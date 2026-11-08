import fs from 'fs';
import path from 'path';
import readline from 'readline';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const CATEGORY_MAP = {
  1: { id: 'study', name: '공부', color: '#4F46E5', defaultSource: '하버드 비즈니스 리뷰 · 뇌과학 아카이브' },
  2: { id: 'tech', name: '기술', color: '#0284C7', defaultSource: 'MIT 테크놀로지 리뷰 · 테크 아키텍처' },
  3: { id: 'culture', name: '문화', color: '#BE185D', defaultSource: '월간 디자인 & 시네마틱 저널' },
  4: { id: 'hobby', name: '취미', color: '#059669', defaultSource: '라이프스타일 매거진 B' }
};

const TRENDING_TOPICS = {
  study: [
    '뇌과학이 밝혀낸 시냅스 가소성과 장기 기억 인출 연습의 원리',
    '칼 뉴포트의 딥 워크(Deep Work): 디지털 산만을 이기는 주의력 보호법',
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

const FALLBACK_UNSPLASH = {
  study: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
  tech: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
  culture: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
  hobby: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80'
};

function createPrompt(categoryKey, topic) {
  const cat = CATEGORY_MAP[categoryKey] || CATEGORY_MAP[1];
  return `
당신은 취향과 지적 호기심을 선도하는 지식 큐레이션 플랫폼 '맘고리즘 (My-gorithm)'의 수석 에디터입니다.
주제 [${topic}] (분야: ${cat.name})에 관해, 독자가 5분간 몰입하여 깊은 인사이트와 지적 즐거움을 얻을 수 있는 완성도 높은 심층 아티클을 집필해주세요.

[필수 집필 원칙]
1. 단순 사전식 요약이나 백과사전식 나열은 절대 금지합니다.
2. 각 본문 섹션(sections)은 최소 3~4개로 구성하며, 각 섹션의 본문(body)은 300자~500자 이상의 밀도 있고 설득력 있는 문장으로 작성하세요. (전체 본문 분량 1,200자~2,000자 내외)
3. 맘고리즘만의 특장점인 [추천 이유(recommendationReason)]와 [3줄 핵심 요약(keyPoints)]을 날카롭게 정제하세요.
4. 반드시 유효한 JSON 형식으로만 응답해야 합니다. 마크다운 따옴표나 기타 설명 없이 오직 JSON 데이터만 출력하세요.

[JSON 구조 규격]
{
  "title": "호기심을 자극하고 전문성이 돋보이는 세련된 헤드라인",
  "summary": "피드 카드 미리보기용 요약 1~2문장 (120자 내외)",
  "source": "${cat.defaultSource}",
  "duration": "5분 읽기",
  "date": "최신 칼럼",
  "imageUrl": "${FALLBACK_UNSPLASH[cat.id]}",
  "url": "https://my-gorithm.web.app",
  "recommendationReason": "독자가 이 글을 지금 꼭 읽어야 하는 이유와 지적 인사이트 1~2문장",
  "keyPoints": [
    "핵심 요약 포인트 1 (구체적 통찰)",
    "핵심 요약 포인트 2 (원리 및 분석)",
    "핵심 요약 포인트 3 (실천 또는 미래 전망)"
  ],
  "sections": [
    {
      "heading": "첫 번째 소제목: 배경과 문제의식",
      "body": "충실한 분석과 배경 설명 (300자 이상)..."
    },
    {
      "heading": "두 번째 소제목: 핵심 메커니즘과 심층 분석",
      "body": "기술적/인문적 핵심 원리와 작동 방식에 대한 깊이 있는 서술 (350자 이상)..."
    },
    {
      "heading": "세 번째 소제목: 현실적 적용과 시사점",
      "body": "일상이나 산업에 적용 가능한 구체적 통찰과 행동 지침 (300자 이상)..."
    }
  ]
}
`;
}

async function generateWithGemini(categoryKey, topic) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log('\n\x1b[33m[안내] GEMINI_API_KEY가 설정되지 않아 고품질 트렌드 시뮬레이션 모드로 생성합니다.\x1b[0m');
    console.log('\x1b[90m(실제 Gemini 실시간 생성은 .env 파일에 GEMINI_API_KEY를 입력하시면 즉시 활성화됩니다.)\x1b[0m\n');
    return generateSimulationArticle(categoryKey, topic);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = createPrompt(categoryKey, topic);

    console.log('\x1b[36m⏳ Google Gemini 모델이 심층 리서치 및 아티클 집필 중...\x1b[0m');
    let response;
    const candidateModels = ['gemini-3.8-flash', 'gemini-2.5-flash', 'gemini-flash-latest'];
    for (const modelName of candidateModels) {
      try {
        response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });
        if (response && response.text) break;
      } catch (e) {
        // try next candidate model
      }
    }
    if (!response || !response.text) {
      throw new Error('사용 가능한 Gemini 모델을 찾을 수 없습니다.');
    }

    const raw = response.text.trim();
    const data = JSON.parse(raw);
    const cat = CATEGORY_MAP[categoryKey] || CATEGORY_MAP[1];
    data.id = `${cat.id}-${Date.now().toString().slice(-4)}`;
    data.category = cat.id;
    data.type = 'article';
    return data;
  } catch (err) {
    console.error('\x1b[31mGemini API 호출 중 오류 발생:\x1b[0m', err.message);
    console.log('\x1b[33m시뮬레이션 모드로 전환하여 안전하게 아티클을 생성합니다.\x1b[0m\n');
    return generateSimulationArticle(categoryKey, topic);
  }
}

function generateSimulationArticle(categoryKey, topic) {
  const cat = CATEGORY_MAP[categoryKey] || CATEGORY_MAP[1];
  const id = `${cat.id}-${Date.now().toString().slice(-4)}`;

  return {
    id,
    category: cat.id,
    type: 'article',
    title: topic.length > 10 ? topic : `${topic}: 알고리즘 시대의 새로운 시선`,
    summary: `${topic}에 대한 심층 분석을 통해 단순 정보 습득을 넘어 삶과 업무에 적용 가능한 맘고리즘의 독자적 인사이트를 전달합니다.`,
    source: cat.defaultSource,
    duration: '5분 읽기',
    date: '최신 칼럼',
    imageUrl: FALLBACK_UNSPLASH[cat.id],
    url: 'https://my-gorithm.web.app',
    recommendationReason: `현대 사회의 정보 과부하 속에서 ${topic}이 갖는 본질적인 의미를 파악하고, 스스로 사고의 깊이를 넓힐 수 있는 필독 칼럼입니다.`,
    keyPoints: [
      `${topic}의 기저에 흐르는 핵심 원리와 현대적 재해석.`,
      `단편적 사실 나열을 탈피하여 구조적 맥락과 실용적 가치를 조명하는 통찰.`,
      `개인의 지적 성장과 일상적인 의사결정에 즉시 활용할 수 있는 실천적 가이드.`
    ],
    sections: [
      {
        heading: '1. 보이지 않는 구조: 왜 지금 이 주제에 주목해야 하는가',
        body: `${topic}은 단순히 일시적인 유행이나 단편적 지식이 아닙니다. 우리가 마주한 기술과 문화의 급격한 전환기에서, 이 주제는 개인이 마주한 정보 처리 방식과 사고 구조에 중대한 질문을 던집니다. 과거의 방식으로는 해결할 수 없는 복잡한 문제들이 수면 위로 떠오를 때, 본질을 꿰뚫어 보는 시선이야말로 진정한 지적 경쟁력이 됩니다.`
      },
      {
        heading: '2. 심층 메커니즘: 복잡성을 관통하는 핵심 원리',
        body: `이 현상의 이면에는 치밀한 시스템과 인간 심리의 상호작용이 자리 잡고 있습니다. 다양한 데이터와 경험적 연구는 피상적인 접근이 아닌 근본적인 프레임워크의 필요성을 강력히 시사합니다. 이를 이해한다는 것은 단순히 지식을 쌓는 차원을 넘어, 복잡한 현실에서 올바른 우선순위를 판별하는 감각을 기르는 훈련과 같습니다.`
      },
      {
        heading: '3. 적용과 확장: 내 삶과 생각에 적용하는 실천적 통찰',
        body: `이론적 이해가 실질적인 변화로 이어지려면 일상의 루틴 속에 작고 명확한 규칙으로 자리 잡아야 합니다. ${cat.name} 영역에서 제시하는 이 접근법은 불필요한 노이즈를 걷어내고 가장 높은 레버리지를 가져다줄 핵심 행동에 집중할 수 있도록 돕습니다. 오늘부터 작은 실험을 시작해보는 것만으로도 장기적인 변화의 물꼬를 틀 수 있습니다.`
      }
    ]
  };
}

function displayArticlePreview(article) {
  const cat = Object.values(CATEGORY_MAP).find(c => c.id === article.category) || CATEGORY_MAP[1];
  console.log('\n' + '='.repeat(64));
  console.log(`\x1b[1m\x1b[35m[맘고리즘 관리자 검토 대시보드 - 생성 결과 미리보기]\x1b[0m`);
  console.log('='.repeat(64));
  console.log(`\x1b[36m분야:\x1b[0m [${cat.name}]  |  \x1b[36mID:\x1b[0m ${article.id}  |  \x1b[36m소요시간:\x1b[0m ${article.duration}`);
  console.log(`\x1b[1m\x1b[37m📌 제목: ${article.title}\x1b[0m`);
  console.log(`\x1b[33m💡 추천 이유:\x1b[0m ${article.recommendationReason}`);
  console.log(`\x1b[32m📝 피드 요약:\x1b[0m ${article.summary}`);
  console.log(`\x1b[34m🌐 출처:\x1b[0m ${article.source}`);
  console.log('\n\x1b[1m[3줄 핵심 요약 (keyPoints)]\x1b[0m');
  article.keyPoints.forEach((kp, idx) => {
    console.log(`  ${idx + 1}. ${kp}`);
  });

  console.log('\n\x1b[1m[본문 심층 섹션 미리보기 (sections)]\x1b[0m');
  article.sections.forEach((sec, idx) => {
    console.log(`  \x1b[36m${sec.heading}\x1b[0m (${sec.body.length}자)`);
    console.log(`  ${sec.body.slice(0, 120)}...`);
  });
  console.log('='.repeat(64) + '\n');
}

function insertArticleToDataFile(article) {
  const dataPath = path.resolve(process.cwd(), 'data.js');
  if (!fs.existsSync(dataPath)) {
    throw new Error('data.js 파일을 찾을 수 없습니다.');
  }

  const content = fs.readFileSync(dataPath, 'utf8');
  const target = 'export const CONTENT_DATA = [';
  const targetIdx = content.indexOf(target);

  if (targetIdx === -1) {
    throw new Error('data.js에서 CONTENT_DATA 배열을 찾을 수 없습니다.');
  }

  // 포맷팅된 아티클 문자열 생성
  const articleCode = `  {\n` +
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
    `  },`;

  const insertPos = targetIdx + target.length;
  const newContent = content.slice(0, insertPos) + '\n' + articleCode + content.slice(insertPos);

  fs.writeFileSync(dataPath, newContent, 'utf8');
  console.log(`\x1b[32m✔ 축하합니다! 새 아티클이 [data.js] 최상단에 성공적으로 삽입되었습니다.\x1b[0m`);
  console.log(`\x1b[90m(빌드 후 배포 명령: npm run deploy)\x1b[0m\n`);
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (q) => new Promise((resolve) => rl.question(q, resolve));

  console.log('\n\x1b[1m\x1b[34m========================================================\x1b[0m');
  console.log('\x1b[1m\x1b[36m  맘고리즘 (My-gorithm) AI 심층 아티클 자동 생성 스튜디오\x1b[0m');
  console.log('\x1b[1m\x1b[34m========================================================\x1b[0m\n');

  while (true) {
    console.log('\x1b[1m발행할 분야를 선택하세요:\x1b[0m');
    console.log('  [1] 공부 (Study)');
    console.log('  [2] 기술 (Tech)');
    console.log('  [3] 문화 (Culture)');
    console.log('  [4] 취미 (Hobby)');
    const catChoice = (await question('\n선택 (1~4, 기본값 2): ')).trim() || '2';
    const catKey = ['1', '2', '3', '4'].includes(catChoice) ? parseInt(catChoice, 10) : 2;
    const cat = CATEGORY_MAP[catKey];

    console.log(`\n\x1b[36m[${cat.name}] 추천 최신 트렌드 토픽:\x1b[0m`);
    TRENDING_TOPICS[cat.id].forEach((t, i) => {
      console.log(`  [${i + 1}] ${t}`);
    });
    console.log('  [0] 직접 주제 입력하기');

    const topicChoice = (await question('\n주제 선택 (0~4, 기본값 1): ')).trim() || '1';
    let topic = '';
    if (topicChoice === '0') {
      topic = (await question('\n원하는 아티클 주제를 구체적으로 입력하세요: ')).trim();
      if (!topic) topic = TRENDING_TOPICS[cat.id][0];
    } else {
      const idx = parseInt(topicChoice, 10) - 1;
      topic = TRENDING_TOPICS[cat.id][idx] || TRENDING_TOPICS[cat.id][0];
    }

    console.log(`\n\x1b[32m✔ 선택된 주제: "${topic}"\x1b[0m`);
    const article = await generateWithGemini(catKey, topic);

    displayArticlePreview(article);

    console.log('\x1b[1m이 아티클을 피드에 승인하여 발행하시겠습니까?\x1b[0m');
    console.log('  \x1b[32m[1] 승인하여 data.js에 즉시 추가 (Approve & Publish)\x1b[0m');
    console.log('  \x1b[33m[2] 다른 주제로 다시 생성 (Retry)\x1b[0m');
    console.log('  \x1b[31m[3] 작업 종료 (Exit)\x1b[0m');

    const action = (await question('\n선택 (1~3, 기본값 1): ')).trim() || '1';

    if (action === '1') {
      insertArticleToDataFile(article);
      break;
    } else if (action === '2') {
      console.log('\n다시 시작합니다...\n');
      continue;
    } else {
      console.log('\n생성을 취소하고 종료합니다.\n');
      break;
    }
  }

  rl.close();
}

main().catch(console.error);
