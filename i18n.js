// ==========================================================================
// 맘고리즘 (My-gorithm) - 다국어(i18n) 지원 엔진 (한국어 / English)
// ==========================================================================

export const STORAGE_KEY_LANG = 'mamgorithm_lang_v1';

export const TRANSLATIONS = {
  ko: {
    brand: {
      title: '맘고리즘',
      sub: '내맘대로 추천 피드',
      badge: 'My-gorithm'
    },
    header: {
      installApp: '맘고리즘 앱 설치',
      quickTune: '알고리즘 비율 조절',
      langToggleTitle: '언어 변경 (KO / EN)',
      langLabel: 'KO',
      authBtn: '로그인'
    },
    auth: {
      signIn: '로그인',
      signOut: '로그아웃',
      account: '내 계정',
      skip: '닫기',
      modalTitle: '맘고리즘',
      modalSubtitle: '내 취향대로 튜닝하는 알고리즘 피드',
      googleSignIn: 'Google 계정으로 계속하기',
      guestContinue: '로그인 없이 둘러보기',
      loginSuccess: '{name}님, 환영합니다!',
      logoutSuccess: '로그아웃되었습니다.',
      loginFailed: '로그인에 실패했습니다. 다시 시도해주세요.',
      statsBannerTitle: 'Google 계정 연동',
      statsBannerDesc: '로그인하면 다른 기기에서도 튜닝 비율이 유지됩니다.',
      btnSyncLogin: '로그인',
      syncActive: '클라우드 연동됨'
    },
    splash: {
      title: '맘고리즘',
      sub: '내맘대로 추천 피드'
    },
    intro: {
      brand: '맘고리즘',
      startWithSound: '소리와 함께 시작',
      skip: '건너뛰기',
      soundOn: '소리 켬',
      soundOff: '음소거'
    },
    banner: {
      main: '맘고리즘 앱으로 더 쾌적하게',
      sub: '홈 화면에 추가해 1초 만에 실행하세요',
      install: '앱 설치'
    },
    feed: {
      all: '전체',
      video: '영상',
      article: '기사',
      refresh: '새로고침',
      emptyTitle: '관심 분야가 모두 꺼져 있습니다',
      emptyDesc: '맘고리즘은 사용자가 원하는 분야만 추천합니다.<br/>하단 미니 독을 터치해 관심 분야를 1% 이상으로 올려보세요.',
      restoreBalance: '균형 모드로 켜기'
    },
    presets: {
      balanced: { name: '균형 모드', desc: '모든 분야를 골고루' },
      growth: { name: '커리어·성장', desc: '공부와 기술 집중' },
      healing: { name: '휴식·힐링', desc: '문화와 취미 위주' },
      studyOnly: { name: '학습 집중', desc: '오직 공부 콘텐츠만' }
    },
    categories: {
      study: { name: '공부', shortTag: '학습 · 교양', desc: '학습법, 인문·교양 지식' },
      tech: { name: '기술', shortTag: 'IT · 트렌드', desc: 'AI, 개발, IT 트렌드' },
      culture: { name: '문화', shortTag: '예술 · 라이프', desc: '문화, 예술 트렌드' },
      hobby: { name: '취미', shortTag: '액티비티 · 일상', desc: '운동, 가드닝, 쿠킹' }
    },
    cards: {
      badgeNew: 'NEW',
      bookmarkSave: '보관함에 저장',
      bookmarkRemove: '보관함에서 제거',
      sourceLabel: '출처',
      minRead: '분 읽기',
      video: '영상',
      article: '기사'
    },
    tabs: {
      feed: '피드',
      stats: '내 알고리즘',
      saved: '보관함'
    },
    dock: {
      tune: '튜닝',
      title: '알고리즘 믹서',
      desc: '슬라이더를 조절하면 피드에 즉시 반영됩니다.',
      tooltip: '믹서 사용 팁',
      shareRecipe: '현재 알고리즘 레시피 공유',
      reset: '균형 리셋',
      close: '믹서 닫기',
      allZeroAlert: '모든 분야가 0%입니다. 최소 1개 이상의 관심도를 올려주세요.',
      allExcluded: '모든 분야 제외됨 (터치하여 설정)',
      apply: '피드 확인하기'
    },
    sliders: {
      ticks: { 0: '제외', 25: '낮음', 50: '보통', 75: '높음', 100: '최대' },
      levels: {
        0: { label: '제외', desc: '피드에서 숨김' },
        25: { label: '조금', desc: '가끔 1~2개 추천' },
        50: { label: '보통', desc: '균형 있게 추천' },
        75: { label: '선호', desc: '자주 추천' },
        100: { label: '집중', desc: '피드 최우선 배치' }
      }
    },
    stats: {
      title: '내 알고리즘 분석',
      subtitle: '맘고리즘의 추천 공식과 현재 설정된 가중치를 투명하게 공개합니다.',
      shareTitle: '내 알고리즘 레시피 공유',
      shareDesc: '내가 튜닝한 관심도 비율을 친구에게 링크로 전달해보세요. 친구가 링크를 열면 내 설정이 그대로 반영됩니다.',
      shareBtn: '현재 레시피 링크 복사 및 공유',
      calcTitle: '추천 계산 메커니즘',
      calcDesc: '맘고리즘은 사용자의 머무는 시간이나 광고 수익에 기반한 <strong>중독형 블랙박스 알고리즘을 사용하지 않습니다.</strong>',
      formula: '추천 비율(%) = (카테고리 설정값 ÷ 전체 가중치 합) × 100',
      formulaSub: '설정값이 0%인 분야는 추천 피드에서 100% 원천 배제되며, 1% 이상으로 지정한 분야만 비율에 맞추어 균등하게 교차 배치됩니다.',
      tableTitle: '현재 가중치 배분표',
      thCategory: '분야',
      thWeight: '설정 가중치',
      thRatio: '추천 비율',
      thCards: '피드 카드 수',
      cardsUnit: '장',
      replayTitle: '시작 화면 및 안내 다시 보기',
      replayDesc: '처음 접속했을 때의 인터랙티브 알고리즘 튜닝과 미니 독 사용 가이드를 홈 화면으로 자동 이동하여 다시 체험할 수 있습니다.',
      btnLightIntro: '라이트 인트로 재생',
      btnDarkIntro: '다크 인트로 재생',
      btnOnboarding: '시작 화면(온보딩) 열기',
      btnCoachmark: '미니 독 튜닝 안내(코치마크)',
      addCardTitle: '새 콘텐츠 카드 추가',
      addCardDesc: '원하는 유튜브 영상이나 아티클 정보를 입력하여 추천 풀에 즉시 새로운 카드를 추가할 수 있습니다.',
      labelCategory: '카테고리 분야',
      labelType: '콘텐츠 유형',
      labelTitle: '카드 제목',
      placeholderTitle: '예: 2026 반드시 알아야 할 디자인 시스템 트렌드',
      labelSummary: '요약 설명 (2줄 내외)',
      placeholderSummary: '핵심 내용을 간결하게 입력하세요',
      labelSource: '출처 / 채널명',
      placeholderSource: '예: YouTube · 디자인 채널',
      labelUrl: '연결 URL (유튜브 또는 원문 링크)',
      btnAddCard: '새 카드 피드에 추가하기',
      btnResetCards: '추가한 카드 초기화',
      customCardPill: '추가된 카드 {count}장'
    },
    saved: {
      title: '보관함',
      subtitle: '북마크한 기사와 영상을 나중에 다시 찾아볼 수 있습니다.',
      clearAll: '전체 비우기',
      emptyTitle: '보관한 콘텐츠가 없습니다',
      emptyDesc: '피드 카드의 북마크 버튼을 누르면<br/>나중에 다시 읽고 싶은 콘텐츠가 이곳에 저장됩니다.'
    },
    onboarding: {
      title: '내 취향대로 맞추는 피드',
      desc: '관심 있는 분야의 슬라이더를 손끝으로 가볍게 튜닝해보세요.',
      presetsTitle: '빠른 프리셋',
      gaugeTitle: '실시간 추천 비율',
      haptic: '햅틱 피드백',
      start: '이 설정으로 내 피드 열기'
    },
    video: {
      youtubeOriginal: 'YouTube 원본',
      feedbackTitle: '추천 알고리즘 피드백',
      feedbackDesc: '이 영상이 마음에 드셨다면 해당 분야의 관심도를 높여보세요.',
      tuneBtn: '비율 조절'
    },
    reader: {
      keyPointsTitle: '3줄 핵심 요약',
      recomReason: '맘고리즘 추천 이유',
      visitOriginal: '원문 방문',
      visitOriginalFull: '원문 사이트 방문하기',
      feedbackTitle: '{category} 알고리즘 피드백',
      feedbackDesc: '이 기사가 유익하셨다면 알고리즘 믹서에서 {category} 비율을 높여보세요.',
      backToFeed: '피드로 돌아가기',
      notice: '※ 외부 사이트의 보안 설정이나 모바일 네트워크 환경에 따라 링크 연결이 지연될 경우, 위 인앱 리더의 핵심 요약과 상세 본문에서 전문을 바로 확인하실 수 있습니다.'
    },
    coachmark: {
      badge1: 'TIP · 1 / 2',
      title1: '하단 미니 독으로 언제든 조절하세요',
      desc1: '피드를 탐색하다가 언제든 하단 바를 살짝 위로 올리면 4개 분야의 추천 비율을 실시간으로 믹싱할 수 있습니다.',
      badge2: 'TIP · 2 / 2',
      title2: '원터치 프리셋 & 셔플',
      desc2: '상황에 맞는 프리셋 버튼을 눌러 분위기를 바꾸거나, 새로고침(셔플)으로 새로운 조합을 즉시 탐색해보세요.',
      skip: '건너뛰기',
      next: '다음',
      start: '시작하기'
    },
    confirm: {
      title: '확인',
      defaultDesc: '정말 진행하시겠습니까?',
      cancel: '취소',
      ok: '확인',
      resetTitle: '알고리즘 균형 재설정',
      resetDesc: '모든 분야 관심도를 50% 균등 분배로 재설정하시겠습니까?',
      resetConfirm: '재설정',
      clearSavedTitle: '보관함 전체 비우기',
      clearSavedDesc: '보관함에 저장된 콘텐츠 {count}개를 모두 삭제하시겠습니까?',
      clearSavedConfirm: '전체 삭제',
      resetCardsTitle: '직접 추가한 카드 초기화',
      resetCardsDesc: '사용자가 직접 추가한 콘텐츠 카드 {count}장을 모두 삭제하고 기본 데이터셋으로 되돌리시겠습니까?',
      resetCardsConfirm: '초기화'
    },
    iosInstall: {
      title: '홈 화면에 맘고리즘 추가하기',
      desc: 'Safari에서 3초 만에 앱처럼 전체 화면으로 등록할 수 있습니다.',
      step1: 'Safari 하단 메뉴의 <strong>공유 버튼</strong>을 탭합니다.',
      step2: '메뉴를 아래로 내려 <strong>\'홈 화면에 추가\'</strong>를 선택합니다.',
      step3: '우측 상단의 <strong>\'추가\'</strong>를 누르면 홈 화면에 앱이 설치됩니다!',
      done: '확인했습니다'
    },
    tooltip: {
      stats: '맘고리즘은 전체 가중치 합산 대비 각 분야의 비율을 최대 잔여수(Largest Remainder) 방식으로 정밀 계산하여 피드 12장의 구성을 투명하게 맞춥니다.',
      mixer: '슬라이더를 1% 단위로 조절하면 다른 분야와의 상대 비율이 실시간 계산됩니다. 0%로 맞춘 분야는 피드에서 100% 원천 배제됩니다.'
    },
    toast: {
      langSwitched: '한국어로 설정되었습니다.',
      recipeApplied: '공유받은 알고리즘 레시피가 적용되었습니다.',
      recipeCopied: '알고리즘 레시피 링크가 복사되었습니다.',
      balancedApplied: '균형 모드가 적용되었습니다.',
      presetApplied: '{preset} 설정이 적용되었습니다.',
      balancedReset: '모든 분야 관심도를 50% 균등으로 재설정했습니다.',
      saved: '보관함에 저장되었습니다.',
      removed: '보관함에서 제거되었습니다.',
      restored: '보관함에 다시 복원되었습니다.',
      allRestored: '보관함 콘텐츠가 모두 복원되었습니다.',
      cleared: '보관함이 모두 비워졌습니다.',
      undo: '실행 취소',
      allClearedCount: '{count}개의 콘텐츠가 모두 삭제되었습니다.',
      zeroWarning: '모든 분야가 0%입니다. 관심도를 1% 이상 올려주세요.',
      shuffled: '새로운 추천 콘텐츠 조합을 불러왔습니다.',
      titleRequired: '카드 제목과 핵심 요약을 입력해주세요.',
      cardAdded: '새로운 {category} 카드가 피드에 추가되었습니다.',
      cardsReset: '직접 추가한 카드가 모두 초기화되었습니다.',
      appInstalled: '맘고리즘 앱이 성공적으로 설치되었습니다!',
      iosGuide: 'Safari 공유 메뉴에서 [홈 화면에 추가]를 선택하세요.',
      online: '네트워크가 정상적으로 다시 연결되었습니다.',
      offline: '네트워크 연결이 끊겼습니다. 오프라인 모드로 실행됩니다.',
      shareMsg: '내가 직접 튜닝한 맘고리즘 추천 비율 (공부 {study}% · 기술 {tech}% · 문화 {culture}% · 취미 {hobby}%)을 확인해보세요!',
      sharePrompt: '아래 링크를 복사하여 공유하세요:',
      onboardingFeedReady: '내 맞춤 추천 피드가 열렸습니다.',
      appUpdated: '새로운 기능과 디자인이 업데이트되었습니다.',
      reload: '새로고침'
    }
  },

  en: {
    brand: {
      title: 'My-gorithm',
      sub: 'User-Driven Recommendation Feed',
      badge: 'My-gorithm'
    },
    header: {
      installApp: 'Install My-gorithm App',
      quickTune: 'Tune Algorithm Mixer',
      langToggleTitle: 'Change Language (KO / EN)',
      langLabel: 'EN',
      authBtn: 'Sign In'
    },
    auth: {
      signIn: 'Sign In',
      signOut: 'Sign Out',
      account: 'Account',
      skip: 'Close',
      modalTitle: 'My-gorithm',
      modalSubtitle: 'Tune your recommendation feed your way',
      googleSignIn: 'Continue with Google',
      guestContinue: 'Browse without logging in',
      loginSuccess: 'Welcome, {name}!',
      logoutSuccess: 'Signed out successfully.',
      loginFailed: 'Login failed. Please try again.',
      statsBannerTitle: 'Connect Google Account',
      statsBannerDesc: 'Sign in to keep your tuning ratio across all devices.',
      btnSyncLogin: 'Sign In',
      syncActive: 'Cloud synced'
    },
    splash: {
      title: 'My-gorithm',
      sub: 'User-Driven Recommendation Feed'
    },
    intro: {
      brand: 'My-gorithm',
      startWithSound: 'Start with Sound',
      skip: 'Skip',
      soundOn: 'Sound On',
      soundOff: 'Mute'
    },
    banner: {
      main: 'Experience More with App',
      sub: 'Add to home screen for instant 1-second launch',
      install: 'Install'
    },
    feed: {
      all: 'All',
      video: 'Video',
      article: 'Article',
      refresh: 'Refresh',
      emptyTitle: 'All categories are turned off',
      emptyDesc: 'My-gorithm only recommends what you want to see.<br/>Tap the mini dock below and raise any category above 1%.',
      restoreBalance: 'Turn on Balanced Mode'
    },
    presets: {
      balanced: { name: 'Balanced', desc: 'Even mix across all fields' },
      growth: { name: 'Career & Growth', desc: 'Focus on Study & Tech' },
      healing: { name: 'Rest & Chill', desc: 'Culture & Hobby focused' },
      studyOnly: { name: 'Deep Study', desc: 'Exclusively Study content' }
    },
    categories: {
      study: { name: 'Study', shortTag: 'Learning & Culture', desc: 'Study methods, humanities & culture' },
      tech: { name: 'Tech', shortTag: 'IT & Trends', desc: 'AI, engineering & tech trends' },
      culture: { name: 'Culture', shortTag: 'Arts & Life', desc: 'Culture, arts & modern life' },
      hobby: { name: 'Hobby', shortTag: 'Activity & Daily', desc: 'Sports, cooking & lifestyle' }
    },
    cards: {
      badgeNew: 'NEW',
      bookmarkSave: 'Save to bookmarks',
      bookmarkRemove: 'Remove from bookmarks',
      sourceLabel: 'Source',
      minRead: 'min read',
      video: 'Video',
      article: 'Article'
    },
    tabs: {
      feed: 'Feed',
      stats: 'My Algorithm',
      saved: 'Bookmarks'
    },
    dock: {
      tune: 'Tune',
      title: 'Algorithm Mixer',
      desc: 'Adjust sliders to instantly shape your recommendation feed.',
      tooltip: 'Mixer tips',
      shareRecipe: 'Share current algorithm recipe',
      reset: 'Reset to balance',
      close: 'Close mixer',
      allZeroAlert: 'All categories are 0%. Please raise at least one above 0%.',
      allExcluded: 'All topics off (tap to configure)',
      apply: 'View Feed'
    },
    sliders: {
      ticks: { 0: 'Off', 25: 'Low', 50: 'Mid', 75: 'High', 100: 'Max' },
      levels: {
        0: { label: 'Exclude', desc: 'Hidden from feed' },
        25: { label: 'Low', desc: '1~2 cards occasionally' },
        50: { label: 'Normal', desc: 'Balanced recommendation' },
        75: { label: 'Preferred', desc: 'Frequent recommendations' },
        100: { label: 'Focus', desc: 'Top priority in feed' }
      }
    },
    stats: {
      title: 'My Algorithm Insights',
      subtitle: 'Transparent recommendation formula and live weights breakdown.',
      shareTitle: 'Share My Algorithm Recipe',
      shareDesc: 'Send your customized interest ratio to friends with a single link. When opened, your settings apply immediately.',
      shareBtn: 'Copy & Share Recipe Link',
      calcTitle: 'Recommendation Mechanism',
      calcDesc: 'My-gorithm <strong>does not use addictive black-box algorithms</strong> designed to maximize screen time or ad profits.',
      formula: 'Target Ratio (%) = (Category Weight ÷ Total Weights Sum) × 100',
      formulaSub: 'Categories set to 0% are 100% excluded. Only categories with 1%+ are evenly interleaved according to their ratio.',
      tableTitle: 'Current Weight Allocation',
      thCategory: 'Category',
      thWeight: 'Set Weight',
      thRatio: 'Target Ratio',
      thCards: 'Feed Cards',
      cardsUnit: ' cards',
      replayTitle: 'Replay Intro & Guides',
      replayDesc: 'Experience the interactive algorithm onboarding and mini dock guide again.',
      btnLightIntro: 'Play Light Intro',
      btnDarkIntro: 'Play Dark Intro',
      btnOnboarding: 'Open Onboarding',
      btnCoachmark: 'Mini Dock Guide',
      addCardTitle: 'Add New Content Card',
      addCardDesc: 'Add YouTube videos or articles directly into your recommendation pool.',
      labelCategory: 'Category',
      labelType: 'Content Type',
      labelTitle: 'Card Title',
      placeholderTitle: 'e.g. 2026 Key Design System Trends',
      labelSummary: 'Summary (about 2 lines)',
      placeholderSummary: 'Enter concise highlights of the content',
      labelSource: 'Source / Channel',
      placeholderSource: 'e.g. YouTube · Design Channel',
      labelUrl: 'Link URL (YouTube or Article link)',
      btnAddCard: 'Add Card to Feed',
      btnResetCards: 'Reset Added Cards',
      customCardPill: '{count} custom card(s)'
    },
    saved: {
      title: 'Bookmarks',
      subtitle: 'Read or watch saved content whenever you are ready.',
      clearAll: 'Clear All',
      emptyTitle: 'No saved content yet',
      emptyDesc: 'Tap the bookmark icon on feed cards<br/>to save articles and videos here for later.',
    },
    onboarding: {
      title: 'Tune Feeds to Your Taste',
      desc: 'Freely adjust the topic sliders with your fingertips.',
      presetsTitle: 'Quick Presets',
      gaugeTitle: 'Live Recommendation Ratio',
      haptic: 'Haptic Feedback',
      start: 'Open Feed with These Settings'
    },
    video: {
      youtubeOriginal: 'YouTube Original',
      feedbackTitle: 'Algorithm Feedback',
      feedbackDesc: 'If you enjoyed this video, increase its topic weight in the mixer.',
      tuneBtn: 'Tune Ratio'
    },
    reader: {
      keyPointsTitle: '3-Line Summary',
      recomReason: 'Why Recommended',
      visitOriginal: 'Visit Original',
      visitOriginalFull: 'Visit Original Website',
      feedbackTitle: '{category} Algorithm Feedback',
      feedbackDesc: 'If this article was insightful, raise {category} weight in the mixer.',
      backToFeed: 'Back to Feed',
      notice: '※ If external web loading is slow, you can read the complete summary and structured text directly inside this in-app reader.'
    },
    coachmark: {
      badge1: 'TIP · 1 / 2',
      title1: 'Adjust Anytime with the Mini Dock',
      desc1: 'Whenever you want to switch topics, simply slide up the bottom mini dock to reshape your feed in real-time.',
      badge2: 'TIP · 2 / 2',
      title2: 'One-Touch Presets & Shuffle',
      desc2: 'Tap preset buttons to instantly adapt your feed mood, or hit shuffle to explore fresh content mixes.',
      skip: 'Skip',
      next: 'Next',
      start: 'Get Started'
    },
    confirm: {
      title: 'Confirm',
      defaultDesc: 'Are you sure you want to proceed?',
      cancel: 'Cancel',
      ok: 'Confirm',
      resetTitle: 'Reset Algorithm Balance',
      resetDesc: 'Reset all category weights back to 50% equal balance?',
      resetConfirm: 'Reset',
      clearSavedTitle: 'Clear Entire Bookmarks',
      clearSavedDesc: 'Delete all {count} saved items from your bookmarks?',
      clearSavedConfirm: 'Clear All',
      resetCardsTitle: 'Reset Custom Cards',
      resetCardsDesc: 'Delete all {count} custom content cards and revert to default pool?',
      resetCardsConfirm: 'Reset'
    },
    iosInstall: {
      title: 'Add My-gorithm to Home Screen',
      desc: 'Launch in full screen like a native app in 3 seconds via Safari.',
      step1: 'Tap the <strong>Share button</strong> in Safari bottom menu.',
      step2: 'Scroll down and select <strong>\'Add to Home Screen\'</strong>.',
      step3: 'Tap <strong>\'Add\'</strong> on top right to install on your home screen!',
      done: 'Got it'
    },
    tooltip: {
      stats: 'My-gorithm calculates transparent 12-card proportions via the Largest Remainder method relative to total weights sum.',
      mixer: 'Adjusting sliders at 1% increments recalculates live proportions. Categories set to 0% are 100% excluded.'
    },
    toast: {
      langSwitched: 'Language switched to English.',
      recipeApplied: 'Shared algorithm recipe applied.',
      recipeCopied: 'Algorithm recipe link copied to clipboard.',
      balancedApplied: 'Balanced mode applied.',
      presetApplied: '{preset} preset applied.',
      balancedReset: 'Reset all category weights to 50% equal balance.',
      saved: 'Saved to bookmarks.',
      removed: 'Removed from bookmarks.',
      restored: 'Restored to bookmarks.',
      allRestored: 'All bookmarks restored.',
      cleared: 'All bookmarks cleared.',
      undo: 'Undo',
      allClearedCount: 'All {count} content items were deleted.',
      zeroWarning: 'All categories are 0%. Please raise at least one.',
      shuffled: 'Loaded a fresh combination of recommendations.',
      titleRequired: 'Please enter card title and summary.',
      cardAdded: 'New {category} card added to feed.',
      cardsReset: 'Custom cards have been reset.',
      appInstalled: 'My-gorithm app installed successfully!',
      iosGuide: 'Select [Add to Home Screen] from the Safari Share menu.',
      online: 'Network connection restored.',
      offline: 'You are offline. Running in offline cache mode.',
      shareMsg: 'Check out my custom My-gorithm recommendation mix (Study {study}% · Tech {tech}% · Culture {culture}% · Hobby {hobby}%)!',
      sharePrompt: 'Copy the link below to share:',
      onboardingFeedReady: 'Your personalized feed is now live.',
      appUpdated: 'New features and improvements updated.',
      reload: 'Reload'
    }
  }
};

let currentLanguage = 'ko';
const listeners = new Set();

// 초기 언어 감지
export function initLanguage() {
  try {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_LANG);
      if (saved && (saved === 'ko' || saved === 'en')) {
        currentLanguage = saved;
      } else if (typeof navigator !== 'undefined') {
        const browserLang = (navigator.language || '').toLowerCase();
        currentLanguage = browserLang.startsWith('ko') ? 'ko' : 'en';
      }
    }
  } catch (e) {
    currentLanguage = 'ko';
  }
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = currentLanguage;
  }
  return currentLanguage;
}

export function getLanguage() {
  return currentLanguage;
}

export function setLanguage(lang) {
  if (lang !== 'ko' && lang !== 'en') lang = 'ko';
  currentLanguage = lang;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_LANG, lang);
    }
  } catch (e) {}
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang;
  }
  listeners.forEach(cb => {
    try { cb(currentLanguage); } catch (e) { console.error(e); }
  });
  return currentLanguage;
}

export function toggleLanguage() {
  const next = currentLanguage === 'ko' ? 'en' : 'ko';
  return setLanguage(next);
}

export function onLanguageChange(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

// 번역 문자열 조회 헬퍼 (dot notation 지원 e.g. 'feed.all')
export function t(keyPath, params = {}) {
  const dict = TRANSLATIONS[currentLanguage] || TRANSLATIONS.ko;
  const parts = keyPath.split('.');
  let current = dict;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      // fallback to ko
      let fb = TRANSLATIONS.ko;
      for (const p of parts) {
        if (fb && typeof fb === 'object' && p in fb) {
          fb = fb[p];
        } else {
          return keyPath;
        }
      }
      current = fb;
      break;
    }
  }

  if (typeof current !== 'string') {
    return keyPath;
  }

  // 템플릿 치환 {category}, {count} 등
  let result = current;
  for (const [k, v] of Object.entries(params)) {
    result = result.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
  }
  return result;
}

// DOM 내 data-i18n 속성 자동 번역
export function translateDOM(root = document) {
  if (!root) return;

  // 1. TextContent
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (key) {
      el.innerHTML = t(key);
    }
  });

  // 2. Placeholder
  root.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (key) {
      el.placeholder = t(key);
    }
  });

  // 3. Title
  root.querySelectorAll('[data-i18n-title]').forEach((el) => {
    const key = el.dataset.i18nTitle;
    if (key) {
      el.title = t(key);
    }
  });

  // 4. Aria-Label
  root.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const key = el.dataset.i18nAria;
    if (key) {
      el.setAttribute('aria-label', t(key));
    }
  });

  // 5. 언어 토글 버튼 라벨 갱신
  const langLabelEl = document.getElementById('currentLangLabel');
  if (langLabelEl) {
    langLabelEl.textContent = currentLanguage.toUpperCase();
  }
}
