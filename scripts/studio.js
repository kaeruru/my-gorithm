import http from 'http';
import fs from 'fs';
import path from 'path';
import { exec, execSync } from 'child_process';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const PORT = 4321;
const DRAFTS_FILE = path.resolve(process.cwd(), 'drafts', 'drafts.json');

const CATEGORIES = {
  study: { name: '공부', color: '#4F46E5', defaultSource: '하버드 비즈니스 리뷰 · 뇌과학 아카이브', fallbackUrl: 'https://hbr.org' },
  tech: { name: '기술', color: '#0284C7', defaultSource: '토스 테크 · Toss Tech', fallbackUrl: 'https://toss.tech' },
  culture: { name: '문화', color: '#BE185D', defaultSource: '씨네21 · 독립·예술 기획', fallbackUrl: 'http://www.cine21.com' },
  hobby: { name: '취미', color: '#059669', defaultSource: '라이프스타일 매거진 B', fallbackUrl: 'https://magazine-b.co.kr' }
};

const TOPIC_SEEDS = {
  study: [
    '뇌과학이 증명한 시냅스 가소성과 장기 기억 인출 연습의 기적',
    '칼 뉴포트의 딥 워크(Deep Work): 디지털 산만을 이기는 주의력 보호 프로토콜',
    '제2의 뇌(Second Brain): 복잡한 정보를 직관적으로 정리하는 PARA 프레임워크',
    '하버드 의대가 제안하는 인지 피로 리셋과 수면 학습 메커니즘'
  ],
  tech: [
    '2026 온디바이스 AI 혁명: 스마트폰 안으로 들어온 로컬 소형 언어 모델(SLM)',
    '토스와 당근마켓의 대규모 트래픽 분산 처리 및 실시간 추천 엔진 아키텍처',
    '양자 컴퓨팅의 암호학적 위협과 포스트 양자 암호(PQC) 전환 전략',
    'Rust 언어가 주도하는 초고성능 웹 어셈블리와 백엔드 시스템 현대화'
  ],
  culture: [
    '디스토피아 SF 시네마가 포착한 현대 기술 사회의 소외와 연대의 미학',
    '성수동과 한남동의 공간 브랜딩: 오프라인 팝업스토어가 파는 경험 경제학',
    '디지털 스트리밍 시대에 다시 폭발하는 바이닐(LP) 레코드의 아날로그 질감',
    '현대 미니멀리즘 건축이 인간의 뇌파와 심리적 안정에 미치는 공간 신경학'
  ],
  hobby: [
    '심폐 지구력과 미토콘드리아를 깨우는 Zone 2 유산소 러닝 완전 정복',
    '초보 식집사를 위한 실내 광합성 조도와 과습 방지 통기 시스템 가이드',
    '홈카페 에스프레소 추출의 미학: 분쇄도와 추출 압력이 결정하는 골든 컵',
    '스트레스 호르몬을 낮추는 실내 클라이밍과 전신 기능성 스트렝스 훈련'
  ]
};

const FALLBACK_IMAGES = {
  study: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
  tech: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
  culture: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
  hobby: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80'
};

function readDrafts() {
  if (!fs.existsSync(DRAFTS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(DRAFTS_FILE, 'utf8'));
  } catch (e) {
    return [];
  }
}

function saveDrafts(drafts) {
  const dir = path.dirname(DRAFTS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DRAFTS_FILE, JSON.stringify(drafts, null, 2), 'utf8');
}

async function validateUrl(url, fallback) {
  if (!url || !url.startsWith('http')) return fallback;
  try {
    const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(2000) });
    if (res.ok || res.status === 403) return url;
    return fallback;
  } catch (e) {
    return fallback;
  }
}

async function generateSingleArticle(category, topic) {
  const meta = CATEGORIES[category] || CATEGORIES.tech;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return createSimulationArticle(category, topic);
  }

  const prompt = `
당신은 취향과 지적 호기심을 선도하는 큐레이션 플랫폼 '맘고리즘'의 수석 에디터입니다.
주제 [${topic}] (분야: ${meta.name})에 관해, 독자가 5분간 몰입하여 깊은 인사이트와 지적 즐거움을 얻을 수 있는 완성도 높은 심층 아티클을 집필해주세요.

[필수 집필 원칙]
1. 단순 사전식 요약이나 백과사전식 나열은 절대 금지합니다.
2. 각 본문 섹션(sections)은 3개로 구성하며, 각 섹션의 본문(body)은 300자~450자 이상의 밀도 있고 설득력 있는 문장으로 작성하세요. (전체 본문 분량 1,200자~1,800자 내외)
3. 맘고리즘만의 특장점인 [추천 이유(recommendationReason)]와 [3줄 핵심 요약(keyPoints)]을 날카롭게 정제하세요.
4. 반드시 유효한 JSON 형식으로만 응답해야 합니다.

[JSON 구조 규격]
{
  "title": "호기심을 자극하고 전문성이 돋보이는 세련된 헤드라인",
  "summary": "피드 카드 미리보기용 요약 1~2문장 (120자 내외)",
  "source": "${meta.defaultSource}",
  "duration": "5분 읽기",
  "date": "최신 칼럼",
  "imageUrl": "${FALLBACK_IMAGES[category]}",
  "url": "${meta.fallbackUrl}",
  "recommendationReason": "독자가 이 글을 지금 꼭 읽어야 하는 이유와 지적 인사이트 1~2문장",
  "keyPoints": [
    "핵심 요약 포인트 1 (구체적 통찰)",
    "핵심 요약 포인트 2 (원리 및 분석)",
    "핵심 요약 포인트 3 (실천 또는 미래 전망)"
  ],
  "sections": [
    {
      "heading": "1. 소제목: 배경과 문제의식",
      "body": "충실한 분석과 배경 설명 (300자 이상)..."
    },
    {
      "heading": "2. 소제목: 핵심 메커니즘과 심층 분석",
      "body": "기술적/인문적 핵심 원리와 작동 방식에 대한 깊이 있는 서술 (350자 이상)..."
    },
    {
      "heading": "3. 소제목: 현실적 적용과 시사점",
      "body": "일상이나 산업에 적용 가능한 구체적 통찰과 행동 지침 (300자 이상)..."
    }
  ]
}
`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const models = ['gemini-3.8-flash', 'gemini-2.5-flash', 'gemini-flash-latest'];
    let text = null;

    for (const m of models) {
      try {
        const response = await ai.models.generateContent({
          model: m,
          contents: prompt,
          config: { responseMimeType: 'application/json' }
        });
        if (response && response.text) {
          text = response.text;
          break;
        }
      } catch (err) {}
    }

    if (!text) {
      return createSimulationArticle(category, topic);
    }

    const data = JSON.parse(text.trim());
    data.id = `${category}-${Date.now().toString().slice(-4)}${Math.floor(Math.random()*10)}`;
    data.category = category;
    data.type = 'article';
    data.url = await validateUrl(data.url, meta.fallbackUrl);
    return data;
  } catch (err) {
    console.error('Gemini error, fallback to simulation:', err.message);
    return createSimulationArticle(category, topic);
  }
}

function createSimulationArticle(category, topic) {
  const meta = CATEGORIES[category] || CATEGORIES.tech;
  const id = `${category}-${Date.now().toString().slice(-4)}${Math.floor(Math.random()*10)}`;

  return {
    id,
    category,
    type: 'article',
    title: topic.length > 10 ? topic : `${topic}: 알고리즘 시대의 새로운 시선`,
    summary: `${topic}에 대한 심층 분석을 통해 단순 정보 습득을 넘어 삶과 업무에 적용 가능한 맘고리즘의 독자적 인사이트를 전달합니다.`,
    source: meta.defaultSource,
    duration: '5분 읽기',
    date: '최신 칼럼',
    imageUrl: FALLBACK_IMAGES[category],
    url: meta.fallbackUrl,
    recommendationReason: `현대 사회의 정보 과부하 속에서 ${topic}이 갖는 본질적인 의미를 파악하고, 스스로 사고의 깊이를 넓힐 수 있는 필독 칼럼입니다.`,
    keyPoints: [
      `${topic}의 기저에 흐르는 핵심 원리와 현대적 재해석.`,
      `단편적 사실 나열을 탈피하여 구조적 맥락과 실용적 가치를 조명하는 통찰.`,
      `개인의 지적 성장과 일상적인 의사결정에 즉시 활용할 수 있는 실천적 가이드.`
    ],
    sections: [
      {
        heading: '1. 보이지 않는 구조: 왜 지금 이 주제에 주목해야 하는가',
        body: `${topic}은 단순한 일시적 유행이 아닙니다. 기술과 문화의 급격한 전환기에서 이 주제는 우리가 마주한 정보 처리 방식과 사고 구조에 중대한 질문을 던집니다. 과거의 방식으로는 해결할 수 없는 복잡한 문제들이 수면 위로 떠오를 때, 본질을 꿰뚫어 보는 시선이야말로 진정한 지적 경쟁력이 됩니다.`
      },
      {
        heading: '2. 심층 메커니즘: 복잡성을 관통하는 핵심 원리',
        body: `이 현상의 이면에는 치밀한 시스템과 인간 심리의 상호작용이 자리 잡고 있습니다. 다양한 데이터와 경험적 연구는 피상적인 접근이 아닌 근본적인 프레임워크의 필요성을 강력히 시사합니다. 이를 이해한다는 것은 단순히 지식을 쌓는 차원을 넘어, 복잡한 현실에서 올바른 우선순위를 판별하는 감각을 기르는 훈련과 같습니다.`
      },
      {
        heading: '3. 적용과 확장: 내 삶과 생각에 적용하는 실천적 통찰',
        body: `이론적 이해가 실질적인 변화로 이어지려면 일상의 루틴 속에 작고 명확한 규칙으로 자리 잡아야 합니다. ${meta.name} 영역에서 제시하는 이 접근법은 불필요한 노이즈를 걷어내고 가장 높은 레버리지를 가져다줄 핵심 행동에 집중할 수 있도록 돕습니다. 오늘부터 작은 실험을 시작해보는 것만으로도 장기적인 변화를 이끌어낼 수 있습니다.`
      }
    ]
  };
}

function insertArticlesToData(articles) {
  const dataPath = path.resolve(process.cwd(), 'data.js');
  const content = fs.readFileSync(dataPath, 'utf8');
  const target = 'export const CONTENT_DATA = [';
  const targetIdx = content.indexOf(target);

  if (targetIdx === -1) throw new Error('data.js에서 CONTENT_DATA를 찾을 수 없습니다.');

  const articlesCode = articles.map(article => `  {\n` +
    `    id: '${article.id}',\n` +
    `    category: '${article.category}',\n` +
    `    type: 'article',\n` +
    `    title: ${JSON.stringify(article.title)},\n` +
    `    summary: ${JSON.stringify(article.summary)},\n` +
    `    source: ${JSON.stringify(article.source)},\n` +
    `    duration: '${article.duration}',\n` +
    `    date: '${article.date}',\n` +
    `    imageUrl: '${article.imageUrl}',\n` +
    `    url: '${article.url}',\n` +
    `    recommendationReason: ${JSON.stringify(article.recommendationReason)},\n` +
    `    keyPoints: [\n` +
    article.keyPoints.map(kp => `      ${JSON.stringify(kp)}`).join(',\n') + '\n' +
    `    ],\n` +
    `    sections: [\n` +
    article.sections.map(sec =>
      `      {\n        heading: ${JSON.stringify(sec.heading)},\n        body: ${JSON.stringify(sec.body)}\n      }`
    ).join(',\n') + '\n' +
    `    ]\n` +
    `  }`).join(',\n');

  const insertPos = targetIdx + target.length;
  const newContent = content.slice(0, insertPos) + '\n' + articlesCode + ',\n' + content.slice(insertPos);
  fs.writeFileSync(dataPath, newContent, 'utf8');
}

function buildCsv(drafts) {
  const BOM = '\uFEFF';
  const header = ['ID', '분야', '제목', '출처', '소요시간', '추천이유', '요약', '원문링크', '3줄요약', '본문전문'].map(h => `"${h}"`).join(',');
  const rows = drafts.map(d => {
    const kp = (d.keyPoints || []).join(' / ');
    const fullBody = (d.sections || []).map(s => `[${s.heading}] ${s.body}`).join('\n\n');
    return [
      d.id,
      d.category,
      d.title,
      d.source,
      d.duration,
      d.recommendationReason,
      d.summary,
      d.url,
      kp,
      fullBody
    ].map(val => `"${String(val || '').replace(/"/g, '""')}"`).join(',');
  });
  return BOM + [header, ...rows].join('\r\n');
}

const server = http.createServer(async (req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  const pathname = urlObj.pathname;

  if (pathname === '/' || pathname === '/index.html') {
    const htmlPath = path.resolve(process.cwd(), 'scripts', 'studio.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
    return;
  }

  if (pathname === '/api/drafts') {
    const drafts = readDrafts();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ drafts }));
    return;
  }

  if (pathname === '/api/generate-batch' && req.method === 'POST') {
    console.log('\n[Studio] 4개 전 분야 일괄 생성 시작...');
    const categories = ['tech', 'study', 'culture', 'hobby'];
    const newArticles = [];

    for (const cat of categories) {
      const seeds = TOPIC_SEEDS[cat];
      const randomTopic = seeds[Math.floor(Math.random() * seeds.length)];
      console.log(`[Studio] 집필 중: [${cat}] "${randomTopic}"`);
      const art = await generateSingleArticle(cat, randomTopic);
      newArticles.push(art);
    }

    const currentDrafts = readDrafts();
    const updated = [...newArticles, ...currentDrafts];
    saveDrafts(updated);

    console.log(`[Studio] 4편 집필 완료 및 대기열 저장 완료!\n`);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, count: 4 }));
    return;
  }

  if (pathname === '/api/generate-custom' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { topic, category } = JSON.parse(body);
        const art = await generateSingleArticle(category || 'tech', topic);
        const currentDrafts = readDrafts();
        saveDrafts([art, ...currentDrafts]);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, article: art }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: e.message }));
      }
    });
    return;
  }

  if (pathname === '/api/delete-draft' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { id } = JSON.parse(body);
        const current = readDrafts();
        const updated = current.filter(d => d.id !== id);
        saveDrafts(updated);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: e.message }));
      }
    });
    return;
  }

  if (pathname === '/api/approve' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { articleIds } = JSON.parse(body);
        const currentDrafts = readDrafts();
        const toApprove = currentDrafts.filter(d => articleIds.includes(d.id));
        const remaining = currentDrafts.filter(d => !articleIds.includes(d.id));

        if (toApprove.length === 0) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: '선택된 아티클이 없습니다.' }));
          return;
        }

        console.log(`\n[Studio] ${toApprove.length}개 아티클 승인 처리: data.js 삽입 중...`);
        insertArticlesToData(toApprove);
        saveDrafts(remaining);

        console.log(`[Studio] npm run build 실행 중...`);
        execSync('npm run build', { stdio: 'inherit' });

        console.log(`[Studio] firebase deploy --only hosting 실행 중...`);
        execSync('firebase deploy --only hosting', { stdio: 'inherit' });

        console.log(`[Studio] 🎉 실서버 배포 완료!\n`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, approvedCount: toApprove.length }));
      } catch (err) {
        console.error('[Studio] 배포 실패:', err.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  if (pathname === '/api/export-csv') {
    const drafts = readDrafts();
    const csv = buildCsv(drafts);
    res.writeHead(200, {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="mamgorithm-drafts.csv"'
    });
    res.end(csv);
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log('\n' + '='.repeat(60));
  console.log(`\x1b[1m\x1b[32m  맘고리즘 관리자 웹 스튜디오 가동 완료!\x1b[0m`);
  console.log(`  주소: \x1b[36m${url}\x1b[0m`);
  console.log('='.repeat(60));
  console.log('\x1b[90m브라우저를 자동으로 실행합니다...\x1b[0m\n');

  // 윈도우 기본 브라우저 자동 실행
  const startCmd = process.platform === 'win32' ? `start ${url}` : `open ${url}`;
  exec(startCmd);
});
