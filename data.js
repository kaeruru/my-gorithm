// 맘고리즘 (내맘대로 알고리즘) - 카테고리별 추천 콘텐츠 데이터셋
// 카테고리: study(공부), tech(기술), culture(문화), hobby(취미)
// 타입: video(영상), article(기사/글)

export const CATEGORY_META = {
  study: {
    id: 'study',
    name: '공부',
    shortTag: '학습 · 교양',
    color: '#4F46E5',
    tagBg: '#EEF2FF',
    tagText: '#4338CA',
    border: '#C7D2FE',
    description: '학습법, 외국어, 자격증, 인문·교양 지식',
    iconSvg: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>'
  },
  tech: {
    id: 'tech',
    name: '기술',
    shortTag: 'IT · 트렌드',
    color: '#0284C7',
    tagBg: '#F0F9FF',
    tagText: '#0369A1',
    border: '#BAE6FD',
    description: 'AI, 개발, IT 트렌드, 디지털 생산성',
    iconSvg: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>'
  },
  culture: {
    id: 'culture',
    name: '문화',
    shortTag: '예술 · 라이프',
    color: '#BE185D',
    tagBg: '#FFF1F2',
    tagText: '#9F1239',
    border: '#FECDD3',
    description: '전시, 영화, 음악, 도서, 예술 트렌드',
    iconSvg: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>'
  },
  hobby: {
    id: 'hobby',
    name: '취미',
    shortTag: '액티비티 · 일상',
    color: '#059669',
    tagBg: '#ECFDF5',
    tagText: '#047857',
    border: '#A7F3D0',
    description: '운동, 러닝, 홈카페, 가드닝, 쿠킹',
    iconSvg: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>'
  }
};

// 새 카드 추가 시 기본 스키마를 정규화하는 팩토리 헬퍼 함수
export function normalizeContentCard(raw) {
  const category = CATEGORY_META[raw.category] ? raw.category : 'study';
  const type = raw.type === 'video' ? 'video' : 'article';
  const defaultImages = {
    study: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
    tech: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    culture: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    hobby: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&auto=format&fit=crop&q=80'
  };

  let youtubeId = raw.youtubeId || '';
  if (type === 'video' && !youtubeId && raw.url) {
    const match = raw.url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (match) youtubeId = match[1];
  }

  const imageUrl = raw.imageUrl?.trim()
    || (youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : defaultImages[category]);

  return {
    id: raw.id || `${category}-custom-${Date.now()}`,
    category,
    type,
    isNew: raw.isNew !== undefined ? Boolean(raw.isNew) : true,
    title: (raw.title || '새 추천 콘텐츠').trim(),
    summary: (raw.summary || '사용자 맞춤형으로 추가된 추천 콘텐츠입니다.').trim(),
    source: (raw.source || (type === 'video' ? 'YouTube · 추천 채널' : '추천 아티클')).trim(),
    duration: (raw.duration || (type === 'video' ? '10:00' : '5분 읽기')).trim(),
    date: (raw.date || '신규 등록').trim(),
    imageUrl,
    youtubeId,
    url: (raw.url || 'https://my-gorithm.web.app').trim(),
    recommendationReason: raw.recommendationReason || `${CATEGORY_META[category].name} 분야 관심도 설정에 따라 우선 배정된 신규 콘텐츠입니다.`,
    keyPoints: Array.isArray(raw.keyPoints) && raw.keyPoints.length > 0
      ? raw.keyPoints
      : [
          (raw.summary || '핵심 요약 내용을 확인해보세요.').trim(),
          `카테고리: ${CATEGORY_META[category].name} (${CATEGORY_META[category].description})`,
          '원문 방문 버튼을 통해 전체 상세 내용을 확인하실 수 있습니다.'
        ],
    sections: Array.isArray(raw.sections) && raw.sections.length > 0
      ? raw.sections
      : [
          {
            heading: raw.title || '콘텐츠 핵심 내용',
            body: raw.summary || '사용자 맞춤형으로 추가된 추천 콘텐츠입니다.'
          }
        ]
  };
}

export const LEVEL_LABELS = {
  0: { label: '제외', desc: '피드에서 숨김' },
  25: { label: '조금', desc: '가끔 1~2개 추천' },
  50: { label: '보통', desc: '균형 있게 추천' },
  75: { label: '선호', desc: '자주 추천' },
  100: { label: '집중', desc: '피드 최우선 배치' }
};

export function getLevelDescription(val) {
  if (val <= 0) return { label: '제외', desc: '피드에서 숨김' };
  if (val <= 25) return { label: '조금', desc: '가끔 1~2개 추천' };
  if (val <= 60) return { label: '보통', desc: '균형 있게 추천' };
  if (val <= 85) return { label: '선호', desc: '자주 추천' };
  return { label: '집중', desc: '피드 최우선 배치' };
}

export const CONTENT_DATA = [
  // ==================== 기술 (Tech) ====================
  {
    id: 'tech-2',
    category: 'tech',
    type: 'video',
    title: "애플뮤직은 왜 로고를 액체로 흔들었을까? | Apple Music 'Made by Sound' 리뷰",
    summary: '사운드와 브랜딩 디자인의 혁신적인 결합: 액체 인터랙션 비주얼 시스템과 애플의 최신 크리에이티브 테크놀로지 분석.',
    source: 'YouTube · RBI : 브랜드와 디자인 이야기',
    duration: '08:45',
    date: '추천 영상',
    imageUrl: 'https://i.ytimg.com/vi/6uc4QM79mZ8/hqdefault.jpg',
    youtubeId: '6uc4QM79mZ8',
    url: 'https://www.youtube.com/watch?v=6uc4QM79mZ8'
  },
  {
    id: 'tech-1',
    category: 'tech',
    type: 'article',
    title: '토스 쇼핑 추천 시스템: 수백만 사용자와 상품을 잇는 멀티 스테이지 접근법',
    summary: '방대한 사용자 트래픽 속에서 효율적이고 정확한 추천을 제공하기 위한 멀티 스테이지(Retrieval → Ranking → Re-ranking) 파이프라인 설계 전략.',
    source: '토스 테크 · Toss Tech',
    duration: '7분 읽기',
    date: '오늘',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    url: 'https://toss.tech/article/toss-shopping-recommendation',
    keyPoints: [
      '수백만 상품 풀에서 목적형/탐색형 사용자를 만족시키는 멀티 스테이지(Retrieval → Ranking → Re-ranking) 아키텍처.',
      'pCTR(클릭률)과 pCVR(전환율)을 동시에 고려하는 딥러닝 모델링과 비즈니스 다양성 최적화.',
      '사용자의 실시간 행동 피드백을 추천 후보군에 즉각 반영하는 파이프라인 엔지니어링.'
    ],
    sections: [
      {
        heading: '탐색형 사용자를 위한 추천의 본질',
        body: '명확한 목적을 가지고 검색하는 사용자와 달리, 피드를 둘러보며 흥미를 발견하는 탐색형 사용자는 취향과 맥락에 대한 정교한 예측이 필요합니다. 토스 쇼핑은 방대한 상품 속에서 사용자가 자연스럽게 매력을 느낄 수 있도록 다단계 추천 파이프라인을 구축했습니다.'
      },
      {
        heading: '멀티 스테이지 추천 파이프라인의 설계',
        body: '첫 번째 Retrieval 단계에서는 수백만 상품 중 사용자가 관심을 가질 만한 수천 개의 후보군을 초고속으로 추려냅니다. 두 번째 Ranking 단계에서는 딥러닝 기반 pCTR/pCVR 모델을 통해 상품별 점수를 정밀 계산합니다. 마지막 Re-ranking 단계에서는 카테고리 다양성, 신규 아이템 탐색(Exploration), 비즈니스 목표를 반영해 최종 피드를 완성합니다.'
      },
      {
        heading: '지속적인 실험과 사용자 경험 혁신',
        body: '추천 모델의 성능은 오프라인 지표뿐만 아니라 실제 사용자의 체감 만족도로 검증되어야 합니다. 후보군 수(TopK) 최적화와 실시간 A/B 테스트를 통해 알고리즘이 사용자에게 피로감을 주지 않고 가치 있는 발견을 돕도록 고도화하고 있습니다.'
      }
    ]
  },
  {
    id: 'tech-4',
    category: 'tech',
    type: 'video',
    title: '파이썬 코딩 무료 강의: 5시간 만에 끝내는 실전 프로그래밍 기초',
    summary: '프로그래밍 언어 문법부터 실전 웹 스크래핑과 업무 자동화까지 한 번에 배우는 코딩 입문 가이드.',
    source: 'YouTube · 조코딩 JoCoding',
    duration: '4:52:10',
    date: '인기 강의',
    imageUrl: 'https://i.ytimg.com/vi/KL1MIuBfWe0/hqdefault.jpg',
    youtubeId: 'KL1MIuBfWe0',
    url: 'https://www.youtube.com/watch?v=KL1MIuBfWe0'
  },
  {
    id: 'tech-3',
    category: 'tech',
    type: 'article',
    title: '반응형 웹 디자인 핵심 가이드: 최신 CSS 레이아웃과 뷰포트 기법',
    summary: '모바일 작은 화면부터 대화면 데스크톱까지 일관되고 쾌적한 가독성을 제공하는 프론트엔드 스타일 설계 가이드.',
    source: 'MDN Web Docs · 웹 개발 가이드',
    duration: '8분 읽기',
    date: '5일 전',
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    url: 'https://developer.mozilla.org/ko/docs/Learn/CSS/CSS_layout/Responsive_Design',
    keyPoints: [
      '모바일 화면부터 설계하는 Mobile-First 접근법은 불필요한 장식을 덜어내고 핵심 콘텐츠에 집중하게 만듭니다.',
      '최신 CSS Grid의 minmax()와 repeat(auto-fill, ...) 조합은 미디어 쿼리 없이도 완벽한 반응형 카드를 구성합니다.',
      '모바일 브라우저의 주소창 가변성에 대응하기 위해 100vh 대신 100dvh와 safe-area 단위를 채택하는 것이 표준입니다.'
    ],
    sections: [
      {
        heading: '모바일 화면에서 출발하는 Less is More 철학',
        body: '데스크톱의 넓은 캔버스에서 시작하면 여백을 채우기 위해 불필요한 사이드바와 위젯을 남발하기 쉽습니다. 반면 390px 모바일 뷰포트에서 먼저 디자인을 시작하면, "사용자에게 지금 당장 가장 가치 있는 정보는 무엇인가?"라는 본질적인 질문에 집중할 수밖에 없습니다.'
      },
      {
        heading: '미디어 쿼리를 줄이는 현대적 CSS 기법',
        body: '수많은 브레이크포인트로 분기하던 과거와 달리, 현대 CSS는 고유의 유연성을 활용합니다. grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) 패턴은 뷰포트 너비에 따라 카드가 자연스럽게 1열, 2열, 3열로 유기적으로 재배치됩니다. 여기에 유동적 타이포그래피를 위한 clamp() 함수를 결합하면 유지보수성이 비약적으로 향상됩니다.'
      },
      {
        heading: '모바일 뷰포트의 새로운 표준: dvh와 세이프 에어리어',
        body: '스마트폰 브라우저는 스크롤 시 URL 바가 축소되거나 나타나며 높이가 수시로 변합니다. 과거의 100vh는 하단 버튼을 주소창 뒤로 숨기는 치명적인 결함이 있었습니다. 이제 동적 뷰포트 단위 100dvh와 노치/홈 인디케이터를 고려한 env(safe-area-inset-bottom)을 기본으로 적용해야 합니다.'
      }
    ]
  },
  {
    id: 'tech-6',
    category: 'tech',
    type: 'video',
    title: '제대로 파는 Git & GitHub: 버전 관리와 브랜치 협업 핵심 원리',
    summary: '원격 저장소 관리부터 풀 리퀘스트(PR) 코드 리뷰, 충돌(Conflict) 해결까지 실무 협업 흐름 정리.',
    source: 'YouTube · 얄팍한 코딩사전',
    duration: '48:30',
    date: '필수 시청',
    imageUrl: 'https://i.ytimg.com/vi/1I3hMwQU6GU/hqdefault.jpg',
    youtubeId: '1I3hMwQU6GU',
    url: 'https://www.youtube.com/watch?v=1I3hMwQU6GU'
  },
  {
    id: 'tech-5',
    category: 'tech',
    type: 'article',
    title: '스마트폰 배터리 수명과 충전 효율을 지키는 올바른 배터리 관리 가이드',
    summary: '리튬이온 배터리 화학적 노화 원리부터 배터리 보호 모드, 발열 억제 및 수명 주기를 연장하는 실전 팁.',
    source: '삼성전자 고객지원 · 배터리 케어',
    duration: '5분 읽기',
    date: '4일 전',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
    url: 'https://www.samsung.com/sec/support/galaxy-battery/care-and-maintenance/',
    keyPoints: [
      '리튬이온 배터리는 완전 방전(0%)이나 완충(100%) 상태에서 전극의 화학적 스트레스가 가장 높습니다.',
      '배터리 잔량을 20%~80% 구간에서 유지하면 배터리 수명 주기(Cycle)를 2배 이상 연장할 수 있습니다.',
      '고속 충전 시 발생하는 발열 관리가 배터리 열화 및 OLED 디스플레이 번인을 막는 핵심입니다.'
    ],
    sections: [
      {
        heading: '충전 사이클과 화학적 열화의 원리',
        body: '리튬이온 배터리는 양극과 음극 사이를 리튬 이온이 이동하며 충·방전이 이루어집니다. 0% 완전 방전 시에는 음극의 구리 집전체가 용해될 위험이 있고, 100% 완충 상태로 고전압이 장시간 유지되면 전해액이 분해되며 가스가 발생합니다. 따라서 80~85% 보호 충전 기능 활성화가 권장됩니다.'
      },
      {
        heading: '발열: 배터리와 디스플레이의 공통된 적',
        body: '급속 충전 자체보다 위험한 것은 동반되는 "온도 상승"입니다. 충전 중 고사양 3D 게임이나 4K 영상 렌더링을 병행하면 45도 이상의 고온에 노출되어 배터리 셀의 영구적 용량 감소를 유발합니다. 또한 높은 온도는 OLED의 유기 발광 소자 수명을 급격히 갉아먹어 잔상(번인) 현상을 앞당깁니다.'
      },
      {
        heading: '실천 가능한 3가지 배터리 관리 루틴',
        body: '첫째, 밤새 충전기를 꽂아둘 때는 기기 내 "배터리 보호 모드"를 켜두세요. 둘째, 차량 내 직사광선 아래나 두꺼운 케이스를 씌운 채 고속 충전하는 것을 피하세요. 셋째, 20% 경고 알림이 뜨기 전에 미리 보조배터리로 충전하는 습관이 좋습니다.'
      }
    ]
  },
  {
    id: 'tech-7',
    category: 'tech',
    type: 'article',
    title: '카카오의 언어모델, Kanana 테크니컬 리포트: 온디바이스와 경량화 AI의 미래',
    summary: '스마트폰 기기 자체에서 구동되는 초경량 언어 모델 아키텍처와 프라이버시 보호형 온디바이스 AI 개발기.',
    source: '카카오 테크 · Kakao Tech',
    duration: '6분 읽기',
    date: '어제',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    url: 'https://tech.kakao.com/posts/689',
    keyPoints: [
      '온디바이스 AI는 클라우드 서버와의 통신 없이 스마트폰 내 NPU 칩에서 인공지능 모델을 직접 구동합니다.',
      '개인 민감 데이터(문서, 사진, 건강 정보)가 기기 밖으로 유출되지 않아 프라이버시가 완벽히 보장됩니다.',
      '네트워크 지연(Latency)이 0에 수렴하여 오프라인 환경에서도 즉각적인 실시간 인터랙션이 가능합니다.'
    ],
    sections: [
      {
        heading: '클라우드 AI의 한계와 온디바이스의 부상',
        body: '대규모 언어 모델(LLM)이 촉발한 AI 혁명은 엄청난 클라우드 서버 비용과 데이터 프라이버시 문제를 낳았습니다. 내 사적인 통화 내용이나 작성 중인 메모가 외부 서버로 전송된다는 불안감은 AI 대중화의 큰 걸림돌이었습니다. 이를 극복하기 위해 경량화된 SLM(Small Language Model)을 스마트폰 칩셋에서 직접 구동하는 온디바이스 기술이 급부상했습니다.'
      },
      {
        heading: 'NPU 아키텍처와 양자화(Quantization) 기술',
        body: '모바일 NPU(Neural Processing Unit)는 인공신경망의 행렬 연산을 초저전력으로 고속 처리합니다. 여기에 16비트 부동소수점 가중치를 4비트나 8비트 정수로 압축하는 양자화 기술이 더해져, 수 기가바이트 크기의 파라미터를 메모리 수백 메가바이트 수준으로 압축하여 탑재할 수 있게 되었습니다.'
      },
      {
        heading: '내 손안에서 완성되는 완벽한 개인화',
        body: '온디바이스 AI는 사용자의 이용 패턴, 캘린더, 수면 주기, 관심사 선호도를 기기 로컬 샌드박스에서만 학습합니다. 맘고리즘처럼 사용자가 직접 추천 기준을 조절하는 로컬 지향 서비스와 결합할 때, 진정한 의미의 독립적인 디지털 비서가 완성됩니다.'
      }
    ]
  },
  {
    id: 'tech-8',
    category: 'tech',
    type: 'article',
    isNew: true,
    title: 'AI 시대를 이끌 3대 메가프로젝트는 무엇일까?',
    summary: '반도체의 데이터 처리 역할과 팹·패키징을 살펴보고 피지컬 AI, AI 데이터센터 등 미래 핵심 산업을 소개합니다.',
    recommendationReason: '최신 기술의 원리와 활용 분야에 관심 있는 사용자가 핵심 산업의 구조를 이해할 수 있습니다.',
    source: '대한민국 정책브리핑',
    duration: '6분 읽기',
    date: '정책 브리핑',
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
    url: 'https://m.korea.kr/news/policyNewsView.do?newsId=148968025',
    keyPoints: [
      '초거대 AI 연산을 뒷받침하는 차세대 HBM(고대역폭 메모리)과 첨단 팹(Fab)·어드밴스드 패키징 인프라.',
      '로봇과 자율주행, 제조 현장에 AI 두뇌를 결합하는 물리적 공간의 혁신, 피지컬 AI(Physical AI).',
      '막대한 전력과 냉각 수요를 해결하는 친환경·고효율 미래형 AI 데이터센터 클러스터 구축.'
    ],
    sections: [
      {
        heading: '반도체 생태계의 판도를 바꾸는 첨단 패키징',
        body: '미세 공정의 한계를 극복하기 위해 서로 다른 칩을 하나로 연결하는 3D 패키징과 HBM 메모리가 핵심 승부처로 떠올랐습니다. 반도체 팹 제조부터 패키징까지 이어지는 밸류체인 경쟁력이 AI 시대의 국가 경쟁력을 좌우합니다.'
      },
      {
        heading: '소프트웨어를 넘어 현실로: 피지컬 AI',
        body: '컴퓨터 화면 속 텍스트와 이미지 생성을 넘어 휴머노이드 로봇, 스마트 팩토리, 자율주행 이동체 등 현실 세계에서 스스로 감각하고 조작하는 피지컬 AI가 차세대 메가 트렌드로 진화하고 있습니다.'
      },
      {
        heading: 'AI 데이터센터와 에너지 솔루션',
        body: '수만 장의 GPU가 뿜어내는 열을 식히는 액체 냉각(Liquid Cooling) 기술과 원활한 전력 공급망이 결합된 친환경 AI 데이터센터가 미래 인프라의 심장부로 집중 육성되고 있습니다.'
      }
    ]
  },
  {
    id: 'tech-9',
    category: 'tech',
    type: 'article',
    isNew: true,
    title: 'AI가 스스로 계획하고 행동한다고?',
    summary: 'AI가 목표를 세우고 여러 단계의 작업을 수행하는 에이전틱 AI의 개념과 활용 분야, 보안·개인정보 보호 등의 위험 요소를 알아봅니다.',
    recommendationReason: 'AI가 질문에 답하는 수준을 넘어 실제 작업을 수행하는 방식과 주의할 점을 이해할 수 있습니다.',
    source: '대한민국 정책브리핑',
    duration: '5분 읽기',
    date: '미래 기술',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80',
    url: 'https://m.korea.kr/news/policyNewsView.do?newsId=148968687',
    keyPoints: [
      '인간의 단일 프롬프트를 해석해 목표 달성에 필요한 하위 태스크를 자율적으로 분해하고 실행하는 에이전틱 AI(Agentic AI).',
      '도구 사용(Tool Use), 메모리 관리, 웹 브라우징 및 코드 실행을 결합해 복합 워크플로우를 자동 완성.',
      '자율성이 커짐에 따른 권한 오남용, 프롬프트 인젝션 취약점 및 개인정보 보호를 위한 안전 가드레일 필요성.'
    ],
    sections: [
      {
        heading: '단순 챗봇에서 행동하는 자율 에이전트로',
        body: '기존의 생성형 AI가 "이 질문에 답해줘"에 응답하는 수동적 비서였다면, 에이전틱 AI는 "다음 달 워크숍 장소를 비교해 팀원 일정에 맞춰 예약해줘"라는 최종 목표를 주면 검색부터 비교, 이메일 전송까지 순차적으로 완수합니다.'
      },
      {
        heading: '에이전틱 아키텍처의 3요소: 계획, 도구, 반추',
        body: '에이전트는 복잡한 문제를 쪼개는 계획(Planning), API와 계산기 등을 다루는 도구(Tools), 그리고 실행 결과가 잘못되었을 때 다시 시도하는 자기 반추(Reflection) 루프를 통해 성공률을 높입니다.'
      },
      {
        heading: '자율성 뒤에 숨은 보안과 책임의 과제',
        body: '에이전트가 외부 시스템과 금융, 개인 데이터에 직접 접근할 수 있게 되면서 의도치 않은 삭제나 권한 탈취를 막기 위한 인가 프로토콜과 인간 승인(Human-in-the-loop) 안전장치가 필수적으로 요구됩니다.'
      }
    ]
  },

  // ==================== 공부 (Study) ====================
  {
    id: 'study-1',
    category: 'study',
    type: 'video',
    title: '내 안의 가능성을 끌어내는 메타인지의 비밀 | 리사 손 교수',
    summary: '단순 암기 대신 내가 무엇을 알고 모르는지 직시하고 실수를 두려워하지 않는 인지과학적 성장 학습법.',
    source: 'YouTube · 세바시 Sebasi Talk',
    duration: '15:20',
    date: '인기 강연',
    imageUrl: 'https://i.ytimg.com/vi/9vjJC7TwA3Y/hqdefault.jpg',
    youtubeId: '9vjJC7TwA3Y',
    url: 'https://www.youtube.com/watch?v=9vjJC7TwA3Y'
  },
  {
    id: 'study-2',
    category: 'study',
    type: 'article',
    title: '읽고 잊지 않는 생각의 아카이빙: 나만의 두 번째 뇌를 만드는 메모 독서법',
    summary: '읽고 휘발되는 파편적 정보를 연결하여 나만의 사고 체계로 축적하는 현대적 노트 필기와 메모 독서 체계.',
    source: '브런치스토리 · 마인드와칭 (메모 독서법)',
    duration: '6분 읽기',
    date: '어제',
    imageUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop&q=80',
    url: 'https://brunch.co.kr/@mindwatching',
    keyPoints: [
      '단순히 베껴 쓰는 필기는 뇌의 인지 부하를 줄여 장기 기억으로 전환되지 못하고 휘발됩니다.',
      '코넬식 노트는 필기 영역, 단서 영역, 요약 영역의 3분할 구조로 능동적 인출(Active Recall)을 유도합니다.',
      '제텔카스텐(Zettelkasten)은 지식을 원자 단위 메모로 쪼개고 하이퍼링크처럼 연결하는 창의적 지식 네트워크입니다.'
    ],
    sections: [
      {
        heading: '필기의 함정: 수동적 기록 vs 능동적 재구성',
        body: '강의나 책의 내용을 그대로 받아 적는 행위는 "공부를 많이 했다"는 착각을 줍니다. 하지만 인지과학 연구에 따르면, 정보가 뇌에 새겨지려면 자신의 어휘로 재구성하고 요약하는 인출 과정이 반드시 수반되어야 합니다.'
      },
      {
        heading: '코넬 노트 시스템: 한 장으로 끝내는 체계화',
        body: '코넬 대학교의 월터 포크 교수가 고안한 이 시스템은 종이를 세 칸으로 나눕니다. 오른쪽 넓은 칸에 핵심 강의를 기록하고, 왼쪽 좁은 칸에는 수업 직후 복습용 핵심 키워드와 질문을 작성합니다. 맨 아래쪽에는 전체 내용을 2~3문장으로 압축하는 요약 영역을 둡니다. 나중에 복습할 때는 오른쪽을 가리고 왼쪽 질문만 보며 스스로 답하는 훈련이 가능합니다.'
      },
      {
        heading: '제텔카스텐: 파편화된 지식의 연결망',
        body: '사회학자 니클라스 루만은 평생 9만 장의 인덱스 카드를 연결해 70여 권의 책을 집필했습니다. 한 장의 카드에는 단 하나의 생각(원자성)만 담고, 관련된 다른 카드 번호를 상호 참조로 링크합니다. 노션이나 옵시디언 같은 현대 마크다운 도구 역시 이 제텔카스텐의 양방향 링크 원리를 바탕으로 나만의 두 번째 뇌를 구축할 수 있게 돕습니다.'
      }
    ]
  },
  {
    id: 'study-5',
    category: 'study',
    type: 'video',
    title: '원달러 1,384원: 격해지는 글로벌 환율 전쟁과 경제 흐름 읽기',
    summary: '기준금리 인상과 환율 변동이 내 월급과 자산에 미치는 영향을 거시경제 흐름으로 알기 쉽게 해설.',
    source: 'YouTube · 슈카월드 Syuka World',
    duration: '19:40',
    date: '3일 전',
    imageUrl: 'https://i.ytimg.com/vi/ZIx30v8J0Ro/hqdefault.jpg',
    youtubeId: 'ZIx30v8J0Ro',
    url: 'https://www.youtube.com/watch?v=ZIx30v8J0Ro'
  },
  {
    id: 'study-4',
    category: 'study',
    type: 'article',
    title: '뽀모도로 타이머 최적화: 번아웃 없이 하루 4시간 초몰입 유지하는 법',
    summary: '25분 집중-5분 휴식 원리를 개인 인지 주기와 피로도에 맞추어 커스텀하는 실전 생산성 루틴.',
    source: 'Pomofocus · 타임블로킹 가이드',
    duration: '5분 읽기',
    date: '1주 전',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
    url: 'https://pomofocus.io',
    keyPoints: [
      '뽀모도로 테크닉은 25분 집중과 5분 완전 휴식을 한 세트로 진행하여 뇌의 인지 피로를 차단합니다.',
      '휴식 시간 5분 동안 스마트폰이나 SNS를 확인하면 뇌가 쉬지 못해 다음 세션의 집중력이 반토막 납니다.',
      '개인 업무 성격에 맞춰 50분 집중-10분 휴식 등 유연한 스냅 주기로 커스텀하는 것이 성공의 열쇠입니다.'
    ],
    sections: [
      {
        heading: '인간의 집중력 한계와 시간 조각화(Timeboxing)',
        body: '집중력은 무한정 쓸 수 있는 자원이 아니라 스마트폰 배터리처럼 소모되는 인지 에너지입니다. "오늘 4시간 동안 공부해야지"라는 막연한 목표는 시작 전부터 뇌에 저항감을 주어 딴짓을 유발합니다. 뽀모도로 기법은 시간 단위를 25분이라는 짧은 조각으로 분할해 시작 허들을 극단적으로 낮춥니다.'
      },
      {
        heading: '휴식 시간의 품질이 다음 세션을 결정한다',
        body: '가장 흔한 실수는 5분의 쉬는 시간에 인스타그램이나 유튜브 쇼츠를 켜는 것입니다. 화면을 보며 자극적인 도파민을 소비하면 뇌의 기본모드신경망(DMN)이 활성화되지 못해 이전 25분간 습득한 지식을 정리할 수 없습니다. 5분 동안은 자리에서 일어나 스트레칭을 하거나 물을 마시며 뇌를 비워야 합니다.'
      },
      {
        heading: '실무자를 위한 뽀모도로 고도화 팁',
        body: '코딩이나 글쓰기처럼 딥워크가 필요한 작업은 25분이 너무 짧을 수 있습니다. 이럴 때는 50분 집중-10분 휴식 주기로 확장하세요. 중요한 것은 타이머가 울리면 작업 흐름을 끊고 반드시 휴식 규칙을 엄격히 지키는 것입니다.'
      }
    ]
  },
  {
    id: 'study-6',
    category: 'study',
    type: 'article',
    title: '인지심리학 기반 공부법: 벼락치기 대신 인출 연습과 간격 반복의 과학',
    summary: '망각 시점에 맞춰 자동으로 복습 주기를 계산해주는 과학적 플래시카드 복습 시스템 원리.',
    source: '동아비즈니스리뷰 (DBR) · 인지과학 리포트',
    duration: '7분 읽기',
    date: '2일 전',
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
    url: 'https://dbr.donga.com/article/view/1202/article_no/8172',
    keyPoints: [
      '에빙하우스의 망각 곡선에 따르면 학습 후 하루만 지나도 기억의 약 70%가 소실됩니다.',
      '망각 직전의 타이밍에 복습을 배치하면 뇌는 해당 정보를 생존에 필수적인 영구 기억으로 분류합니다.',
      'Anki나 SuperMemo의 SM-2 알고리즘을 활용하면 최소한의 복습 횟수로 최대의 기억 파지를 달성할 수 있습니다.'
    ],
    sections: [
      {
        heading: '벼락치기가 시험 후 망각되는 이유',
        body: '시험 전날 밤을 새워 수백 페이지를 머릿속에 밀어 넣으면 단기 기억 저장소인 해마에는 머무를 수 있지만, 장기 기억을 관장하는 대뇌 피질로는 이동하지 못합니다. 벼락치기는 시험 당일 아침에는 통할지 몰라도, 일주일만 지나면 거의 모든 지식이 백지화되는 비효율적인 방식입니다.'
      },
      {
        heading: '간격 반복 알고리즘: 기억의 감쇠를 거스르는 기술',
        body: '간격 반복(Spaced Repetition System)은 정보를 망각하기 바로 직전에 복습 신호를 보내는 방식입니다. 첫 복습은 1일 뒤, 두 번째는 3일 뒤, 세 번째는 7일 뒤, 네 번째는 16일 뒤처럼 간격을 지수 함수적으로 늘려갑니다. 이때 기억을 떠올리려고 애쓰는 "인출 노력"이 강할수록 시냅스 연결이 물리적으로 강화됩니다.'
      },
      {
        heading: '디지털 플래시카드로 나만의 망각 방어선 구축하기',
        body: 'Anki 같은 도구는 사용자가 문제의 난이도를 평가할 때마다 다음 출제일을 수학적으로 재계산해 줍니다. 이미 잘 아는 문제는 한 달 뒤로 미루고, 자주 헷갈리는 문제만 집중적으로 매일 출제되므로 공부 시간을 최대 80%까지 절약할 수 있습니다.'
      }
    ]
  },
  {
    id: 'study-8',
    category: 'study',
    type: 'article',
    title: '파인만 학습 기법: 복잡한 지식을 가장 단순한 언어로 설명하는 4단계',
    summary: '복잡한 전문 지식을 직관적인 비유와 쉬운 언어로 재구성하여 지적 빈틈을 메우는 4단계 학습법.',
    source: 'Farnam Street (fs.blog) · 멘탈 모델',
    duration: '5분 읽기',
    date: '3일 전',
    imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&auto=format&fit=crop&q=80',
    url: 'https://fs.blog/the-feynman-technique/',
    keyPoints: [
      '노벨 물리학상 수상자 리처드 파인만이 고안한 최고의 메타인지 자가 점검 학습법입니다.',
      '어려운 전문 용어와 수식의 장막 뒤에 숨지 않고, 초등학생도 이해할 수 있는 쉬운 일상 언어로 설명합니다.',
      '설명이 막히는 지점이 바로 내가 안다고 착각했던 지적 빈틈이며, 이 부분을 원전에서 집중 보완합니다.'
    ],
    sections: [
      {
        heading: '지식의 두 가지 유형: 이름만 아는 것 vs 원리를 아는 것',
        body: '리처드 파인만은 "새의 이름을 안다고 해서 그 새에 대해 아는 것은 아니다"라고 강조했습니다. 전문 용어나 학술적 단어를 외워 읊는 것은 지식이 아니라 단순한 명명에 불과합니다. 진짜 이해는 복잡한 개념의 인과관계를 가장 기초적인 직관으로 풀어낼 수 있을 때 비로소 증명됩니다.'
      },
      {
        heading: '파인만 기법 4단계 실천 가이드',
        body: '1단계: 백지 상단에 배우고자 하는 주제를 적습니다. 2단계: 가상의 8세 아이에게 가르친다고 생각하고 쉬운 단어와 친근한 비유로 설명문을 적어 내려갑니다. 3단계: 설명이 막히거나 전문 용어 없이는 문장이 이어지지 않는 지점을 찾아냅니다. 4단계: 교재나 원문으로 돌아가 그 구멍을 메우고 비유를 정교하게 다듬습니다.'
      },
      {
        heading: '비유의 힘: 추상을 구체로 바꾸기',
        body: '예를 들어 "컴퓨터 RAM과 SSD의 차이"를 설명할 때, 버스 대역폭이나 플래시 메모리 구조를 언급하는 대신 "공부하는 책상 위 공간(RAM)과 뒤편 책꽂이(SSD)"로 비유하면 누구나 직관적으로 깨닫습니다. 비유를 만드는 과정 자체가 뇌 속 지식의 입체적 지도를 완성합니다.'
      }
    ]
  },
  {
    id: 'study-9',
    category: 'study',
    type: 'article',
    isNew: true,
    title: '나에게는 어떤 공부방법이 맞을까?',
    summary: '자신의 학습 수준에 맞는 기초·기본·발전 강좌를 선택하고 학습 목표를 설정해 자기주도학습을 실천하는 방법을 살펴봅니다.',
    recommendationReason: '공부에 관심이 있는 사용자가 자신의 수준에 맞는 학습 계획을 세우는 데 도움이 되는 자료입니다.',
    source: 'EBSi',
    duration: '5분 읽기',
    date: '학습 가이드',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
    url: 'https://www.ebsi.co.kr/ebs/pot/poth/RetrieveHelpBgnGud.ebs',
    keyPoints: [
      '자신의 현재 학습 수준(기초·기본·발전)을 객관적으로 진단하고 무리하지 않는 현실적인 단계별 강좌를 선택합니다.',
      '목표를 세분화하여 매일 실천 가능한 학습 루틴을 만들고 자기주도학습 습관을 형성합니다.',
      'EBSi 수준별 맞춤 커리큘럼을 활용해 취약한 단원을 집중 보완하고 성취감을 단계적으로 쌓아갑니다.'
    ],
    sections: [
      {
        heading: '내 수준에 맞는 강좌 선택이 첫걸음',
        body: '많은 학생들이 자신의 실력보다 앞선 고난도 강의를 선택했다가 중도 포기하곤 합니다. 기초가 부족할 때는 기초·기본 강좌를 통해 개념을 탄탄히 다진 후 발전 강좌로 넘어가는 단계적 접근이 효과적입니다.'
      },
      {
        heading: '자기주도학습을 이끄는 학습 목표 설정법',
        body: '단순히 "오늘 공부 열심히 하기" 대신 "수학 3단원 개념 정리 2강 수강 및 예제 10문제 풀기"처럼 구체적이고 측정 가능한 일일 목표를 세우면 집중력과 실천율이 크게 향상됩니다.'
      },
      {
        heading: 'EBSi 학습 로드맵과 피드백 활용',
        body: '강좌별 맛보기 강의와 진단 테스트를 통해 나에게 맞는 선생님과 커리큘럼을 찾아보고, 완강 후 오답 노트를 복습하며 취약점을 보완하는 선순환을 만들어보세요.'
      }
    ]
  },
  {
    id: 'study-10',
    category: 'study',
    type: 'article',
    isNew: true,
    title: '영어 단어 공부, 더 쉽게 해볼까?',
    summary: '좋아하는 영어 영상에서 AI로 핵심 단어를 찾고 뜻·영어 풀이·예문을 확인한 뒤, 수준에 맞춰 단어 카드와 퀴즈로 반복 학습하는 방법을 알아봅니다.',
    recommendationReason: '영어 공부에 관심 있는 사용자가 친숙한 영상과 AI를 활용해 어휘 공부를 시작할 수 있습니다.',
    source: 'KSW 뉴스',
    duration: '4분 읽기',
    date: '어휘 학습',
    imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=80',
    url: 'https://www.ksw-news.com/news/articleView.html?idxno=3032912',
    keyPoints: [
      '좋아하는 애니메이션이나 유튜브 영상의 자막에서 AI가 자주 쓰이는 핵심 어휘를 자동으로 추출합니다.',
      '단어의 사전적 뜻뿐만 아니라 영상 속 실제 문맥 예문과 영영 풀이를 함께 익혀 자연스러운 쓰임새를 체득합니다.',
      '수준별 플래시 단어 카드와 스피드 퀴즈를 결합해 지루하지 않게 장기 기억으로 전환합니다.'
    ],
    sections: [
      {
        heading: '영상 콘텐츠와 AI가 만난 단어 학습',
        body: '두꺼운 단어장을 기계적으로 암기하는 방식은 쉽게 피로해집니다. 내가 좋아하는 영어 영상에서 실제로 원어민이 사용하는 대화 속 단어를 AI로 추출하면 학습 동기가 자연스럽게 유지됩니다.'
      },
      {
        heading: '문맥으로 기억하는 3단계 어휘 확장',
        body: 'AI가 단어의 핵심 의미, 영영 풀이, 실제 영상 내 문장을 한눈에 제공하여 단편적인 1:1 번역 암기가 아닌 상황별 뉘앙스를 직관적으로 이해할 수 있습니다.'
      },
      {
        heading: '단어 카드와 인터랙티브 퀴즈로 복습',
        body: '망각 곡선에 맞춘 복습 알림과 퀴즈 게임을 통해 방금 익힌 단어를 잊어버리기 전에 반복 노출하여 장기 기억으로 확실하게 정착시킵니다.'
      }
    ]
  },

  // ==================== 문화 (Culture) ====================
  {
    id: 'culture-3',
    category: 'culture',
    type: 'video',
    title: 'Relaxing Jazz Piano Radio: 몰입과 휴식을 위한 24/7 슬로우 재즈',
    summary: '차분한 피아노 선율과 따뜻한 브라스 사운드로 일상에 감성적인 휴식을 더해주는 재즈 라이브 세션.',
    source: 'YouTube · Relaxing Jazz Piano',
    duration: '라이브 스트리밍',
    date: '실시간',
    imageUrl: 'https://i.ytimg.com/vi/Dx5qFachd3A/hqdefault.jpg',
    youtubeId: 'Dx5qFachd3A',
    url: 'https://www.youtube.com/watch?v=Dx5qFachd3A'
  },
  {
    id: 'culture-2',
    category: 'culture',
    type: 'article',
    title: '현대미술 전시가 낯설 때: 도슨트 없이도 작품의 개념과 물성을 읽는 법',
    summary: '전시 서문 읽는 순서부터 작가의 재료 선택 의도와 시대 배경을 포착하는 현대미술 입문 가이드.',
    source: '월간미술 (Monthly Art) · 전시 리뷰 & 비평',
    duration: '6분 읽기',
    date: '3일 전',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
    url: 'https://monthlyart.com',
    keyPoints: [
      '현대미술은 시각적 아름다움을 감상하는 대상이 아니라 작가가 던지는 질문과 개념을 탐색하는 대화입니다.',
      '전시장에 들어서면 전시장 서문과 작가의 약력을 먼저 읽어 시대적 맥락을 파악하세요.',
      '작품 캡션에 적힌 재료(Medium)를 유심히 관찰하면 작가가 표현하고자 한 물성의 메시지가 보입니다.'
    ],
    sections: [
      {
        heading: '왜 현대미술은 난해하게 느껴질까?',
        body: '르네상스나 인상주의 회화는 눈에 보이는 대상을 재현했기 때문에 직관적 감상이 가능했습니다. 하지만 20세기 마르셀 뒤샹의 "샘(변기)" 이후 현대미술은 시각적 쾌락을 넘어 "미술이란 무엇인가?"라는 개념 미술의 영역으로 진화했습니다. 형태보다 그 작품이 놓인 맥락과 작가의 문제의식이 핵심이 되었습니다.'
      },
      {
        heading: '스마트폰을 내리고 1분간 응시하기 (Slow Looking)',
        body: '미술관 관람객이 작품 하나를 바라보는 평균 시간은 15초 남짓이며, 그마저도 사진 촬영에 쓰입니다. 마음에 드는 작품 앞에 서서 최소 1분간 눈을 떼지 마세요. 붓 터치의 두께, 캔버스의 질감, 빛의 반사, 설치된 공간의 여백을 온전히 감각할 때 도록이나 화면에서는 결코 느낄 수 없는 울림이 다가옵니다.'
      },
      {
        heading: '캡션 속 "재료(Medium)"가 건네는 힌트',
        body: '작품 옆 작은 명판에는 제목뿐 아니라 재료가 적혀 있습니다. 전통적인 캔버스에 유채 대신 왜 버려진 플라스틱, 녹슨 철사, 흙, 유기물을 사용했을까요? 재료는 단순한 수단이 아니라 작가가 전하고자 하는 시대비판이나 생명성, 덧없음의 상징입니다.'
      }
    ]
  },
  {
    id: 'culture-4',
    category: 'culture',
    type: 'article',
    title: '쇼츠와 릴스의 시대, 왜 2030은 "텍스트 힙(Text Hip)"에 열광하는가',
    summary: '즉각적인 숏폼 자극을 넘어 깊은 호흡의 사유와 물성을 가진 서가를 찾는 2030 세대의 독서 문화 분석.',
    source: '매거진한경 · 트렌드 인사이트',
    duration: '7분 읽기',
    date: '어제',
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop&q=80',
    url: 'https://magazine.hankyung.com/business/article/202404176251b',
    keyPoints: [
      '알고리즘이 끝없이 밀어 넣는 15초 쇼츠의 과도한 도파민 자극에 피로를 느낀 세대의 문화적 반작용입니다.',
      '종이책을 읽고 밑줄을 긋는 행위가 개성적이고 지적인 라이프스타일의 상징(Text Hip)으로 떠올랐습니다.',
      '대형 체인 서점의 베스트셀러 획일화를 벗어나 서점주의 철학이 깃든 독립서점이 새로운 쉼터가 되고 있습니다.'
    ],
    sections: [
      {
        heading: '숏폼의 시대, 왜 역설적으로 긴 글을 찾는가?',
        body: '하루에도 수백 편의 숏폼 영상을 넘겨보지만, 밤이 되면 머릿속에 남는 것은 공허함과 인지적 산만함뿐입니다. 즉각적인 보상에 지친 젊은 층을 중심으로 깊은 호흡으로 사유할 수 있는 긴 텍스트와 책장을 넘기는 아날로그 촉각에 대한 갈망이 "텍스트 힙"이라는 신조어로 발현되었습니다.'
      },
      {
        heading: '물성(Tactile)을 가진 오브제로서의 책',
        body: '디지털 전자책이나 웹 아티클이 주지 못하는 종이의 무게감, 표지의 타이포그래피, 손때 묻은 책갈피는 그 자체로 하나의 개인적 취향을 대변하는 오브제가 됩니다. 북카페나 북클럽에서 조용히 책을 읽는 시간은 디지털 디톡스와 멘탈 케어의 리추얼로 자리 잡았습니다.'
      },
      {
        heading: '독립서점이 제안하는 큐레이션의 미학',
        body: '알고리즘 추천은 사용자가 이미 좋아하는 것의 복제품만 추천하여 확증 편향의 필터 버블을 만듭니다. 반면 골목길 독립서점의 책장에는 서점주의 독특한 안목으로 엄선된 시집, 인문 에세이, 독립출판물이 꽂혀 있어 뜻밖의 우연한 발견(Serendipity)의 기쁨을 선사합니다.'
      }
    ]
  },
  {
    id: 'culture-6',
    category: 'culture',
    type: 'article',
    title: '공연장 좌석 선택부터 인터미션 에티켓까지: 뮤지컬 첫 관람 가이드',
    summary: '무대 예술의 현장감을 오롯이 즐기기 위한 극장 구조 이해와 초심자 예매 팁 총정리.',
    source: '플레이DB (PlayDB) · 인터파크 공연 매거진',
    duration: '5분 읽기',
    date: '2일 전',
    imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&auto=format&fit=crop&q=80',
    url: 'http://www.playdb.co.kr/magazine/',
    keyPoints: [
      '대극장은 1층 중블(중앙 블록) 5~10열이 배우의 표정 연기와 전체 무대 연출의 최적 밸런스 구역입니다.',
      '오페라글라스는 2층이나 3층 가성비 좌석에서도 배우의 미세한 감정선을 포착할 수 있는 필수 아이템입니다.',
      '공연 중에는 수그리(등받이에 등을 떼고 앞으로 숙이는 행위) 금지와 커튼콜 촬영 허용 여부 숙지가 기본 에티켓입니다.'
    ],
    sections: [
      {
        heading: '극장 좌석 배치도의 비밀: 음향과 시야의 골든존',
        body: '뮤지컬 티켓팅 시 무조건 맨 앞자리가 최고는 아닙니다. 1~2열은 배우의 숨소리와 땀방울까지 보이지만 무대 바닥의 앙상블 대열이나 조명 연출 전체를 조망하기 어렵고 목에 피로가 옵니다. 무대 전체의 웅장한 세트와 배우의 연기를 고루 즐기려면 1층 6~12열 중앙 블록이 음향과 시야 모두에서 최상의 감동을 선사합니다.'
      },
      {
        heading: '인터미션 20분 현명하게 활용하기',
        body: '1막과 2막 사이 주어지는 20분 내외의 인터미션은 화장실 대기 줄이 매우 길어집니다. 1막이 끝나자마자 화장실을 이용하거나 프로그램 북을 미리 둘러보는 것이 좋습니다. 공연의 여운을 음미하며 2막의 클라이맥스를 기대하는 설렘도 뮤지컬만의 묘미입니다.'
      },
      {
        heading: '서로의 몰입을 지키는 관람 에티켓',
        body: '스마트폰 전원을 비행기 탑승 모드가 아닌 "전원 종료"로 해두어야 진동이나 화면 불빛 테러를 막을 수 있습니다. 또한 앞좌석 관객이 상체를 앞으로 숙이면 뒷좌석 관객의 시야 전체가 가려지는 "수그리" 현상이 발생하므로, 등받이에 등을 밀착하고 관람하는 배려가 필요합니다.'
      }
    ]
  },
  {
    id: 'culture-8',
    category: 'culture',
    type: 'article',
    title: '국제 영화제가 주목한 올해의 독립·예술영화 큐레이션 리포트',
    summary: '정형화된 공식을 비껴가며 독창적인 연출 감각과 인간 내면의 깊이를 조명하는 독립 영화 7편 소개.',
    source: '씨네21 (Cine21) · 독립·예술영화 기획',
    duration: '6분 읽기',
    date: '3일 전',
    imageUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=800&auto=format&fit=crop&q=80',
    url: 'http://www.cine21.com',
    keyPoints: [
      '천만 관객 상업 영화의 자극적 클리셰를 벗어나 인물의 내면과 사회적 소외를 섬세하게 응시하는 7편의 걸작.',
      '칸, 베를린, 베니스 국제 영화제 수상작들이 채택한 미장센과 롱테이크 연출의 독창성을 집중 조명합니다.',
      '러닝타임 내내 관객에게 질문을 던지며 엔딩 크레디트 이후 깊은 여운과 토론을 이끌어내는 시네마틱 경험.'
    ],
    sections: [
      {
        heading: '상업 영화의 공식 뒤편에서 피어난 시네마',
        body: '거대 자본이 투입된 블록버스터는 흥행을 위해 예측 가능한 기승전결과 빠른 편집, 과장된 감정선을 강요하기 마련입니다. 반면 독립·예술영화는 정답을 정해두지 않고, 삶의 부조리함이나 관계의 미묘한 틈새를 고요하게 포착하여 관객 각자의 삶을 거울처럼 비추어 줍니다.'
      },
      {
        heading: '침묵과 여백이 빚어내는 미장센의 미학',
        body: '뛰어난 작가주의 감독들은 대사보다 인물의 침묵과 카메라 앵글, 빛과 그림자의 질감으로 이야기를 전합니다. 인물의 뒷모습을 오래도록 비추는 롱테이크(Long Take) 샷은 관객으로 하여금 극 중 인물의 호흡과 고뇌에 온전히 동기화되는 특별한 영화적 체험을 선사합니다.'
      },
      {
        heading: '오늘 밤을 위한 추천 영화 큐레이션',
        body: '일상의 소소한 대화 속에서 가족의 의미를 되묻는 정주리 감독의 신작부터, 자연의 소리와 침묵을 앰비언트 사운드로 직조한 유럽 다큐멘터리까지 다양합니다. 스마트폰을 멀리 두고 불을 끈 채 방 안을 작은 영화관으로 만들어 보세요.'
      }
    ]
  },
  {
    id: 'culture-9',
    category: 'culture',
    type: 'article',
    isNew: true,
    title: '우리 전통문화가 세계로 나아간다고?',
    summary: '한식·한복·한지·한글·한옥 등 한국 전통문화를 세계적인 문화 브랜드로 발전시키려는 계획을 소개합니다.',
    recommendationReason: '한국 전통문화가 현대 사회에서 어떻게 활용되고 세계로 확장되는지 알아볼 수 있습니다.',
    source: '매일신문',
    duration: '5분 읽기',
    date: '전통 문화',
    imageUrl: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=800&auto=format&fit=crop&q=80',
    url: 'https://m.imaeil.com/page/view/2025041516144443640',
    keyPoints: [
      '한식, 한복, 한지, 한글, 한옥을 아우르는 "5-K 전통문화 세계화" 브랜드 전략 본격 추진.',
      '단순한 과거 유물 보존을 넘어 현대적인 라이프스타일 디자인과 글로벌 팝 컬처와의 융합.',
      '친환경 한지 공예, 현대 감각의 생활 한복, K-푸드 웰빙 식문화가 글로벌 명품 시장에서 각광.'
    ],
    sections: [
      {
        heading: '한국의 5대 정체성: 한식·한복·한지·한글·한옥',
        body: '한국의 정체성을 담은 5가지 전통 자산(5-K)이 전 세계적인 K-웨이브 열풍과 결합하여 고부가가치 문화 브랜드로 재탄생하고 있습니다. 전통의 뿌리를 보존하면서도 현대적 감각으로 재해석하는 작업이 핵심입니다.'
      },
      {
        heading: '현대 라이프스타일 속에 스며든 전통 미학',
        body: '천연 닥나무 섬유로 만든 한지가 친환경 럭셔리 포장재와 음향 스피커 진동판으로 쓰이고, 한옥의 처마 곡선과 차경(借景) 철학이 현대 건축 디자인에 영감을 주며 글로벌 건축계의 찬사를 받고 있습니다.'
      },
      {
        heading: '세계인이 함께 즐기는 K-컬처 플랫폼',
        body: '해외 주요 문화원과 글로벌 박람회를 통해 전 세계 시민들이 직접 한복을 입고, 궁중 병과를 맛보며, 한글의 조형미를 캘리그라피로 체험하는 인터랙티브 문화 교류가 확산되고 있습니다.'
      }
    ]
  },
  {
    id: 'culture-10',
    category: 'culture',
    type: 'article',
    isNew: true,
    title: '우리 전통문화를 직접 체험하려면?',
    summary: '울산의 향교와 서원에서 전통 예절·붓글씨·도예·전통 음식 등을 체험하는 문화유산 활용 프로그램을 소개합니다.',
    recommendationReason: '전통문화를 직접 체험할 기회를 살펴보고 우리 문화유산의 가치를 이해할 수 있습니다.',
    source: '연합뉴스',
    duration: '4분 읽기',
    date: '문화재 체험',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    url: 'https://www.yna.co.kr/view/AKR20260526109300057',
    keyPoints: [
      '울산향교와 구강서원 등 역사적 고택을 시민들에게 개방하는 살아있는 문화유산 활용 사업.',
      '전통 다도(茶道), 붓글씨 서예, 도예 빚기, 전통 한과 만들기 등 남녀노소 맞춤형 체험 코스 운영.',
      '엄숙한 유적지 관람에서 벗어나 오감으로 만지고 즐기는 지역 문화유산의 대중화 모델.'
    ],
    sections: [
      {
        heading: '문턱을 낮춘 고택과 서원의 변신',
        body: '담장 너머로 바라보기만 하던 울산향교와 구강서원이 시민들의 일상 속 쉼터이자 배움터로 문을 열었습니다. 유서 깊은 한옥 마루에 앉아 바람 소리를 들으며 전통의 지혜를 배우는 특별한 시간이 마련됩니다.'
      },
      {
        heading: '오감으로 배우는 다도와 서예',
        body: '차를 우리고 대접하는 정갈한 다도 예절을 통해 마음의 안정을 찾고, 먹향 그윽한 한지 위에 먹물로 붓글씨를 쓰며 디지털 기기에서 벗어나 아날로그 몰입의 즐거움을 경험할 수 있습니다.'
      },
      {
        heading: '가족과 함께하는 주말 전통 레저',
        body: '흙을 직접 빚어 나만의 도자기를 굽고, 전통 방식으로 다식을 찍어내는 등 아이부터 어르신까지 온 가족이 함께 참여할 수 있는 실감형 프로그램이 계절별로 다채롭게 펼쳐집니다.'
      }
    ]
  },

  // ==================== 취미 (Hobby) ====================
  {
    id: 'hobby-1',
    category: 'hobby',
    type: 'video',
    title: '달리기의 기초: 무릎 부상 없는 착지 자세와 지치지 않는 2박자 호흡법',
    summary: '시선 처리, 코어 유지, 미드풋 발 디딤과 산소 섭취를 극대화하는 러닝 교과서 기초 가이드.',
    source: 'YouTube · 러닝 텍스트북',
    duration: '12:45',
    date: '추천 영상',
    imageUrl: 'https://i.ytimg.com/vi/Q-5MAWBA8FI/hqdefault.jpg',
    youtubeId: 'Q-5MAWBA8FI',
    url: 'https://www.youtube.com/watch?v=Q-5MAWBA8FI'
  },
  {
    id: 'hobby-5',
    category: 'hobby',
    type: 'video',
    title: '이탈리아 정통 말고 한국 스타일! 실패 없는 K-알리오올리오 파스타',
    summary: '마늘과 올리브유, 면수를 완벽하게 결합(Emulsion)하여 깊은 풍미를 완성하는 초간단 홈쿠킹 레시피.',
    source: 'YouTube · 백종원 PAIK JONG WON',
    duration: '11:20',
    date: '인기 레시피',
    imageUrl: 'https://i.ytimg.com/vi/ohihzV6Z85k/hqdefault.jpg',
    youtubeId: 'ohihzV6Z85k',
    url: 'https://www.youtube.com/watch?v=ohihzV6Z85k'
  },
  {
    id: 'hobby-2',
    category: 'hobby',
    type: 'article',
    title: '홈카페 핸드드립 입문: 원두 로스팅 포인트와 분쇄도별 브루잉 공식',
    summary: '산미와 단맛의 균형을 이끌어내는 물 온도(92도)와 드리퍼 형태별 푸어오버 테크닉.',
    source: '블랙워터이슈 (BWIssue) · 스페셜티 커피 전문지',
    duration: '5분 읽기',
    date: '2일 전',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80',
    url: 'https://bwissue.com',
    keyPoints: [
      '물 온도 90~93도와 원두:물 비율 1:15~1:16 공식만 지켜도 카페 부럽지 않은 깔끔한 브루잉이 완성됩니다.',
      '약배전(라이트 로스팅) 원두는 얇은 분쇄도와 고온(93도)으로 화사한 산미를, 강배전 원두는 중거친 분쇄도로 바디감을 살립니다.',
      '추출 시작 전 40초간의 원두 뜸들이기(Blooming) 과정이 원두 내 이산화탄소를 배출해 잡미를 없애는 핵심입니다.'
    ],
    sections: [
      {
        heading: '핸드드립의 핵심 3대 변수: 원두, 물, 시간',
        body: '에스프레소 머신 없이도 드리퍼와 필터, 주전자만으로 훌륭한 커피를 내릴 수 있는 것이 핸드드립의 매력입니다. 가장 중요한 기본 공식은 원두 20g 기준 300g의 물을 내리는 "1:15 브루잉 레이시오(Brewing Ratio)"입니다. 이 비율을 기준으로 취향에 따라 농도를 조절해 나갈 수 있습니다.'
      },
      {
        heading: '뜸들이기(Blooming): 커피의 숨구멍을 여는 40초',
        body: '신선하게 로스팅된 원두 속에는 다량의 이산화탄소가 갇혀 있습니다. 처음 원두 가루 전체가 살짝 적셔질 만큼 40~50g의 물을 부어주면 빵처럼 부풀어 오르는 "커피 번(Coffee Bun)" 현상이 나타납니다. 이 뜸 과정을 거쳐야 물길이 균일하게 형성되어 과소추출이나 떫은맛을 방지할 수 있습니다.'
      },
      {
        heading: '하리오 V60 vs 칼리타 웨이브: 드리퍼의 차이',
        body: '빠른 유속과 깔끔한 산미를 선호한다면 원뿔형 구조의 하리오 V60을, 균일한 추출과 묵직한 단맛을 원한다면 평평한 바닥에 구멍이 3개 뚫린 칼리타 웨이브를 추천합니다. 원두 산지(에티오피아의 과일 향, 콜롬비아의 고소한 너트 향)에 어울리는 드리퍼를 매칭하는 재미가 쏠쏠합니다.'
      }
    ]
  },
  {
    id: 'hobby-4',
    category: 'hobby',
    type: 'article',
    title: '실내 간접광에서도 건강하게 자라는 공기정화 반려식물 5종과 물주기',
    summary: '과습으로 인한 뿌리 썩음을 방지하는 화분 흙 건조도 체크법과 플랜테리어 입문 안내.',
    source: '국립원예특작과학원 · 반려식물 가이드',
    duration: '6분 읽기',
    date: '5일 전',
    imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop&q=80',
    url: 'https://www.nihhs.go.kr',
    keyPoints: [
      '실내 식물이 시드는 가장 큰 원인은 물 부족이 아니라 과습(Overwatering)과 통풍 부족입니다.',
      '몬스테라, 스킨답서스, 산세베리아, 테이블야자, 필로덴드론은 직사광선 없는 거실에서도 튼튼하게 자랍니다.',
      '정해진 요일에 기계적으로 물을 주지 말고, 나무젓가락으로 흙 속 3~5cm가 말랐는지 확인 후 듬뿍 줍니다.'
    ],
    sections: [
      {
        heading: '식물 킬러를 탈출하는 첫걸음: 빛과 바람의 이해',
        body: '많은 초보 식집사들이 "식물은 햇빛을 많이 받아야 한다"며 베란다 직사광선에 바로 내놓았다가 잎이 타버리는 경험을 합니다. 실내 관엽식물 대다수는 열대 우림의 큰 나무 그늘 아래서 진화했기 때문에, 커튼을 한 번 거친 부드러운 "밝은 간접광"에서 가장 윤기 나는 잎을 보여줍니다.'
      },
      {
        heading: '과습을 막는 저면관수와 겉흙 체크법',
        body: '"일주일에 한 번 물주기"라는 규칙은 계절과 실내 습도에 따라 위험합니다. 나무젓가락을 화분 가장자리에 5cm 깊이로 찔러 넣었다가 뺐을 때 흙이 묻어나지 않고 보송보송할 때가 물을 줄 타이밍입니다. 물을 줄 때는 화분 밑바닥 배수구로 물이 콸콸 흘러나올 만큼 충분히 주고, 받침대에 고인 물은 즉시 비워 뿌리 호흡을 도와주세요.'
      },
      {
        heading: '초보자를 위한 베스트 3종 추천',
        body: '공기정화 능력이 탁월하고 어두운 방에서도 강인한 "스킨답서스", 찢어진 잎의 이국적인 조형미를 뽐내는 "몬스테라", 건조에 강해 한 달에 한 번만 줘도 끄떡없는 "산세베리아"부터 시작해 보세요. 반려식물과 함께하는 초록빛 일상이 주는 정서적 위로는 놀라울 정도로 큽니다.'
      }
    ]
  },
  {
    id: 'hobby-6',
    category: 'hobby',
    type: 'article',
    title: '아이패드 드로잉과 어반스케치: 형태 왜곡을 두려워하지 않는 취미 미술',
    summary: '사진을 트레이싱하지 않고도 일상의 장면을 자신만의 선과 색상 팔레트로 기록하는 드로잉 가이드.',
    source: 'Procreate 공식 핸드북 · 디지털 드로잉 가이드',
    duration: '5분 읽기',
    date: '6일 전',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80',
    url: 'https://procreate.com/kr/handbook/procreate',
    keyPoints: [
      '똑같이 그리는 사진 복사가 아니라 일상의 한 조각을 나만의 시선과 필선으로 담아내는 감성 드로잉입니다.',
      '프로크리에이트(Procreate)의 모노라인 브러시와 스튜디오 펜으로 가벼운 외곽선부터 시작해 보세요.',
      '투시도법의 엄격한 법칙에 얽매이지 않고 비뚤어진 선조차 손그림 특유의 따뜻한 매력으로 승화시키는 태도가 중요합니다.'
    ],
    sections: [
      {
        heading: '백지 공포증을 이기는 낙서(Doodle)의 힘',
        body: '처음 디지털 펜슬을 잡으면 매끈한 유리 액정 위에서 손이 미끄러지고, 선 하나도 완벽하게 그어야 한다는 강박에 지우개 버튼(Undo)만 누르다 지치기 쉽습니다. 종이 질감 필름을 붙이거나 브러시의 떨림 보정 수치를 살짝 올려두고, 카페의 커피잔이나 책상 위 안경 같은 작은 소품부터 편안하게 낙서하듯 그려보세요.'
      },
      {
        heading: '어반스케치: 여행의 순간을 영원으로 박제하는 법',
        body: '스마트폰 카메라로 찍은 수천 장의 사진은 갤러리 속에서 잊히기 쉽지만, 여행지 길모퉁이에 15분간 서서 스케치북에 담은 골목길의 풍경은 평생 기억에 남습니다. 건물의 모든 창문과 벽돌을 다 그릴 필요는 없습니다. 빛을 받는 지붕의 실루엣과 그림자진 벽면의 큰 덩어리감만 잡아내면 충분합니다.'
      },
      {
        heading: '나만의 색감 팔레트 만들기',
        body: '그림의 분위기를 결정하는 것은 정밀한 형태보다 "색상의 통일감"입니다. 자연의 초록색, 카페 벽돌의 테라코타 주황색, 흐린 하늘의 슬레이트 블루처럼 3~4가지 메인 컬러 팔레트를 정해두고 채색해 보세요. 비뚤어진 선과 어우러져 그림에 유일무이한 개성이 깃듭니다.'
      }
    ]
  },
  {
    id: 'hobby-8',
    category: 'hobby',
    type: 'article',
    title: '에어프라이어로 만드는 겉바속촉 플레인 버터 스콘: 베이킹 기본기',
    summary: '차가운 버터 큐브 샌딩과 반죽 휴지 시간을 지켜 오븐 없이도 바삭한 식감을 완성하는 베이킹 레시피.',
    source: '만개의레시피 · 홈베이킹 연구소',
    duration: '6분 읽기',
    date: '4일 전',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
    url: 'https://www.10000recipe.com',
    keyPoints: [
      '오븐이 없어도 에어프라이어의 대류 열풍으로 겉은 바삭하고 속은 촉촉한 영국식 플레인 스콘을 구울 수 있습니다.',
      '버터가 반죽에 녹아들지 않도록 깍둑썰기하여 차갑게 유지하고, 가루류와 모래알 크기로 샌딩하는 것이 결 생성의 비밀입니다.',
      '반죽을 치대지 않고 접어서 30분간 냉장 휴지한 뒤 180도에서 15분 구워내면 완벽한 크랙이 완성됩니다.'
    ],
    sections: [
      {
        heading: '홈베이킹의 훌륭한 입문작, 스콘',
        body: '발효 과정이 필요한 빵이나 머랭을 올려야 하는 케이크와 달리, 퀵 브레드(Quick Bread)인 스콘은 가루류와 차가운 버터, 우유만 있으면 30분 만에 반죽을 끝낼 수 있어 홈베이커에게 최고의 첫 도전 과제입니다. 갓 구워낸 따끈한 스콘에 딸기잼과 클로티드 크림을 곁들이면 주말 오후가 홈카페로 변신합니다.'
      },
      {
        heading: '버터를 사수하라: 샌딩(Sanding)과 결 만들기',
        body: '스콘의 생명인 파이 같은 "결"은 차가운 버터 조각이 가루 사이에 층층이 갇혀 있다가, 뜨거운 에어프라이어 열기 속에서 버터가 녹아 수증기를 뿜어내며 틈새를 밀어 올릴 때 생겨납니다. 손의 체온으로 버터가 녹지 않도록 스크래퍼나 포크를 사용해 콩알 크기로 빠르게 다져주는 것이 핵심입니다.'
      },
      {
        heading: '에어프라이어 온도 세팅과 실패 방지 꿀팁',
        body: '에어프라이어는 열선과 반죽 사이 거리가 가까워 윗면이 쉽게 탈 수 있습니다. 175~180도로 예열한 뒤 종이호일을 깔고 12~15분간 구워줍니다. 윗면 색이 너무 빨리 짙어진다면 마지막 3분은 호일을 가볍게 덮어주세요. 겉은 비스킷처럼 바삭하고 속은 버터의 풍미가 가득한 인생 스콘을 만날 수 있습니다.'
      }
    ]
  },
  {
    id: 'hobby-9',
    category: 'hobby',
    type: 'article',
    isNew: true,
    title: '된장 마요 김치볶음밥? 같이 만들어 볼까?',
    summary: '김치에 된장·마요네즈·간장 등의 양념을 넣고 볶은 뒤 밥을 섞어 만드는 색다른 김치볶음밥 조리법을 소개합니다.',
    recommendationReason: '익숙한 김치볶음밥에 새로운 양념을 더해 색다른 요리를 시도해 볼 수 있습니다.',
    source: '아리마리 티스토리',
    duration: '5분 읽기',
    date: '홈쿠킹 레시피',
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80',
    url: 'https://arimarim.tistory.com/1158',
    keyPoints: [
      '잘 익은 신김치의 산미를 된장의 구수한 감칠맛과 마요네즈의 고소함으로 부드럽게 감싸는 황금 비율.',
      '된장 반 스푼, 마요네즈 한 스푼, 진간장 살짝을 팬 가장자리에 눌려 불향을 입히는 핵심 팁.',
      '기존 고추장·고춧가루 볶음밥과 달리 자극적이지 않고 풍미가 깊어 혼밥 요리로 안성맞춤.'
    ],
    sections: [
      {
        heading: '김치볶음밥에 된장과 마요네즈를 넣는 이유',
        body: '김치볶음밥에 된장이라니 생소하게 느껴질 수 있지만, 된장의 아미노산 감칠맛이 김치의 시큼한 맛을 중화하고 마요네즈의 유지방이 밥알 하나하나를 코팅해 윤기와 고소함을 극대화해 줍니다.'
      },
      {
        heading: '실패 없는 재료 손질과 양념 볶기',
        body: '잘게 썬 김치 1공기에 대파를 넉넉히 썰어 파기름을 낸 뒤 김치를 달달 볶아줍니다. 김치가 투명해질 때 팬 한쪽에 된장 0.5스푼, 진간장 0.5스푼을 넣고 지글지글 끓여 불향을 내는 것이 결정적 비법입니다.'
      },
      {
        heading: '마요네즈로 마무리하는 밥알 코팅',
        body: '불을 약하게 줄이고 식은 밥을 넣어 주걱으로 가르듯 섞은 뒤, 마지막에 마요네즈 1스푼을 둘러 센 불에서 1분간 빠르게 볶아냅니다. 반숙 계란후라이와 김가루를 얹으면 근사한 한 그릇 요리가 완성됩니다.'
      }
    ]
  },
  {
    id: 'hobby-10',
    category: 'hobby',
    type: 'article',
    isNew: true,
    title: '스마트폰으로 사진을 더 잘 찍을 수 있을까?',
    summary: '스마트폰으로 사진을 찍을 때 구도와 빛을 활용해 더 좋은 사진을 만드는 기본 촬영 방법을 소개합니다.',
    recommendationReason: '사진 촬영에 관심 있는 사용자가 일상에서 쉽게 적용할 수 있는 촬영 기법을 배울 수 있습니다.',
    source: '브로시스터',
    duration: '6분 읽기',
    date: '스마트폰 사진',
    imageUrl: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800&auto=format&fit=crop&q=80',
    url: 'https://brosister.officialsite.kr/photography/smartphone-photography',
    keyPoints: [
      '스마트폰 카메라 설정에서 격자(3x3 삼분할 그리드)를 켜고 수평과 여백을 맞추는 구도의 마법.',
      '카메라 렌즈를 옷소매로 깨끗이 닦는 것만으로도 빛 번짐과 안개 낀 듯한 뿌연 현상을 즉시 해결.',
      '직사광선보다는 창가 간접광이나 해 질 녘 골든아워(Golden Hour)의 부드러운 자연광 활용법.'
    ],
    sections: [
      {
        heading: '렌즈 닦기와 3x3 격자선 활성화',
        body: '멋진 풍경을 찍기 전 스마트폰 카메라 렌즈를 안경 닦이나 부드러운 천으로 닦는 것만으로 사진의 선명도가 2배는 올라갑니다. 카메라 설정에서 "격자선"을 켜고 교차점에 주인공을 배치하는 3분할 법칙만 지켜도 안정감이 살아납니다.'
      },
      {
        heading: '빛의 방향 읽기: 순광, 역광, 사광',
        body: '인물이나 음식을 찍을 때는 피사체 정면에서 비추는 강한 빛보다 45도 측면에서 들어오는 사광(Side Light)을 활용하면 입체감 있는 그림자가 생겨 분위기가 극대화됩니다.'
      },
      {
        heading: '탭으로 초점과 노출(밝기) 수동 조절하기',
        body: '화면에서 가장 중요한 피사체를 손가락으로 가볍게 탭한 뒤 옆에 나타나는 해 모양 아이콘을 살짝 아래로 내려 노출을 조금 어둡게 맞추면 하이라이트가 날아가지 않고 색감이 훨씬 깊고 진해집니다.'
      }
    ]
  }
];

export const PRESET_MODES = [
  {
    id: 'balanced',
    name: '균형 모드',
    desc: '모든 분야를 골고루',
    weights: { study: 50, tech: 50, culture: 50, hobby: 50 }
  },
  {
    id: 'growth',
    name: '커리어·성장',
    desc: '공부와 기술 집중',
    weights: { study: 80, tech: 80, culture: 20, hobby: 0 }
  },
  {
    id: 'healing',
    name: '휴식·힐링',
    desc: '문화와 취미 위주',
    weights: { study: 0, tech: 20, culture: 80, hobby: 80 }
  },
  {
    id: 'studyOnly',
    name: '학습 집중',
    desc: '오직 공부 콘텐츠만',
    weights: { study: 100, tech: 0, culture: 0, hobby: 0 }
  }
];
