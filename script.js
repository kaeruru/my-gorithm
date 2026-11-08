// ==========================================================================
// 맘고리즘 (내맘대로 알고리즘) - Modern Product Script with Mini Dock & Recipe Sharing
// ==========================================================================
import { CATEGORY_META, LEVEL_LABELS, getLevelDescription, CONTENT_DATA, PRESET_MODES, normalizeContentCard } from './data.js';
import { getLocalizedCard } from './articles_en.js';
import {
  isFirebaseConfigured,
  currentUser,
  saveUserSettingsToCloud,
  loadUserSettingsFromCloud,
  loginWithGoogle,
  logoutUser,
  onAuthStatusChange
} from './firebase.js';
import { tracker } from './tracker.js';
import {
  initLanguage,
  getLanguage,
  setLanguage,
  toggleLanguage,
  t,
  translateDOM,
  onLanguageChange
} from './i18n.js';

const STORAGE_KEYS = {
  WEIGHTS: 'mamgorithm_weights_v2',
  SAVED_IDS: 'mamgorithm_saved_v2',
  ONBOARDED: 'mamgorithm_onboarded_v2',
  COACHMARK_SEEN: 'mamgorithm_coachmark_seen',
  VISIT_COUNT: 'mamgorithm_visit_count_v1',
  CUSTOM_CARDS: 'mamgorithm_custom_cards_v1',
  INTRO_SEEN: 'mamgorithm_intro_seen_v1'
};

// 애플리케이션 상태 (0~100% 1% 단위 가중치 스케일)
const state = {
  weights: {
    study: 50,
    tech: 50,
    culture: 50,
    hobby: 50
  },
  currentTab: 'viewFeed',
  contentType: 'all', // 'all' | 'video' | 'article'
  feedSize: 12,
  shuffleSeed: 0,
  savedIds: new Set(),
  customCards: [],
  isDockExpanded: false
};

// 현재 활성 콘텐츠 풀 (사용자 추가 카드 + 기본 카드 풀)
function getActiveContentPool() {
  const pool = [...state.customCards, ...CONTENT_DATA];
  if (typeof window !== 'undefined') {
    window.__mamgorithm_pool = pool;
    window.__mamgorithm_state = state;
  }
  return pool;
}

// ==========================================================================
// 크로스 플랫폼 하이브리드 햅틱 엔진 (Android 물리 진동 + iOS 스위치/서브베이스 펄스)
// QR 웹 접속 환경(안드로이드 폰/태블릿, 아이폰/아이패드 사파리) 전 기기 대응
// ==========================================================================
let hapticAudioCtx = null;
let lastHapticTimestamp = 0;

function ensureHapticAudioContext() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!hapticAudioCtx) {
      hapticAudioCtx = new AudioCtx();
    }
    if (hapticAudioCtx.state === 'suspended') {
      hapticAudioCtx.resume().catch(() => {});
    }
    return hapticAudioCtx;
  } catch (e) {
    return null;
  }
}

// 첫 사용자 터치 시 오디오 컨텍스트 잠금 해제
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    ensureHapticAudioContext();
  };
  window.addEventListener('pointerdown', unlockAudio, { passive: true, once: true });
  window.addEventListener('touchstart', unlockAudio, { passive: true, once: true });
}

function playTactileAudioPulse(type = 'light') {
  try {
    const ctx = ensureHapticAudioContext();
    if (!ctx || ctx.state !== 'running') return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    if (type === 'light') {
      osc.frequency.setValueAtTime(85, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.012);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);
      osc.start(now);
      osc.stop(now + 0.013);
    } else if (type === 'medium') {
      osc.frequency.setValueAtTime(105, now);
      osc.frequency.exponentialRampToValueAtTime(38, now + 0.018);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);
      osc.start(now);
      osc.stop(now + 0.019);
    } else if (type === 'success') {
      osc.frequency.setValueAtTime(95, now);
      osc.frequency.exponentialRampToValueAtTime(130, now + 0.025);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.026);
      osc.start(now);
      osc.stop(now + 0.027);
    } else {
      osc.frequency.setValueAtTime(75, now);
      osc.frequency.exponentialRampToValueAtTime(28, now + 0.022);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.022);
      osc.start(now);
      osc.stop(now + 0.023);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
  } catch (e) {}
}

function triggerHaptic(type = 'light') {
  const now = performance.now();
  // 연속 슬라이더 드래그 시 과도한 진동 큐 적체 방지 (최소 18ms 간격)
  if (type === 'light' && now - lastHapticTimestamp < 18) {
    return;
  }
  lastHapticTimestamp = now;

  let vibrated = false;
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    try {
      switch (type) {
        case 'light':
          vibrated = navigator.vibrate(12);
          break;
        case 'medium':
          vibrated = navigator.vibrate(25);
          break;
        case 'success':
          vibrated = navigator.vibrate([18, 35, 24]);
          break;
        case 'delete':
          vibrated = navigator.vibrate([24, 40, 18]);
          break;
        default:
          vibrated = navigator.vibrate(15);
      }
    } catch (e) {}
  }

  // iOS Safari 17.4+ 히든 스위치 탭틱 트리거 (medium/success/delete 액션 시)
  if (!vibrated && type !== 'light') {
    try {
      const iosLabel = document.getElementById('iosHapticLabel');
      if (iosLabel) iosLabel.click();
    } catch (e) {}
  }

  // 모든 기기(특히 iOS/iPadOS)에서 즉각적인 촉각 펄스 감각 보강
  playTactileAudioPulse(type);
}

let introFinished = false;
let introSafetyTimer = null;

// ==========================================================================
// 유튜브 스타일 퀵 브랜드 스플래시 인트로 (여유롭고 품격 있는 1.5초 숏폼 모션)
// 매번 사이트 재접속 시 기분 좋은 브랜드 아이덴티티를 온전히 전달 (라이트/다크 테마 완벽 동기화)
// ==========================================================================
function runQuickBrandSplash(onComplete) {
  const splash = document.getElementById('quickBrandSplash');
  if (!splash) {
    if (typeof onComplete === 'function') onComplete();
    return;
  }

  // 기본 라이트 테마 원칙 (사용자가 설정에서 명시적으로 다크 테마를 선택했을 때만 다크 적용)
  const isDark = localStorage.getItem('mamgorithm_theme_v2') === 'dark';
  splash.classList.toggle('theme-dark', isDark);
  splash.classList.toggle('theme-light', !isDark);

  let dismissed = false;
  const dismiss = () => {
    if (dismissed) return;
    dismissed = true;
    splash.classList.add('splash-dismissed');
    setTimeout(() => {
      splash.style.display = 'none';
      if (typeof onComplete === 'function') onComplete();
    }, 240);
  };

  // 60ms 경쾌한 촉각/청각 피드백 펄스
  setTimeout(() => {
    try {
      playTactileAudioPulse('light');
    } catch (e) {}
  }, 60);

  // 약 0.72초 동안 빠르고 우아한 마그네틱 결합 모션 연출 후 즉시 진입 (터치 시 즉시 스킵)
  const timer = setTimeout(dismiss, 720);

  // 화면 터치/클릭 시 언제든 즉시 스킵 가능
  splash.addEventListener('click', () => {
    clearTimeout(timer);
    dismiss();
  }, { once: true });
}

// ==========================================================================
// 첫 접속 사용자 전용: 초미니멀 시작 게이트 & 사운드 온 소개 영상 경험 (무조건 라이트 테마 기본)
// ==========================================================================
function setupFirstVisitIntroExperience(onComplete) {
  const overlay = document.getElementById('introSplashOverlay');
  const startGate = document.getElementById('introStartGate');
  const videoContainer = document.getElementById('introVideoContainer');
  const video = document.getElementById('introVideo');
  const btnStartExp = document.getElementById('btnStartExperience');
  const btnStartSkip = document.getElementById('btnStartSkipToFeed');
  const btnSkip = document.getElementById('btnIntroSkip');
  const btnMute = document.getElementById('btnIntroMute');
  const textMute = document.getElementById('textIntroMute');
  const quickSplash = document.getElementById('quickBrandSplash');

  // 첫 접속 시에는 퀵 브랜드 스플래시 완전 숨김
  if (quickSplash) {
    quickSplash.style.display = 'none';
  }

  if (!overlay || !startGate) {
    if (typeof onComplete === 'function') onComplete();
    return;
  }

  // 첫 접속은 무조건 라이트 테마 기본 (기기 설정 따르지 않음)
  overlay.classList.remove('theme-dark');
  overlay.classList.add('theme-light');
  overlay.classList.remove('hidden');
  overlay.style.display = 'flex';

  // 시작 게이트 노출 및 비디오 컨테이너 숨김
  startGate.classList.remove('hidden', 'fade-out');
  startGate.style.display = 'flex';
  if (videoContainer) {
    videoContainer.classList.add('hidden');
    videoContainer.style.display = 'none';
  }

  introFinished = false;
  if (introSafetyTimer) clearTimeout(introSafetyTimer);

  const finishIntro = () => {
    if (introFinished) return;
    introFinished = true;
    if (introSafetyTimer) clearTimeout(introSafetyTimer);

    // 첫 접속 인트로 시청 완료 기록
    localStorage.setItem(STORAGE_KEYS.INTRO_SEEN, 'true');
    document.documentElement.classList.remove('is-first-visit');
    document.documentElement.classList.add('is-returning-user');

    if (video) {
      try {
        video.pause();
      } catch (e) {}
    }

    overlay.classList.add('hidden');
    setTimeout(() => {
      overlay.style.display = 'none';
      if (typeof onComplete === 'function') onComplete();
    }, 350);
  };

  // 1) "사운드와 함께 소개 영상 보기" 버튼 클릭
  if (btnStartExp) {
    btnStartExp.onclick = () => {
      triggerHaptic('medium');
      startGate.classList.add('fade-out');

      setTimeout(() => {
        startGate.classList.add('hidden');
        startGate.style.display = 'none';

        if (videoContainer && video) {
          videoContainer.classList.remove('hidden');
          videoContainer.style.display = 'flex';

          // 기본 라이트 테마 원칙: 무조건 라이트 테마 인트로 영상 재생
          const targetSrc = '/videos/intro_algo_light.mp4';
          video.src = targetSrc;
          try {
            video.currentTime = 0;
          } catch (e) {}
          video.load();

          video.muted = false;
          video.volume = 1.0;
          if (textMute) textMute.textContent = t('intro.soundOn');

          video.play().catch(() => {
            // 브라우저 정책상 실패 시 음소거 재생 시도
            video.muted = true;
            if (textMute) textMute.textContent = t('intro.soundOff');
            video.play().catch(() => finishIntro());
          });

          video.onended = finishIntro;
        } else {
          finishIntro();
        }
      }, 250);
    };
  }

  // 2) "소개 영상 건너뛰고 바로 시작하기" 버튼 클릭
  if (btnStartSkip) {
    btnStartSkip.onclick = () => {
      triggerHaptic('light');
      finishIntro();
    };
  }

  // 비디오 컨트롤러 이벤트 (건너뛰기, 음소거 토글)
  if (btnSkip) {
    btnSkip.onclick = (e) => {
      e.stopPropagation();
      triggerHaptic('light');
      finishIntro();
    };
  }

  if (btnMute && video) {
    btnMute.onclick = (e) => {
      e.stopPropagation();
      video.muted = !video.muted;
      triggerHaptic('light');
      if (textMute) textMute.textContent = video.muted ? t('intro.soundOff') : t('intro.soundOn');
    };
  }

  // 28초 안전 타이머 (비디오 로딩 지연 대응)
  introSafetyTimer = setTimeout(() => {
    if (!introFinished) finishIntro();
  }, 28000);
}

// ==========================================================================
// 인트로 동영상 다시보기 모달 제어 (설정 탭 등에서 사용자가 수동 클릭 시 재생)
// ==========================================================================
function setupIntroVideoModal() {
  const overlay = document.getElementById('introSplashOverlay');
  const startGate = document.getElementById('introStartGate');
  const videoContainer = document.getElementById('introVideoContainer');
  const video = document.getElementById('introVideo');
  const btnSkip = document.getElementById('btnIntroSkip');
  const btnMute = document.getElementById('btnIntroMute');
  const textMute = document.getElementById('textIntroMute');

  if (!overlay || !video) return;

  const startPlayback = (targetTheme = 'light') => {
    introFinished = false;
    if (introSafetyTimer) clearTimeout(introSafetyTimer);

    const isDark = targetTheme === 'dark';
    overlay.classList.toggle('theme-dark', isDark);
    overlay.classList.toggle('theme-light', !isDark);

    const targetSrc = isDark ? '/videos/intro_algo_dark.mp4' : '/videos/intro_algo_light.mp4';
    video.src = targetSrc;
    try {
      video.currentTime = 0;
    } catch (e) {}
    video.load();

    video.muted = false;
    video.volume = 1.0;
    if (textMute) textMute.textContent = t('intro.soundOn');

    if (startGate) {
      startGate.classList.add('hidden');
      startGate.style.display = 'none';
    }
    if (videoContainer) {
      videoContainer.classList.remove('hidden');
      videoContainer.style.display = 'flex';
    }

    video.play().catch(() => {
      video.muted = true;
      if (textMute) textMute.textContent = t('intro.soundOff');
      video.play().catch(() => finishIntroModal());
    });

    const finishIntroModal = () => {
      if (introFinished) return;
      introFinished = true;
      if (introSafetyTimer) clearTimeout(introSafetyTimer);

      try {
        video.pause();
      } catch (e) {}

      overlay.classList.add('hidden');
      overlay.classList.remove('force-show');
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 350);
    };

    video.onended = finishIntroModal;

    if (btnSkip) {
      btnSkip.onclick = (e) => {
        e.stopPropagation();
        triggerHaptic('light');
        finishIntroModal();
      };
    }

    if (btnMute) {
      btnMute.onclick = (e) => {
        e.stopPropagation();
        video.muted = !video.muted;
        triggerHaptic('light');
        if (textMute) textMute.textContent = video.muted ? t('intro.soundOff') : t('intro.soundOn');
      };
    }

    introSafetyTimer = setTimeout(() => {
      if (!introFinished) finishIntroModal();
    }, 24000);
  };

  // 외부(내 알고리즘 탭 등)에서 원하는 테마 인트로를 바로 감상할 수 있도록 전역 함수 등록
  window.playIntroWithTheme = (theme) => {
    overlay.classList.add('force-show');
    overlay.classList.remove('hidden');
    overlay.style.display = 'flex';
    startPlayback(theme);
  };
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  translateDOM();
  loadSavedPreferences();
  checkRecipeFromUrl(); // URL 공유 레시피 파라미터 감지 (?s=50&t=50&c=50&h=50)
  bindUIEvents();
  const initialSkeletonCount = window.innerWidth >= 768 ? 4 : 3;
  renderAllViews({ withSkeleton: true, delay: 280, skeletonCount: initialSkeletonCount });

  // 수동 다시보기 모달 리스너 준비
  setupIntroVideoModal();

  // 인트로 종료 후 온보딩 / 로그인 / 코치마크 진행 핸들러
  const afterIntroProceed = () => {
    const hasOnboarded = localStorage.getItem(STORAGE_KEYS.ONBOARDED);
    const hasDismissedAuth = sessionStorage.getItem('mamgorithm_auth_dismissed') === 'true';
    const isUserLoggedIn = currentUser && !currentUser.isAnonymous;

    // 첫 방문자 중 미로그인 상태이고 아직 건너뛰기를 누르지 않았다면 모던 로그인 모달 먼저 제시
    if (!hasOnboarded && !isUserLoggedIn && !hasDismissedAuth) {
      openAuthModal({
        isFirstVisit: true,
        onDismiss: () => {
          openOnboarding();
        }
      });
      return;
    }

    if (!hasOnboarded) {
      openOnboarding();
    } else {
      const hasSeenCoachmark = localStorage.getItem(STORAGE_KEYS.COACHMARK_SEEN);
      if (!hasSeenCoachmark) {
        setTimeout(() => startCoachmarkTour(), 400);
      }
    }
  };

  // 첫 접속 여부 판별
  const hasSeenIntro = localStorage.getItem(STORAGE_KEYS.INTRO_SEEN) === 'true';

  if (!hasSeenIntro) {
    // [첫 접속]: 1초 퀵 애니메이션 대신 세련된 소개 영상 게이트 표시!
    setupFirstVisitIntroExperience(afterIntroProceed);
  } else {
    // [그 후 매 접속]: 소개 영상은 절대 나오지 않고, 1초 미만(0.7초)의 퀵 브랜드 스플래시 애니메이션 매번 실행!
    runQuickBrandSplash(afterIntroProceed);
  }
});

// 로컬 설정 불러오기 (첫 방문 고정 피드 vs 재접속/새로고침 유동 피드 처리)
function loadSavedPreferences() {
  try {
    const savedWeights = localStorage.getItem(STORAGE_KEYS.WEIGHTS);
    if (savedWeights) {
      const parsed = JSON.parse(savedWeights);
      const maxVal = Math.max(...['study', 'tech', 'culture', 'hobby'].map((c) => (typeof parsed[c] === 'number' ? parsed[c] : 0)));
      const isOldScale = maxVal <= 3;

      ['study', 'tech', 'culture', 'hobby'].forEach((cat) => {
        if (typeof parsed[cat] === 'number') {
          if (isOldScale) {
            const scaleMap = { 0: 0, 1: 25, 2: 50, 3: 100 };
            state.weights[cat] = scaleMap[parsed[cat]] ?? 50;
          } else {
            state.weights[cat] = Math.max(0, Math.min(100, Math.round(parsed[cat])));
          }
        }
      });
    }

    const savedBookmarks = localStorage.getItem(STORAGE_KEYS.SAVED_IDS);
    if (savedBookmarks) {
      state.savedIds = new Set(JSON.parse(savedBookmarks));
    }

    const savedCustomCards = localStorage.getItem(STORAGE_KEYS.CUSTOM_CARDS);
    if (savedCustomCards) {
      const parsedCustom = JSON.parse(savedCustomCards);
      if (Array.isArray(parsedCustom)) {
        state.customCards = parsedCustom.map(normalizeContentCard);
      }
    }

    // 첫 접속 시에는 대표 카드 기본 고정(seed = 0), 재접속 및 새로고침 시에는 유동적 셔플 시드 부여
    const visitCount = parseInt(localStorage.getItem(STORAGE_KEYS.VISIT_COUNT) || '0', 10);
    if (visitCount === 0) {
      state.shuffleSeed = 0;
      localStorage.setItem(STORAGE_KEYS.VISIT_COUNT, '1');
    } else {
      state.shuffleSeed = ((Date.now() % 9973) + visitCount * 53) || 1;
      localStorage.setItem(STORAGE_KEYS.VISIT_COUNT, String(visitCount + 1));
    }

    // 브랜드 플랫 라이트 테마 고정 (잔여 클래스 정리)
    document.body.classList.remove('dark-mode', 'apple-glass');
    localStorage.removeItem('mamgorithm_ui_mode_v2');
    localStorage.removeItem('mamgorithm_theme_v2');
  } catch (err) {
    console.warn('설정 불러오기 실패:', err);
  }
}

let previousWeightsForTelemetry = { ...state.weights };
function persistWeights() {
  try {
    tracker.trackMixerChange(previousWeightsForTelemetry, state.weights);
    previousWeightsForTelemetry = { ...state.weights };
    localStorage.setItem(STORAGE_KEYS.WEIGHTS, JSON.stringify(state.weights));
    if (isFirebaseConfigured() && currentUser?.uid) {
      saveUserSettingsToCloud(currentUser.uid, state.weights);
    }
  } catch (err) {}
}

function persistBookmarks() {
  try {
    localStorage.setItem(STORAGE_KEYS.SAVED_IDS, JSON.stringify([...state.savedIds]));
    tracker.scheduleSync();
  } catch (err) {}
}

function persistCustomCards() {
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_CARDS, JSON.stringify(state.customCards));
  } catch (err) {}
}

// ==========================================================================
// 공유된 알고리즘 레시피 URL 파라미터 확인 및 적용
// ==========================================================================
function checkRecipeFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search);
    const s = params.get('s');
    const t = params.get('t');
    const c = params.get('c');
    const h = params.get('h');

    if (s !== null || t !== null || c !== null || h !== null) {
      const parseParam = (val) => {
        if (val === null || isNaN(parseInt(val, 10))) return null;
        let num = parseInt(val, 10);
        if (num <= 3 && !val.includes('0')) {
          const map = { 0: 0, 1: 25, 2: 50, 3: 100 };
          return map[num] ?? num;
        }
        return Math.max(0, Math.min(100, num));
      };

      const studyVal = parseParam(s);
      const techVal = parseParam(t);
      const cultureVal = parseParam(c);
      const hobbyVal = parseParam(h);

      if (studyVal !== null) state.weights.study = studyVal;
      if (techVal !== null) state.weights.tech = techVal;
      if (cultureVal !== null) state.weights.culture = cultureVal;
      if (hobbyVal !== null) state.weights.hobby = hobbyVal;

      persistWeights();
      triggerHaptic('success');
      showToast(t('toast.recipeApplied'));
    }
  } catch (e) {}
}

// 현재 알고리즘 레시피 공유하기
function shareCurrentRecipe() {
  const url = `${window.location.origin}${window.location.pathname}?s=${state.weights.study}&t=${state.weights.tech}&c=${state.weights.culture}&h=${state.weights.hobby}`;
  const shareText = t('toast.shareMsg', {
    study: state.weights.study,
    tech: state.weights.tech,
    culture: state.weights.culture,
    hobby: state.weights.hobby
  });

  if (navigator.share) {
    navigator.share({
      title: t('stats.shareTitle'),
      text: shareText,
      url
    }).then(() => {
      triggerHaptic('success');
    }).catch(() => {});
  } else if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      triggerHaptic('success');
      showToast(t('toast.recipeCopied'));
    }).catch(() => {
      prompt(t('toast.sharePrompt'), url);
    });
  } else {
    prompt(t('toast.sharePrompt'), url);
  }
}

// ==========================================================================
// 핵심 알고리즘: 1% 단위 비율(%) 및 카테고리별 카드 수 정밀 계산 (Largest Remainder)
// ==========================================================================
function calculateAllocation() {
  const categories = ['study', 'tech', 'culture', 'hobby'];
  const totalWeight = categories.reduce((sum, c) => sum + state.weights[c], 0);

  const result = {};
  if (totalWeight === 0) {
    categories.forEach((c) => {
      result[c] = { weight: 0, exactPct: 0, displayPct: 0, cardCount: 0 };
    });
    return { totalWeight: 0, categories: result };
  }

  const targetTotalCards = state.feedSize;
  let allocatedCardsSum = 0;
  let allocatedPctSum = 0;
  const cardRemainders = [];
  const pctRemainders = [];

  categories.forEach((cat) => {
    const w = state.weights[cat];
    const ratio = w / totalWeight;
    const exactPct = ratio * 100;
    const floorPct = Math.floor(exactPct);
    const exactCards = ratio * targetTotalCards;
    const floorCards = Math.floor(exactCards);

    allocatedCardsSum += floorCards;
    allocatedPctSum += floorPct;
    cardRemainders.push({ cat, rem: exactCards - floorCards, weight: w });
    pctRemainders.push({ cat, rem: exactPct - floorPct, weight: w });

    result[cat] = {
      weight: w,
      exactPct,
      displayPct: floorPct,
      cardCount: floorCards
    };
  });

  // 1% 단위 표시 퍼센트 합계가 항상 정확히 100%가 되도록 최대 잔여법 보정
  let remainingPct = 100 - allocatedPctSum;
  pctRemainders
    .filter((r) => r.weight > 0)
    .sort((a, b) => b.rem - a.rem || b.weight - a.weight)
    .forEach((item) => {
      if (remainingPct > 0) {
        result[item.cat].displayPct += 1;
        remainingPct -= 1;
      }
    });

  // 카드 배정 수 합계가 targetTotalCards(12장)가 되도록 최대 잔여법 보정
  let remainingCards = targetTotalCards - allocatedCardsSum;
  cardRemainders
    .filter((r) => r.weight > 0)
    .sort((a, b) => b.rem - a.rem || b.weight - a.weight)
    .forEach((item) => {
      if (remainingCards > 0) {
        result[item.cat].cardCount += 1;
        remainingCards -= 1;
      }
    });

  return { totalWeight, categories: result };
}

function seededShuffle(arr, seed) {
  const list = [...arr];
  if (seed === 0) return list;
  let s = seed;
  for (let i = list.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

function buildFeedList(allocation) {
  if (allocation.totalWeight === 0) return [];

  const activePool = getActiveContentPool();
  const filteredPool = activePool.filter((item) => {
    if (state.contentType === 'all') return true;
    return item.type === state.contentType;
  });

  const buckets = {};
  ['study', 'tech', 'culture', 'hobby'].forEach((cat, catIdx) => {
    const quota = allocation.categories[cat].cardCount;
    if (quota <= 0) {
      buckets[cat] = [];
      return;
    }
    const rawCatItems = filteredPool.filter((item) => item.category === cat);
    // 첫 진입(seed === 0)은 기본 순서 고정, 새로고침/재접속(seed > 0)은 카테고리별 고유 시드로 유동적 셔플
    const catSeed = state.shuffleSeed === 0 ? 0 : state.shuffleSeed + (catIdx + 1) * 131;
    const catItems = seededShuffle(rawCatItems, catSeed);

    const selected = [];
    for (let i = 0; i < quota && catItems.length > 0; i++) {
      selected.push(catItems[i % catItems.length]);
    }
    buckets[cat] = selected;
  });

  // 기본 카테고리 순서: 첫 방문(seed === 0)일 때는 대표 카드가 가장 먼저 보이도록 고정 정렬,
  // 재방문/새로고침(seed > 0)일 때는 동률 카테고리 순서를 시드에 따라 유동적으로 회전
  const baseOrder = ['hobby', 'tech', 'study', 'culture'];
  const rotatedOrder = state.shuffleSeed === 0
    ? baseOrder
    : baseOrder.map((_, idx) => baseOrder[(idx + state.shuffleSeed) % baseOrder.length]);

  const sortedCats = [...rotatedOrder].sort(
    (a, b) => state.weights[b] - state.weights[a]
  );

  const interleaved = [];
  let hasMore = true;
  let idx = 0;
  while (hasMore) {
    hasMore = false;
    for (const cat of sortedCats) {
      if (buckets[cat] && idx < buckets[cat].length) {
        interleaved.push(buckets[cat][idx]);
        hasMore = true;
      }
    }
    idx++;
  }
  return interleaved;
}

// ==========================================================================
// 렌더링 함수들
// ==========================================================================
function renderAllViews(options = {}) {
  const allocation = calculateAllocation();
  renderPresetChips();
  if (options.withSkeleton) {
    renderFeedCardsWithSkeleton(allocation, options.delay || 260, options.onComplete);
  } else {
    renderFeedCards(allocation);
  }
  renderDockMixer(allocation);
  renderStatsView(allocation);
  renderSavedView();
  updateSavedBadge();
  updateCustomCardCountUI();
  updateHeaderAuthUI(currentUser);
}

// 스켈레톤 쉬머 마크업 생성기 (오늘의집/토스 스타일)
function createSkeletonCardMarkup() {
  return `
    <div class="skeleton-card" aria-hidden="true">
      <div class="skeleton-main-box">
        <div class="skeleton-media-wrap skeleton-shimmer">
          <div class="skeleton-badge-overlay"></div>
          <div class="skeleton-duration-overlay"></div>
        </div>
        <div class="skeleton-content-body">
          <div class="skeleton-line skeleton-title-1 skeleton-shimmer"></div>
          <div class="skeleton-line skeleton-title-2 skeleton-shimmer"></div>
          <div class="skeleton-line skeleton-desc skeleton-shimmer"></div>
        </div>
      </div>
      <div class="skeleton-detached-footer skeleton-shimmer"></div>
    </div>
  `;
}

function renderSkeletonCards(container, count = 3) {
  if (!container) return;
  container.innerHTML = Array.from({ length: count }, () => createSkeletonCardMarkup()).join('');
}

let feedTransitionTimer = null;
function renderFeedCardsWithSkeleton(allocation, delay = 260, onComplete = null) {
  const container = document.getElementById('feedCardsList');
  if (!container) return;

  if (feedTransitionTimer) {
    clearTimeout(feedTransitionTimer);
    feedTransitionTimer = null;
  }

  // 1. 스켈레톤 즉시 표시 (태블릿 2열에서는 4개, 모바일에서는 3개)
  const skeletonCount = window.innerWidth >= 768 ? 4 : 3;
  renderSkeletonCards(container, skeletonCount);

  // 2. 부드러운 딜레이 후 실제 카드 페이드인 렌더링
  feedTransitionTimer = setTimeout(() => {
    renderFeedCards(allocation);
    feedTransitionTimer = null;
    if (typeof onComplete === 'function') {
      onComplete();
    }
  }, delay);
}

function renderPresetChips() {
  const container = document.getElementById('presetContainer');
  if (!container) return;

  container.innerHTML = PRESET_MODES.map((preset) => {
    const isActive = ['study', 'tech', 'culture', 'hobby'].every(
      (cat) => state.weights[cat] === preset.weights[cat]
    );
    return `
      <button
        type="button"
        class="preset-chip-btn ${isActive ? 'active' : ''}"
        data-preset-id="${preset.id}"
        title="${preset.desc}"
      >
        ${preset.name}
      </button>
    `;
  }).join('');
}

function createCardMarkup(rawItem) {
  const item = getLocalizedCard(rawItem, getLanguage());
  const meta = CATEGORY_META[item.category] || CATEGORY_META.study;
  const isSaved = state.savedIds.has(item.id);
  const isVideo = item.type === 'video';
  const typeText = isVideo ? t('cards.video') : t('cards.article');
  const lang = getLanguage();
  let durationText = item.duration || (isVideo ? '10:00' : (lang === 'en' ? '5 min read' : '5분 읽기'));
  if (lang === 'en' && typeof durationText === 'string') {
    durationText = durationText.replace('분 읽기', ' min read').replace('분 분량', ' min');
  }

  return `
    <article
      class="content-feed-card"
      data-id="${item.id}"
      data-type="${item.type}"
      data-category="${item.category}"
      data-url="${item.url}"
      role="link"
      tabindex="0"
      aria-label="${meta.name} ${typeText}: ${item.title}"
    >
      <!-- 1. 상단 메인 콘텐츠 카드 (썸네일 + 제목 + 요약) -->
      <div class="card-main-box">
        <div class="card-media-wrap">
          <img
            src="${item.imageUrl}"
            alt="${item.title}"
            class="card-media-img"
            loading="lazy"
            onerror="this.src='https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80'"
          />
          <div class="card-tag-overlay">
            <span class="card-tag-indicator" style="background-color: ${meta.color}"></span>
            <span><strong>${meta.name}</strong> · ${typeText}</span>
          </div>
          ${item.isNew ? `<span class="card-badge-new">${t('cards.badgeNew')}</span>` : ''}
          <span class="card-duration-overlay">${durationText}</span>
          <button
            type="button"
            class="card-bookmark-btn ${isSaved ? 'saved' : ''}"
            data-bookmark-id="${item.id}"
            title="${isSaved ? t('cards.bookmarkRemove') : t('cards.bookmarkSave')}"
            aria-label="${t('cards.bookmarkSave')}"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
        </div>

        <div class="card-content-body">
          <h3 class="card-title-text">${item.title}</h3>
          <p class="card-summary-text">${item.summary}</p>
        </div>
      </div>

      <!-- 2. 하단 완전히 분리된 솔리드 테마 출처 캡슐 바 (순백색 폰트 + 테마 솔리드) -->
      <div
        class="card-detached-footer"
        style="--footer-solid-bg: ${meta.solidBg}; --footer-solid-text: ${meta.solidText}; --footer-solid-border: ${meta.solidBorder}; --footer-dark-bg: ${meta.darkSolidBg}; --footer-dark-border: ${meta.darkSolidBorder}; --footer-glow: ${meta.glowShadow};"
      >
        <div class="card-footer-source">
          <span class="card-footer-source-label">${t('cards.sourceLabel')}</span>
          <strong class="card-footer-source-name">${item.source}</strong>
          <span class="card-footer-sep">·</span>
          <span class="card-footer-date">${item.date}</span>
        </div>
      </div>
    </article>
  `;
}

function renderFeedCards(allocation) {
  const container = document.getElementById('feedCardsList');
  if (!container) return;

  if (allocation.totalWeight === 0) {
    container.innerHTML = `
      <div class="empty-feed-placeholder">
        <div class="empty-feed-title">${t('feed.emptyTitle')}</div>
        <p class="empty-feed-desc">${t('feed.emptyDesc')}</p>
        <button type="button" class="btn-primary-reset" id="btnRestoreBalance">${t('feed.restoreBalance')}</button>
      </div>
    `;
    const btn = document.getElementById('btnRestoreBalance');
    if (btn) {
      btn.addEventListener('click', () => {
        state.weights = { study: 50, tech: 50, culture: 50, hobby: 50 };
        persistWeights();
        renderAllViews();
        triggerHaptic('medium');
        showToast(t('toast.balancedApplied'));
      });
    }
    return;
  }

  const cards = buildFeedList(allocation);
  container.innerHTML = cards.map(createCardMarkup).join('');
  setTimeout(() => tracker.observeFeedCards(), 60);
}

// ==========================================================================
// 하단 미니 독 & 확장 믹서 시트 렌더링
// ==========================================================================
// 미니 독 상단 게이지 & 누적 바 & 레전드만 가볍게 갱신 (슬라이더 드래그 중 부드러운 60fps 유지)
function updateDockGauges(allocation) {
  if (!allocation) allocation = calculateAllocation();
  const categories = ['study', 'tech', 'culture', 'hobby'];

  const topGauge = document.getElementById('dockTopGauge');
  if (topGauge) {
    if (!topGauge.querySelector('.gauge-segment') || topGauge.children.length !== 4) {
      topGauge.innerHTML = categories.map((cat) => {
        const meta = CATEGORY_META[cat];
        const pct = allocation.totalWeight === 0 ? 0 : allocation.categories[cat].exactPct;
        return `<div class="gauge-segment" data-cat="${cat}" style="width:${pct}%; background-color:${meta.color}"></div>`;
      }).join('');
    } else {
      categories.forEach((cat) => {
        const seg = topGauge.querySelector(`.gauge-segment[data-cat="${cat}"]`);
        if (seg) {
          const pct = allocation.totalWeight === 0 ? 0 : allocation.categories[cat].exactPct;
          seg.style.width = `${pct}%`;
        }
      });
    }
  }

  const ratioPills = document.getElementById('dockRatioPills');
  if (ratioPills) {
    if (allocation.totalWeight === 0) {
      ratioPills.innerHTML = `<span style="font-size:0.74rem; color:var(--text-muted); font-weight:600;">${t('dock.allExcluded')}</span>`;
    } else {
      ratioPills.innerHTML = categories
        .filter((cat) => state.weights[cat] > 0)
        .map((cat) => {
          const meta = CATEGORY_META[cat];
          const alloc = allocation.categories[cat];
          return `
            <span class="dock-ratio-pill">
              <span class="dock-ratio-dot" style="background-color: ${meta.color}"></span>
              <span>${meta.name} <strong>${alloc.displayPct}%</strong></span>
            </span>
          `;
        }).join('');
    }
  }

  const stackedBar = document.getElementById('dockStackedBar');
  if (stackedBar) {
    if (!stackedBar.querySelector('.gauge-segment') || stackedBar.children.length !== 4) {
      stackedBar.innerHTML = categories.map((cat) => {
        const meta = CATEGORY_META[cat];
        const pct = allocation.totalWeight === 0 ? 0 : allocation.categories[cat].exactPct;
        return `<div class="gauge-segment" data-cat="${cat}" style="width:${pct}%; background-color:${meta.color}"></div>`;
      }).join('');
    } else {
      categories.forEach((cat) => {
        const seg = stackedBar.querySelector(`.gauge-segment[data-cat="${cat}"]`);
        if (seg) {
          const pct = allocation.totalWeight === 0 ? 0 : allocation.categories[cat].exactPct;
          seg.style.width = `${pct}%`;
        }
      });
    }
  }

  const legendRow = document.getElementById('dockLegendRow');
  if (legendRow) {
    if (!legendRow.querySelector('.gauge-legend-pill') || legendRow.children.length !== 4) {
      legendRow.innerHTML = categories.map((cat) => {
        const meta = CATEGORY_META[cat];
        const alloc = allocation.categories[cat];
        return `
          <div class="gauge-legend-pill" data-cat="${cat}">
            <div class="legend-name-group">
              <span class="legend-dot" style="background-color: ${meta.color}"></span>
              <span class="legend-theme-name">${meta.name}</span>
              <span class="legend-theme-sep">|</span>
              <span class="legend-theme-desc">${meta.description}</span>
            </div>
            <span class="legend-pct-text">${alloc.displayPct}%</span>
          </div>
        `;
      }).join('');
    } else {
      categories.forEach((cat) => {
        const pill = legendRow.querySelector(`.gauge-legend-pill[data-cat="${cat}"]`);
        const pctEl = pill?.querySelector('.legend-pct-text');
        if (pctEl) {
          pctEl.textContent = `${allocation.categories[cat].displayPct}%`;
        }
      });
    }
  }
}

// 온보딩 게이지 갱신 헬퍼 (기존 DOM 요소를 재활용하여 부드러운 전환 보장)
function updateOnboardingGauges(allocation) {
  const categories = ['study', 'tech', 'culture', 'hobby'];
  const stackedBar = document.getElementById('onboardingStackedBar');
  const legendRow = document.getElementById('onboardingLegendRow');
  if (stackedBar) {
    if (!stackedBar.querySelector('.gauge-segment') || stackedBar.children.length !== 4) {
      stackedBar.innerHTML = categories.map((cat) => {
        const meta = CATEGORY_META[cat];
        const pct = allocation.totalWeight === 0 ? 0 : allocation.categories[cat].exactPct;
        return `<div class="gauge-segment" data-cat="${cat}" style="width:${pct}%; background-color:${meta.color}"></div>`;
      }).join('');
    } else {
      categories.forEach((cat) => {
        const seg = stackedBar.querySelector(`.gauge-segment[data-cat="${cat}"]`);
        if (seg) {
          const pct = allocation.totalWeight === 0 ? 0 : allocation.categories[cat].exactPct;
          seg.style.width = `${pct}%`;
        }
      });
    }
  }
  if (legendRow) {
    if (!legendRow.querySelector('.gauge-legend-pill') || legendRow.children.length !== 4) {
      legendRow.innerHTML = categories.map((cat) => {
        const meta = CATEGORY_META[cat];
        const alloc = allocation.categories[cat];
        return `
          <div class="gauge-legend-pill" data-cat="${cat}">
            <div class="legend-name-group">
              <span class="legend-dot" style="background-color: ${meta.color}"></span>
              <span class="legend-theme-name">${meta.name}</span>
              <span class="legend-theme-sep">|</span>
              <span class="legend-theme-desc">${meta.description}</span>
            </div>
            <span class="legend-pct-text">${alloc.displayPct}%</span>
          </div>
        `;
      }).join('');
    } else {
      categories.forEach((cat) => {
        const pill = legendRow.querySelector(`.gauge-legend-pill[data-cat="${cat}"]`);
        const pctEl = pill?.querySelector('.legend-pct-text');
        if (pctEl) {
          pctEl.textContent = `${allocation.categories[cat].displayPct}%`;
        }
      });
    }
  }
}

// 각 채널 카드의 상태 뱃지와 틱 마크 하이라이트 실시간 갱신
function updateAllChannelPills(container, allocation) {
  if (!container) return;
  const isOnboarding = container.id === 'onboardingSlidersList';
  container.querySelectorAll('[data-channel]').forEach((card) => {
    const cat = card.dataset.channel;
    const val = state.weights[cat];
    const alloc = allocation.categories[cat];
    const pill = card.querySelector('.channel-status-pill');
    if (pill) {
      pill.innerHTML = val === 0
        ? '<span class="is-zero">0%</span>'
        : `<span class="pct-num">${alloc.displayPct}</span><span class="pct-unit">%</span>`;
    }
    const ticks = card.querySelectorAll('.tick-label');
    ticks.forEach((tick) => {
      const tickVal = parseInt(tick.dataset.val, 10);
      tick.classList.toggle('active', tickVal === val);
    });
  });
}

function updateMixerInlineValidation(allocation) {
  if (!allocation) allocation = calculateAllocation();
  const alertEl = document.getElementById('mixerInlineAlert');
  const applyBtn = document.getElementById('btnApplyDockMixer');
  const isZero = allocation.totalWeight === 0;

  if (alertEl) {
    alertEl.classList.toggle('hidden', !isZero);
  }
  if (applyBtn) {
    applyBtn.classList.toggle('disabled', isZero);
  }
}

function renderDockMixer(allocation) {
  if (!allocation) allocation = calculateAllocation();
  const categories = ['study', 'tech', 'culture', 'hobby'];
  updateDockGauges(allocation);
  updateMixerInlineValidation(allocation);

  // 4. 확장 패널 4개 슬라이더 목록 (1% 단위 정밀 조절)
  const slidersList = document.getElementById('dockSlidersList');
  if (slidersList) {
    slidersList.innerHTML = categories.map((cat) => {
      const meta = CATEGORY_META[cat];
      const currentVal = state.weights[cat];
      const alloc = allocation.categories[cat];

      return `
        <div class="mixer-channel-card" data-channel="${cat}">
          <div class="channel-top-line">
            <div class="channel-title-group">
              <span class="channel-color-bar" style="background-color: ${meta.color}"></span>
              <div class="channel-name">${meta.name}</div>
            </div>
            <span class="channel-status-pill" style="color: ${meta.color}">
              ${currentVal === 0 ? '<span class="is-zero">0%</span>' : `<span class="pct-num">${alloc.displayPct}</span><span class="pct-unit">%</span>`}
            </span>
          </div>

          <div class="slider-wrap">
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value="${currentVal}"
              class="channel-range-input dock-range-input"
              data-cat="${cat}"
              style="--thumb-color: ${meta.color}; background: linear-gradient(to right, ${meta.color} ${currentVal}%, var(--bg-subtle) ${currentVal}%);"
              aria-label="${meta.name} ${t('dock.title')}"
            />
            <div class="slider-ticks-row">
              <span class="tick-label ${currentVal === 0 ? 'active' : ''}" data-cat="${cat}" data-val="0">${t('sliders.ticks.0')}</span>
              <span class="tick-label ${currentVal === 25 ? 'active' : ''}" data-cat="${cat}" data-val="25">${t('sliders.ticks.25')}</span>
              <span class="tick-label ${currentVal === 50 ? 'active' : ''}" data-cat="${cat}" data-val="50">${t('sliders.ticks.50')}</span>
              <span class="tick-label ${currentVal === 75 ? 'active' : ''}" data-cat="${cat}" data-val="75">${t('sliders.ticks.75')}</span>
              <span class="tick-label ${currentVal === 100 ? 'active' : ''}" data-cat="${cat}" data-val="100">${t('sliders.ticks.100')}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
}

let isDockTransitioning = false;

function openDockMixer() {
  const container = document.getElementById('dockMixerContainer');
  if (!container || isDockTransitioning) return;
  isDockTransitioning = true;
  state.isDockExpanded = true;
  const allocation = calculateAllocation();
  renderDockMixer(allocation);
  container.classList.remove('closing');
  container.classList.add('expanded');
  document.getElementById('dockPeekBar')?.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  triggerHaptic('medium');
  setTimeout(() => {
    isDockTransitioning = false;
  }, 360);
}

function closeDockMixer() {
  const container = document.getElementById('dockMixerContainer');
  if (!container || isDockTransitioning || !container.classList.contains('expanded')) return;
  isDockTransitioning = true;
  state.isDockExpanded = false;
  document.getElementById('dockPeekBar')?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  const allocation = calculateAllocation();
  updateDockGauges(allocation);
  triggerHaptic('light');

  // 1) 믹서 패널이 밑으로 슉 내려가는(slide down) 애니메이션 시작
  container.classList.add('closing');

  // 2) 280ms 후 믹서 모달 닫힘 완료 (미니 바는 원래 자리에 항상 대기하고 있으므로 전환 갭 0%)
  setTimeout(() => {
    container.classList.remove('expanded');
    container.classList.remove('closing');
    isDockTransitioning = false;
  }, 280);
}

// 6. 내 알고리즘 투명성 뷰
function renderStatsView(allocation) {
  const container = document.getElementById('statsTableContainer');
  if (!container) return;

  const rows = ['study', 'tech', 'culture', 'hobby']
    .map((cat) => {
      const meta = CATEGORY_META[cat];
      const alloc = allocation.categories[cat];
      const levelDesc = getLevelDescription(alloc.weight);
      return `
        <tr>
          <td>
            <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background-color:${meta.color}; margin-right:6px;"></span>
            <strong>${meta.name}</strong>
          </td>
          <td>${alloc.weight}% (${levelDesc.label})</td>
          <td><strong>${alloc.displayPct}%</strong></td>
          <td>${alloc.cardCount}${t('stats.cardsUnit')}</td>
        </tr>
      `;
    })
    .join('');

  container.innerHTML = `
    <table class="stats-table">
      <thead>
        <tr>
          <th>${t('stats.thCategory')}</th>
          <th>${t('stats.thWeight')}</th>
          <th>${t('stats.thRatio')}</th>
          <th>${t('stats.thCards')}</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

function updateCustomCardCountUI() {
  const pill = document.getElementById('customCardCountPill');
  const btnReset = document.getElementById('btnResetCustomCards');
  const count = state.customCards.length;
  if (pill) {
    pill.textContent = t('stats.customCardPill', { count });
  }
  if (btnReset) {
    btnReset.classList.toggle('hidden', count === 0);
  }
}

// 7. 보관함 뷰
function renderSavedView() {
  const container = document.getElementById('savedCardsList');
  const btnClear = document.getElementById('btnClearSaved');
  if (!container) return;

  const activePool = getActiveContentPool();
  const savedItems = activePool.filter((item) => state.savedIds.has(item.id));
  if (btnClear) {
    btnClear.classList.toggle('hidden', savedItems.length === 0);
  }

  if (savedItems.length === 0) {
    container.innerHTML = `
      <div class="empty-feed-placeholder">
        <div class="empty-feed-title">${t('saved.emptyTitle')}</div>
        <p class="empty-feed-desc">${t('saved.emptyDesc')}</p>
      </div>
    `;
    return;
  }

  container.innerHTML = savedItems.map(createCardMarkup).join('');
}

function updateSavedBadge() {
  const badge = document.getElementById('savedCountBadge');
  if (!badge) return;
  const count = state.savedIds.size;
  badge.textContent = count > 99 ? '99+' : count;
  badge.classList.toggle('hidden', count === 0);
}

// ==========================================================================
// 온보딩 (시작 화면) 렌더링, 부드러운 스르륵 전환 애니메이션 및 모달 제어
// ==========================================================================
let onboardingTransitionRafId = null;

function updateOnboardingPresetChips() {
  const presetContainer = document.getElementById('onboardingPresetRow');
  if (!presetContainer) return;
  const categories = ['study', 'tech', 'culture', 'hobby'];
  presetContainer.querySelectorAll('.preset-chip-btn').forEach((btn) => {
    const preset = PRESET_MODES.find((p) => p.id === btn.dataset.presetId);
    const isActive = preset && categories.every((cat) => state.weights[cat] === preset.weights[cat]);
    btn.classList.toggle('active', !!isActive);
  });
}

function animateOnboardingWeights(targetWeights, targetPresetId) {
  const categories = ['study', 'tech', 'culture', 'hobby'];
  const startWeights = { ...state.weights };

  if (onboardingTransitionRafId) {
    cancelAnimationFrame(onboardingTransitionRafId);
    onboardingTransitionRafId = null;
  }

  // 프리셋 칩 즉각 활성화 피드백
  const presetContainer = document.getElementById('onboardingPresetRow');
  if (presetContainer) {
    presetContainer.querySelectorAll('.preset-chip-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.presetId === targetPresetId);
    });
  }

  const alreadyEqual = categories.every((c) => Math.round(startWeights[c]) === targetWeights[c]);
  if (alreadyEqual) return;

  const duration = 440; // 부드럽고 유려한 스르륵 전환 시간 (ms)
  const startTime = performance.now();

  // 토스/애플 감성의 감속 이징 곡선 (easeOutCubic)
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const stackedBar = document.getElementById('onboardingStackedBar');
  const legendRow = document.getElementById('onboardingLegendRow');
  const slidersList = document.getElementById('onboardingSlidersList');

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / duration);
    const eased = easeOutCubic(progress);

    categories.forEach((cat) => {
      const s = startWeights[cat];
      const target = targetWeights[cat];
      state.weights[cat] = Math.round(s + (target - s) * eased);
    });

    if (progress >= 1) {
      categories.forEach((cat) => {
        state.weights[cat] = targetWeights[cat];
      });
    }

    const allocation = calculateAllocation();

    // 1. 실시간 게이지 바 너비 부드러운 스르륵 전환
    if (stackedBar) {
      categories.forEach((cat) => {
        const seg = stackedBar.querySelector(`.gauge-segment[data-cat="${cat}"]`);
        if (seg) {
          const pct = allocation.totalWeight === 0 ? 0 : allocation.categories[cat].exactPct;
          seg.style.width = `${pct}%`;
        }
      });
    }

    // 2. 범례 퍼센트 수치 실시간 롤링 카운팅
    if (legendRow) {
      categories.forEach((cat) => {
        const pill = legendRow.querySelector(`.gauge-legend-pill[data-cat="${cat}"]`);
        const pctEl = pill?.querySelector('.legend-pct-text');
        if (pctEl) {
          pctEl.textContent = `${allocation.categories[cat].displayPct}%`;
        }
      });
    }

    // 3. 4개 슬라이더 손잡이 위치 & 배경 채우기 & 카드 뱃지 실시간 동기화
    if (slidersList) {
      categories.forEach((cat) => {
        const card = slidersList.querySelector(`[data-channel="${cat}"]`);
        if (!card) return;
        const input = card.querySelector('.onboarding-range-input');
        const pill = card.querySelector('.channel-status-pill');
        const meta = CATEGORY_META[cat];
        const w = state.weights[cat];
        const alloc = allocation.categories[cat];

        if (input) {
          input.value = w;
          input.style.background = `linear-gradient(to right, ${meta.color} ${w}%, var(--bg-subtle) ${w}%)`;
        }
        if (pill) {
          pill.innerHTML = w === 0
            ? '<span class="is-zero">0%</span>'
            : `<span class="pct-num">${alloc.displayPct}</span><span class="pct-unit">%</span>`;
        }
      });
    }

    if (progress < 1) {
      onboardingTransitionRafId = requestAnimationFrame(step);
    } else {
      onboardingTransitionRafId = null;
      updateOnboardingPresetChips();
      triggerHaptic('light');
    }
  }

  onboardingTransitionRafId = requestAnimationFrame(step);
}

function renderOnboardingView(options = {}) {
  const overlay = document.getElementById('onboardingOverlay');
  if (!overlay || overlay.classList.contains('hidden')) return;

  const allocation = calculateAllocation();
  const presetContainer = document.getElementById('onboardingPresetRow');
  const stackedBar = document.getElementById('onboardingStackedBar');
  const legendRow = document.getElementById('onboardingLegendRow');
  const slidersList = document.getElementById('onboardingSlidersList');
  const categories = ['study', 'tech', 'culture', 'hobby'];

  // 1) 프리셋 버튼 렌더링 / 활성화 갱신
  if (presetContainer) {
    if (!presetContainer.querySelector('.preset-chip-btn') || options.forceRebuild) {
      presetContainer.innerHTML = PRESET_MODES.slice(0, 3).map((preset) => {
        const isActive = categories.every((cat) => state.weights[cat] === preset.weights[cat]);
        return `
          <button
            type="button"
            class="preset-chip-btn ${isActive ? 'active' : ''}"
            data-preset-id="${preset.id}"
          >
            ${preset.name}
          </button>
        `;
      }).join('');
    } else {
      updateOnboardingPresetChips();
    }
  }

  // 2) 실시간 추천 비율 게이지 바 & 범례
  updateOnboardingGauges(allocation);

  // 3) 슬라이더 리스트 렌더링 / 값 동기화
  if (slidersList) {
    if (!slidersList.querySelector('.onboarding-channel-card') || options.forceRebuild) {
      slidersList.innerHTML = categories.map((cat) => {
        const meta = CATEGORY_META[cat];
        const currentVal = state.weights[cat];
        const alloc = allocation.categories[cat];

        return `
          <div class="onboarding-channel-card" data-channel="${cat}">
            <div class="channel-top-line" style="margin-bottom:6px;">
              <div class="channel-title-group">
                <span class="channel-color-bar" style="background-color: ${meta.color}"></span>
                <span class="channel-name" style="font-size:0.86rem; font-weight:700;">${meta.name}</span>
              </div>
              <span class="channel-status-pill" style="color: ${meta.color}">
                ${currentVal === 0 ? '<span class="is-zero">0%</span>' : `<span class="pct-num">${alloc.displayPct}</span><span class="pct-unit">%</span>`}
              </span>
            </div>

            <div class="slider-wrap">
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value="${currentVal}"
                class="channel-range-input onboarding-range-input"
                data-cat="${cat}"
                style="--thumb-color: ${meta.color}; background: linear-gradient(to right, ${meta.color} ${currentVal}%, var(--bg-subtle) ${currentVal}%);"
                aria-label="${meta.name} ${t('onboarding.gaugeTitle')}"
              />
            </div>
          </div>
        `;
      }).join('');
    } else {
      categories.forEach((cat) => {
        const card = slidersList.querySelector(`[data-channel="${cat}"]`);
        if (!card) return;
        const input = card.querySelector('.onboarding-range-input');
        const pill = card.querySelector('.channel-status-pill');
        const meta = CATEGORY_META[cat];
        const currentVal = state.weights[cat];
        const alloc = allocation.categories[cat];

        if (input) {
          input.value = currentVal;
          input.style.background = `linear-gradient(to right, ${meta.color} ${currentVal}%, var(--bg-subtle) ${currentVal}%)`;
        }
        if (pill) {
          pill.innerHTML = currentVal === 0
            ? '<span class="is-zero">0%</span>'
            : `<span class="pct-num">${alloc.displayPct}</span><span class="pct-unit">%</span>`;
        }
      });
    }
  }
}

// ==========================================================================
// 글로벌 계정 & 모던 구글 로그인 제어 모듈
// ==========================================================================
let authModalDismissCallback = null;

function openAuthModal(options = {}) {
  const overlay = document.getElementById('authOverlay');
  if (!overlay) return;

  authModalDismissCallback = options.onDismiss || null;

  updateAuthModalState();

  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  triggerHaptic('light');
}

function closeAuthModal() {
  const overlay = document.getElementById('authOverlay');
  if (overlay) overlay.classList.add('hidden');
  document.body.style.overflow = '';
}

function dismissAuthModal(skipped = true) {
  closeAuthModal();
  if (skipped) {
    sessionStorage.setItem('mamgorithm_auth_dismissed', 'true');
    triggerHaptic('light');
  }
  if (typeof authModalDismissCallback === 'function') {
    const cb = authModalDismissCallback;
    authModalDismissCallback = null;
    cb();
  }
}

function updateAuthModalState() {
  const loggedOutView = document.getElementById('authLoggedOutView');
  const loggedInView = document.getElementById('authLoggedInView');
  const userPhoto = document.getElementById('authUserPhoto');
  const userName = document.getElementById('authUserName');
  const userEmail = document.getElementById('authUserEmail');

  const isLoggedIn = currentUser && !currentUser.isAnonymous;

  if (isLoggedIn) {
    if (loggedOutView) loggedOutView.classList.add('hidden');
    if (loggedInView) loggedInView.classList.remove('hidden');
    if (userPhoto) {
      userPhoto.src = currentUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
    }
    if (userName) {
      userName.textContent = currentUser.displayName || t('auth.account');
    }
    if (userEmail) {
      userEmail.textContent = currentUser.email || '';
    }
  } else {
    if (loggedOutView) loggedOutView.classList.remove('hidden');
    if (loggedInView) loggedInView.classList.add('hidden');
  }
}

function updateHeaderAuthUI(user) {
  const btnHeader = document.getElementById('btnHeaderAuth');
  const avatarWrap = document.getElementById('headerAuthAvatar');
  const label = document.getElementById('headerAuthLabel');
  const isLoggedIn = user && !user.isAnonymous;

  if (!btnHeader) return;

  btnHeader.classList.toggle('logged-in', isLoggedIn);

  if (isLoggedIn) {
    if (avatarWrap) {
      if (user.photoURL) {
        avatarWrap.innerHTML = `<img src="${user.photoURL}" alt="${user.displayName || 'User'}" class="auth-avatar-img" />`;
      } else {
        const initial = (user.displayName || user.email || 'U').charAt(0).toUpperCase();
        avatarWrap.innerHTML = `<span style="font-weight:700; font-size:11px;">${initial}</span>`;
      }
    }
    if (label) {
      const shortName = user.displayName ? user.displayName.split(' ')[0] : t('auth.account');
      label.textContent = shortName;
    }
  } else {
    if (avatarWrap) {
      avatarWrap.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      `;
    }
    if (label) {
      label.textContent = t('auth.signIn');
    }
  }

  // 내 알고리즘 탭 상단 배너 동기화
  updateStatsAuthBanner(user);
}

function updateStatsAuthBanner(user) {
  const card = document.getElementById('authStatsCard');
  const title = document.getElementById('authStatsTitle');
  const desc = document.getElementById('authStatsDesc');
  const btnAction = document.getElementById('btnAuthStatsAction');
  const iconWrap = document.getElementById('authStatsIconWrap');
  if (!card) return;

  const isLoggedIn = user && !user.isAnonymous;
  card.classList.toggle('connected', isLoggedIn);

  if (isLoggedIn) {
    if (iconWrap) {
      iconWrap.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;
    }
    if (title) title.textContent = user.displayName || user.email;
    if (desc) desc.textContent = `${user.email} · ${t('auth.syncActive')}`;
    if (btnAction) {
      btnAction.textContent = t('auth.account');
      btnAction.classList.add('secondary');
    }
  } else {
    if (iconWrap) {
      iconWrap.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      `;
    }
    if (title) title.textContent = t('auth.statsBannerTitle');
    if (desc) desc.textContent = t('auth.statsBannerDesc');
    if (btnAction) {
      btnAction.textContent = t('auth.btnSyncLogin');
      btnAction.classList.remove('secondary');
    }
  }
}

function openOnboarding() {
  const overlay = document.getElementById('onboardingOverlay');
  if (!overlay) return;
  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  renderOnboardingView({ forceRebuild: true });
}

function closeOnboarding() {
  if (onboardingTransitionRafId) {
    cancelAnimationFrame(onboardingTransitionRafId);
    onboardingTransitionRafId = null;
  }
  const overlay = document.getElementById('onboardingOverlay');
  if (overlay) overlay.classList.add('hidden');
  document.body.style.overflow = '';
  try {
    localStorage.setItem(STORAGE_KEYS.ONBOARDED, 'true');
  } catch (e) {}
  persistWeights();
  renderAllViews();
  triggerHaptic('success');
  showToast(t('toast.onboardingFeedReady'));

  const hasSeenCoachmark = localStorage.getItem(STORAGE_KEYS.COACHMARK_SEEN);
  if (!hasSeenCoachmark) {
    setTimeout(() => startCoachmarkTour(), 500);
  }
}

// ==========================================================================
// 이벤트 바인딩
// ==========================================================================
function switchTab(targetTabId) {
  closeDockMixer();
  state.currentTab = targetTabId;
  triggerHaptic('light');

  document.querySelectorAll('.tab-view').forEach((view) => {
    view.classList.toggle('active', view.id === targetTabId);
  });

  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === targetTabId);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (targetTabId === 'viewSaved') {
    renderSavedView();
  }
}

let dockGaugeRafId = null;
let dockFeedDebounceTimer = null;
let onboardingGaugeRafId = null;

function bindUIEvents() {
  // 0) 글로벌 언어 전환 토글 버튼 (KO <-> EN)
  document.getElementById('btnLanguageToggle')?.addEventListener('click', () => {
    toggleLanguage();
    triggerHaptic('light');
    translateDOM();
    renderAllViews();
    if (currentReadingArticle) {
      openArticleModal(currentReadingArticle);
    }
    showToast(t('toast.langSwitched'));
    tracker.syncToFirestore();
  });

  // 0-1) 헤더 로그인 / 계정 버튼 클릭
  document.getElementById('btnHeaderAuth')?.addEventListener('click', () => {
    openAuthModal();
  });

  // 0-2) 로그인 모달 건너뛰기 & 닫기 이벤트
  document.getElementById('btnAuthSkip')?.addEventListener('click', () => {
    dismissAuthModal(true);
  });
  document.getElementById('btnGuestContinue')?.addEventListener('click', () => {
    dismissAuthModal(true);
  });
  document.getElementById('authBackdrop')?.addEventListener('click', () => {
    dismissAuthModal(true);
  });

  // 0-3) 구글 원클릭 팝업 로그인 실행
  document.getElementById('btnGoogleLogin')?.addEventListener('click', async () => {
    const btn = document.getElementById('btnGoogleLogin');
    if (!btn) return;
    try {
      triggerHaptic('medium');
      btn.style.opacity = '0.6';
      btn.style.pointerEvents = 'none';

      const user = await loginWithGoogle();
      if (user) {
        triggerHaptic('success');
        showToast(t('auth.loginSuccess', { name: user.displayName || user.email }));
        dismissAuthModal(false);
        tracker.syncToFirestore();
      }
    } catch (err) {
      triggerHaptic('error');
      showToast(t('auth.loginFailed'));
    } finally {
      btn.style.opacity = '1';
      btn.style.pointerEvents = 'auto';
    }
  });

  // 0-4) 로그아웃 버튼 실행
  document.getElementById('btnAuthLogout')?.addEventListener('click', async () => {
    try {
      triggerHaptic('light');
      await logoutUser();
      showToast(t('auth.logoutSuccess'));
      closeAuthModal();
      tracker.syncToFirestore();
    } catch (err) {
      console.error(err);
    }
  });

  // 0-5) 내 알고리즘 탭의 계정 연동 버튼
  document.getElementById('btnAuthStatsAction')?.addEventListener('click', () => {
    openAuthModal();
  });

  // 0-6) Firebase Auth 상태 변화 구독
  onAuthStatusChange((user) => {
    updateHeaderAuthUI(user);
    updateAuthModalState();
    if (user && !user.isAnonymous) {
      loadUserSettingsFromCloud(user.uid).then((cloudWeights) => {
        if (cloudWeights) {
          state.weights = { ...state.weights, ...cloudWeights };
          persistWeights();
          renderAllViews();
        } else {
          saveUserSettingsToCloud(user.uid, state.weights);
        }
      });
      tracker.syncToFirestore();
    }
  });

  // 1) 하단 3개 탭 바 클릭
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      switchTab(btn.dataset.tab);
    });
  });

  // 2) 브랜드 로고 클릭 시 피드로
  document.getElementById('brandHome')?.addEventListener('click', () => {
    switchTab('viewFeed');
  });

  // 3) 상단 빠른 조절 버튼 -> 미니 독 확장
  document.getElementById('btnQuickTune')?.addEventListener('click', () => {
    openDockMixer();
  });

  // 4) 미니 독 탭/클릭 시 믹서 시트 확장
  document.getElementById('dockPeekBar')?.addEventListener('click', () => {
    openDockMixer();
  });

  // 미니 독 시트 닫기
  document.getElementById('btnCollapseDock')?.addEventListener('click', closeDockMixer);
  document.getElementById('dockBackdrop')?.addEventListener('click', closeDockMixer);

  // 미니 독 시트 "피드 확인하기" 버튼
  document.getElementById('btnApplyDockMixer')?.addEventListener('click', () => {
    const alloc = calculateAllocation();
    if (alloc.totalWeight === 0) {
      triggerHaptic('light');
      showToast(t('dock.allZeroAlert'));
      return;
    }
    closeDockMixer();
    switchTab('viewFeed');
    triggerHaptic('success');
    showToast(t('toast.recipeApplied'));
  });

  // 미니 독 내부 균형 리셋 버튼 (확인 모달 다이얼로그)
  document.getElementById('btnResetMixerInDock')?.addEventListener('click', () => {
    showConfirmModal({
      title: t('confirm.resetTitle'),
      message: t('confirm.resetDesc'),
      confirmText: t('confirm.resetConfirm'),
      cancelText: t('confirm.cancel'),
      isDanger: false,
      onConfirm: () => {
        state.weights = { study: 50, tech: 50, culture: 50, hobby: 50 };
        persistWeights();
        renderAllViews();
        triggerHaptic('delete');
        showToast(t('toast.balancedReset'));
      }
    });
  });

  // 레시피 공유 버튼 (미니 독 & 내 알고리즘 탭)
  document.getElementById('btnShareRecipeInDock')?.addEventListener('click', shareCurrentRecipe);
  document.getElementById('btnShareRecipeInStats')?.addEventListener('click', shareCurrentRecipe);

  // 5) 미니 독 슬라이더 실시간 조절 (1% 단위 60~120fps rAF 최적화)
  const dockSlidersList = document.getElementById('dockSlidersList');
  if (dockSlidersList) {
    dockSlidersList.addEventListener('input', (e) => {
      const input = e.target.closest('.dock-range-input');
      if (!input) return;
      const cat = input.dataset.cat;
      const val = parseInt(input.value, 10);
      if (cat && !Number.isNaN(val)) {
        state.weights[cat] = Math.max(0, Math.min(100, val));
        triggerHaptic('light');

        const meta = CATEGORY_META[cat];
        input.style.background = `linear-gradient(to right, ${meta.color} ${val}%, var(--bg-subtle) ${val}%)`;

        if (dockGaugeRafId) cancelAnimationFrame(dockGaugeRafId);
        dockGaugeRafId = requestAnimationFrame(() => {
          const allocation = calculateAllocation();
          updateDockGauges(allocation);
          updateMixerInlineValidation(allocation);
          updateAllChannelPills(dockSlidersList, allocation);
          renderPresetChips();
          dockGaugeRafId = null;
        });

        if (dockFeedDebounceTimer) clearTimeout(dockFeedDebounceTimer);
        dockFeedDebounceTimer = setTimeout(() => {
          persistWeights();
          const allocation = calculateAllocation();
          renderFeedCards(allocation);
          renderStatsView(allocation);
          dockFeedDebounceTimer = null;
        }, 55);
      }
    });

    dockSlidersList.addEventListener('change', () => {
      if (dockFeedDebounceTimer) {
        clearTimeout(dockFeedDebounceTimer);
        dockFeedDebounceTimer = null;
      }
      persistWeights();
      const allocation = calculateAllocation();
      renderFeedCards(allocation);
      renderStatsView(allocation);
    });

    dockSlidersList.addEventListener('click', (e) => {
      const tick = e.target.closest('.tick-label');
      if (!tick) return;
      const cat = tick.dataset.cat;
      const val = parseInt(tick.dataset.val, 10);
      if (cat && !Number.isNaN(val)) {
        state.weights[cat] = Math.max(0, Math.min(100, val));
        triggerHaptic('light');
        persistWeights();
        renderAllViews();
      }
    });
  }

  // 6) 온보딩 화면 슬라이더 및 프리셋 이벤트 (1% 단위 rAF 최적화 & 부드러운 스르륵 애니메이션)
  const onboardingSliders = document.getElementById('onboardingSlidersList');
  if (onboardingSliders) {
    onboardingSliders.addEventListener('input', (e) => {
      const input = e.target.closest('.onboarding-range-input');
      if (!input) return;

      // 사용자가 직접 슬라이더를 잡으면 재생 중인 프리셋 전환 애니메이션 즉시 취소
      if (onboardingTransitionRafId) {
        cancelAnimationFrame(onboardingTransitionRafId);
        onboardingTransitionRafId = null;
      }

      const cat = input.dataset.cat;
      const val = parseInt(input.value, 10);
      if (cat && !Number.isNaN(val)) {
        state.weights[cat] = Math.max(0, Math.min(100, val));
        triggerHaptic('light');

        const meta = CATEGORY_META[cat];
        input.style.background = `linear-gradient(to right, ${meta.color} ${val}%, var(--bg-subtle) ${val}%)`;

        if (onboardingGaugeRafId) cancelAnimationFrame(onboardingGaugeRafId);
        onboardingGaugeRafId = requestAnimationFrame(() => {
          const allocation = calculateAllocation();
          updateOnboardingGauges(allocation);
          updateAllChannelPills(onboardingSliders, allocation);
          updateOnboardingPresetChips();
          onboardingGaugeRafId = null;
        });
      }
    });

    onboardingSliders.addEventListener('click', (e) => {
      const tick = e.target.closest('.tick-label');
      if (!tick) return;
      const cat = tick.dataset.cat;
      const val = parseInt(tick.dataset.val, 10);
      if (cat && !Number.isNaN(val)) {
        triggerHaptic('light');
        const targetWeights = { ...state.weights, [cat]: Math.max(0, Math.min(100, val)) };
        animateOnboardingWeights(targetWeights);
      }
    });
  }

  document.getElementById('onboardingPresetRow')?.addEventListener('click', (e) => {
    const chip = e.target.closest('.preset-chip-btn');
    if (!chip) return;
    const preset = PRESET_MODES.find((p) => p.id === chip.dataset.presetId);
    if (preset) {
      triggerHaptic('medium');
      animateOnboardingWeights(preset.weights, preset.id);
    }
  });

  document.getElementById('btnOnboardingStart')?.addEventListener('click', closeOnboarding);

  // 라이트 인트로 다시보기 (소리와 함께 재생 및 라이트 테마 복귀)
  document.getElementById('btnReplayIntroLight')?.addEventListener('click', () => {
    triggerHaptic('medium');
    if (typeof window.playIntroWithTheme === 'function') {
      window.playIntroWithTheme('light');
    }
  });

  // 다크 인트로 다시보기 (소리와 함께 재생 및 다크 테마 전환)
  document.getElementById('btnReplayIntroDark')?.addEventListener('click', () => {
    triggerHaptic('medium');
    if (typeof window.playIntroWithTheme === 'function') {
      window.playIntroWithTheme('dark');
    }
  });

  // 시작 안내 및 설정 다시보기 -> 자동으로 홈 화면(피드)으로 이동 후 실행
  document.getElementById('btnReopenOnboarding')?.addEventListener('click', () => {
    triggerHaptic('medium');
    switchTab('viewFeed');
    window.scrollTo({ top: 0, behavior: 'auto' });
    setTimeout(() => {
      openOnboarding();
    }, 120);
  });

  // 7) 피드 빠른 프리셋 칩 클릭
  document.getElementById('presetContainer')?.addEventListener('click', (e) => {
    const chip = e.target.closest('.preset-chip-btn');
    if (!chip) return;
    const preset = PRESET_MODES.find((p) => p.id === chip.dataset.presetId);
    if (preset) {
      state.weights = { ...preset.weights };
      persistWeights();
      renderAllViews({ withSkeleton: true, delay: 240 });
      triggerHaptic('medium');
      showToast(t('toast.presetApplied', { preset: preset.name }));
    }
  });

  // 8) 콘텐츠 유형 필터 (전체 / 영상 / 기사)
  document.querySelectorAll('.type-pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      if (pill.classList.contains('active')) return;
      document.querySelectorAll('.type-pill').forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      state.contentType = pill.dataset.type;
      triggerHaptic('light');
      const allocation = calculateAllocation();
      renderFeedCardsWithSkeleton(allocation, 120);
    });
  });

  // 9) 새로고침 셔플 버튼 (빠릿하고 경쾌한 140ms 반응)
  document.getElementById('btnShuffle')?.addEventListener('click', () => {
    const btn = document.getElementById('btnShuffle');
    if (btn) btn.classList.add('spinning');
    state.shuffleSeed += 1;
    triggerHaptic('medium');
    const allocation = calculateAllocation();
    renderFeedCardsWithSkeleton(allocation, 140, () => {
      if (btn) btn.classList.remove('spinning');
      showToast(t('toast.shuffled'));
    });
  });

  // 10) 카드 인터랙션: 영상은 인앱 바텀시트 플레이어, 기사는 원본 열기 & 북마크 토글
  const handleCardInteraction = (e) => {
    const bookmarkBtn = e.target.closest('.card-bookmark-btn');
    if (bookmarkBtn) {
      e.stopPropagation();
      const id = bookmarkBtn.dataset.bookmarkId;
      if (state.savedIds.has(id)) {
        state.savedIds.delete(id);
        persistBookmarks();
        renderAllViews();
        triggerHaptic('delete');
        showSnackbar(t('toast.removed'), t('toast.undo'), () => {
          state.savedIds.add(id);
          persistBookmarks();
          renderAllViews();
          triggerHaptic('success');
          showToast(t('toast.restored'));
        }, 4500);
      } else {
        state.savedIds.add(id);
        persistBookmarks();
        renderAllViews();
        triggerHaptic('success');
        showToast(t('toast.saved'));
      }
      return;
    }

    const card = e.target.closest('.content-feed-card');
    if (card) {
      const type = card.dataset.type;
      const id = card.dataset.id;
      const activePool = getActiveContentPool();
      const item = activePool.find((c) => c.id === id);
      const isFromBookmark = !!card.closest('#savedCardsList');

      if (item) {
        tracker.trackCardClick(item, isFromBookmark);
      }

      if (type === 'video' && item) {
        triggerHaptic('medium');
        openVideoModal(item);
      } else if (type === 'article' && item) {
        triggerHaptic('medium');
        openArticleModal(item);
      } else if (card.dataset.url) {
        triggerHaptic('light');
        window.open(card.dataset.url, '_blank', 'noopener,noreferrer');
      }
    }
  };

  document.getElementById('feedCardsList')?.addEventListener('click', handleCardInteraction);
  document.getElementById('savedCardsList')?.addEventListener('click', handleCardInteraction);

  // 11) 인앱 비디오 바텀시트 제어
  document.getElementById('btnVideoSheetClose')?.addEventListener('click', () => {
    triggerHaptic('light');
    closeVideoModal();
  });
  document.getElementById('sheetDragHandle')?.addEventListener('click', () => {
    triggerHaptic('light');
    closeVideoModal();
  });

  document.getElementById('videoSheetBackdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'videoSheetBackdrop') {
      triggerHaptic('light');
      closeVideoModal();
    }
  });

  document.getElementById('btnSheetTune')?.addEventListener('click', () => {
    closeVideoModal();
    openDockMixer();
  });

  // 12) 인앱 기사 리더 모달 제어
  document.getElementById('btnArticleSheetClose')?.addEventListener('click', () => {
    triggerHaptic('light');
    closeArticleModal();
  });
  document.getElementById('articleDragHandle')?.addEventListener('click', () => {
    triggerHaptic('light');
    closeArticleModal();
  });
  document.getElementById('btnArticleBackToFeed')?.addEventListener('click', () => {
    triggerHaptic('light');
    closeArticleModal();
  });
  document.getElementById('articleSheetBackdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'articleSheetBackdrop') {
      triggerHaptic('light');
      closeArticleModal();
    }
  });
  document.getElementById('btnArticleSheetTune')?.addEventListener('click', () => {
    closeArticleModal();
    openDockMixer();
  });
  document.getElementById('btnArticleBookmark')?.addEventListener('click', () => {
    if (!currentReadingArticle) return;
    const id = currentReadingArticle.id;
    if (state.savedIds.has(id)) {
      state.savedIds.delete(id);
      updateArticleBookmarkButtonState();
      persistBookmarks();
      renderAllViews();
      triggerHaptic('delete');
      showSnackbar(t('toast.removed'), t('toast.undo'), () => {
        state.savedIds.add(id);
        updateArticleBookmarkButtonState();
        persistBookmarks();
        renderAllViews();
        triggerHaptic('success');
        showToast(t('toast.restored'));
      }, 4500);
    } else {
      state.savedIds.add(id);
      updateArticleBookmarkButtonState();
      persistBookmarks();
      renderAllViews();
      triggerHaptic('success');
      showToast(t('toast.saved'));
    }
  });

  // 보관함 전체 비우기 버튼 (확인 모달 다이얼로그 + 실행 취소 스낵바)
  document.getElementById('btnClearSaved')?.addEventListener('click', () => {
    if (state.savedIds.size === 0) return;
    const count = state.savedIds.size;
    showConfirmModal({
      title: t('confirm.clearSavedTitle'),
      message: t('confirm.clearSavedDesc', { count }),
      confirmText: t('confirm.clearSavedConfirm'),
      cancelText: t('confirm.cancel'),
      isDanger: true,
      onConfirm: () => {
        const previous = new Set(state.savedIds);
        state.savedIds.clear();
        persistBookmarks();
        renderAllViews();
        triggerHaptic('delete');
        showSnackbar(t('toast.allClearedCount', { count }), t('toast.undo'), () => {
          state.savedIds = new Set(previous);
          persistBookmarks();
          renderAllViews();
          triggerHaptic('success');
          showToast(t('toast.allRestored'));
        }, 5000);
      }
    });
  });

  // 13) 컨텍스추얼 툴팁 이벤트
  document.getElementById('btnStatsTooltip')?.addEventListener('click', (e) => {
    e.stopPropagation();
    triggerHaptic('light');
    showTooltip(e.currentTarget, t('tooltip.stats'));
  });

  document.getElementById('btnMixerTooltip')?.addEventListener('click', (e) => {
    e.stopPropagation();
    triggerHaptic('light');
    showTooltip(e.currentTarget, t('tooltip.mixer'));
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.tooltip-popover') && !e.target.closest('.btn-tooltip-trigger')) {
      hideTooltip();
    }
  });

  window.addEventListener('scroll', () => {
    hideTooltip();
  }, { passive: true });

  // 14) 코치마크 투어 제어 (다시보기 클릭 시 홈 화면으로 자동 전환 후 실행)
  document.getElementById('btnCoachmarkSkip')?.addEventListener('click', () => {
    triggerHaptic('light');
    dismissCoachmark();
  });

  document.getElementById('btnCoachmarkNext')?.addEventListener('click', () => {
    const steps = getCoachmarkSteps();
    if (currentCoachmarkStep < steps.length - 1) {
      currentCoachmarkStep += 1;
      triggerHaptic('light');
      showCoachmarkStep(currentCoachmarkStep);
    } else {
      triggerHaptic('success');
      dismissCoachmark();
    }
  });

  document.getElementById('btnReplayCoachmark')?.addEventListener('click', () => {
    triggerHaptic('medium');
    switchTab('viewFeed');
    window.scrollTo({ top: 0, behavior: 'auto' });
    setTimeout(() => {
      startCoachmarkTour();
    }, 160);
  });

  // 15) 새 콘텐츠 카드 추가 및 초기화 폼 이벤트
  const addCardForm = document.getElementById('addCardForm');
  if (addCardForm) {
    addCardForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const category = document.getElementById('newCardCategory')?.value || 'study';
      const type = document.getElementById('newCardType')?.value || 'video';
      const title = document.getElementById('newCardTitle')?.value?.trim();
      const summary = document.getElementById('newCardSummary')?.value?.trim();
      const source = document.getElementById('newCardSource')?.value?.trim() || (getLanguage() === 'en' ? 'My-gorithm Curation' : '맘고리즘 큐레이션');
      const duration = document.getElementById('newCardDuration')?.value?.trim() || (type === 'video' ? '10:00' : (getLanguage() === 'en' ? '4 min read' : '4분 읽기'));
      const url = document.getElementById('newCardUrl')?.value?.trim() || '';
      const imageUrl = document.getElementById('newCardImage')?.value?.trim() || '';

      if (!title || !summary) {
        triggerHaptic('light');
        showToast(t('toast.titleRequired'));
        return;
      }

      const newCard = normalizeContentCard({
        category,
        type,
        title,
        summary,
        source,
        duration,
        url,
        imageUrl,
        date: getLanguage() === 'en' ? 'Just added' : '방금 추가됨',
        isNew: true
      });

      state.customCards.unshift(newCard);
      persistCustomCards();

      if (state.weights[category] === 0) {
        state.weights[category] = 35;
        persistWeights();
      }
      if (state.contentType !== 'all' && state.contentType !== type) {
        state.contentType = 'all';
        document.querySelectorAll('.type-pill').forEach((p) => {
          p.classList.toggle('active', p.dataset.type === 'all');
        });
      }
      state.shuffleSeed = 0;

      addCardForm.reset();
      renderAllViews();
      switchTab('viewFeed');
      triggerHaptic('success');
      showToast(t('toast.cardAdded', { category: CATEGORY_META[category].name }));
    });
  }

  document.getElementById('btnResetCustomCards')?.addEventListener('click', () => {
    if (state.customCards.length === 0) return;
    const count = state.customCards.length;
    showConfirmModal({
      title: t('confirm.resetCardsTitle'),
      message: t('confirm.resetCardsDesc', { count }),
      confirmText: t('confirm.resetCardsConfirm'),
      cancelText: t('confirm.cancel'),
      isDanger: true,
      onConfirm: () => {
        state.customCards = [];
        persistCustomCards();
        renderAllViews();
        triggerHaptic('delete');
        showToast(t('toast.cardsReset'));
      }
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeVideoModal();
      closeArticleModal();
      closeDockMixer();
      hideTooltip();
      document.getElementById('confirmModalBackdrop')?.classList.add('hidden');
      dismissCoachmark();
    }
  });
}

// ==========================================================================
// 인앱 유튜브 비디오 모달 제어 함수
// ==========================================================================
function extractYouTubeVideoId(url) {
  if (!url) return '6uc4QM79mZ8';
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : '6uc4QM79mZ8';
}

function openVideoModal(rawItem) {
  const backdrop = document.getElementById('videoSheetBackdrop');
  const iframe = document.getElementById('youtubeIframe');
  const badgeName = document.getElementById('sheetCategoryName');
  const indicator = document.getElementById('sheetIndicator');
  const extLink = document.getElementById('sheetExternalLink');
  const title = document.getElementById('sheetVideoTitle');
  const channel = document.getElementById('sheetChannelName');
  const duration = document.getElementById('sheetDuration');
  const summary = document.getElementById('sheetSummary');

  if (!backdrop || !iframe || !rawItem) return;

  const item = getLocalizedCard(rawItem, getLanguage());
  const meta = CATEGORY_META[item.category] || CATEGORY_META.study;
  const ytId = item.youtubeId || extractYouTubeVideoId(item.url);

  iframe.src = `https://www.youtube.com/embed/${ytId}?autoplay=1&playsinline=1&rel=0`;

  if (badgeName) badgeName.textContent = `${meta.name} · ${t('cards.video')}`;
  if (indicator) indicator.style.backgroundColor = meta.color;
  if (extLink) extLink.href = item.url;
  if (title) title.textContent = item.title;
  if (channel) channel.textContent = item.source;
  if (duration) duration.textContent = item.duration;
  if (summary) summary.textContent = item.summary;

  backdrop.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
  const backdrop = document.getElementById('videoSheetBackdrop');
  const iframe = document.getElementById('youtubeIframe');

  if (backdrop) backdrop.classList.add('hidden');
  if (iframe) iframe.src = '';
  document.body.style.overflow = '';
}

// ==========================================================================
// 인앱 기사 리더 모드 (Article Reader Mode) 모달 제어 함수
// ==========================================================================
let currentReadingArticle = null;

function openArticleModal(rawItem) {
  const backdrop = document.getElementById('articleSheetBackdrop');
  if (!backdrop || !rawItem) return;

  const item = getLocalizedCard(rawItem, getLanguage());
  currentReadingArticle = item;
  tracker.trackReaderOpen(rawItem);
  const meta = CATEGORY_META[item.category] || CATEGORY_META.study;

  // 1. 카테고리 뱃지 & 읽기 시간
  const badgeName = document.getElementById('articleCategoryName');
  const indicator = document.getElementById('articleIndicator');
  const readTime = document.getElementById('articleReadTime');
  const lang = getLanguage();
  if (badgeName) badgeName.textContent = `${meta.name} · ${t('cards.article')}`;
  if (indicator) indicator.style.backgroundColor = meta.color;
  let dur = item.duration || (lang === 'en' ? '5 min read' : '5분 읽기');
  if (lang === 'en' && typeof dur === 'string') {
    dur = dur.replace('분 읽기', ' min read').replace('분 분량', ' min');
  }
  if (readTime) readTime.textContent = dur;

  // 2. 북마크 버튼 상태
  updateArticleBookmarkButtonState();

  // 3. 원문 링크 (상단 및 하단 버튼)
  const extLink = document.getElementById('articleExternalLink');
  const footerOriginal = document.getElementById('btnArticleFooterOriginal');
  if (extLink) extLink.href = item.url;
  if (footerOriginal) footerOriginal.href = item.url;

  // 4. 히어로 썸네일 이미지
  const heroImg = document.getElementById('articleHeroImg');
  if (heroImg) {
    heroImg.src = item.imageUrl;
    heroImg.alt = item.title;
  }

  // 5. 메타 정보 (출처, 작성일)
  const sourceEl = document.getElementById('articleSource');
  const dateEl = document.getElementById('articleDate');
  if (sourceEl) sourceEl.textContent = item.source;
  if (dateEl) dateEl.textContent = item.date;

  // 6. 타이틀
  const titleEl = document.getElementById('articleTitle');
  if (titleEl) titleEl.textContent = item.title;

  // 7. 3줄 핵심 요약 (keyPoints) & 추천 이유
  const keyPointsEl = document.getElementById('articleKeyPoints');
  if (keyPointsEl) {
    let html = '';
    if (item.recommendationReason) {
      html += `
        <li class="article-recom-box">
          <div class="article-recom-badge">${t('reader.recomReason')}</div>
          <div class="article-recom-text">${item.recommendationReason}</div>
        </li>
      `;
    }
    const points = item.keyPoints && item.keyPoints.length > 0
      ? item.keyPoints
      : [item.summary];
    html += points.map((p) => `<li>${p}</li>`).join('');
    keyPointsEl.innerHTML = html;
  }

  // 8. 본문 상세 섹션
  const contentEl = document.getElementById('articleFullContent');
  if (contentEl) {
    if (item.sections && item.sections.length > 0) {
      contentEl.innerHTML = item.sections.map((sec) => `
        <div class="article-section-block">
          <h3 class="article-section-heading">${sec.heading}</h3>
          <p class="article-section-body">${sec.body}</p>
        </div>
      `).join('');
    } else {
      contentEl.innerHTML = `
        <div class="article-section-block">
          <p class="article-section-body">${item.summary}</p>
        </div>
      `;
    }
  }

  // 9. 하단 알고리즘 박스 텍스트 & 테두리 포인트
  const summaryCard = document.querySelector('.article-summary-card');
  if (summaryCard) summaryCard.style.borderLeftColor = meta.color;

  const algoTitle = document.getElementById('articleAlgoTitle');
  const algoDesc = document.getElementById('articleAlgoDesc');
  if (algoTitle) algoTitle.textContent = t('reader.feedbackTitle', { category: meta.name });
  if (algoDesc) algoDesc.textContent = t('reader.feedbackDesc', { category: meta.name });

  // 스크롤 맨 위로 리셋
  const bodyEl = document.getElementById('articleReaderBody');
  if (bodyEl) bodyEl.scrollTop = 0;

  // 모달 열기 & 바디 스크롤 차단
  backdrop.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeArticleModal() {
  const backdrop = document.getElementById('articleSheetBackdrop');
  if (backdrop) backdrop.classList.add('hidden');
  tracker.trackReaderClose();
  currentReadingArticle = null;
  document.body.style.overflow = '';
}

function updateArticleBookmarkButtonState() {
  const btn = document.getElementById('btnArticleBookmark');
  if (!btn || !currentReadingArticle) return;
  const isSaved = state.savedIds.has(currentReadingArticle.id);
  btn.classList.toggle('saved', isSaved);
  btn.title = isSaved ? t('cards.bookmarkRemove') : t('cards.bookmarkSave');
  btn.setAttribute('aria-label', isSaved ? t('cards.bookmarkRemove') : t('cards.bookmarkSave'));
}

// 토스트 메시지
let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById('toastPopup');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.remove('hidden');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.add('hidden');
  }, 2200);
}

// ==========================================================================
// 상용앱 피드백 컴포넌트: 스낵바 (실행 취소 & 카운트다운 게이지)
// ==========================================================================
let snackbarTimer = null;
function showSnackbar(msg, actionText, onAction, duration = 4000) {
  const container = document.getElementById('snackbarContainer');
  const msgEl = document.getElementById('snackbarMessage');
  const btnEl = document.getElementById('snackbarActionBtn');
  const progressEl = document.getElementById('snackbarProgress');
  if (!container || !msgEl || !btnEl || !progressEl) return;

  if (snackbarTimer) clearTimeout(snackbarTimer);

  msgEl.textContent = msg;
  btnEl.textContent = actionText || t('toast.undo');

  // 카운트다운 프로그레스 바 CSS 애니메이션 리셋
  progressEl.classList.remove('animate');
  progressEl.style.animationDuration = `${duration}ms`;
  void progressEl.offsetWidth; // Reflow 트리거
  progressEl.classList.add('animate');

  btnEl.onclick = () => {
    container.classList.add('hidden');
    if (snackbarTimer) clearTimeout(snackbarTimer);
    if (typeof onAction === 'function') onAction();
    btnEl.onclick = null;
  };

  container.classList.remove('hidden');

  snackbarTimer = setTimeout(() => {
    container.classList.add('hidden');
    btnEl.onclick = null;
  }, duration);
}

// ==========================================================================
// 상용앱 피드백 컴포넌트: 확인 모달 다이얼로그 (Confirm Modal Dialog)
// ==========================================================================
function showConfirmModal({ title, message, confirmText = t('confirm.ok'), cancelText = t('confirm.cancel'), isDanger = true, onConfirm, onCancel }) {
  const backdrop = document.getElementById('confirmModalBackdrop');
  const titleEl = document.getElementById('confirmModalTitle');
  const descEl = document.getElementById('confirmModalDesc');
  const btnConfirm = document.getElementById('btnModalConfirm');
  const btnCancel = document.getElementById('btnModalCancel');
  const iconWrap = document.getElementById('confirmModalIcon');
  if (!backdrop || !titleEl || !descEl || !btnConfirm || !btnCancel) return;

  titleEl.textContent = title;
  descEl.textContent = message;
  btnConfirm.textContent = confirmText;
  btnCancel.textContent = cancelText;

  if (isDanger) {
    btnConfirm.classList.remove('primary-mode');
    iconWrap?.classList.remove('info-mode');
  } else {
    btnConfirm.classList.add('primary-mode');
    iconWrap?.classList.add('info-mode');
  }

  const close = () => {
    backdrop.classList.add('hidden');
    btnConfirm.onclick = null;
    btnCancel.onclick = null;
    backdrop.onclick = null;
  };

  btnConfirm.onclick = () => {
    triggerHaptic('medium');
    close();
    if (typeof onConfirm === 'function') onConfirm();
  };

  btnCancel.onclick = () => {
    triggerHaptic('light');
    close();
    if (typeof onCancel === 'function') onCancel();
  };

  backdrop.onclick = (e) => {
    if (e.target === backdrop) {
      close();
      if (typeof onCancel === 'function') onCancel();
    }
  };

  backdrop.classList.remove('hidden');
}

// ==========================================================================
// 상용앱 피드백 컴포넌트: 컨텍스추얼 툴팁 팝오버 (Tooltip Popover)
// ==========================================================================
let activeTooltipTrigger = null;

function showTooltip(triggerEl, text) {
  const popover = document.getElementById('tooltipPopover');
  const body = document.getElementById('tooltipBody');
  const arrow = document.getElementById('tooltipArrow');
  if (!popover || !body || !arrow || !triggerEl) return;

  if (activeTooltipTrigger === triggerEl && !popover.classList.contains('hidden')) {
    hideTooltip();
    return;
  }

  body.textContent = text;
  popover.classList.remove('hidden');
  activeTooltipTrigger = triggerEl;

  const rect = triggerEl.getBoundingClientRect();
  const popRect = popover.getBoundingClientRect();

  let top = rect.top - popRect.height - 8;
  let isAbove = true;
  if (top < 12) {
    top = rect.bottom + 8;
    isAbove = false;
  }

  let left = rect.left + rect.width / 2 - popRect.width / 2;
  left = Math.max(12, Math.min(window.innerWidth - popRect.width - 12, left));

  popover.style.top = `${top}px`;
  popover.style.left = `${left}px`;

  const arrowLeft = rect.left + rect.width / 2 - left - 4;
  arrow.style.left = `${Math.max(10, Math.min(popRect.width - 18, arrowLeft))}px`;
  if (isAbove) {
    arrow.style.bottom = '-4px';
    arrow.style.top = 'auto';
  } else {
    arrow.style.top = '-4px';
    arrow.style.bottom = 'auto';
  }
}

function hideTooltip() {
  const popover = document.getElementById('tooltipPopover');
  if (popover) popover.classList.add('hidden');
  activeTooltipTrigger = null;
}

// ==========================================================================
// 상용앱 피드백 컴포넌트: 코치마크 스포트라이트 가이드 (Coachmark Onboarding)
// ==========================================================================
function getCoachmarkSteps() {
  return [
    {
      targetId: 'dockPeekBar',
      badge: t('coachmark.badge1'),
      title: t('coachmark.title1'),
      desc: t('coachmark.desc1'),
      nextText: t('coachmark.next')
    },
    {
      targetId: 'presetContainer',
      badge: t('coachmark.badge2'),
      title: t('coachmark.title2'),
      desc: t('coachmark.desc2'),
      nextText: t('coachmark.start')
    }
  ];
}

let currentCoachmarkStep = 0;

function startCoachmarkTour() {
  currentCoachmarkStep = 0;
  showCoachmarkStep(0);
}

function showCoachmarkStep(stepIndex) {
  const overlay = document.getElementById('coachmarkOverlay');
  const spotlight = document.getElementById('coachmarkSpotlight');
  const card = document.getElementById('coachmarkCard');
  const badge = document.getElementById('coachmarkBadge');
  const title = document.getElementById('coachmarkTitle');
  const desc = document.getElementById('coachmarkDesc');
  const btnNext = document.getElementById('btnCoachmarkNext');
  const btnSkip = document.getElementById('btnCoachmarkSkip');

  if (!overlay || !spotlight || !card || !badge || !title || !desc || !btnNext) return;

  const steps = getCoachmarkSteps();
  const step = steps[stepIndex];
  if (!step) {
    dismissCoachmark();
    return;
  }

  const target = document.getElementById(step.targetId);
  if (!target) {
    dismissCoachmark();
    return;
  }

  badge.textContent = step.badge;
  title.textContent = step.title;
  desc.textContent = step.desc;
  btnNext.textContent = step.nextText;
  if (btnSkip) btnSkip.textContent = t('coachmark.skip');

  overlay.classList.remove('hidden');

  const rect = target.getBoundingClientRect();
  const pad = 6;
  const top = Math.max(0, rect.top - pad);
  const left = Math.max(0, rect.left - pad);
  const width = rect.width + pad * 2;
  const height = rect.height + pad * 2;

  spotlight.style.top = `${top}px`;
  spotlight.style.left = `${left}px`;
  spotlight.style.width = `${width}px`;
  spotlight.style.height = `${height}px`;

  // 타겟의 상하 위치에 맞춰 안내 카드 자동 배치
  const cardHeight = 150;
  let cardTop = top - cardHeight - 14;
  if (cardTop < 20 || top < window.innerHeight / 2) {
    cardTop = top + height + 14;
  }
  let cardLeft = left + width / 2 - 160;
  cardLeft = Math.max(16, Math.min(window.innerWidth - 336, cardLeft));

  card.style.top = `${cardTop}px`;
  card.style.left = `${cardLeft}px`;
}

function dismissCoachmark() {
  const overlay = document.getElementById('coachmarkOverlay');
  if (overlay) overlay.classList.add('hidden');
  try {
    localStorage.setItem(STORAGE_KEYS.COACHMARK_SEEN, 'true');
  } catch (e) {}
}

/* ==========================================================================
   PWA & 모바일 네이티브 앱 엔진 (A2HS, Service Worker, 햅틱 & 네트워크 감지)
   ========================================================================== */

let deferredInstallPrompt = null;

// iOS Safari 기기 감지 (PWA 설치 안내 맞춤 분기용)
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

// 1) Service Worker 등록 및 캐시/버전 동기화
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      // 새 버전 배포 감지 시 스낵바 알림
      registration.addEventListener('updatefound', () => {
        const installingWorker = registration.installing;
        if (installingWorker) {
          installingWorker.addEventListener('statechange', () => {
            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
              showSnackbar(t('toast.appUpdated'), t('toast.reload'), () => {
                window.location.reload();
              }, 7000);
            }
          });
        }
      });
    }).catch((err) => {
      console.debug('ServiceWorker 등록 예외:', err);
    });
  });
}

// 2) 브라우저 설치 프롬프트 (Android Chrome / Edge / 데스크톱)
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  showInstallUI();
});

// 3) 앱 설치 완료 이벤트
window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  hideInstallUI();
  triggerHaptic('success');
  showToast(t('toast.appInstalled'));
});

// 설치 UI 노출 관리
function showInstallUI() {
  if (isStandalone) return;
  const isDismissed = sessionStorage.getItem('mamgorithm_install_dismissed') === 'true';

  const btnHeaderInstall = document.getElementById('btnInstallApp');
  if (btnHeaderInstall) {
    btnHeaderInstall.classList.remove('hidden');
  }

  const installBanner = document.getElementById('appInstallBanner');
  if (installBanner && !isDismissed) {
    installBanner.classList.remove('hidden');
  }
}

function hideInstallUI() {
  const btnHeaderInstall = document.getElementById('btnInstallApp');
  if (btnHeaderInstall) btnHeaderInstall.classList.add('hidden');

  const installBanner = document.getElementById('appInstallBanner');
  if (installBanner) installBanner.classList.add('hidden');
}

// 앱 설치 실행 트리거 (Android/Chrome or iOS 분기)
function handleInstallApp() {
  triggerHaptic('medium');

  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    deferredInstallPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        hideInstallUI();
      }
      deferredInstallPrompt = null;
    });
  } else if (isIOS) {
    showIosInstallModal();
  } else {
    // 이미 설치되었거나 기타 브라우저인 경우 가이드 토스트
    showToast(t('toast.iosGuide'));
  }
}

// iOS Safari용 안내 바텀시트
function showIosInstallModal() {
  const sheet = document.getElementById('iosInstallSheet');
  if (!sheet) return;
  sheet.classList.remove('hidden');
  triggerHaptic('light');
}

function hideIosInstallModal() {
  const sheet = document.getElementById('iosInstallSheet');
  if (!sheet) return;
  sheet.classList.add('hidden');
  triggerHaptic('light');
}

// PWA UI 이벤트 리스너 초기화
function initPwaFeatures() {
  // 이미 홈 화면 PWA로 실행 중일 때 바디에 표시
  if (isStandalone) {
    document.body.classList.add('is-pwa-standalone');
    hideInstallUI();
  } else if (isIOS) {
    // iOS Safari는 beforeinstallprompt가 발생하지 않으므로 직접 노출 조건 체크
    showInstallUI();
  }

  // 헤더 앱 설치 버튼
  document.getElementById('btnInstallApp')?.addEventListener('click', () => {
    handleInstallApp();
  });

  // 피드 상단 배너 설치 버튼
  document.getElementById('btnBannerInstall')?.addEventListener('click', () => {
    handleInstallApp();
  });

  // 피드 상단 배너 닫기 버튼
  document.getElementById('btnBannerDismiss')?.addEventListener('click', () => {
    triggerHaptic('light');
    const installBanner = document.getElementById('appInstallBanner');
    if (installBanner) installBanner.classList.add('hidden');
    sessionStorage.setItem('mamgorithm_install_dismissed', 'true');
  });

  // iOS 바텀시트 닫기 이벤트
  document.getElementById('btnIosInstallDone')?.addEventListener('click', () => {
    hideIosInstallModal();
  });
  document.getElementById('iosInstallBackdrop')?.addEventListener('click', () => {
    hideIosInstallModal();
  });

  // 네트워크 상태 실시간 모니터링
  window.addEventListener('online', () => {
    showToast(t('toast.online'));
  });
  window.addEventListener('offline', () => {
    showToast(t('toast.offline'));
  });
}

// DOM 준비 시 PWA 기능 구동
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPwaFeatures);
} else {
  initPwaFeatures();
}
