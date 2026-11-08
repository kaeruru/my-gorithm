// 맘고리즘 (내맘대로 알고리즘) - 카테고리별 추천 콘텐츠 데이터셋
// 카테고리: study(공부), tech(기술), culture(문화), hobby(취미)
// 타입: video(영상), article(기사/글)

export const CATEGORY_META = {
  study: {
    id: 'study',
    name: '공부',
    shortTag: '학습 · 교양',
    color: '#4338CA',
    tagBg: '#E0E7FF',
    tagText: '#312E81',
    border: '#818CF8',
    solidBg: '#4338CA',
    solidText: '#FFFFFF',
    solidBorder: '#4338CA',
    darkSolidBg: '#3730A3',
    darkSolidBorder: '#4F46E5',
    glowShadow: 'rgba(67, 56, 202, 0.28)',
    description: '학습법, 인문·교양 지식',
    iconSvg: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>'
  },
  tech: {
    id: 'tech',
    name: '기술',
    shortTag: 'IT · 트렌드',
    color: '#0284C7',
    tagBg: '#E0F2FE',
    tagText: '#075985',
    border: '#38BDF8',
    solidBg: '#0284C7',
    solidText: '#FFFFFF',
    solidBorder: '#0284C7',
    darkSolidBg: '#0369A1',
    darkSolidBorder: '#0284C7',
    glowShadow: 'rgba(2, 132, 199, 0.28)',
    description: 'AI, 개발, IT 트렌드',
    iconSvg: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>'
  },
  culture: {
    id: 'culture',
    name: '문화',
    shortTag: '예술 · 라이프',
    color: '#BE185D',
    tagBg: '#FFE4E6',
    tagText: '#881337',
    border: '#FB7185',
    solidBg: '#BE185D',
    solidText: '#FFFFFF',
    solidBorder: '#BE185D',
    darkSolidBg: '#9F1239',
    darkSolidBorder: '#BE185D',
    glowShadow: 'rgba(190, 24, 93, 0.28)',
    description: '문화, 예술 트렌드',
    iconSvg: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>'
  },
  hobby: {
    id: 'hobby',
    name: '취미',
    shortTag: '액티비티 · 일상',
    color: '#059669',
    tagBg: '#D1FAE5',
    tagText: '#064E3B',
    border: '#34D399',
    solidBg: '#059669',
    solidText: '#FFFFFF',
    solidBorder: '#059669',
    darkSolidBg: '#047857',
    darkSolidBorder: '#059669',
    glowShadow: 'rgba(5, 150, 105, 0.28)',
    description: '운동, 가드닝, 쿠킹',
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
  {
    id: 'tech-draft-1',
    category: 'tech',
    type: 'article',
    title: "2026 온디바이스 AI 패러다임: 클라우드를 벗어나 내 주머니 속으로 들어온 초경량 신경망",
    summary: "거대 데이터센터에 의존하던 LLM이 어떻게 1와트 미만의 스마트폰 AP 안으로 압축되었는지, NPU 아키텍처의 혁신을 분석합니다.",
    source: "토스 테크 · Toss Tech",
    duration: '6분 읽기',
    date: '최신 칼럼',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    url: 'https://toss.tech',
    recommendationReason: "네트워크 연결 없이도 스마트폰 자체 칩셋에서 작동하는 온디바이스 AI의 보안성과 프라이버시 패러다임을 조명합니다.",
    keyPoints: [
      "클라우드 API 호출 지연 시간(Latency)과 데이터 유출 위험을 0으로 만드는 로컬 온디바이스 추론.",
      "양자화(Quantization)와 지식 증류(Distillation)를 통한 3B~7B 매개변수 초경량화 기법.",
      "스마트폰 배터리 소모를 극소화하는 모바일 전용 NPU(신경망처리장치) 칩셋 설계."
    ],
    sections: [
      {
        heading: "1. 중앙 집중형 클라우드의 한계와 로컬 지능의 태동",
        body: "지난 수년간 생성형 AI는 수천 개의 GPU가 돌아가는 거대 클라우드 데이터센터의 전유물이었습니다. 하지만 수억 명의 동시 접속으로 인한 천문학적인 서버 비용, 평균 1~2초에 달하는 네트워크 응답 지연(Latency), 그리고 민감한 개인정보의 외부 유출 우려는 클라우드 중심 AI의 치명적인 한계로 부각되었습니다. 이에 따라 글로벌 빅테크 기업들은 모델을 스마트폰, 노트북, 웨어러블 기기 자체에서 구동하는 '온디바이스(On-Device) AI'로 기술 축을 급격히 이동하고 있습니다."
      },
      {
        heading: "2. 매개변수 다이어트: 수십 기가 모델이 2GB 램에 들어가는 원리",
        body: "온디바이스 AI의 핵심 기술은 고성능 거대 모델의 성능을 90% 이상 유지하면서 모델 크기를 10분의 1 이하로 줄이는 압축 공학입니다. 부동소수점 정밀도를 16비트에서 4비트(INT4)로 낮추는 양자화(Quantization) 기술과 불필요한 뉴런 연결을 가지치기하는 프루닝(Pruning), 그리고 거대 교사 모델이 소형 학생 모델을 지도하는 지식 증류(Knowledge Distillation) 기술이 결합되어 스마트폰의 제한된 NPU 자원에서도 초당 수십 토큰의 고속 추론을 실현했습니다."
      },
      {
        heading: "3. 프라이버시와 개인화의 결합: 내 데이터를 서버에 보내지 않는 세상",
        body: "온디바이스 AI의 가장 강력한 무기는 타협 없는 보안입니다. 사용자의 사진, 음성, 금융 거래 내역, 개인 메시지가 기기 외부로 단 1바이트도 전송되지 않고 로컬에서 안전하게 처리됩니다. 이는 의료, 금융, 법률 등 고도의 프라이버시가 요구되는 산업군뿐만 아니라, 사용자의 실시간 행동 데이터를 실시간으로 반영하는 초개인화 알고리즘의 비약적인 진화를 의미합니다."
      }
    ]
  },
  {
    id: 'study-draft-1',
    category: 'study',
    type: 'article',
    title: "뇌과학이 증명한 '인출 연습(Retrieval Practice)': 읽기만 하는 공부가 실패하는 이유",
    summary: "단순 반복 읽기는 뇌에 지적 착각만 줄 뿐입니다. 뇌신경 시냅스를 영구 강화하는 능동적 기억 인출의 과학적 메커니즘을 탐구합니다.",
    source: "하버드 비즈니스 리뷰 · 뇌과학 아카이브",
    duration: '5분 읽기',
    date: '최신 칼럼',
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
    url: 'https://hbr.org',
    recommendationReason: "노력 대비 기억 지속 시간을 3배 이상 늘려주는 인지 심리학 최고의 학습 원리를 바로 일상에 적용할 수 있습니다.",
    keyPoints: [
      "입력(Input) 중심 학습의 치명적 함정: '알고 있다'는 착각을 유발하는 유창성 착각(Fluency Illusion).",
      "기억을 끄집어낼 때마다 시냅스 연결이 물리적으로 재구성되는 기억 고정화(Re-consolidation).",
      "플래시카드, 백지 복습법, 페이만 테크닉을 활용한 실전 인출 학습 프로토콜."
    ],
    sections: [
      {
        heading: "1. 교재를 형광펜으로 칠하는 행위가 주는 가짜 안도감",
        body: "많은 수험생과 지식 노동자들은 책을 여러 번 정독하고 중요한 문장에 형광펜을 칠하는 것만으로 충분한 공부를 했다고 착각합니다. 인지과학에서는 이를 '유창성 착각(Fluency Illusion)'이라고 부릅니다. 눈앞에 놓인 문장을 매끄럽게 읽어 내려갈 수 있다는 느낌이, 정작 시험장이나 실무 현장에서 그 지식을 스스로 끄집어낼 수 있다는 착각을 유발하기 때문입니다. 정보가 뇌로 들어오는 '입력' 과정 자체는 장기 기억을 만드는 데 거의 기여하지 못합니다."
      },
      {
        heading: "2. 기억을 끄집어내는 고통이 시냅스를 재건축한다",
        body: "장기 기억의 형성은 정보를 머릿속에서 억지로 쥐어짜 내는 '인출(Retrieval)' 순간에 비로소 촉발됩니다. 뇌는 기억을 인출하려고 애쓰는 과정에서 도파민과 노르에피네프린을 분비하며, 관련 뉴런 간의 시냅스 연결을 더 굵고 단단하게 재배선합니다. 심리학 실험에 따르면, 4번 복습한 그룹보다 1번 읽고 3번 셀프 테스트를 본 그룹의 1주일 뒤 기억 잔존율이 50% 이상 월등히 높았습니다. 인출할 때 겪는 적절한 난이도와 인지적 고통이야말로 뇌가 기억을 중요한 자산으로 분류하는 신호입니다."
      },
      {
        heading: "3. 내일부터 당장 실천하는 3단계 인출 프로토콜",
        body: "인출 연습을 삶에 안착시키는 방법은 매우 단순합니다. 첫째, 한 챕터를 읽은 후 책을 덮고 빈 종이에 방금 읽은 핵심 개념 3가지를 손으로 적어보는 '백지 복습법'을 적용하세요. 둘째, 내가 배운 개념을 초등학생도 이해할 수 있는 쉬운 비유로 소리 내어 설명해보는 '페이만 테크닉'을 병행합니다. 셋째, Anki 같은 간격 반복(Spaced Repetition) 알고리즘 도구를 활용해 잊힐 만한 시점에 인출 질문을 주기적으로 던지는 시스템을 구축하세요."
      }
    ]
  },
  {
    id: 'culture-draft-1',
    category: 'culture',
    type: 'article',
    title: "성수동과 한남동의 공간 브랜딩: 오프라인 팝업스토어가 파는 '경험 경제학'",
    summary: "이커머스가 정복한 디지털 시대, 왜 브랜드들은 역설적으로 값비싼 오프라인 팝업 공간으로 몰려드는지 공간 신경학적 배경을 짚어봅니다.",
    source: "씨네21 · 독립·예술 기획",
    duration: '5분 읽기',
    date: '최신 칼럼',
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
    url: 'http://www.cine21.com',
    recommendationReason: "스마트폰 화면을 넘어 오감(五感)을 자극하는 공간 경험이 브랜드의 충성도를 어떻게 결정짓는지 통찰을 얻을 수 있습니다.",
    keyPoints: [
      "클릭 몇 번으로 구매 가능한 시대, 소비자가 기꺼이 1시간씩 줄을 서는 '체험의 희소성'.",
      "시각, 촉각, 공간의 향(Scent)이 뇌의 편도체에 직접 각인시키는 정서적 유대감.",
      "물건을 파는 매장에서 브랜드의 세계관을 탐험하는 몰입형 전시장으로의 진화."
    ],
    sections: [
      {
        heading: "1. 쿠팡과 네이버가 줄 수 없는 것: 공간의 입체적 질감",
        body: "스마트폰 터치 한 번으로 새벽에 문 앞까지 배송되는 완벽한 편리함의 시대에, 2030 세대는 왜 성수동 골목길 팝업스토어 앞에 1시간씩 줄을 서서 기다릴까요? 답은 '경험의 결핍'에 있습니다. 디지털 환경은 극도의 효율성을 제공하지만, 오감을 자극하는 입체적인 질감과 장소성(Placeness)을 제공하지 못합니다. 현대의 소비자들에게 공간은 단순히 물건을 구매하는 매장이 아니라, 브랜드를 온몸으로 감각하고 자신만의 취향을 인증하는 문화적 무대로 작동합니다."
      },
      {
        heading: "2. 뇌의 감정 중추를 자극하는 향기와 오브제의 심리학",
        body: "공간 브랜딩의 핵심은 뇌의 후각과 촉각 경로를 장악하는 것입니다. 젠틀몬스터, 탬버린즈, 아더에러 같은 공간 혁신 브랜드들은 입구에 들어서는 순간 독자적으로 조향된 시그니처 향과 기괴하면서도 웅장한 키네틱 아트를 마주하게 만듭니다. 후각과 시각적 충격은 이성적 판단을 관장하는 전두엽을 건너뛰고 기억과 감정을 관장하는 해마와 편도체로 직행합니다. 소비자는 물건의 가격표를 보기도 전에 이미 그 브랜드에 매혹되는 것입니다."
      },
      {
        heading: "3. 미래의 상거래: '물건 판매자'에서 '세계관 설계자'로",
        body: "오프라인 매장의 성패는 이제 평당 매출액이 아닌 평당 체류 시간과 SNS 공유율로 측정됩니다. 제품을 진열해 파는 곳이 아니라, 고객이 브랜드의 세계관 속에 뛰어들어 주인공이 되는 놀이터를 만들어야 합니다. 온라인으로 고객을 모으는 획득 비용(CAC)이 천문학적으로 치솟는 지금, 잘 설계된 하나의 오프라인 공간은 수억 원의 디지털 광고보다 훨씬 강력하고 영구적인 팬덤을 형성하는 최고의 전략적 자산이 되었습니다."
      }
    ]
  },
  {
    id: 'hobby-draft-1',
    category: 'hobby',
    type: 'article',
    title: "심폐 기능과 미토콘드리아를 깨우는 'Zone 2 러닝': 왜 천천히 달려야 더 빨라지는가",
    summary: "숨이 턱 끝까지 차오르게 달리는 것만이 능사가 아닙니다. 심장 근육과 지방 대사 효율을 극대화하는 과학적 유산소 훈련법을 해부합니다.",
    source: "라이프스타일 매거진 B",
    duration: '5분 읽기',
    date: '최신 칼럼',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
    url: 'https://magazine-b.co.kr',
    recommendationReason: "부상 없이 평생 지속할 수 있으면서도 심혈관 건강과 활력을 최상위 1%로 끌어올리는 운동의 황금률을 전달합니다.",
    keyPoints: [
      "최대 심박수의 60~70% 구간: 젖산이 축적되지 않고 지방을 주 연료로 태우는 에너지 시스템.",
      "세포 내 에너지 발전소인 미토콘드리아의 밀도와 부피를 폭발적으로 늘리는 저강도 자극.",
      "옆 사람과 숨차지 않게 대화할 수 있는 페이스로 주 3회 45분간 실천하는 루틴."
    ],
    sections: [
      {
        heading: "1. '고통 없이는 얻는 것도 없다'는 신화의 종말",
        body: "많은 러너들이 피를 토할 듯이 전력 질주해야만 제대로 된 운동이 된다고 믿습니다. 하지만 무리한 고강도 인터벌 러닝은 스트레스 호르몬인 코르티솔을 급증시키고 관절과 건에 과도한 부하를 주어 결국 번아웃이나 부상으로 이어집니다. 세계 최정상급 엘리트 마라토너와 사이클 선수들의 훈련 일지를 분석해보면 놀랍게도 전체 훈련량의 80% 이상이 '말을 편하게 할 수 있을 정도로 천천히 달리는' 저강도 유산소 영역에 집중되어 있습니다."
      },
      {
        heading: "2. 미토콘드리아 청소와 지방 연소의 엔진룸",
        body: "Zone 2(존 2) 훈련의 핵심 목적은 세포 속 발전소인 미토콘드리아의 유연성과 효율을 극대화하는 것입니다. 심박수가 최대치의 60~70%에 머무는 구간에서 우리 몸은 탄수화물 대신 체지방을 산소와 결합하여 주된 에너지원으로 태웁니다. 또한 오래된 미토콘드리아를 스스로 정화하고 새로운 미토콘드리아를 증식시키는 생체 합성(Biogenesis)을 유도합니다. 이것이 바로 피로를 덜 타는 강철 체력과 대사 건강의 근본 토대입니다."
      },
      {
        heading: "3. 스마트워치를 활용한 실전 Zone 2 페이스 설정법",
        body: "Zone 2를 측정하는 가장 정확한 기준은 '대화 테스트(Talk Test)'입니다. 달리는 도중 전화 통화를 끊김 없이 문장 단위로 이어갈 수 있는 속도가 본인의 Zone 2입니다. 스마트워치를 착용한다면 (220 - 나이) 공식에 0.65~0.75를 곱한 심박수를 유지하세요. 페이스가 생각보다 너무 느려 걷는 속도에 가깝더라도 조급해할 필요가 없습니다. 8주 동안 꾸준히 존 2를 누적하면, 같은 낮은 심박수에서도 러닝 페이스가 경이롭게 빨라지는 마법을 경험하게 됩니다."
      }
    ]
  },

  {
    id: 'study-2199',
    category: 'study',
    type: 'article',
    title: "기억은 보관이 아닌 재구성이다: 시냅스 가소성과 '인출'의 신경과학",
    summary: "단순 반복 읽기가 왜 배움의 착각에 불과한지, 뇌과학의 시냅스 가소성과 장기 강화(LTP) 메커니즘을 통해 능동적 인출 훈련이 뇌 구조를 물리적으로 재설계하는 과정을 해부합니다.",
    source: "네이처 뉴로사이언스 · 인지과학 리뷰",
    duration: '5분 읽기',
    date: '최신 칼럼',
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
    url: 'https://my-gorithm.web.app',
    recommendationReason: "노력 대비 성과가 나지 않는 비효율적인 공부 습관의 굴레를 끊어내고, 뇌의 생물학적 메커니즘에 정면으로 부합하는 학습 패러다임 전환을 이끌어냅니다.",
    keyPoints: [
      "반복해 읽는 수동적 입력은 친숙함에 기반한 '인지적 착각'을 유발하며, 기억 형성의 본질인 시냅스 구조 변화를 촉진하지 못한다.",
      "장기 기억의 정착은 정보를 꺼내는 순간 일어나는 '인출 노력'과 NMDA 수용체 기반의 장기 강화(LTP) 반응에 달려 있다.",
      "백지 복습과 셀프 테스트 같은 의도적 불편함은 신경망 연결을 강화해 지식을 완전히 내재화하는 가장 과학적인 지적 단련법이다."
    ],
    sections: [
      {
        heading: "1. 밑줄 긋기의 함정: 친숙함을 지식으로 오해하는 뇌",
        body: "수많은 학습자가 두꺼운 전공서나 강의 노트를 반복해 읽으며 밑줄을 긋는 행위에서 일종의 지적 안도감을 느낍니다. 페이지를 거듭 넘길수록 텍스트가 눈에 익고, 문맥이 매끄럽게 읽히면 뇌는 그 지식을 완전히 '이해하고 흡수했다'고 착각합니다. 인지심리학에서는 이를 '유창성의 착각(Illusion of Fluency)'이라 부릅니다. 감각기관을 통해 정보가 수동적으로 유입될 때 발생하는 친숙함은 망막과 단기 기억 피질의 일시적 활성화에 불과할 뿐, 해마에서 대뇌피질로 이어지는 견고한 신경학적 연결망을 구축하지 못합니다. 즉, 입력(Input) 중심의 전통적인 학습 태도는 에너지 소모를 최소화하려는 뇌의 본능에는 부합할지언정, 정작 시험장이나 실무 현장처럼 기억을 주도적으로 꺼내 써야 하는 결정적 순간에는 아무런 힘도 발휘하지 못하는 취약한 신기루에 가깝습니다."
      },
      {
        heading: "2. 시냅스 가소성과 장기 강화(LTP): 뇌세포의 길을 내는 법",
        body: "우리의 뇌는 정적인 컴퓨터 하드디스크가 아닙니다. 경험과 자극의 형태에 따라 신경세포 사이의 시냅스 연결 강도가 유연하게 재편되는 '시냅스 가소성(Synaptic Plasticity)'이라는 생물학적 특성을 지니고 있습니다. 신경망에서 특정 경로가 강하게 반복 자극될 때 시냅스 신호 전달 효율이 반영구적으로 증대되는 현상을 '장기 강화(Long-Term Potentiation, LTP)'라고 합니다. 이때 핵심 매개체는 NMDA 수용체와 글루타메이트 신경전달물질입니다. 자극이 미약하면 마그네슘 이온에 막혀 있던 NMDA 채널이 열리지 않지만, 강렬하고 집중적인 인지적 부하가 걸릴 때 세포막이 탈분극되며 채널이 개방되고 칼슘 이온이 유입됩니다. 이 일련의 생화학적 연쇄 반응은 새로운 수용체를 합성하고 시냅스 말단의 물리적 접촉 면적을 확장합니다. 결국 기억이란 저장소에 얌전히 놓인 서류가 아니라, 뇌세포들이 서로를 부르며 형성한 정교한 전기화학적 '고속도로'인 셈입니다."
      },
      {
        heading: "3. 인출 연습(Retrieval Practice): 고통스러운 재생산이 신경망을 굳힌다",
        body: "그렇다면 이 신경 고속도로를 가장 신속하고 견고하게 포장하는 방법은 무엇일까요? 인지신경과학 연구진은 입을 모아 '인출 연습(Retrieval Practice)'을 지목합니다. 정보를 머릿속에 집어넣는 데 집중하기보다, 이미 들어간 불완전한 지식을 온 힘을 다해 밖으로 끄집어내는 과정입니다. 뇌는 저장된 정보를 다시 끄집어낼 때(Recall) 기억의 흔적을 단순히 읽기만 하는 것이 아니라, 기억 회로를 일시적으로 불안정하게 만든 뒤 더 강한 연결 강도로 재응고(Reconsolidation)합니다. 기억이 잘 나지 않아 머리를 쥐어짜는 순간, 바로 그 '인지적 고통' 속에서 NMDA 수용체가 반응하고 시냅스 연결 단백질이 폭발적으로 합성됩니다. 실제로 헨리 뢰디거(Henry Roediger) 교수의 실험에 따르면, 4회 반복 학습한 집단보다 1회 학습 후 3회 시험을 치른 집단이 1주일 뒤 치러진 테스트에서 압도적으로 높은 장기 기억 보존율을 기록했습니다."
      },
      {
        heading: "4. 인텔리전스의 구조적 재설계: 의도적 불편함을 환영하라",
        body: "진정한 공부는 수동적 소비자가 아닌 적극적 생산자의 태도를 취할 때 완성됩니다. 책을 덮고 빈 종이 위에 방금 배운 개념의 뼈대를 그려보는 '백지 복습', 배운 내용을 동료나 거울 앞의 자신에게 설명하는 '페인만 기법', 그리고 시간 간격을 두고 오답을 스스로 검증하는 플래시카드 테스트는 시냅스를 단련하는 가장 훌륭한 뇌의 피트니스 루틴입니다. 이러한 훈련 과정은 즉각적인 만족감을 주지 않으며, 때로는 자신의 무지와 마주하게 만들어 불쾌감을 동반하기도 합니다. 그러나 인지적 마찰이 없는 배움은 뇌에 아무런 흔적도 남기지 못합니다. 뇌세포의 회로를 물리적으로 바꾸고 평생 유지되는 통찰로 굳히고 싶다면, 친숙한 읽기의 안락함을 버리고 기꺼이 '인출의 불편함' 속으로 뛰어들어야 합니다. 배움의 성패는 얼마나 많이 집어넣었는가가 아니라, 얼마나 치열하게 끄집어냈는가로 결정됩니다."
      }
    ]
  },
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
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800&auto=format&fit=crop&q=80',
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

  {
    id: 'tech-11',
    category: 'tech',
    type: 'article',
    isNew: true,
    title: "게임 속 세상은 어떤 기술로 움직일까?",
    summary: "최근 비디오 게임 콘솔과 그래픽 하드웨어의 발전, 실시간 3D 렌더링과 디지털 배포망이 게임 속 세상을 구현하는 기술적 원리를 살펴봅니다.",
    recommendationReason: "기술 분야 관심도에 따라 최신 비디오 게임 및 하드웨어 그래픽 기술의 원리를 추천합니다.",
    source: "한국어 위키백과 · 비디오 게임 콘솔",
    duration: '5분 읽기',
    date: '위키백과',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    url: 'https://ko.wikipedia.org/wiki/%EB%B9%84%EB%94%94%EC%98%A4_%EA%B2%8C%EC%9E%84_%EC%BD%98%EC%86%94',
    keyPoints: [
      "5~7년 세대 주기로 발전하며 가정용 컴퓨터 아키텍처와 통합되는 최신 콘솔 시스템.",
      "실시간 3D 렌더링을 가능케 하는 전용 GPU 하드웨어와 초소형 고성능 칩셋 제조 공정.",
      "블루투스, 무선 네트워킹과 디지털 배포를 통한 글로벌 게임 에코시스템 구현."
    ],
    sections: [
      {
        heading: "가정용 컴퓨터와 콘솔의 기술적 통합",
        body: "최근의 콘솔은 가정용 컴퓨터와의 추가적인 통합을 보여 개발자들이 여러 플랫폼에서 게임을 출시하기 쉽게 만들었습니다. 광학 미디어 또는 스트리밍 미디어 서비스에서 영화 및 음악을 재생할 수 있는 기능을 갖춘 미디어 플레이어로도 진화했습니다."
      },
      {
        heading: "실시간 3D 렌더링과 그래픽 프로세서",
        body: "더 낮은 비용과 작은 크기로 컴퓨팅 파워를 극대화하는 반도체 칩 제조 개선, 실시간 렌더링을 위한 3D 그래픽 및 하드웨어 기반 그래픽 프로세서(GPU) 도입이 게임 내 방대한 가상세계를 사실적으로 구현합니다."
      },
      {
        heading: "디지털 통신과 글로벌 배포망",
        body: "인터넷, 무선 네트워킹 및 블루투스와 같은 디지털 통신 기술과 대용량 디지털 배포 방식이 결합하여 게임의 전송과 플레이 경험을 혁신하고 있습니다."
      }
    ]
  },
  {
    id: 'tech-12',
    category: 'tech',
    type: 'article',
    isNew: true,
    title: "추천 결과를 바꾸는 규칙의 정체",
    summary: "수학과 컴퓨터 과학의 엄밀한 명령 체계인 알고리즘이 조건 분기와 의사 결정을 통해 추천 결과를 도출하는 과정을 알아봅니다.",
    recommendationReason: "알고리즘의 조건 분기와 자동화된 추론 절차를 통해 추천 시스템의 핵심 기술을 이해할 수 있습니다.",
    source: "한국어 위키백과 · 알고리즘",
    duration: '5분 읽기',
    date: '위키백과',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    url: 'https://ko.wikipedia.org/wiki/%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98',
    keyPoints: [
      "수학과 컴퓨터 과학에서 특정 계산 문제를 해결하기 위한 수학적으로 엄밀한 유한 명령 수열.",
      "단순 계산을 넘어 조건문을 활용해 실행 경로를 분기하는 자동화된 의사 결정 메커니즘.",
      "입력 데이터로부터 타당한 결론을 도출하는 자동화된 추론 기술의 기초."
    ],
    sections: [
      {
        heading: "알고리즘의 정의와 유한 명령 수열",
        body: "수학과 컴퓨터 과학에서 알고리즘은 특정 종류의 계산 문제를 풀거나 계산을 수행하기 위한, 수학적으로 엄밀한 명령의 유한 수열입니다."
      },
      {
        heading: "조건문과 자동화된 의사 결정",
        body: "더 발전된 알고리즘은 조건문을 사용해 실행 경로를 여러 갈래로 나누고 자동화된 의사 결정을 내립니다. 이를 통해 사용자의 다양한 입력 조건에 맞춤형 결과를 제시할 수 있습니다."
      },
      {
        heading: "자동화된 추론과 추천 파이프라인",
        body: "알고리즘은 주어진 데이터로부터 타당한 추론을 이끌어 냄으로써 추천 시스템, 검색 엔진, 데이터 분류 등 복잡한 현대 소프트웨어의 기반이 됩니다."
      }
    ]
  },
  {
    id: 'tech-13',
    category: 'tech',
    type: 'article',
    isNew: true,
    title: "인공지능은 어떻게 판단하는 걸까?",
    summary: "대규모 데이터 학습과 파운데이션 모델, 생성형 AI가 입력을 처리하여 예측값과 결정을 만들어내는 원리를 탐구합니다.",
    recommendationReason: "현대 인공지능이 사람의 뇌를 모방하지 않으면서도 고차원 추론과 판단을 내리는 메커니즘을 배울 수 있습니다.",
    source: "한국어 위키백과 · 인공지능",
    duration: '6분 읽기',
    date: '위키백과',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80',
    url: 'https://ko.wikipedia.org/wiki/%EC%9D%B8%EA%B3%B5%EC%A7%80%EB%8A%A5',
    keyPoints: [
      "대규모 데이터 사전학습 기반의 파운데이션 모델과 생성형 AI의 확산.",
      "사람의 뇌 구조를 직접 복제하지 않고 입력 데이터를 처리해 예측값, 추천, 결정을 도출하는 추론 구조.",
      "산업, 과학, 창작 전반의 효율성 향상과 편향·신뢰성 등 기술적 고려 사항."
    ],
    sections: [
      {
        heading: "파운데이션 모델과 생성형 AI의 시대",
        body: "2020년대에는 대규모 자료로 미리 학습한 파운데이션 모델과 생성형 인공지능이 확산되면서, 인공지능은 일상적인 정보 서비스뿐 아니라 과학, 의료, 산업과 창작 활동에도 널리 쓰이고 있습니다."
      },
      {
        heading: "입력 처리와 예측·결정 메커니즘",
        body: "인공지능 시스템은 입력을 처리해 예측값, 추천, 결정, 글·그림 같은 결과를 만들며, 반드시 사람의 사고 과정을 그대로 흉내 내는 것은 아닙니다. 방대한 패턴 분석과 통계적 추론을 통해 최적의 해답을 도출합니다."
      },
      {
        heading: "기술 혁신과 신뢰성 과제",
        body: "인공지능은 반복적인 일을 줄이고 과학적 탐구에 새로운 도구를 제공하지만, 잘못된 결과나 편향, 보안 등 안전성을 보장하기 위한 기술적 정렬(Alignment) 작업이 필수적입니다."
      }
    ]
  },
  {
    id: 'tech-14',
    category: 'tech',
    type: 'article',
    isNew: true,
    title: "로봇은 어떻게 주변을 감지하고 움직일까?",
    summary: "프로그래밍과 수치 제어를 통해 위험하고 정밀한 작업을 사람 대신 자동 실행하는 기계 장치와 지능형 로봇의 제어 원리를 소개합니다.",
    recommendationReason: "제조 라인부터 푸드테크까지 자동화된 로봇의 움직임을 구현하는 프로그래밍 제어 원리를 학습합니다.",
    source: "한국어 위키백과 · 로봇",
    duration: '5분 읽기',
    date: '위키백과',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
    url: 'https://ko.wikipedia.org/wiki/%EB%A1%9C%EB%B4%87',
    keyPoints: [
      "프로그램으로 제어되어 사람이 직접 하기 어려운 복잡한 작업을 대신 실행하는 기계적 장치.",
      "수치 정보 입력을 통해 기계가 스스로 정밀 가공과 동작을 완수하는 수치 제어 원리.",
      "환경을 인식해 스스로 판단하는 지능형 로봇 및 푸드테크·산업 자동화의 확장."
    ],
    sections: [
      {
        heading: "프로그램으로 작동하는 자동 기계",
        body: "로봇은 프로그램으로 작동하고, 사람이 직접 수행할 수 없는 어렵고 복잡하며 위험한 일련의 작업들을 사람 대신 실행하는 기계적 장치입니다."
      },
      {
        heading: "수치 제어와 정밀 동작의 구현",
        body: "수치 제어 공작 기계는 가공하는 작업의 순서와 내용을 수치 정보로 만들어 기계에 입력시키면 기계가 자동적으로 가공 작업을 수행합니다. 이러한 수치 제어 기술이 로봇의 정확한 동작 궤적을 완성합니다."
      },
      {
        heading: "산업용 로봇에서 지능형 로봇으로",
        body: "제조공장에서 조립, 용접, 핸들링을 수행하는 산업용 로봇에 이어, 센서와 알고리즘으로 환경을 인식해 스스로 판단하는 지능형 로봇과 급식·조리용 푸드테크 로봇으로 발전하고 있습니다."
      }
    ]
  },
  {
    id: 'tech-15',
    category: 'tech',
    type: 'article',
    isNew: true,
    title: "악성 소프트웨어는 어떻게 관찰하고 확인할까?",
    summary: "바이러스와 랜섬웨어 같은 악성 소프트웨어를 탐지하기 위해 보안 시스템이 사용하는 정적 분석과 동적/휴리스틱 분석의 원리를 살펴봅니다.",
    recommendationReason: "보안 백신 프로그램이 위험한 코드를 사전에 포착하고 무력화하는 최신 소프트웨어 분석 기술을 다룹니다.",
    source: "한국어 위키백과 · 악성 소프트웨어",
    duration: '5분 읽기',
    date: '위키백과',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
    url: 'https://ko.wikipedia.org/wiki/%EC%95%85%EC%84%B1_%EC%86%8C%ED%94%84%ED%8A%B8%EC%9B%A8%EC%96%B4',
    keyPoints: [
      "파일을 직접 실행하지 않고 시그니처와 구조를 검사하는 정적 분석(Static Analysis).",
      "가상 환경(샌드박스)에서 프로그램 동작과 의심 행위를 실시간 감시하는 동적/휴리스틱 분석.",
      "초기 컴퓨터 바이러스 연구부터 현대 암호화 랜섬웨어 대응까지의 보안 기술 진화."
    ],
    sections: [
      {
        heading: "악성 소프트웨어 연구와 암호화 기술",
        body: "프레드 코헨의 초기 컴퓨터 바이러스 실험 이후, 악성 코드는 탐지 회피와 자가 난독화 기법을 진화시켜 왔으며 현대에는 암호화 기술을 결합한 랜섬웨어 형태로 발전했습니다."
      },
      {
        heading: "정적 분석: 시그니처와 코드 구조 검사",
        body: "바이러스 백신 소프트웨어는 악성 소프트웨어를 탐지하기 위해 두 가지 기술을 사용합니다. 첫 번째인 정적 분석은 파일을 실행하지 않고 고유 시그니처와 코드 패턴을 대조하여 위험을 즉시 식별합니다."
      },
      {
        heading: "동적 및 휴리스틱 분석: 행위 기반 감시",
        body: "변종 및 미등록 위협에 대응하기 위해 보안 시스템은 프로그램을 격리된 환경에서 실행하며 시스템 콜, 네트워크 연결, 메모리 변조 행위를 실시간 감시하는 동적/휴리스틱 분석을 병행합니다."
      }
    ]
  },
  {
    id: 'tech-16',
    category: 'tech',
    type: 'article',
    isNew: true,
    title: "컴퓨터가 사람의 말을 다루는 방법",
    summary: "자연어 처리(NLP)가 음성 인식, 문서 분류, 텍스트 이해와 생성을 구현하기 위해 사용하는 수학적 통계와 기계학습 모델의 구조를 소개합니다.",
    recommendationReason: "컴퓨터가 인간의 복잡한 언어 체계를 수학적 벡터로 변환하고 처리하는 NLP 핵심 원리를 이해할 수 있습니다.",
    source: "한국어 위키백과 · 자연어 처리",
    duration: '6분 읽기',
    date: '위키백과',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    url: 'https://ko.wikipedia.org/wiki/%EC%9E%90%EC%97%B0%EC%96%B4_%EC%B2%98%EB%A6%AC',
    keyPoints: [
      "음성 인식, 문서 분류, 자연어 이해(NLU), 자연어 생성(NLG)을 아우르는 핵심 처리 파이프라인.",
      "언어학과 인지과학적 현상을 수학적·통계적 벡터 공간으로 수량화하는 모델링.",
      "대규모 언어 모델(LLM)과 기계학습 도구를 활용한 실시간 대화 및 문맥 해석 기술."
    ],
    sections: [
      {
        heading: "자연어 처리 시스템의 주요 파이프라인",
        body: "NLP 시스템의 주요 처리 작업에는 음성 인식, 문서 분류, 자연어 이해(NLU), 자연어 생성(NLG)이 포함됩니다. 컴퓨터가 소리를 문자로 변환하고 그 의미를 파악해 응답을 생성하는 일련의 과정입니다."
      },
      {
        heading: "언어학과 수학·통계학의 결합",
        body: "자연어 처리는 연구 대상이 언어이기 때문에 언어 자체를 연구하는 언어학 및 언어 현상의 내적 기제를 탐구하는 인지 과학과 연관이 깊습니다. 이를 구현하기 위해 수학적·통계적 도구를 광범위하게 활용합니다."
      },
      {
        heading: "기계학습과 트랜스포머의 혁신",
        body: "특히 기계학습 및 딥러닝 도구를 적극 채택하면서 문맥과 뉘앙스를 스스로 학습하는 모델로 진화하였으며, 현대 챗봇과 번역 시스템의 두뇌 역할을 담당하고 있습니다."
      }
    ]
  },
  {
    id: 'tech-17',
    category: 'tech',
    type: 'article',
    isNew: true,
    title: "로봇 수술은 우리 생활에서 어디에 쓰일까?",
    summary: "의사의 정밀한 제어 명령을 마이크로 로봇 관절로 전달하여 수술의 정확도를 높이고 환자 회복을 돕는 현대 의료 로봇 공학의 성과를 다룹니다.",
    recommendationReason: "정밀 제어 기술과 비전 시스템이 의료 현장과 결합하여 인간의 한계를 극복하는 실전 테크 사례입니다.",
    source: "한국어 위키백과 · 로봇 수술",
    duration: '4분 읽기',
    date: '위키백과',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80',
    url: 'https://ko.wikipedia.org/wiki/%EB%A1%9C%EB%B4%87_%EC%88%98%EC%88%A0',
    keyPoints: [
      "의사의 손동작을 미세 로봇 팔로 실시간 동기화하여 제어하는 컴퓨터 보조 수술 시스템.",
      "인간 손의 미세 떨림을 필터링하고 고배율 3D 고화질 시야를 제공하는 엔지니어링.",
      "외과를 넘어 비뇨의학과, 흉부외과 등 광범위한 임상 영역으로의 응용 확장."
    ],
    sections: [
      {
        heading: "로봇 수술의 개념과 의사의 정밀 제어",
        body: "로봇 수술은 수술 도구를 움직일 수 있는 로봇을 의사가 제어하며 진행하는 수술 방식입니다. 로봇이 단독으로 판단하는 것이 아니라 전문의의 숙련된 조작을 초정밀 기계 장치로 전달합니다."
      },
      {
        heading: "최소 침습과 3차원 확대 비전 시스템",
        body: "극소 절개를 통해 마이크로 관절 도구를 환자 몸속으로 삽입하고, 고해상도 3D 입체 카메라를 통해 미세 혈관과 신경을 선명하게 관찰함으로써 수술 후 출혈과 회복 기간을 획기적으로 줄입니다."
      },
      {
        heading: "다양한 의학 분야로의 기술 확장",
        body: "초기 외과 영역을 넘어 현재는 심장 흉부외과, 산부인과, 비뇨의학과 등 고도의 정밀함이 요구되는 복잡한 임상 수술 분야로 응용 범위가 지속적으로 확장되고 있습니다."
      }
    ]
  },
  {
    id: 'tech-18',
    category: 'tech',
    type: 'article',
    isNew: true,
    title: "구글 제미나이는 생각과 기억에 어떻게 연결될까?",
    summary: "멀티모달 대형 언어 모델 구글 제미나이가 텍스트, 코드, 이미지를 처리하고 사용자의 과거 대화 맥락을 기억·참조하는 기술 메커니즘을 알아봅니다.",
    recommendationReason: "대화 세션을 넘어 장기 기억과 맥락을 유지하는 최신 대형 언어 모델의 개인화 기술을 조망합니다.",
    source: "한국어 위키백과 · 구글 제미나이",
    duration: '5분 읽기',
    date: '위키백과',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80',
    url: 'https://ko.wikipedia.org/wiki/%EA%B5%AC%EA%B8%80_%EC%A0%9C%EB%AF%B8%EB%82%98%EC%9D%B4',
    keyPoints: [
      "텍스트, 코드, 이미지, 오디오, 비디오를 네이티브로 동시 처리하는 멀티모달 아키텍처.",
      "과거 대화 내역을 보존하고 필요 시 참조하여 개인화된 맥락을 구축하는 장기 기억 기능.",
      "단순 질의응답을 넘어 사용자의 취향과 작업 흐름을 유지하는 AI 에이전트 인터페이스."
    ],
    sections: [
      {
        heading: "네이티브 멀티모달 LLM 아키텍처",
        body: "제미나이 아키텍처는 여러 데이터 유형에 대해 기본적으로 학습되어 모델이 텍스트, 컴퓨터 코드, 이미지, 오디오 및 비디오를 별도의 변환 없이 동시에 처리하고 생성할 수 있는 강점을 지닙니다."
      },
      {
        heading: "과거 대화의 기억과 맥락 참조",
        body: "구글은 과거의 대화를 기억하고 참조할 수 있는 메모리 기능을 도입했습니다. 이를 통해 AI는 이전 세션에서 공유한 사용자의 선호도, 프로젝트 배경, 규칙을 기억하여 매번 설명할 필요 없는 연속적인 대화를 지원합니다."
      },
      {
        heading: "개인화 가상 비서로의 진화",
        body: "장기 기억과 실시간 추론이 결합된 AI 비서는 문서 작성과 코드 분석뿐 아니라 일상의 맞춤형 계획 수립까지 포괄하는 고지능 파트너로 진화하고 있습니다."
      }
    ]
  },
  {
    id: 'tech-19',
    category: 'tech',
    type: 'article',
    isNew: true,
    title: "2차원 컴퓨터 그래픽스에는 어떤 종류가 있을까?",
    summary: "벡터 그래픽스와 래스터 이미지, 기하 함수 모델이 디지털 문서와 디스플레이 화면에서 어떻게 결합하고 제어되는지 기술적 분류를 살펴봅니다.",
    recommendationReason: "픽셀 기반 래스터와 수학적 수식 기반 벡터 그래픽의 차이를 명확히 이해하고 응용할 수 있습니다.",
    source: "한국어 위키백과 · 2차원 컴퓨터 그래픽스",
    duration: '5분 읽기',
    date: '위키백과',
    imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80',
    url: 'https://ko.wikipedia.org/wiki/2%EC%B0%A8%EC%9B%90_%EC%BB%B4%ED%93%A8%ED%84%B0_%EA%B7%B8%EB%9E%98%ED%94%BD%EC%8A%A4',
    keyPoints: [
      "기하 모델(벡터 그래픽스)과 디지털 이미지(래스터 그래픽스)의 상호 보완적 결합.",
      "탁상출판, 설계, 웹 UI에서 3D 모델 대비 훨씬 가벼운 용량과 정밀한 제어력 제공.",
      "조판 텍스트, 수학적 함수, 래스터라이징 파이프라인의 조화로운 처리."
    ],
    sections: [
      {
        heading: "2차원 그래픽 모델의 핵심 구성 요소",
        body: "2차원 그래픽 모델은 기하 모델(벡터 그래픽스), 디지털 이미지(래스터 그래픽스), 조판될 텍스트(폰트, 크기, 색상, 좌표), 수학적 함수 및 방정식을 결합하여 구성됩니다."
      },
      {
        heading: "직접적인 이미지 제어와 높은 효율성",
        body: "2차원 모델은 3차원 컴퓨터 그래픽스보다 이미지에 대한 직접적인 제어를 제공합니다. 탁상출판이나 인터페이스 설계 영역에서 2D 그래픽스 기술 기반 문서는 비트맵 이미지 대비 용량을 수천 배 이상 절감할 수 있습니다."
      },
      {
        heading: "현대 디지털 인터페이스에서의 응용",
        body: "웹 표준 SVG와 캔버스 렌더링, 폰트 렌더링 엔진 등 현대 화면 디자인의 근간에는 정교한 2차원 벡터 연산과 래스터라이제이션 기술이 자리 잡고 있습니다."
      }
    ]
  },
  {
    id: 'tech-20',
    category: 'tech',
    type: 'article',
    isNew: true,
    title: "영화 속 불가능한 장면은 어떻게 만들어질까?",
    summary: "현실에서 촬영하기 힘든 시각 효과를 창조하는 컴퓨터 그래픽스(CG)의 3D 모델링, 렌더링, 셰이더, GPU 하드웨어 파이프라인을 분석합니다.",
    recommendationReason: "영화와 게임의 환상적인 비주얼을 실제로 구축하는 렌더링 및 컴퓨터 애니메이션 공학을 배울 수 있습니다.",
    source: "한국어 위키백과 · 컴퓨터 그래픽스",
    duration: '6분 읽기',
    date: '위키백과',
    imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
    url: 'https://ko.wikipedia.org/wiki/%EC%BB%B4%ED%93%A8%ED%84%B0_%EA%B7%B8%EB%9E%98%ED%94%BD%EC%8A%A4',
    keyPoints: [
      "컴퓨터를 이용해 영상과 예술을 창조하는 현대 디지털 영화 및 게임의 핵심 기술.",
      "기하 처리, 3차원 모델링, 광선 추적(Ray Tracing), 실시간 셰이더 렌더링 기술의 총체.",
      "전용 그래픽 프로세서(GPU) 설계와 계산과학이 이끄는 사실적 시각 효과 구현."
    ],
    sections: [
      {
        heading: "영상과 예술을 생성하는 컴퓨터 그래픽스",
        body: "컴퓨터 그래픽스는 컴퓨터를 이용하여 영상과 예술을 생성하는 작업을 다룹니다. 디지털 사진술, 영화, 비디오 게임, 디스플레이 하드웨어의 필수적인 핵심 기술입니다."
      },
      {
        heading: "렌더링과 광선 추적의 과학",
        body: "스프라이트, 래스터, 3차원 모델링, 셰이더, 광선 추적(Ray Tracing) 등 복잡한 빛의 반사와 굴절을 물리 방정식으로 시뮬레이션하여 실사보다 더 사실적인 가상 영상을 만들어냅니다."
      },
      {
        heading: "GPU 아키텍처와 시각화의 미래",
        body: "고성능 GPU 하드웨어와 계산 기하학, 이미지 처리 알고리즘의 발전에 힘입어 과거 수일이 걸리던 대규모 특수 효과 렌더링이 점차 실시간 인터랙티브 환경으로 진화하고 있습니다."
      }
    ]
  },
  {
    id: 'tech-21',
    category: 'tech',
    type: 'article',
    isNew: true,
    title: "중화인민공화국의 인공지능 산업은 어떻게 등장하고 발전했을까?",
    summary: "경제 개혁 이후 과학기술 진흥 정책에서 출발해 국가적 의제와 인재 육성을 거쳐 글로벌 AI 강국으로 도약한 중국의 기술 산업 생태계를 살펴봅니다.",
    recommendationReason: "국가 차원의 전략적 로드맵과 R&D 투자가 기술 산업의 폭발적 성장을 견인한 과정을 분석합니다.",
    source: "한국어 위키백과 · 중화인민공화국의 인공지능 산업",
    duration: '5분 읽기',
    date: '위키백과',
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5703bc225?w=800&auto=format&fit=crop&q=80',
    url: 'https://ko.wikipedia.org/wiki/%EC%A4%91%ED%99%94%EC%9D%B8%EB%AF%BC%EA%B3%B5%ED%99%94%EA%B5%AD%EC%9D%98_%EC%9D%B8%EA%B3%B5%EC%A7%80%EB%8A%A5_%EC%82%B0%EC%97%85',
    keyPoints: [
      "1970년대 후반 과학기술을 주요 생산력으로 강조하며 시작된 기술 발전 토대.",
      "해외 유학파 과학자들의 초기 연구와 2006년 이후의 국가적 인공지능 개발 의제 수립.",
      "막대한 데이터 인프라와 산학 협력을 통해 선도적인 글로벌 AI 강국으로 부상한 과정."
    ],
    sections: [
      {
        heading: "과학기술 생산력 강조와 발전의 토대",
        body: "중국 AI 개발의 뿌리는 1970년대 후반 경제 개혁 이후 국가의 주요 생산력으로서 과학기술을 강조하면서 시작되었습니다. 초기에는 기술적 격차가 있었으나 인재 양성을 통해 격차를 좁혀갔습니다."
      },
      {
        heading: "국가적 의제 설정과 집중 육성",
        body: "2006년부터 정부 차원의 중장기 인공지능 개발을 위한 국가적 로드맵을 꾸준히 발전시켜 왔으며, 정책적 지원과 방대한 내수 시장을 무대로 연구 개발을 가속화했습니다."
      },
      {
        heading: "글로벌 AI 선도국으로의 도약",
        body: "딥러닝 알고리즘, 컴퓨터 비전, 자연어 처리 및 자율주행 영역에서 대규모 투자가 이어지며 오늘날 세계에서 가장 역동적인 AI 생태계 중 하나로 평가받고 있습니다."
      }
    ]
  },
  {
    id: 'tech-22',
    category: 'tech',
    type: 'article',
    isNew: true,
    title: "빛이 닿지 않는 바닷속을 담는 수중사진의 기술",
    summary: "빛의 산란과 높은 수압을 극복하는 특수 하우징, 인공 광원 동기화, 해양 탐사 데이터 기록을 위한 수중 이미징 엔지니어링을 살펴봅니다.",
    recommendationReason: "극한의 수중 환경에서 빛과 데이터를 포착하는 특수 광학 기술과 촬영 장비의 원리를 배웁니다.",
    source: "한국어 위키백과 · 수중사진",
    duration: '5분 읽기',
    date: '위키백과',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80',
    url: 'https://ko.wikipedia.org/wiki/%EC%88%98%EC%A4%91%EC%82%AC%EC%A7%84',
    keyPoints: [
      "수중에서 빛의 굴절과 색 손실(적색광 감쇠)을 보정하는 돔 포트와 고광량 스트로브 기술.",
      "수심 수십 미터의 고압 환경에서 카메라를 안전하게 보호하는 정밀 방수 하우징 엔지니어링.",
      "해양 생태계 조사, 난파선 탐사, 수중 지형 측량 등 과학적 데이터 기록 수단으로의 확장."
    ],
    sections: [
      {
        heading: "수중 광학과 인공 광원의 동기화",
        body: "물속에서는 빛이 공기 중에서보다 800배 빠르게 흡수되며, 특히 붉은색 파장이 먼저 사라집니다. 성공적인 수중 이미징은 돔 포트로 화각 왜곡을 잡고, 고출력 수중 플래시(스트로브)를 셔터와 정밀 동기화하여 피사체 본연의 생생한 색상을 복원합니다."
      },
      {
        heading: "극한 압력을 견디는 정밀 방수 하우징",
        body: "깊은 바다는 수압이 매우 높아 일반 전자 기기가 즉시 파손됩니다. 고강도 알루미늄 합금 하우징과 이중 O-링 밀폐 기술, 수중 부력 밸런싱 시스템을 통해 다이버가 수심 수십 미터 아래에서도 카메라의 모든 다이얼과 센서를 정밀 조작할 수 있습니다."
      },
      {
        heading: "예술을 넘어 해양 데이터 기록으로",
        body: "수중 사진은 감성적인 예술 창작일 뿐 아니라 해양 생물 다양성 모니터링, 산호초 백화 현상 추적, 수중 문화재 3D 측량 등 해양 과학 데이터를 수집하고 기록하는 필수적인 도구로 널리 쓰이고 있습니다."
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
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
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

  {
    id: 'study-11',
    category: 'study',
    type: 'article',
    isNew: true,
    title: "갈릴레오 갈릴레이는 데이터를 어떻게 활용할까?",
    summary: "자체 개량한 망원경으로 목성의 4대 위성과 달의 표면을 관측하고, 이 경험적 수량 자료로 코페르니쿠스의 지동설을 과학적으로 입증한 관측천문학의 정수를 다룹니다.",
    recommendationReason: "편견에 맞서 실제 관측 데이터와 수학적 수량 분석으로 진리를 증명한 과학적 탐구 정신을 배웁니다.",
    source: "한국어 위키백과 · 갈릴레오 갈릴레이",
    duration: '6분 읽기',
    date: '위키백과',
    imageUrl: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=800&auto=format&fit=crop&q=80',
    url: 'https://ko.wikipedia.org/wiki/%EA%B0%88%EB%A6%B4%EB%A0%88%EC%98%A4_%EA%B0%88%EB%A6%B4%EB%A0%88%EC%9D%B4',
    keyPoints: [
      "경험적 사실의 수량적 분석과 보편적 수학 법칙을 결합한 근대 과학 연구 방법의 확립.",
      "1609년 직접 망원경을 개량하여 목성의 4대 위성, 달의 반점, 태양 흑점을 정밀 관측.",
      "확보된 관측 데이터를 논리적 근거로 삼아 당시 통념이었던 천동설을 반박하고 지동설을 입증."
    ],
    sections: [
      {
        heading: "수량적 분석과 근대 과학 방법론의 확립",
        body: "갈릴레오의 최대 공적은 과학적 연구 방법으로서 보편적 수학적 법칙과 경험적 사실의 수량적 분석을 확립한 점에 있습니다. 추상적 사변이 아닌 데이터 기반 탐구의 시대를 열었습니다."
      },
      {
        heading: "망원경 개량과 천체 관측 데이터의 확보",
        body: "1609년 망원경을 개량해 천체 관측에 응용함으로써 목성의 위성들, 달의 표면 분화구, 태양의 흑점 등을 발견하고 이를 정밀하게 기록했습니다."
      },
      {
        heading: "데이터를 통한 지동설의 과학적 입증",
        body: "목성 주위를 도는 위성들의 관측 자료를 결정적 증거로 삼아 지구 중심설(천동설)에 맞서 코페르니쿠스의 태양 중심설(지동설)이 정당함을 입증하는 저술을 펴냈습니다."
      }
    ]
  },
  {
    id: 'study-12',
    category: 'study',
    type: 'article',
    isNew: true,
    title: "왜 어떤 기억은 오래 남고 어떤 기억은 사라질까?",
    summary: "감각 정보가 단기 기억과 작업 기억을 거쳐 장기 기억으로 고착되거나 잊혀지는 인간의 인지적 기억 메커니즘을 탐구합니다.",
    recommendationReason: "인간의 뇌가 정보를 선별하고 장기 기억으로 정착시키는 인지 심리학의 원리를 배웁니다.",
    source: "한국어 위키백과 · 기억",
    duration: '5분 읽기',
    date: '위키백과',
    imageUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&auto=format&fit=crop&q=80',
    url: 'https://ko.wikipedia.org/wiki/%EA%B8%B0%EC%96%B5',
    keyPoints: [
      "모든 감각 기관의 경험과 개념, 규칙을 현재 상황에 맞춰 인출하는 필수 인지 과정.",
      "즉각적인 행동 완료 후 불필요한 정보는 소멸시키는 단기/작업 기억의 필터링 기능.",
      "반복 부호화와 의미 부여를 통해 뇌 신경망에 영구 보존되는 장기 기억의 원리."
    ],
    sections: [
      {
        heading: "인지 과정으로서의 기억과 자아 정체성",
        body: "기억은 모든 감각 경험과 논리적 해석, 개념, 가치를 보존하고 인출하는 필수 인지 과정입니다. 과거 경험을 바탕으로 현재를 분석하고 미래를 예측하며 자아 정체성을 유지하게 돕습니다."
      },
      {
        heading: "단기 기억의 망각과 효율적 정보 선별",
        body: "단기 기억이나 작업 기억은 지금의 행동이 완료된 뒤 크게 의미가 없으면 짧은 시간 뒤에 자연스럽게 잊혀집니다. 이는 뇌가 과도한 정보 부하로 과열되는 것을 막는 중요한 적응 메커니즘입니다."
      },
      {
        heading: "장기 기억으로의 고착화와 학습의 원리",
        body: "생존에 중요하거나 깊은 정서적 교감이 동반된 정보, 혹은 반복적인 인출 훈련을 거친 정보는 여러 뇌 신경 작용을 통해 장기 기억으로 견고하게 저장됩니다."
      }
    ]
  },
  {
    id: 'study-13',
    category: 'study',
    type: 'article',
    isNew: true,
    title: "별과 행성의 비밀은 어떻게 밝혀질까?",
    summary: "빛과 전파를 통해 물리 자료를 수집하는 관측 천문학과, 컴퓨터 수치 시뮬레이션으로 우주 모형을 세우는 이론 천문학의 탐구 방식을 분석합니다.",
    recommendationReason: "관측 데이터와 컴퓨터 모형 분석이 어떻게 거대한 우주의 비밀을 풀어내는지 과학적 사고를 넓혀줍니다.",
    source: "한국어 위키백과 · 천문학",
    duration: '5분 읽기',
    date: '위키백과',
    imageUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&auto=format&fit=crop&q=80',
    url: 'https://ko.wikipedia.org/wiki/%EC%B2%9C%EB%AC%B8%ED%95%99',
    keyPoints: [
      "관측 데이터를 수집하는 관측 천문학과 컴퓨터 시뮬레이션 모형을 세우는 이론 천문학의 상호작용.",
      "일반상대성론과 중력 방정식을 이용한 천체 움직임의 정밀 물리 해석.",
      "초거대 망원경과 우주 망원경이 포착한 빛의 스펙트럼 분석을 통한 우주 진화 추적."
    ],
    sections: [
      {
        heading: "관측 천문학과 이론 천문학의 양대 축",
        body: "현대 천문학은 관측 분야와 이론 분야로 체계화되어 있습니다. 관측 천문학은 천체에 대한 자료를 얻고 물리적으로 분석하는 데 초점을 두며, 이론 천문학은 현상들을 컴퓨터나 해석적 방법으로 설명하는 모형을 세웁니다."
      },
      {
        heading: "중력 방정식과 컴퓨터 모형 시뮬레이션",
        body: "천체의 움직임에서 가장 비중이 큰 힘은 중력이므로 아인슈타인의 일반상대론을 적극적으로 이용합니다. 슈퍼컴퓨터를 이용한 수치 모형을 통해 별의 탄생과 은하 충돌 과정을 가상으로 재현합니다."
      },
      {
        heading: "다파장 관측을 통한 우주의 기원 탐구",
        body: "가시광선뿐 아니라 전파, 적외선, X선 등 우주에서 날아오는 다양한 파장의 신호를 분석함으로써 암흑 물질과 행성계의 기원을 밝혀내고 있습니다."
      }
    ]
  },
  {
    id: 'study-14',
    category: 'study',
    type: 'article',
    isNew: true,
    title: "불쾌한 골짜기는 어떻게 등장하고 발전했을까?",
    summary: "로봇이나 가상 캐릭터가 사람과 너무 흡사해질 때 발생하는 기괴함과 반발감을 규명한 모리 마사히로의 로봇공학 이론과 심리학적 계보를 살펴봅니다.",
    recommendationReason: "심리학과 공학이 교차하는 지점에서 인간의 인식과 인공물의 상호작용을 깊이 있게 탐구합니다.",
    source: "한국어 위키백과 · 불쾌한 골짜기",
    duration: '5분 읽기',
    date: '위키백과',
    imageUrl: 'https://images.unsplash.com/photo-1534972195531-a756b1126975?w=800&auto=format&fit=crop&q=80',
    url: 'https://ko.wikipedia.org/wiki/%EB%B6%88%EC%BE%8C%ED%95%9C_%EA%B3%A8%EC%A7%9C%EA%B8%B0',
    keyPoints: [
      "로봇의 인간 유사도가 극도로 높아질 때 호감도가 급락하며 거부감으로 변하는 심리 현상.",
      "1906년 옌치의 심리학 논문과 프로이트의 무의식 연구에서 출발한 이론적 뿌리.",
      "1970년 모리 마사히로의 정립 이후 휴머노이드 로봇과 3D 애니메이션 캐릭터 제작의 핵심 기준 확립."
    ],
    sections: [
      {
        heading: "모리 마사히로의 이론과 호감도의 급락",
        body: "로봇공학자 모리 마사히로의 이론에 따르면, 로봇이 점점 더 사람의 모습과 흡사해질수록 인간이 느끼는 호감도가 증가하다가, 특정 임계점에 도달하면 갑자기 강한 거부감과 오싹함으로 바뀌게 됩니다."
      },
      {
        heading: "섬뜩함의 심리학적 기원",
        body: "이 개념은 1906년 에른스트 옌치의 논문 〈섬뜩함의 심리학에 관하여〉와 지그문트 프로이트의 연구에 뿌리를 두고 있습니다. 친숙한 대상이 미묘하게 비틀릴 때 인간 뇌가 느끼는 위험 신호와 밀접합니다."
      },
      {
        heading: "현대 CG 애니메이션과 로봇 설계의 과제",
        body: "불쾌한 골짜기는 폴라 익스프레스와 같은 3D 그래픽이나 사실적 휴머노이드 안드로이드 제작 시 시각적 어색함을 극복하기 위해 반드시 고려해야 하는 중요한 공학적·인지적 기준이 되었습니다."
      }
    ]
  },
  {
    id: 'study-15',
    category: 'study',
    type: 'article',
    isNew: true,
    title: "퍼즐을 풀 때 머릿속에서 일어나는 일",
    summary: "단서를 조합하고 패턴을 인식하며 논리적 연역과 귀납을 반복하는 퍼즐 풀이 과정에서 일어나는 인지 전략과 문제 해결 사고력을 분석합니다.",
    recommendationReason: "지적 유희인 퍼즐을 풀 때 활성화되는 패턴 인식과 논리 추론의 인지적 메커니즘을 배웁니다.",
    source: "한국어 위키백과 · 퍼즐",
    duration: '5분 읽기',
    date: '위키백과',
    imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&auto=format&fit=crop&q=80',
    url: 'https://ko.wikipedia.org/wiki/%ED%8D%BC%EC%A6%90',
    keyPoints: [
      "사람의 창의성과 논리적 사고력을 시험하고 조각을 체계적으로 조합하는 지적 활동.",
      "반복적인 패턴 인식과 일정한 순서 규칙(알고리즘) 준수를 요구하는 문제 해결 전략.",
      "단순한 여가 오락을 넘어 심각한 수학적·논리적 가설 검증과 인지 능력 단련에 기여."
    ],
    sections: [
      {
        heading: "지적 탐구와 창의성을 시험하는 퍼즐",
        body: "퍼즐은 사람의 창의성이나 지식을 시험하는 게임, 문제, 또는 장난감입니다. 퍼즐 해결자는 숨겨진 해답을 찾기 위해 조각들을 논리적인 방식으로 조합하거나 분해하는 고차원 사고를 발휘합니다."
      },
      {
        heading: "패턴 인식과 순서 준수의 인지 전략",
        body: "퍼즐의 해답은 종종 패턴 인식과 특정 종류의 순서 준수를 필요로 합니다. 뇌는 과거에 학습한 규칙들을 조합해 새로운 가설을 세우고 오류를 수정하는 피드백 루프를 반복합니다."
      },
      {
        heading: "수학과 논리학으로 이어지는 문제 해결력",
        body: "퍼즐은 일상의 가벼운 오락으로 즐겨지지만, 동시에 심각한 수학적 난제나 컴퓨터 과학의 알고리즘 최적화 연구에서 비롯되기도 하며 인간의 분석적 사고력을 단련하는 훌륭한 교재가 됩니다."
      }
    ]
  },
  {
    id: 'study-16',
    category: 'study',
    type: 'article',
    isNew: true,
    title: "날것의 재료가 음식이 되는 마법: 조리의 과학",
    summary: "단백질 변성, 전분의 호화, 마이야르 반응 등 가열과 조리를 통해 식재료의 영양 흡수율이 높아지고 풍미가 폭발하는 분자 과학의 원리를 알아봅니다.",
    recommendationReason: "인류의 문명을 바꾼 불의 발견과 음식 조리 과정에 숨겨진 물리·화학적 메커니즘을 배웁니다.",
    source: "한국어 위키백과 · 요리",
    duration: '5분 읽기',
    date: '위키백과',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    url: 'https://ko.wikipedia.org/wiki/%EC%9A%94%EB%A6%AC',
    keyPoints: [
      "열과 산, 효소를 통해 단백질과 탄수화물의 화학 구조를 변형시키는 식품 과학의 기초.",
      "소화 흡수율을 극대화하고 식물 속 독성을 중화하여 뇌 진화를 이끈 조리의 인류학적 의의.",
      "아미노산과 당이 열을 만나 수백 가지 복합 향기를 뿜어내는 마이야르(Maillard) 반응의 원리."
    ],
    sections: [
      {
        heading: "단백질 변성과 전분의 호화 메커니즘",
        body: "단단하고 질긴 날고기에 열을 가하면 꼬여 있던 단백질 분자가 풀리며 부드러워지고, 곡물의 빽빽한 전분 구조는 수분을 머금고 팽창하여 젤 상태(호화)가 됩니다. 이 과정을 통해 우리 몸은 적은 소화 에너지로도 영양분을 극대화하여 흡수할 수 있습니다."
      },
      {
        heading: "독성 중화와 인류 진화의 기폭제",
        body: "야생 식물과 버섯, 뿌리채소에 존재하는 천연 독소와 유해 세균은 가열 조리를 통해 파괴되거나 중화됩니다. 조리된 음식의 높은 에너지 효율은 인류가 소화기관을 줄이고 거대한 뇌를 발달시키는 결정적인 생물학적 계기가 되었습니다."
      },
      {
        heading: "풍미의 정점, 마이야르 반응과 캐러멜화",
        body: "단백질 속 아미노산과 환원당이 140도 이상의 고열에서 반응하는 마이야르 반응은 구운 고기나 빵 표면의 노릇한 갈색과 함께 수백 가지 고소한 아로마 화합물을 만들어냅니다. 요리는 재료를 분자 단위에서 재구성하는 가장 일상적인 응용 화학입니다."
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
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
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

  {
    id: 'culture-11',
    category: 'culture',
    type: 'article',
    isNew: true,
    title: "포켓몬스터는 어떻게 등장하고 발전했을까?",
    summary: "1996년 휴대용 게임기에서 시작해 수집·훈련·배틀의 매력으로 전 세계 183개국 애니메이션과 완구, 대중문화를 뒤흔든 프랜차이즈의 여정을 다룹니다.",
    recommendationReason: "하나의 게임 타이틀이 전 세계 세대를 아우르는 문화적 신드롬과 미디어 믹스로 확장된 역사를 배웁니다.",
    source: "한국어 위키백과 · 포켓몬스터",
    duration: '6분 읽기',
    date: '위키백과',
    imageUrl: 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=800&auto=format&fit=crop&q=80',
    url: 'https://ko.wikipedia.org/wiki/%ED%8F%AC%EC%BC%93%EB%AA%AC%EC%8A%A4%ED%84%B0',
    keyPoints: [
      "1996년 게임보이용 《포켓몬스터 레드·그린》으로 출발한 역사상 최고 수익의 미디어 프랜차이즈.",
      "수집, 훈련, 배틀이라는 핵심 철학을 바탕으로 모든 매체를 아우르는 일관된 세계관 구축.",
      "애니메이션, 트레이딩 카드 게임(TCG), 영화, 캐릭터 굿즈로 확장된 글로벌 대중문화의 상징."
    ],
    sections: [
      {
        heading: "게임보이의 작은 화면에서 시작된 신화",
        body: "《포켓몬스터》는 1996년 2월 게임 프리크가 개발해 닌텐도 휴대용 게임기 게임보이로 출시된 《포켓몬스터 레드·그린》으로 시작했습니다. 통신 케이블을 통한 교환이라는 독창적 아이디어가 돌풍을 일으켰습니다."
      },
      {
        heading: "수집, 훈련, 배틀을 관통하는 세계관",
        body: "이 세 가지 요소는 비디오 게임, 1,000편 이상의 글로벌 애니메이션, 카드 게임, 만화 등 포켓몬스터의 모든 파생 매체에 변함없이 등장하며 팬들에게 공통의 모험 감동을 선사합니다."
      },
      {
        heading: "글로벌 미디어 믹스 프랜차이즈의 정점",
        body: "누적 게임 판매량 3억 8천만 장 이상을 기록하며 전 세계 183개국에 방영된 역사상 가장 성공적인 미디어 믹스이자 팝 컬처 아이콘으로 자리매김했습니다."
      }
    ]
  },
  {
    id: 'culture-12',
    category: 'culture',
    type: 'article',
    isNew: true,
    title: "텔레비전 드라마에서는 정보가 어떻게 전달될까?",
    summary: "시청각성과 대량전달성을 무기로 안방극장을 탄생시킨 텔레비전 드라마가 대본을 영상, 소리, 연출로 구체화하여 감정과 정보를 전달하는 예술적 기법을 살펴봅니다.",
    recommendationReason: "대본 속 활자가 감독의 미장센과 음향 연출을 거쳐 대중의 공감을 이끌어내는 영상 화법을 탐구합니다.",
    source: "한국어 위키백과 · 텔레비전 드라마",
    duration: '5분 읽기',
    date: '위키백과',
    imageUrl: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&auto=format&fit=crop&q=80',
    url: 'https://ko.wikipedia.org/wiki/%ED%85%94%EB%A0%88%EB%B9%84%EC%A0%84_%EB%93%9C%EB%9D%BC%EB%A7%88',
    keyPoints: [
      "시청각성, 동시성, 대량전달성, 박진성을 특성으로 발전한 현대 종합 대중 예술 장르.",
      "텍스트로 이루어진 대본을 영상미와 배경 음악, 배우의 연기로 구상화(具象化)하는 연출 메커니즘.",
      "가정 내 안방극장을 통해 시청자 공동체의 감정적 공감대와 사회적 담론을 형성하는 파급력."
    ],
    sections: [
      {
        heading: "안방극장의 탄생과 텔레비전의 매체적 특성",
        body: "텔레비전 드라마는 방송 시작과 함께 태어난 새로운 장르의 예술로, 시청각성·동시성·대량전달성·박진성 등의 강력한 힘을 발판으로 안방극장이란 친근한 문화를 만들어냈습니다."
      },
      {
        heading: "연출을 통한 대본의 구상화",
        body: "연출자는 말로만 구성된 대본을 영상과 소리에 의해 구상화(具象化)합니다. 카메라 앵글, 조명, 인물의 동선, 효과음이 한데 어우러져 단순 정보 이상의 감정적 울림을 전달합니다."
      },
      {
        heading: "동시대적 공감과 문화적 영향력",
        body: "드라마는 일상적인 시간대에 거실로 직접 전달되는 특성 덕분에 시대의 가치관과 가족관, 사회적 갈등을 투영하고 대중적 담론을 형성하는 강력한 문화적 창구 역할을 합니다."
      }
    ]
  },
  {
    id: 'culture-13',
    category: 'culture',
    type: 'article',
    isNew: true,
    title: "청소년을 다른 개념과 구별하는 특징",
    summary: "급속한 2차 성장기를 거쳐 성인으로 이행하는 청소년기가 사회문화적 규정과 법적 기준, 그리고 발달 단계별 교육 환경 속에서 어떻게 정의되는지 조명합니다.",
    recommendationReason: "단순 생물학적 나이를 넘어 사회문화적 맥락과 교육 제도가 청소년을 어떻게 규정하는지 균형 있게 이해할 수 있습니다.",
    source: "한국어 위키백과 · 청소년",
    duration: '5분 읽기',
    date: '위키백과',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
    url: 'https://ko.wikipedia.org/wiki/%EC%B2%AD%EC%86%8C%EB%85%84',
    keyPoints: [
      "2차 성징의 급속 성장기 이후 성인이 되기 전까지 신체적·정서적 과도기를 가리키는 개념.",
      "사회, 문화 및 국가별 법적 규정에 따라 만 12~17세(로틴/하이틴) 등 유동적인 연령 구분.",
      "지적·정서적·사회적 발달에 부합하는 토의형 교육과 자아 정체성 탐색의 중요성."
    ],
    sections: [
      {
        heading: "과도기로서의 신체적·심리적 성장 단계",
        body: "청소년은 2차 성징이 나타나면서 성장이 급속화되는 급속 성장기를 거쳐 성인이 되기 전의 연령을 일컫습니다. 아동기와 성인기 사이에서 독특한 심리적 역동을 겪습니다."
      },
      {
        heading: "사회문화 및 법적 규정의 다양성",
        body: "사회, 문화 및 법적 규정은 각각 조금씩 나이의 차이를 보입니다. 연령 단계로 나눠 만 12~14세를 로틴(중학생), 만 15~17세를 하이틴(고등학생)으로 부르는 등 사회적 쓰임새에 따라 유연하게 구분됩니다."
      },
      {
        heading: "발달 단계에 상응하는 교육의 역할",
        body: "이 시기에는 학생의 신체적·지적·정서적·사회적 발달에 상응하는 교육 내용과 방법이 요구되며, 충분히 토의하고 연구할 수 있는 자율적인 환경이 성숙한 시민으로의 성장을 돕습니다."
      }
    ]
  },
  {
    id: 'culture-14',
    category: 'culture',
    type: 'article',
    isNew: true,
    title: "미국의 문화는 어떻게 등장하고 발전했을까?",
    summary: "유럽 전통의 뿌리 위에 세계 각국 이민자들의 고유한 유산이 융합되어 독창적인 언어, 음악, 미술, 식문화를 꽃피운 미국 문화의 다양화 과정을 살펴봅니다.",
    recommendationReason: "대규모 이민의 역사 속에서 형성된 다문화주의와 현대 글로벌 대중문화의 기원을 살펴볼 수 있습니다.",
    source: "한국어 위키백과 · 미국의 문화",
    duration: '5분 읽기',
    date: '위키백과',
    imageUrl: 'https://images.unsplash.com/photo-1508433957232-3107f5fd5995?w=800&auto=format&fit=crop&q=80',
    url: 'https://ko.wikipedia.org/wiki/%EB%AF%B8%EA%B5%AD%EC%9D%98_%EB%AC%B8%ED%99%94',
    keyPoints: [
      "유럽 서양 문화의 초기 전통에서 출발해 독자적인 언어, 관습, 예술을 형성한 역사적 궤적.",
      "전 세계 수많은 국가로부터의 대규모 이민을 흡수하며 구축된 민족적·인종적 다문화주의.",
      "재즈, 록, 할리우드 영화, 대중 요리 등 전 세계로 파급된 현대 글로벌 팝 컬처의 원동력."
    ],
    sections: [
      {
        heading: "유럽의 영향과 독자적 서양 문화의 발전",
        body: "미국의 문화는 원래 유럽 문화의 영향을 받아서 발전한 서양 문화입니다. 미국 영어, 독창적 음악과 미술, 사회적 관습을 갖춘 나라가 되기 전부터 오랜 역사적 축적을 거쳤습니다."
      },
      {
        heading: "이민과 인종적 다양성이 만든 모자이크",
        body: "오늘날 미국은 초기 기독교 문화의 전통에서 역사적으로 다른 수많은 국가로부터 대규모 이민을 받아들이면서 민족적으로나 인종적으로 가장 다채로운 문화를 지닌 국가가 되었습니다."
      },
      {
        heading: "글로벌 대중문화로의 확산",
        body: "각양각색의 전통이 충돌하고 융합하며 탄생한 미국의 영화, 대중음악, 패션, 라이프스타일은 전 세계인의 일상에 스며드는 글로벌 문화 코드로 성장했습니다."
      }
    ]
  },
  {
    id: 'culture-15',
    category: 'culture',
    type: 'article',
    isNew: true,
    title: "숭늉은 우리 생활에서 어디에 쓰일까?",
    summary: "가마솥 밥 짓기에서 시작되어 식사의 마지막을 따뜻하고 개운하게 장식하는 한국 고유의 음료이자 독창적인 쌀 식문화를 조명합니다.",
    recommendationReason: "한국의 전통 가마솥 조리 환경이 낳은 고유한 식사 마무리 문화와 숭늉의 지혜를 이해합니다.",
    source: "한국어 위키백과 · 숭늉",
    duration: '4분 읽기',
    date: '위키백과',
    imageUrl: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=800&auto=format&fit=crop&q=80',
    url: 'https://ko.wikipedia.org/wiki/%EC%88%AD%EB%8A%89',
    keyPoints: [
      "가마솥 바닥에 눌어붙은 누룽지에 물을 부어 끓여 낸 한국 전통의 구수한 곡차 겸 음료.",
      "한·중·일 쌀 문화권 중에서도 한국인만이 독자적으로 향유해 온 고유한 음식문화.",
      "식사 후 숭늉을 마시거나 밥을 말아먹음으로써 한 끼 식사의 순서를 온전히 마무리하는 관습."
    ],
    sections: [
      {
        heading: "가마솥 조리 도구가 낳은 지혜의 음료",
        body: "숭늉은 밥솥 바닥에 눌어붙은 누룽지에 물을 붓고 한소끔 끓여 만든 음료입니다. 한국인들은 전통적으로 가마솥을 이용해 밥을 지었으며, 조리 과정에서 자연스럽게 남은 누룽지를 활용해 숭늉을 만들어 즐겼습니다."
      },
      {
        heading: "식사의 완결을 알리는 고유한 식문화",
        body: "밥을 먹고 숭늉을 마시거나 숭늉에 밥을 말아 먹으면 식사의 순서가 끝나는 독특한 식문화를 형성했습니다. 입안을 개운하게 씻어주고 소화를 돕는 후식 역할을 담당했습니다."
      },
      {
        heading: "동아시아 쌀 문화권 속 한국만의 독창성",
        body: "쌀을 주식으로 공유하는 한국, 중국, 일본 중에서도 숭늉 형태로 식사를 마치는 것은 한국만이 지닌 따뜻하고 포용적인 음식 문화의 고유한 유산입니다."
      }
    ]
  },
  {
    id: 'culture-16',
    category: 'culture',
    type: 'article',
    isNew: true,
    title: "음식 배달은 우리 생활에서 어디에 쓰일까?",
    summary: "전화 주문에서 모바일 앱과 전동 모빌리티로 진화하며 가정, 오피스, 의료 시설까지 일상 식생활의 패러다임을 바꾼 배달 서비스 문화를 분석합니다.",
    recommendationReason: "외식과 유통, 디지털 플랫폼이 결합하여 현대 도시 라이프스타일을 어떻게 재정의했는지 탐구합니다.",
    source: "한국어 위키백과 · 음식 배달",
    duration: '5분 읽기',
    date: '위키백과',
    imageUrl: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&auto=format&fit=crop&q=80',
    url: 'https://ko.wikipedia.org/wiki/%EC%9D%8C%EC%8B%9D_%EB%B0%B0%EB%8B%AC',
    keyPoints: [
      "전화 및 모바일 앱, 플랫폼 서비스를 통해 음식과 식료품을 소비자의 문 앞까지 연결.",
      "가정식 소비뿐 아니라 구내식당, 의료 시설, B2B 도매 케이터링까지 포괄하는 생활 인프라.",
      "도시 밀도와 라이프스타일에 맞춘 자전거, 전동 스쿠터 등 마이크로 모빌리티 생태계와의 결합."
    ],
    sections: [
      {
        heading: "디지털 플랫폼과 모바일 주문의 일상화",
        body: "음식 배달 주문은 전화에서 공급업체 웹사이트, 모바일 앱, 그리고 제3자 주문 플랫폼을 통해 표준화되었습니다. 메인 요리부터 디저트, 신선 식료품까지 보온·보냉 포장으로 신속하게 배송됩니다."
      },
      {
        heading: "가정을 넘어 의료·복지 시설로의 쓰임새 확장",
        body: "음식 배달의 영역은 일반 가정을 넘어 음식점 식자재 공급, 구내식당 운영, 의료 시설 및 케이터링 도매 배달 서비스까지 우리 생활 전반의 필수 유통 축으로 확장되었습니다."
      },
      {
        heading: "도시 교통과 라이프스타일의 변화",
        body: "자동차뿐 아니라 대도시 환경에 최적화된 자전거나 전동 스쿠터 배달원이 도심을 유기적으로 연결하며, 집밥과 외식의 경계를 허무는 새로운 도시 음식 문화를 이끌고 있습니다."
      }
    ]
  },
  {
    id: 'culture-17',
    category: 'culture',
    type: 'article',
    isNew: true,
    title: "태국 요리를 다른 개념과 구별하는 특징",
    summary: "풍부한 열대 과일과 허브, 매운맛·신맛·단맛이 어우러지는 토착 전통과 외래 문화의 조화가 만들어낸 태국 식문화의 정체성을 살펴봅니다.",
    recommendationReason: "이국적인 향신료의 배합과 문화적 융합이 빚어낸 동남아시아 대표 미식의 매력을 배웁니다.",
    source: "한국어 위키백과 · 태국 요리",
    duration: '4분 읽기',
    date: '위키백과',
    imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&auto=format&fit=crop&q=80',
    url: 'https://ko.wikipedia.org/wiki/%ED%83%9C%EA%B5%AD_%EC%9A%94%EB%A6%AC',
    keyPoints: [
      "열대 과일, 쌀, 다채로운 천연 향신료(레몬그라스, 갈랑갈 등)가 자아내는 독보적 풍미.",
      "매운맛, 신맛, 단맛, 짠맛이 한 그릇 안에서 절묘한 균형과 조화를 이루는 미식 철학.",
      "동남아시아 토착 전통 식문화 위에 중국, 인도 등의 외부 교류가 융합된 문화적 산물."
    ],
    sections: [
      {
        heading: "열대 기후와 풍부한 식재료의 보고",
        body: "태국 요리는 동남아시아 태국의 자연환경을 반영하여 열대 과일과 쌀, 그리고 다양한 향신료들이 풍성하게 들어가는 독특한 특징을 지닙니다."
      },
      {
        heading: "네 가지 맛의 역동적인 하모니",
        body: "매운맛, 신맛, 단맛, 짠맛 등 각기 다른 자극적인 맛들이 부딪히지 않고 하나의 절묘한 조화를 이룹니다. 라임의 산미와 피시소스의 감칠맛, 고추의 칼칼함이 태국 요리의 정체성을 완성합니다."
      },
      {
        heading: "토착 식문화와 문명 교류의 산물",
        body: "태국 요리의 진정한 매력은 자국의 토착적인 전통 음식 문화가 주변 해상 교역을 통해 들어온 외래 식문화와 유기적으로 혼재되어 개성 있게 발달했다는 점에 있습니다."
      }
    ]
  },
  {
    id: 'culture-18',
    category: 'culture',
    type: 'article',
    isNew: true,
    title: "중국 요리, 음식으로 살펴보는 또 하나의 문화",
    summary: "광대한 대륙의 기후와 화교 네트워크를 타고 전 세계로 퍼져나가며 현지 식습관과 융합한 중국 요리의 세계적 문화 전파력을 탐구합니다.",
    recommendationReason: "이주 역사와 현지화 전략을 통해 세계인의 식탁을 사로잡은 음식 문화의 글로벌 전파를 이해합니다.",
    source: "한국어 위키백과 · 중국 요리",
    duration: '5분 읽기',
    date: '위키백과',
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80',
    url: 'https://ko.wikipedia.org/wiki/%EC%A4%91%EA%B5%AD_%EC%9A%94%EB%A6%AC',
    keyPoints: [
      "광대한 지역적 풍토에 기반한 다양한 조리법과 문화적 총칭으로서의 중국 요리.",
      "화교 이주 역사를 통해 각 나라와 지역의 입맛에 맞춰 적극적으로 변형된 현지화 성공 사례.",
      "단순한 음식을 넘어 사회적 연대와 환대, 철학적 세계관을 공유하는 식문화의 상징."
    ],
    sections: [
      {
        heading: "동아시아를 대표하는 유구한 요리 문화",
        body: "중국 요리는 동아시아의 대표적인 요리 문화로서, 좁게는 대륙 각 지방의 전통 요리를 의미하나 넓게는 전 세계적으로 화교들의 영향을 받은 현지 음식까지 모두 아우르는 거대한 문화적 총칭입니다."
      },
      {
        heading: "화교 네트워크와 적극적인 현지화",
        body: "화교들이 일찍부터 외국으로 진출한 덕분에 각 나라의 고유한 입맛과 재료에 맞게 적극적인 현지화를 꾀하였으며, 이는 전 세계 곳곳에 중국 음식이 친숙하게 뿌리내린 핵심 비결입니다."
      },
      {
        heading: "나눔과 화합을 중시하는 식사 철학",
        body: "원탁에 둘러앉아 음식을 돌려먹으며 소통하는 중국의 식사 방식은 가족과 동료 간의 유대감을 돈독히 하는 중요한 문화적 의례로 작동합니다."
      }
    ]
  },
  {
    id: 'culture-19',
    category: 'culture',
    type: 'article',
    isNew: true,
    title: "일본 식탁에서 발견하는 음식 문화",
    summary: "사찰 음식부터 절기 행사 음식인 오세치와 보타모치까지, 자연의 계절감과 형식미를 담아내는 일본 고유의 식문화를 조명합니다.",
    recommendationReason: "계절의 변화와 전통 의례를 정갈하게 식탁 위에 구현하는 일본의 식문화 미학을 소개합니다.",
    source: "한국어 위키백과 · 일본 요리",
    duration: '5분 읽기',
    date: '위키백과',
    imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80',
    url: 'https://ko.wikipedia.org/wiki/%EC%9D%BC%EB%B3%B8_%EC%9A%94%EB%A6%AC',
    keyPoints: [
      "나라 시대부터 축적된 고유 식재료 활용법과 서양 요리를 독창적으로 재해석한 융합력.",
      "가이세키와 사찰음식 등 엄격한 형식미와 정갈함을 강조하는 전통 조리 체계.",
      "새해 오세치, 꽃놀이 당고, 동지 호박 등 사계절 명절·의례와 밀접하게 결합된 식문화."
    ],
    sections: [
      {
        heading: "전통의 계승과 외래 식문화의 독창적 재해석",
        body: "일본 요리는 나라 시대부터 이어진 고유의 방식과 재료를 계승하면서도 메이지 유신 이후 스파게티, 피자 등 서양 요리를 일본인의 입맛과 풍토에 맞게 재해석하여 풍성하게 발전해 왔습니다."
      },
      {
        heading: "형식미와 예법을 담은 가이세키와 정식",
        body: "사찰음식과 가이세키 요리처럼 격식에 입각한 차림새는 시각적인 아름다움과 그릇의 조화, 식재료 본연의 담백한 맛을 살리는 데 깊은 정성을 쏟습니다."
      },
      {
        heading: "절기와 축제를 수놓는 행사 음식",
        body: "새해를 맞이하는 오세치 요리, 피안의 보타모치, 벚꽃놀이와 달맞이의 당고, 동지의 호박 요리 등 사계절의 순환과 전통 행사를 함께 기념하는 따뜻한 문화적 의미를 지닙니다."
      }
    ]
  },
  {
    id: 'culture-20',
    category: 'culture',
    type: 'article',
    isNew: true,
    title: "로봇의 눈물은 실사와 CGI를 어떻게 결합했을까?",
    summary: "오픈 소스 3D 툴 블렌더(Blender)를 활용해 배우의 실제 연기와 가상 컴퓨터 그래픽을 정교하게 합성해 낸 단편 영화 《로봇의 눈물》의 시각 예술을 살펴봅니다.",
    recommendationReason: "오픈 소스 창작 생태계와 컴퓨터 그래픽 기술이 영화적 서사와 결합한 예술적 시도를 만날 수 있습니다.",
    source: "한국어 위키백과 · 로봇의 눈물",
    duration: '5분 읽기',
    date: '위키백과',
    imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=80',
    url: 'https://ko.wikipedia.org/wiki/%EB%A1%9C%EB%B4%87%EC%9D%98_%EB%88%88%EB%AC%BC',
    keyPoints: [
      "실제 배우의 라이브 액션 촬영과 고난도 3D CGI 기술을 긴밀하게 결합한 시각 효과.",
      "오픈 소스 소프트웨어 블렌더(Blender)의 성능 개선 프로젝트를 통해 제작된 단편 영화.",
      "크리에이티브 커먼즈 라이선스를 채택하여 전 세계 디지털 창작자들에게 자산을 개방한 공유 문화."
    ],
    sections: [
      {
        heading: "실사와 컴퓨터 그래픽의 혁신적 결합",
        body: "《로봇의 눈물》(Tears of Steel)은 라이브 액션 실사 연기와 정밀한 CGI를 결합한 공상과학 단편 영화입니다. 현실 배우의 감정선 위에 정교한 로봇 메카닉 그래픽을 덧입혔습니다."
      },
      {
        heading: "오픈 소스 그래픽 툴 블렌더의 한계 돌파",
        body: "자유·오픈 소스 3D 그래픽 소프트웨어 패키지인 블렌더의 새로운 시각 효과 개선 기능을 검증하고 끌어올리기 위해 제작되었으며, 시각 효과와 합성 작업 전반이 블렌더로 완수되었습니다."
      },
      {
        heading: "공유와 오픈 라이선스의 문화적 의의",
        body: "영화 본편과 스튜디오에서 제작된 모든 에셋이 크리에이티브 커먼즈 라이선스로 전 세계에 공개되어, 미래 세대 독립 영상 제작자들에게 귀중한 학습 및 창작 자산이 되었습니다."
      }
    ]
  },
  {
    id: 'culture-21',
    category: 'culture',
    type: 'article',
    isNew: true,
    title: "노래는 어떻게 등장하고 발전했을까?",
    summary: "중세 유럽 음유시인의 서정시에서 출발해 오페라, 극장 공연, 현대 디지털 음원 스튜디오로 이어지는 노래의 예술적 진화 과정을 탐색합니다.",
    recommendationReason: "인간의 목소리가 역사 속 음유시인과 작곡가들의 손을 거쳐 찬란한 음악 예술로 발전한 역사를 배웁니다.",
    source: "한국어 위키백과 · 노래",
    duration: '5분 읽기',
    date: '위키백과',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    url: 'https://ko.wikipedia.org/wiki/%EB%85%B8%EB%9E%98',
    keyPoints: [
      "음유시인(트루바두르)들의 낭만적 서정시 전통에서 꽃피운 기록된 노래의 기원.",
      "클래식 가곡부터 오페라, 뮤지컬, 현대 녹음 스튜디오로 다변화된 공연 예술 형태.",
      "인간의 정서와 시대를 기록하고 전승하는 보편적인 문화적 소통 양식."
    ],
    sections: [
      {
        heading: "음유시인의 낭만 전통과 노래의 시작",
        body: "유럽의 트루바두르와 음유시인들이 기록된 낭만적 노래의 전통을 시작했으며, 이는 엘리자베스 시대의 류트 연주자들과 음유 가객들에 의해 대를 이어 계승 발전되었습니다."
      },
      {
        heading: "예술 가곡과 무대 공연 예술의 만남",
        body: "클래식 작곡가들에 의해 콘서트용 예술 가곡이 체계화되었고, 노래는 극장 무대의 오페라, 영화, TV 프로그램의 핵심 내러티브 장치로 융합되었습니다."
      },
      {
        heading: "녹음 기술과 대중음악의 번영",
        body: "스튜디오 음향 녹음 기술의 발전과 라이브 공연 문화가 결합하면서 노래는 전 인류가 시공간을 초월해 감정과 이야기를 공유하는 가장 대중적인 문화 언어가 되었습니다."
      }
    ]
  },
  {
    id: 'culture-22',
    category: 'culture',
    type: 'article',
    isNew: true,
    title: "여성주의 운동은 사회를 어떻게 바꾸어 왔을까?",
    summary: "참정권 쟁취에서 시작해 교육권, 경제적 자립, 문화적 고정관념 타파로 확장되며 인류 사회의 평등과 연대를 이끌어온 여성주의 운동의 발전사를 살펴봅니다.",
    recommendationReason: "역사적 차별에 맞서 제도적 변화와 사회문화적 평등을 일궈낸 시민 운동의 흐름을 이해할 수 있습니다.",
    source: "한국어 위키백과 · 여성주의",
    duration: '6분 읽기',
    date: '위키백과',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
    url: 'https://ko.wikipedia.org/wiki/%EC%97%AC%EC%84%B1',
    keyPoints: [
      "성별로 인한 정치·경제·사회·문화적 차별을 해소하고자 태동한 근현대 시민 평등 운동.",
      "19세기 여성 참정권(서프러제트) 운동에서 교육권 보장과 직업적 기회균등으로의 지평 확대.",
      "사회적 관습과 고정관념을 넘어 다양성과 상호 연대를 지향하는 현대 문화 담론으로의 진화."
    ],
    sections: [
      {
        heading: "차별에 맞선 참정권 운동의 출발",
        body: "여성주의 운동은 성별로 인해 발생하는 정치·경제·사회적 차별을 철폐하기 위한 견해이자 실천입니다. 역사적으로 교육과 투표권에서 배제되었던 현실을 타파하기 위해 19세기 말 서프러제트(참정권 운동)로 본격화되었습니다."
      },
      {
        heading: "교육권 보장과 경제적 자립의 길",
        body: "참정권 쟁취 이후 운동은 여성의 고등교육 접근권과 공평한 노동권, 임금 격차 해소로 외연을 넓혔습니다. 교육을 통한 지적 성장은 여성이 가부장적 종속에서 벗어나 주체적인 사회 구성원으로 설 수 있는 발판이 되었습니다."
      },
      {
        heading: "현대 사회문화 담론과 연대의 확장",
        body: "현대의 여성주의는 단순한 법적 권리 획득을 넘어 미디어 속 성별 고정관념 탈피, 일·가정 양립 제도 개선, 그리고 모든 사회적 약자와의 교차적 연대를 통해 포용적이고 지속 가능한 공동체를 향해 나아가고 있습니다."
      }
    ]
  },
  {
    id: 'culture-23',
    category: 'culture',
    type: 'article',
    isNew: true,
    title: "셰프의 감각에 맡기는 미식, 오마카세의 문화",
    summary: "정해진 메뉴 대신 셰프가 계절 식재료와 손님의 취향을 섬세하게 읽어 최적의 코스를 완성하는 일본의 맡김 요리 문화와 미식 철학을 탐구합니다.",
    recommendationReason: "손님과 셰프 사이의 깊은 신뢰와 즉흥적 장인정신이 만들어내는 현대 외식 미식 문화를 배웁니다.",
    source: "한국어 위키백과 · 오마카세",
    duration: '5분 읽기',
    date: '위키백과',
    imageUrl: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800&auto=format&fit=crop&q=80',
    url: 'https://ko.wikipedia.org/wiki/%EC%98%A4%EB%A7%88%EC%B9%B4%EC%84%B8',
    keyPoints: [
      "일본어로 \"맡긴다\"는 뜻으로, 셰프의 당일 재료 선별과 재량에 온전히 식사를 맡기는 방식.",
      "손님의 식사 속도, 취향, 반응을 실시간으로 관찰하고 대화하며 조율하는 맞춤형 접객(오모테나시).",
      "획일화된 메뉴판을 벗어나 계절감과 스토리를 음미하는 프리미엄 미식 라이프스타일."
    ],
    sections: [
      {
        heading: "맡김(お任せ)의 의미와 계절 식재료",
        body: "오마카세는 \"주방장에게 맡긴다\"는 뜻으로, 고정된 메뉴 대신 그날 시장에서 공수한 최상의 제철 식재료에 따라 셰프의 재량으로 코스를 구성하는 독특한 식문화입니다."
      },
      {
        heading: "손님과 소통하는 즉석 조리와 오모테나시",
        body: "소수의 손님만을 카운터에 모시고 즉석에서 요리를 내어주며 재료의 산지와 조리 의도를 설명합니다. 셰프는 손님의 먹는 속도와 선호도를 세심하게 기억하고 다음 요리의 간과 온도를 즉각 조절합니다."
      },
      {
        heading: "경험과 취향을 소비하는 현대 미식 트렌드",
        body: "오늘날 오마카세는 스시를 넘어 한우, 디저트, 티 코스 등 다양한 영역으로 확장되며, 단순한 한 끼 식사를 넘어 셰프의 예술적 철학을 오감으로 교감하는 라이프스타일 문화로 자리 잡았습니다."
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
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop&q=80',
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
  },
  {
    id: 'hobby-11',
    category: 'hobby',
    type: 'article',
    isNew: true,
    title: "네모바지 스폰지밥은 어떻게 등장하고 발전했을까?",
    summary: "집게리아의 긍정적인 요리사로 첫 등장해 기상천외한 순발력과 유쾌한 매력으로 전 세계 극장판 영화와 대중문화를 사로잡은 스폰지밥의 이야기를 다룹니다.",
    recommendationReason: "일상에 유쾌한 활력을 주는 세계적인 인기 애니메이션 캐릭터의 탄생과 유머 코드를 살펴봅니다.",
    source: "한국어 위키백과 · 네모바지 스폰지밥 (캐릭터)",
    duration: '5분 읽기',
    date: '위키백과',
    imageUrl: 'https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?w=800&auto=format&fit=crop&q=80',
    url: 'https://ko.wikipedia.org/wiki/%EB%84%A4%EB%AA%A8%EB%B0%94%EC%A7%80_%EC%8A%A4%ED%8F%B0%EC%A7%80%EB%B0%A5_(%EC%BA%90%EB%A6%AD%ED%84%B0)',
    keyPoints: [
      "집게리아의 열정 넘치는 버거 요리사로 첫 에피소드부터 기상천외한 매력을 발산한 캐릭터.",
      "특유의 낙천적인 웃음과 엉뚱한 순발력으로 남녀노소 모두에게 사랑받는 글로벌 애니메이션.",
      "TV 시리즈를 넘어 극장판 장편 영화, 뮤지컬, 팝 컬처 밈으로 지속 확장 중인 캐릭터 자산."
    ],
    sections: [
      {
        heading: "집게리아 첫 출근과 전설의 게살버거",
        body: "집게사장은 처음에는 스폰지밥의 실력을 미덥지 않게 여겼지만, 시즌 1 첫 번째 에피소드 〈직원모집〉 편에서 몰려든 손님들에게 게살버거를 기상천외한 순발력으로 대접하는 모습을 보고 감동해 즉시 채용했습니다."
      },
      {
        heading: "긍정의 아이콘과 독창적인 유머 세계",
        body: "바닷속 비키니시티를 배경으로 징징이, 뚱이, 다람이와 엮이며 벌어지는 스폰지밥의 순수한 낙천주의는 전 세계 시청자들에게 큰 웃음과 위로를 선사했습니다."
      },
      {
        heading: "극장판 영화와 글로벌 팝 컬처의 마스코트",
        body: "2020년 장편 영화 《스폰지밥 무비: 핑핑이 구출 대작전》을 비롯해 영화사의 대표 마스코트로 자리 잡았으며, 다채로운 상품과 밈으로 소비되는 현대 대중 취미 문화의 상징이 되었습니다."
      }
    ]
  },
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
