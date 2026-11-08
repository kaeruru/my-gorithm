// ==========================================================================
// 맘고리즘 사용자 행동 & 알고리즘 데이터 텔레메트리 트래커 (tracker.js)
// 29개 핵심 지표 (개인정보, 행동, 알고리즘 설정, 보관함, 접속 패턴, 기기·환경) 수집
// ==========================================================================
import { db, auth, isFirebaseConfigured } from './firebase.js';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';

const STORAGE_KEYS = {
  USER_ID: 'mamgorithm_telemetry_uid',
  PROFILE: 'mamgorithm_telemetry_profile',
  BEHAVIOR: 'mamgorithm_telemetry_behavior',
  ALGO_STATS: 'mamgorithm_telemetry_algo',
  VISITS: 'mamgorithm_telemetry_visits'
};

// 1. 기기 및 환경 감지 유틸리티
export function detectEnvironment() {
  const ua = navigator.userAgent || '';
  let deviceType = 'PC';
  if (/iPad|Tablet/i.test(ua) || (navigator.maxTouchPoints > 1 && window.innerWidth >= 768)) {
    deviceType = '태블릿';
  } else if (/Mobi|Android|iPhone/i.test(ua)) {
    deviceType = '모바일';
  }

  let browser = '기타';
  if (/Whale/i.test(ua)) browser = 'Naver Whale';
  else if (/SamsungBrowser/i.test(ua)) browser = 'Samsung Internet';
  else if (/Edg/i.test(ua)) browser = 'Microsoft Edge';
  else if (/Chrome/i.test(ua)) browser = 'Google Chrome';
  else if (/Safari/i.test(ua)) browser = 'Apple Safari';
  else if (/Firefox/i.test(ua)) browser = 'Mozilla Firefox';

  const isDark = document.documentElement.dataset.systemTheme === 'dark' ||
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return {
    deviceType,
    browser,
    colorTheme: isDark ? '다크 모드' : '라이트 모드',
    language: navigator.language || 'ko-KR'
  };
}

// 2. 가입/유입 경로 감지
export function detectSignupSource() {
  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get('utm_source');
  const utmMedium = params.get('utm_medium');
  if (utmSource) {
    return utmMedium ? `${utmSource} (${utmMedium})` : utmSource;
  }
  const ref = document.referrer;
  if (!ref) return '직접 접속 (Direct / PWA)';
  if (ref.includes('google')) return '구글 검색 (Google)';
  if (ref.includes('naver')) return '네이버 (Naver)';
  if (ref.includes('kakao') || ref.includes('kakaotalk')) return '카카오톡 공유';
  if (ref.includes('instagram')) return '인스타그램 (Instagram)';
  if (ref.includes('twitter') || ref.includes('x.com')) return 'X (트위터)';
  try {
    return new URL(ref).hostname;
  } catch (e) {
    return '기타 웹사이트';
  }
}

// 3. 텔레메트리 상태 저장소 (로컬 미러링 + 클라우드 싱크)
class TelemetryTracker {
  constructor() {
    this.sessionStartTime = Date.now();
    this.lastActiveTime = Date.now();
    this.totalDwellSec = 0;
    this.isTabActive = true;

    // 카드별 체류 시간 맵 (cardId -> seconds)
    this.cardDwellMap = {};
    this.cardImpressions = {};
    this.activeCardTimers = {};

    // 인앱 리더 열람 시간
    this.currentReaderItem = null;
    this.readerStartTime = null;
    this.totalReaderDwellSec = 0;

    // 카드 클릭 수
    this.cardClickCount = 0;

    // 스크롤 속도 측정
    this.lastScrollY = window.scrollY;
    this.lastScrollTime = Date.now();
    this.scrollSpeedSamples = [];

    // 알고리즘 설정 통계
    this.tuneCount = 0;
    this.lastTuneTime = Date.now();
    this.mixerHistory = [];

    // 보관함 재열람 카운트
    this.reopenedBookmarkCount = 0;

    // 클라우드 동기화 디바운스 타이머
    this.syncTimer = null;

    this.init();
  }

  init() {
    this.initSession();
    this.setupActiveTimeTracker();
    this.setupScrollSpeedTracker();
    this.setupCardIntersectionObserver();

    // 30초마다 정기적으로 클라우드 동기화
    setInterval(() => {
      this.syncToFirestore();
    }, 30000);

    // 페이지 이탈 시 즉시 동기화
    window.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.isTabActive = false;
        this.syncToFirestore(true);
      } else {
        this.isTabActive = true;
        this.lastActiveTime = Date.now();
      }
    });
    window.addEventListener('pagehide', () => this.syncToFirestore(true));
  }

  initSession() {
    // 방문 횟수 증가
    let visits = parseInt(localStorage.getItem(STORAGE_KEYS.VISITS) || '0', 10);
    visits += 1;
    localStorage.setItem(STORAGE_KEYS.VISITS, visits.toString());
    this.visitCount = visits;

    // 가입일 기록 (최초 접속 시점)
    if (!localStorage.getItem('mamgorithm_first_visit_date')) {
      localStorage.setItem('mamgorithm_first_visit_date', new Date().toISOString());
    }

    // 로컬 저장된 행동 누적치 복원
    try {
      const savedBehavior = JSON.parse(localStorage.getItem(STORAGE_KEYS.BEHAVIOR) || '{}');
      this.totalDwellSec = savedBehavior.totalAppDwellSec || 0;
      this.cardClickCount = savedBehavior.cardClickCount || 0;
      this.totalReaderDwellSec = savedBehavior.readerDwellSec || 0;
      this.cardDwellMap = savedBehavior.cardDwellMap || {};
      this.reopenedBookmarkCount = savedBehavior.reopenedBookmarkCount || 0;

      const savedAlgo = JSON.parse(localStorage.getItem(STORAGE_KEYS.ALGO_STATS) || '{}');
      this.tuneCount = savedAlgo.tuneCount || 0;
      this.lastTuneTime = savedAlgo.lastTuneTime || Date.now();
      this.mixerHistory = savedAlgo.mixerHistory || [];
    } catch (e) {}
  }

  // 앱 전체 체류 시간 (비활성 탭 제외 정확한 초 계산)
  setupActiveTimeTracker() {
    setInterval(() => {
      if (this.isTabActive && !document.hidden) {
        this.totalDwellSec += 1;
      }
    }, 1000);
  }

  // 스크롤 속도 측정 (px/초)
  setupScrollSpeedTracker() {
    window.addEventListener('scroll', () => {
      const now = Date.now();
      const dt = (now - this.lastScrollTime) / 1000;
      if (dt > 0.05) {
        const dy = Math.abs(window.scrollY - this.lastScrollY);
        const speed = Math.round(dy / dt);
        this.scrollSpeedSamples.push(speed);
        if (this.scrollSpeedSamples.length > 20) this.scrollSpeedSamples.shift();
        this.lastScrollY = window.scrollY;
        this.lastScrollTime = now;
      }
    }, { passive: true });
  }

  getAverageScrollSpeed() {
    if (this.scrollSpeedSamples.length === 0) return 0;
    const sum = this.scrollSpeedSamples.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.scrollSpeedSamples.length);
  }

  // 카드별 체류 시간 관찰자 (IntersectionObserver)
  setupCardIntersectionObserver() {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    this.cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const cardId = entry.target.dataset.id;
        const category = entry.target.dataset.category;
        if (!cardId) return;

        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          // 화면에 50% 이상 노출 시작: 타이머 가동
          this.activeCardTimers[cardId] = {
            start: Date.now(),
            category
          };
          this.cardImpressions[cardId] = (this.cardImpressions[cardId] || 0) + 1;
        } else {
          // 화면 밖으로 이탈: 체류 시간 합산
          if (this.activeCardTimers[cardId]) {
            const elapsedSec = (Date.now() - this.activeCardTimers[cardId].start) / 1000;
            if (elapsedSec > 0.5 && elapsedSec < 120) { // 비정상 체류(2분 초과) 제외
              this.cardDwellMap[cardId] = (this.cardDwellMap[cardId] || 0) + Math.round(elapsedSec * 10) / 10;
            }
            delete this.activeCardTimers[cardId];
          }
        }
      });
    }, { threshold: [0.5] });
  }

  observeFeedCards() {
    if (!this.cardObserver) return;
    const cards = document.querySelectorAll('.content-feed-card[data-id]');
    cards.forEach((card) => this.cardObserver.observe(card));
  }

  // 1) 카드 클릭 이벤트 기록
  trackCardClick(item, isFromBookmark = false) {
    this.cardClickCount += 1;
    if (isFromBookmark) {
      this.reopenedBookmarkCount += 1;
    }
    this.scheduleSync();
  }

  // 2) 인앱 리더 모달 열림
  trackReaderOpen(item) {
    this.currentReaderItem = item;
    this.readerStartTime = Date.now();
  }

  // 3) 인앱 리더 모달 닫힘
  trackReaderClose() {
    if (this.readerStartTime && this.currentReaderItem) {
      const elapsed = (Date.now() - this.readerStartTime) / 1000;
      if (elapsed > 1 && elapsed < 600) { // 10분 이내 유효 독서 시간
        this.totalReaderDwellSec += Math.round(elapsed);
        const cardId = this.currentReaderItem.id;
        this.cardDwellMap[cardId] = (this.cardDwellMap[cardId] || 0) + Math.round(elapsed);
      }
    }
    this.currentReaderItem = null;
    this.readerStartTime = null;
    this.scheduleSync();
  }

  // 4) 믹서 가중치 변경 기록
  trackMixerChange(prevWeights, newWeights) {
    this.tuneCount += 1;
    const now = Date.now();
    const durationMinutes = Math.round((now - this.lastTuneTime) / 60000);
    this.lastTuneTime = now;

    const zeroCats = Object.keys(newWeights).filter(c => newWeights[c] === 0);
    const sorted = Object.entries(newWeights).sort((a, b) => b[1] - a[1]);
    const topCategory = sorted[0] ? sorted[0][0] : 'study';

    this.mixerHistory.unshift({
      timestamp: new Date().toISOString(),
      prevWeights: { ...prevWeights },
      newWeights: { ...newWeights },
      durationMinutes,
      topCategory,
      zeroCategories: zeroCats
    });

    if (this.mixerHistory.length > 20) this.mixerHistory.pop();

    localStorage.setItem(STORAGE_KEYS.ALGO_STATS, JSON.stringify({
      tuneCount: this.tuneCount,
      lastTuneTime: this.lastTuneTime,
      mixerHistory: this.mixerHistory
    }));

    this.scheduleSync();
  }

  // 5) 보관함 통계 분석
  calculateBookmarkStats(savedIds, contentPool) {
    const totalCount = savedIds.size;
    if (totalCount === 0) {
      return {
        bookmarkCount: 0,
        bookmarkCategoryRatio: { study: 0, tech: 0, culture: 0, hobby: 0 },
        bookmarkMediaTypeRatio: { article: 0, video: 0 },
        reopenedCount: this.reopenedBookmarkCount,
        bookmarkReopenedRatio: 0
      };
    }

    const catCounts = { study: 0, tech: 0, culture: 0, hobby: 0 };
    const mediaCounts = { article: 0, video: 0 };

    savedIds.forEach(id => {
      const item = contentPool.find(c => c.id === id);
      if (item) {
        if (catCounts[item.category] !== undefined) catCounts[item.category] += 1;
        const type = item.type === 'video' ? 'video' : 'article';
        mediaCounts[type] = (mediaCounts[type] || 0) + 1;
      }
    });

    const categoryRatio = {};
    for (const c of ['study', 'tech', 'culture', 'hobby']) {
      categoryRatio[c] = Math.round((catCounts[c] / totalCount) * 100);
    }

    const mediaRatio = {
      article: Math.round((mediaCounts.article / totalCount) * 100),
      video: Math.round((mediaCounts.video / totalCount) * 100)
    };

    const reopenedRatio = Math.min(100, Math.round((this.reopenedBookmarkCount / totalCount) * 100));

    return {
      bookmarkCount: totalCount,
      bookmarkCategoryRatio: categoryRatio,
      bookmarkMediaTypeRatio: mediaRatio,
      reopenedCount: this.reopenedBookmarkCount,
      bookmarkReopenedRatio: reopenedRatio
    };
  }

  // 6) 실제 많이 본 분야 비율 계산 (체류 시간 기반)
  calculateActualConsumedCategoryRatio(contentPool) {
    const catDwell = { study: 0, tech: 0, culture: 0, hobby: 0 };
    let totalDwell = 0;

    for (const [cardId, sec] of Object.entries(this.cardDwellMap)) {
      const item = contentPool.find(c => c.id === cardId);
      if (item && catDwell[item.category] !== undefined) {
        catDwell[item.category] += sec;
        totalDwell += sec;
      }
    }

    if (totalDwell === 0) {
      return { study: 25, tech: 25, culture: 25, hobby: 25 };
    }

    return {
      study: Math.round((catDwell.study / totalDwell) * 100),
      tech: Math.round((catDwell.tech / totalDwell) * 100),
      culture: Math.round((catDwell.culture / totalDwell) * 100),
      hobby: Math.round((catDwell.hobby / totalDwell) * 100)
    };
  }

  scheduleSync() {
    if (this.syncTimer) clearTimeout(this.syncTimer);
    this.syncTimer = setTimeout(() => {
      this.syncToFirestore();
    }, 2500);
  }

  // 7) 29개 전체 지표 스냅샷 생성
  buildFullTelemetrySnapshot(state, contentPool) {
    const env = detectEnvironment();
    const signupSource = detectSignupSource();
    const now = new Date();
    const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

    // 알고리즘 지표
    const weights = state?.weights || { study: 50, tech: 50, culture: 50, hobby: 50 };
    const zeroCats = Object.keys(weights).filter(c => weights[c] === 0);
    const sorted = Object.entries(weights).sort((a, b) => b[1] - a[1]);
    const topCat = sorted[0] ? sorted[0][0] : 'study';
    const durationMinutesSinceLastTune = Math.round((Date.now() - this.lastTuneTime) / 60000);

    // 행동 지표
    const actualConsumed = this.calculateActualConsumedCategoryRatio(contentPool || []);
    const avgScrollSpeed = this.getAverageScrollSpeed();

    // 보관함 지표
    const bookmarkStats = this.calculateBookmarkStats(state?.savedIds || new Set(), contentPool || []);

    const uid = auth?.currentUser?.uid || localStorage.getItem(STORAGE_KEYS.USER_ID) || 'anonymous-user';
    const email = auth?.currentUser?.email || (auth?.currentUser?.isAnonymous ? '비회원 (익명 UID)' : '미로그인');

    return {
      // 1. 개인정보
      personalInfo: {
        userId: uid,
        email: email,
        age: localStorage.getItem('mamgorithm_user_age') || null,
        gender: localStorage.getItem('mamgorithm_user_gender') || null,
        signupSource: signupSource,
        createdAt: localStorage.getItem('mamgorithm_first_visit_date') || now.toISOString()
      },

      // 2. 행동
      behavior: {
        totalAppDwellSec: this.totalDwellSec,
        cardDwellMap: this.cardDwellMap,
        cardClickCount: this.cardClickCount,
        scrollVelocity: `${avgScrollSpeed} px/s`,
        readerDwellSec: this.totalReaderDwellSec,
        actualConsumedCategoryRatio: actualConsumed
      },

      // 3. 알고리즘 설정
      algorithmSettings: {
        currentWeights: weights,
        tuneCount: this.tuneCount,
        zeroCategories: zeroCats,
        topCategory: topCat,
        durationMinutesSinceLastTune: durationMinutesSinceLastTune,
        history: this.mixerHistory.slice(0, 10)
      },

      // 4. 보관함
      bookmarks: bookmarkStats,

      // 5. 접속 패턴
      accessPattern: {
        visitCount: this.visitCount,
        dayOfWeek: days[now.getDay()],
        hourOfDay: now.getHours(),
        lastActiveAt: now.toISOString()
      },

      // 6. 기기·환경
      environment: env,

      // 메타
      updatedAt: now.toISOString()
    };
  }

  // 8) Firestore로 29개 지표 실시간 적재
  async syncToFirestore(isBeacon = false) {
    try {
      // 현재 앱 전역 state 및 콘텐츠 풀 참조
      const stateRef = window.__mamgorithm_state;
      const poolRef = window.__mamgorithm_pool;

      const snapshot = this.buildFullTelemetrySnapshot(stateRef, poolRef);

      // 로컬 스토리지에 캐시 백업
      localStorage.setItem(STORAGE_KEYS.BEHAVIOR, JSON.stringify({
        totalAppDwellSec: this.totalDwellSec,
        cardClickCount: this.cardClickCount,
        readerDwellSec: this.totalReaderDwellSec,
        cardDwellMap: this.cardDwellMap,
        reopenedBookmarkCount: this.reopenedBookmarkCount
      }));

      // Firebase Firestore 연결이 가능할 때 실시간 클라우드 적재
      if (isFirebaseConfigured() && db) {
        const uid = auth?.currentUser?.uid || localStorage.getItem(STORAGE_KEYS.USER_ID);
        if (uid) {
          const userDocRef = doc(db, 'users', uid);
          await setDoc(userDocRef, snapshot, { merge: true });
          console.log('📡 [Telemetry] 29개 핵심 지표가 Firestore에 성공적으로 적재되었습니다.');
        }
      }
    } catch (err) {
      console.warn('📡 [Telemetry] 클라우드 동기화 대기 (로컬 캐시 보관):', err.message);
    }
  }
}

// 싱글톤 인스턴스 export
export const tracker = new TelemetryTracker();

// 콘솔 디버깅/확인용 전역 함수 등록
if (typeof window !== 'undefined') {
  window.getTelemetryData = () => {
    const stateRef = window.__mamgorithm_state;
    const poolRef = window.__mamgorithm_pool;
    const snap = tracker.buildFullTelemetrySnapshot(stateRef, poolRef);
    console.table({
      '아이디': snap.personalInfo.userId,
      '이메일': snap.personalInfo.email,
      '가입경로': snap.personalInfo.signupSource,
      '총 체류시간': `${snap.behavior.totalAppDwellSec}초`,
      '카드 클릭수': snap.behavior.cardClickCount,
      '인앱 리더 열람': `${snap.behavior.readerDwellSec}초`,
      '스크롤 속도': snap.behavior.scrollVelocity,
      '실제 소비 분야': JSON.stringify(snap.behavior.actualConsumedCategoryRatio),
      '현재 믹서 설정': JSON.stringify(snap.algorithmSettings.currentWeights),
      '0% 배제 분야': JSON.stringify(snap.algorithmSettings.zeroCategories),
      '1순위 분야': snap.algorithmSettings.topCategory,
      '설정 변경 횟수': snap.algorithmSettings.tuneCount,
      '현재 보관수': snap.bookmarks.bookmarkCount,
      '보관 후 재열람률': `${snap.bookmarks.bookmarkReopenedRatio}%`,
      '방문 횟수': snap.accessPattern.visitCount,
      '접속 요일': snap.accessPattern.dayOfWeek,
      '접속 시간대': `${snap.accessPattern.hourOfDay}시`,
      '기기 종류': snap.environment.deviceType,
      '브라우저': snap.environment.browser,
      '테마': snap.environment.colorTheme,
      '언어': snap.environment.language
    });
    return snap;
  };
}
