// ==========================================================================
// 맘고리즘 (내맘대로 알고리즘) - Modern Product Script with Mini Dock & Recipe Sharing
// ==========================================================================
import { CATEGORY_META, LEVEL_LABELS, getLevelDescription, CONTENT_DATA, PRESET_MODES } from './data.js';
import {
  isFirebaseConfigured,
  currentUser,
  saveUserSettingsToCloud,
  loadUserSettingsFromCloud
} from './firebase.js';

const STORAGE_KEYS = {
  WEIGHTS: 'mamgorithm_weights_v2',
  SAVED_IDS: 'mamgorithm_saved_v2',
  THEME: 'mamgorithm_theme_v2',
  ONBOARDED: 'mamgorithm_onboarded_v2',
  COACHMARK_SEEN: 'mamgorithm_coachmark_seen',
  UI_MODE: 'mamgorithm_ui_mode_v2'
};

// 애플리케이션 상태 (0~100% 가중치 스케일)
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
  darkMode: false,
  uiMode: 'glass', // 'glass' (신규 애플 글래스모피즘) | 'classic' (기존 클래식 모던)
  isDockExpanded: false
};

// ==========================================================================
// 햅틱 진동 피드백 유틸리티 (갤럭시 및 모바일 환경 최적화)
// 갤럭시 리니어 모터 관성을 고려해 30~45ms로 쫀득한 손맛 보정
// ==========================================================================
function triggerHaptic(type = 'light') {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator && typeof navigator.vibrate === 'function') {
    try {
      switch (type) {
        case 'light': // 슬라이더 틱(딸깍), 탭 이동, 필터 변경 (30ms)
          navigator.vibrate(30);
          break;
        case 'medium': // 프리셋 선택, 셔플, 믹서 시트 오픈 (40ms)
          navigator.vibrate(40);
          break;
        case 'success': // 온보딩 피드 입장, 북마크 저장, 레시피 복사 완료
          navigator.vibrate([25, 45, 30]);
          break;
        case 'delete': // 북마크 해제, 균형 리셋
          navigator.vibrate([30, 50, 25]);
          break;
        default:
          navigator.vibrate(30);
      }
    } catch (e) {}
  }
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
  loadSavedPreferences();
  checkRecipeFromUrl(); // URL 공유 레시피 파라미터 감지 (?s=50&t=50&c=50&h=50)
  bindUIEvents();
  renderAllViews({ withSkeleton: true, delay: 350 });

  // 첫 방문 시 인터랙티브 믹서 온보딩 화면 자동 노출
  const hasOnboarded = localStorage.getItem(STORAGE_KEYS.ONBOARDED);
  if (!hasOnboarded) {
    openOnboarding();
  } else {
    // 온보딩 완료 후 코치마크 미확인 사용자에게 가이드 안내
    const hasSeenCoachmark = localStorage.getItem(STORAGE_KEYS.COACHMARK_SEEN);
    if (!hasSeenCoachmark) {
      setTimeout(() => startCoachmarkTour(), 600);
    }
  }
});

// 로컬 설정 불러오기
function loadSavedPreferences() {
  try {
    const savedWeights = localStorage.getItem(STORAGE_KEYS.WEIGHTS);
    if (savedWeights) {
      const parsed = JSON.parse(savedWeights);
      const maxVal = Math.max(...['study', 'tech', 'culture', 'hobby'].map((c) => (typeof parsed[c] === 'number' ? parsed[c] : 0)));
      const isOldScale = maxVal <= 3; // 이전 0~3 단계 레거시 데이터 감지

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

    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    if (savedTheme === 'dark') {
      state.darkMode = true;
      document.body.classList.add('dark-mode');
    }

    const savedUiMode = localStorage.getItem(STORAGE_KEYS.UI_MODE);
    state.uiMode = savedUiMode === 'classic' ? 'classic' : 'glass';
    setUiMode(state.uiMode, false);
  } catch (err) {
    console.warn('설정 불러오기 실패:', err);
  }
}

// UI 디자인 모드 (클래식 모던 vs 애플 글래스모피즘) 전환 제어
function setUiMode(mode, notify = true) {
  state.uiMode = mode;
  const isGlass = mode === 'glass';
  document.body.classList.toggle('apple-glass', isGlass);

  // 상단 퀵 버튼 라벨 갱신
  const quickLabel = document.getElementById('uiToggleLabel');
  if (quickLabel) {
    quickLabel.textContent = isGlass ? 'Glass' : 'Classic';
  }
  const quickBtn = document.getElementById('btnUiQuickToggle');
  if (quickBtn) {
    quickBtn.title = isGlass ? '현재: 애플 글래스 모드 (클릭 시 클래식 전환)' : '현재: 클래식 모던 (클릭 시 애플 글래스 전환)';
    quickBtn.classList.toggle('active', isGlass);
  }

  // 내 알고리즘 설정 탭 상태 갱신
  const pill = document.getElementById('currentUiModePill');
  if (pill) {
    pill.textContent = isGlass ? '애플 글래스' : '클래식 모던';
  }
  document.getElementById('btnSelectClassic')?.classList.toggle('active', !isGlass);
  document.getElementById('btnSelectGlass')?.classList.toggle('active', isGlass);

  try {
    localStorage.setItem(STORAGE_KEYS.UI_MODE, mode);
  } catch (e) {}

  if (notify) {
    triggerHaptic('medium');
    showToast(isGlass ? '애플 글래스 UI가 적용되었습니다.' : '클래식 모던 UI로 전환되었습니다.');
  }
}

function persistWeights() {
  try {
    localStorage.setItem(STORAGE_KEYS.WEIGHTS, JSON.stringify(state.weights));
    if (isFirebaseConfigured() && currentUser?.uid) {
      saveUserSettingsToCloud(currentUser.uid, state.weights);
    }
  } catch (err) {}
}

function persistBookmarks() {
  try {
    localStorage.setItem(STORAGE_KEYS.SAVED_IDS, JSON.stringify([...state.savedIds]));
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
      showToast('공유받은 알고리즘 레시피가 적용되었습니다!');
    }
  } catch (e) {}
}

// 현재 알고리즘 레시피 공유하기
function shareCurrentRecipe() {
  const url = `${window.location.origin}${window.location.pathname}?s=${state.weights.study}&t=${state.weights.tech}&c=${state.weights.culture}&h=${state.weights.hobby}`;
  const shareText = `내가 직접 튜닝한 맘고리즘 추천 비율 (공부 ${state.weights.study}% · 기술 ${state.weights.tech}% · 문화 ${state.weights.culture}% · 취미 ${state.weights.hobby}%)을 확인해보세요!`;

  if (navigator.share) {
    navigator.share({
      title: '맘고리즘 - 내 알고리즘 레시피',
      text: shareText,
      url
    }).then(() => {
      triggerHaptic('success');
    }).catch(() => {});
  } else if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      triggerHaptic('success');
      showToast('알고리즘 레시피 링크가 복사되었습니다.');
    }).catch(() => {
      prompt('아래 링크를 복사하여 공유하세요:', url);
    });
  } else {
    prompt('아래 링크를 복사하여 공유하세요:', url);
  }
}

// ==========================================================================
// 핵심 알고리즘: 비율(%) 및 카테고리별 카드 수 계산 (Largest Remainder)
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
  let allocatedSum = 0;
  const remainders = [];

  categories.forEach((cat) => {
    const w = state.weights[cat];
    const ratio = w / totalWeight;
    const exactPct = ratio * 100;
    const exactCards = ratio * targetTotalCards;
    const floorCards = Math.floor(exactCards);

    allocatedSum += floorCards;
    remainders.push({ cat, rem: exactCards - floorCards, weight: w });

    result[cat] = {
      weight: w,
      exactPct,
      displayPct: Math.round(exactPct),
      cardCount: floorCards
    };
  });

  let remainingCards = targetTotalCards - allocatedSum;
  remainders
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

  const filteredPool = CONTENT_DATA.filter((item) => {
    if (state.contentType === 'all') return true;
    return item.type === state.contentType;
  });

  const buckets = {};
  ['study', 'tech', 'culture', 'hobby'].forEach((cat) => {
    const quota = allocation.categories[cat].cardCount;
    if (quota <= 0) {
      buckets[cat] = [];
      return;
    }
    const catItems = seededShuffle(
      filteredPool.filter((item) => item.category === cat),
      state.shuffleSeed
    );
    const selected = [];
    for (let i = 0; i < quota && catItems.length > 0; i++) {
      selected.push(catItems[i % catItems.length]);
    }
    buckets[cat] = selected;
  });

  const interleaved = [];
  const sortedCats = ['study', 'tech', 'culture', 'hobby'].sort(
    (a, b) => state.weights[b] - state.weights[a]
  );

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
}

// 스켈레톤 쉬머 마크업 생성기 (오늘의집/토스 스타일)
function createSkeletonCardMarkup() {
  return `
    <div class="skeleton-card" aria-hidden="true">
      <div class="skeleton-media-wrap skeleton-shimmer">
        <div class="skeleton-badge-overlay"></div>
        <div class="skeleton-duration-overlay"></div>
      </div>
      <div class="skeleton-content-body">
        <div class="skeleton-line skeleton-title-1 skeleton-shimmer"></div>
        <div class="skeleton-line skeleton-title-2 skeleton-shimmer"></div>
        <div class="skeleton-line skeleton-desc skeleton-shimmer"></div>
        <div class="skeleton-meta-row">
          <div class="skeleton-meta-avatar skeleton-shimmer"></div>
          <div class="skeleton-line skeleton-meta-text skeleton-shimmer"></div>
          <div class="skeleton-line skeleton-meta-date skeleton-shimmer"></div>
        </div>
      </div>
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

  // 1. 스켈레톤 즉시 표시 (일렁이는 쉬머 효과)
  renderSkeletonCards(container, 3);

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

function createCardMarkup(item) {
  const meta = CATEGORY_META[item.category];
  const isSaved = state.savedIds.has(item.id);
  const isVideo = item.type === 'video';
  const typeText = isVideo ? '영상' : '기사';

  return `
    <article
      class="content-feed-card"
      data-id="${item.id}"
      data-type="${item.type}"
      data-url="${item.url}"
      role="link"
      tabindex="0"
      aria-label="${meta.name} ${typeText}: ${item.title}"
    >
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
          <span>${meta.name} · ${typeText}</span>
        </div>
        ${item.isNew ? '<span class="card-badge-new">NEW</span>' : ''}
        <span class="card-duration-overlay">${item.duration}</span>
        <button
          type="button"
          class="card-bookmark-btn ${isSaved ? 'saved' : ''}"
          data-bookmark-id="${item.id}"
          title="${isSaved ? '보관함에서 제거' : '보관함에 저장'}"
          aria-label="북마크"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      </div>

      <div class="card-content-body">
        <h3 class="card-title-text">${item.title}</h3>
        <p class="card-summary-text">${item.summary}</p>
        <div class="card-meta-bar">
          <span class="card-meta-source">${item.source} · ${item.date}</span>
          <span class="card-meta-link">
            <span>바로가기</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M7 17l9.2-9.2M17 17V8H8"/>
            </svg>
          </span>
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
        <div class="empty-feed-title">관심 분야가 모두 꺼져 있습니다</div>
        <p class="empty-feed-desc">맘고리즘은 사용자가 원하는 분야만 추천합니다.<br/>하단 미니 독을 터치해 관심 분야를 1단계 이상으로 올려보세요.</p>
        <button type="button" class="btn-primary-reset" id="btnRestoreBalance">균형 모드로 켜기</button>
      </div>
    `;
    const btn = document.getElementById('btnRestoreBalance');
    if (btn) {
      btn.addEventListener('click', () => {
        state.weights = { study: 50, tech: 50, culture: 50, hobby: 50 };
        persistWeights();
        renderAllViews();
        triggerHaptic('medium');
        showToast('균형 모드가 적용되었습니다.');
      });
    }
    return;
  }

  const cards = buildFeedList(allocation);
  container.innerHTML = cards.map(createCardMarkup).join('');
}

// ==========================================================================
// 하단 미니 독 & 확장 믹서 시트 렌더링
// ==========================================================================
// 미니 독 상단 게이지 & 누적 바 & 레전드만 가볍게 갱신 (슬라이더 드래그 중 부드러운 60fps 유지)
function updateDockGauges(allocation) {
  const categories = ['study', 'tech', 'culture', 'hobby'];

  const topGauge = document.getElementById('dockTopGauge');
  if (topGauge) {
    if (allocation.totalWeight === 0) {
      topGauge.innerHTML = `<div class="gauge-segment" style="width:100%; background:var(--border-color)"></div>`;
    } else {
      topGauge.innerHTML = categories.map((cat) => {
        const meta = CATEGORY_META[cat];
        const pct = allocation.categories[cat].exactPct;
        return `<div class="gauge-segment" style="width:${pct}%; background-color:${meta.color}"></div>`;
      }).join('');
    }
  }

  const ratioPills = document.getElementById('dockRatioPills');
  if (ratioPills) {
    if (allocation.totalWeight === 0) {
      ratioPills.innerHTML = `<span style="font-size:0.74rem; color:var(--text-muted); font-weight:600;">모든 분야 제외됨 (터치하여 설정)</span>`;
    } else {
      ratioPills.innerHTML = categories
        .filter((cat) => state.weights[cat] > 0)
        .map((cat) => {
          const meta = CATEGORY_META[cat];
          const alloc = allocation.categories[cat];
          return `
            <span class="dock-ratio-pill">
              <span class="dock-ratio-dot" style="background-color: ${meta.color}"></span>
              <span>${meta.name} ${alloc.displayPct}%</span>
            </span>
          `;
        }).join('');
    }
  }

  const stackedBar = document.getElementById('dockStackedBar');
  const legendRow = document.getElementById('dockLegendRow');
  if (stackedBar) {
    if (allocation.totalWeight === 0) {
      stackedBar.innerHTML = `<div class="gauge-segment" style="width:100%; background:var(--border-color)"></div>`;
    } else {
      stackedBar.innerHTML = categories.map((cat) => {
        const meta = CATEGORY_META[cat];
        const pct = allocation.categories[cat].exactPct;
        return `<div class="gauge-segment" style="width:${pct}%; background-color:${meta.color}"></div>`;
      }).join('');
    }
  }

  if (legendRow) {
    legendRow.innerHTML = categories.map((cat) => {
      const meta = CATEGORY_META[cat];
      const alloc = allocation.categories[cat];
      return `
        <div class="gauge-legend-pill">
          <div class="legend-name-group">
            <span class="legend-dot" style="background-color: ${meta.color}"></span>
            <span>${meta.name}</span>
          </div>
          <span class="legend-pct-text">${alloc.displayPct}%</span>
        </div>
      `;
    }).join('');
  }
}

// 온보딩 게이지 갱신 헬퍼
function updateOnboardingGauges(allocation) {
  const categories = ['study', 'tech', 'culture', 'hobby'];
  const stackedBar = document.getElementById('onboardingStackedBar');
  const legendRow = document.getElementById('onboardingLegendRow');
  if (stackedBar) {
    if (allocation.totalWeight === 0) {
      stackedBar.innerHTML = `<div class="gauge-segment" style="width:100%; background:var(--border-color)"></div>`;
    } else {
      stackedBar.innerHTML = categories.map((cat) => {
        const meta = CATEGORY_META[cat];
        const pct = allocation.categories[cat].exactPct;
        return `<div class="gauge-segment" style="width:${pct}%; background-color:${meta.color}"></div>`;
      }).join('');
    }
  }
  if (legendRow) {
    legendRow.innerHTML = categories.map((cat) => {
      const meta = CATEGORY_META[cat];
      const alloc = allocation.categories[cat];
      return `
        <div class="gauge-legend-pill">
          <div class="legend-name-group">
            <span class="legend-dot" style="background-color: ${meta.color}"></span>
            <span>${meta.name}</span>
          </div>
          <span class="legend-pct-text">${alloc.displayPct}%</span>
        </div>
      `;
    }).join('');
  }
}

// 각 채널 카드의 상태 뱃지와 틱 마크 하이라이트 실시간 갱신
function updateAllChannelPills(container, allocation) {
  if (!container) return;
  container.querySelectorAll('[data-channel]').forEach((card) => {
    const cat = card.dataset.channel;
    const val = state.weights[cat];
    const alloc = allocation.categories[cat];
    const pill = card.querySelector('.channel-status-pill');
    if (pill) {
      pill.innerHTML = val === 0
        ? '0% (제외)'
        : `<b>${val}%</b> <span style="font-size:0.75em; opacity:0.8;">(피드 ${alloc.displayPct}%)</span>`;
    }
    const ticks = card.querySelectorAll('.tick-label');
    ticks.forEach((tick) => {
      const tickVal = parseInt(tick.dataset.val, 10);
      tick.classList.toggle('active', tickVal === val);
    });
  });
}

function updateMixerInlineValidation(allocation) {
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
  const categories = ['study', 'tech', 'culture', 'hobby'];
  updateDockGauges(allocation);
  updateMixerInlineValidation(allocation);

  // 4. 확장 패널 4개 슬라이더 목록
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
              <div>
                <div class="channel-name">${meta.name}</div>
                <div class="channel-desc">${meta.description}</div>
              </div>
            </div>
            <span class="channel-status-pill" style="border-left: 3px solid ${meta.color}">
              ${currentVal === 0 ? '0% (제외)' : `<b>${currentVal}%</b> <span style="font-size:0.75em; opacity:0.8;">(피드 ${alloc.displayPct}%)</span>`}
            </span>
          </div>

          <div class="slider-wrap">
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value="${currentVal}"
              class="channel-range-input dock-range-input"
              data-cat="${cat}"
              style="--thumb-color: ${meta.color}; background: linear-gradient(to right, ${meta.color} ${currentVal}%, var(--bg-subtle) ${currentVal}%);"
              aria-label="${meta.name} 관심도 슬라이더"
            />
            <div class="slider-ticks-row">
              <span class="tick-label ${currentVal === 0 ? 'active' : ''}" data-cat="${cat}" data-val="0">0% (제외)</span>
              <span class="tick-label ${currentVal === 25 ? 'active' : ''}" data-cat="${cat}" data-val="25">25%</span>
              <span class="tick-label ${currentVal === 50 ? 'active' : ''}" data-cat="${cat}" data-val="50">50%</span>
              <span class="tick-label ${currentVal === 75 ? 'active' : ''}" data-cat="${cat}" data-val="75">75%</span>
              <span class="tick-label ${currentVal === 100 ? 'active' : ''}" data-cat="${cat}" data-val="100">100%</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
}

function openDockMixer() {
  const container = document.getElementById('dockMixerContainer');
  if (!container) return;
  state.isDockExpanded = true;
  container.classList.add('expanded');
  document.getElementById('dockPeekBar')?.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  triggerHaptic('medium');
}

function closeDockMixer() {
  const container = document.getElementById('dockMixerContainer');
  if (!container) return;
  state.isDockExpanded = false;
  container.classList.remove('expanded');
  document.getElementById('dockPeekBar')?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  triggerHaptic('light');
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
          <td>${alloc.cardCount}장</td>
        </tr>
      `;
    })
    .join('');

  container.innerHTML = `
    <table class="stats-table">
      <thead>
        <tr>
          <th>분야</th>
          <th>설정 가중치</th>
          <th>추천 비율</th>
          <th>피드 카드 수</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

// 7. 보관함 뷰
function renderSavedView() {
  const container = document.getElementById('savedCardsList');
  const btnClear = document.getElementById('btnClearSaved');
  if (!container) return;

  const savedItems = CONTENT_DATA.filter((item) => state.savedIds.has(item.id));
  if (btnClear) {
    btnClear.classList.toggle('hidden', savedItems.length === 0);
  }

  if (savedItems.length === 0) {
    container.innerHTML = `
      <div class="empty-feed-placeholder">
        <div class="empty-feed-title">보관한 콘텐츠가 없습니다</div>
        <p class="empty-feed-desc">피드 카드의 북마크 버튼을 누르면<br/>나중에 다시 읽고 싶은 콘텐츠가 이곳에 저장됩니다.</p>
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
// 온보딩 (시작 화면) 렌더링 및 모달 제어
// ==========================================================================
function renderOnboardingView() {
  const overlay = document.getElementById('onboardingOverlay');
  if (!overlay || overlay.classList.contains('hidden')) return;

  const allocation = calculateAllocation();
  const presetContainer = document.getElementById('onboardingPresetRow');
  const stackedBar = document.getElementById('onboardingStackedBar');
  const legendRow = document.getElementById('onboardingLegendRow');
  const slidersList = document.getElementById('onboardingSlidersList');

  const categories = ['study', 'tech', 'culture', 'hobby'];

  if (presetContainer) {
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
  }

  if (stackedBar) {
    if (allocation.totalWeight === 0) {
      stackedBar.innerHTML = `<div class="gauge-segment" style="width:100%; background:var(--border-color)"></div>`;
    } else {
      stackedBar.innerHTML = categories.map((cat) => {
        const meta = CATEGORY_META[cat];
        const pct = allocation.categories[cat].exactPct;
        return `<div class="gauge-segment" style="width:${pct}%; background-color:${meta.color}"></div>`;
      }).join('');
    }
  }

  if (legendRow) {
    legendRow.innerHTML = categories.map((cat) => {
      const meta = CATEGORY_META[cat];
      const alloc = allocation.categories[cat];
      return `
        <div class="gauge-legend-pill">
          <div class="legend-name-group">
            <span class="legend-dot" style="background-color: ${meta.color}"></span>
            <span>${meta.name}</span>
          </div>
          <span class="legend-pct-text">${alloc.displayPct}%</span>
        </div>
      `;
    }).join('');
  }

  if (slidersList) {
    slidersList.innerHTML = categories.map((cat) => {
      const meta = CATEGORY_META[cat];
      const currentVal = state.weights[cat];
      const alloc = allocation.categories[cat];

      return `
        <div class="onboarding-channel-card" data-channel="${cat}">
          <div class="channel-top-line" style="margin-bottom:8px;">
            <div class="channel-title-group">
              <span class="channel-color-bar" style="background-color: ${meta.color}"></span>
              <span class="channel-name" style="font-size:0.88rem;">${meta.name}</span>
            </div>
            <span class="channel-status-pill" style="border-left: 3px solid ${meta.color}; font-size:0.72rem; padding:2px 7px;">
              ${currentVal === 0 ? '0% (제외)' : `<b>${currentVal}%</b> <span style="font-size:0.75em; opacity:0.8;">(피드 ${alloc.displayPct}%)</span>`}
            </span>
          </div>

          <div class="slider-wrap">
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value="${currentVal}"
              class="channel-range-input onboarding-range-input"
              data-cat="${cat}"
              style="--thumb-color: ${meta.color}; background: linear-gradient(to right, ${meta.color} ${currentVal}%, var(--bg-subtle) ${currentVal}%);"
              aria-label="${meta.name} 온보딩 관심도 슬라이더"
            />
            <div class="slider-ticks-row">
              <span class="tick-label ${currentVal === 0 ? 'active' : ''}" data-cat="${cat}" data-val="0">0%(제외)</span>
              <span class="tick-label ${currentVal === 25 ? 'active' : ''}" data-cat="${cat}" data-val="25">25%</span>
              <span class="tick-label ${currentVal === 50 ? 'active' : ''}" data-cat="${cat}" data-val="50">50%</span>
              <span class="tick-label ${currentVal === 75 ? 'active' : ''}" data-cat="${cat}" data-val="75">75%</span>
              <span class="tick-label ${currentVal === 100 ? 'active' : ''}" data-cat="${cat}" data-val="100">100%</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
}

function openOnboarding() {
  const overlay = document.getElementById('onboardingOverlay');
  if (!overlay) return;
  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  renderOnboardingView();
}

function closeOnboarding() {
  const overlay = document.getElementById('onboardingOverlay');
  if (overlay) overlay.classList.add('hidden');
  document.body.style.overflow = '';
  try {
    localStorage.setItem(STORAGE_KEYS.ONBOARDED, 'true');
  } catch (e) {}
  persistWeights();
  renderAllViews();
  triggerHaptic('success');
  showToast('내 맞춤 추천 피드가 열렸습니다.');

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

function bindUIEvents() {
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
      showToast('모든 분야가 0%입니다. 관심도를 1% 이상 올려주세요.');
      return;
    }
    closeDockMixer();
    switchTab('viewFeed');
    triggerHaptic('success');
    showToast('새로운 추천 비율이 피드에 적용되었습니다.');
  });

  // 미니 독 내부 균형 리셋 버튼 (확인 모달 다이얼로그)
  document.getElementById('btnResetMixerInDock')?.addEventListener('click', () => {
    showConfirmModal({
      title: '알고리즘 균형 재설정',
      message: '모든 분야 관심도를 50% 균등 분배로 재설정하시겠습니까?',
      confirmText: '재설정',
      cancelText: '취소',
      isDanger: false,
      onConfirm: () => {
        state.weights = { study: 50, tech: 50, culture: 50, hobby: 50 };
        persistWeights();
        renderAllViews();
        triggerHaptic('delete');
        showToast('모든 분야 관심도를 50% 균등으로 재설정했습니다.');
      }
    });
  });

  // 레시피 공유 버튼 (미니 독 & 내 알고리즘 탭)
  document.getElementById('btnShareRecipeInDock')?.addEventListener('click', shareCurrentRecipe);
  document.getElementById('btnShareRecipeInStats')?.addEventListener('click', shareCurrentRecipe);

  // 5) 미니 독 슬라이더 실시간 조절
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
        persistWeights();

        const meta = CATEGORY_META[cat];
        input.style.background = `linear-gradient(to right, ${meta.color} ${val}%, var(--bg-subtle) ${val}%)`;

        const allocation = calculateAllocation();
        updateDockGauges(allocation);
        updateMixerInlineValidation(allocation);
        updateAllChannelPills(dockSlidersList, allocation);
        renderPresetChips();
        renderFeedCards(allocation);
        renderStatsView(allocation);
      }
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

  // 6) 온보딩 화면 슬라이더 및 프리셋 이벤트
  const onboardingSliders = document.getElementById('onboardingSlidersList');
  if (onboardingSliders) {
    onboardingSliders.addEventListener('input', (e) => {
      const input = e.target.closest('.onboarding-range-input');
      if (!input) return;
      const cat = input.dataset.cat;
      const val = parseInt(input.value, 10);
      if (cat && !Number.isNaN(val)) {
        state.weights[cat] = Math.max(0, Math.min(100, val));
        triggerHaptic('light');

        const meta = CATEGORY_META[cat];
        input.style.background = `linear-gradient(to right, ${meta.color} ${val}%, var(--bg-subtle) ${val}%)`;

        const allocation = calculateAllocation();
        updateOnboardingGauges(allocation);
        updateAllChannelPills(onboardingSliders, allocation);
      }
    });

    onboardingSliders.addEventListener('click', (e) => {
      const tick = e.target.closest('.tick-label');
      if (!tick) return;
      const cat = tick.dataset.cat;
      const val = parseInt(tick.dataset.val, 10);
      if (cat && !Number.isNaN(val)) {
        state.weights[cat] = Math.max(0, Math.min(100, val));
        triggerHaptic('light');
        renderOnboardingView();
      }
    });
  }

  document.getElementById('onboardingPresetRow')?.addEventListener('click', (e) => {
    const chip = e.target.closest('.preset-chip-btn');
    if (!chip) return;
    const preset = PRESET_MODES.find((p) => p.id === chip.dataset.presetId);
    if (preset) {
      state.weights = { ...preset.weights };
      triggerHaptic('medium');
      renderOnboardingView();
    }
  });

  document.getElementById('btnOnboardingStart')?.addEventListener('click', closeOnboarding);

  document.getElementById('btnReopenOnboarding')?.addEventListener('click', () => {
    triggerHaptic('medium');
    openOnboarding();
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
      showToast(`${preset.name} 설정이 적용되었습니다.`);
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
      renderFeedCardsWithSkeleton(allocation, 220);
    });
  });

  // 9) 새로고침 셔플 버튼
  document.getElementById('btnShuffle')?.addEventListener('click', () => {
    const btn = document.getElementById('btnShuffle');
    if (btn) btn.classList.add('spinning');
    state.shuffleSeed += 1;
    triggerHaptic('medium');
    const allocation = calculateAllocation();
    renderFeedCardsWithSkeleton(allocation, 320, () => {
      if (btn) btn.classList.remove('spinning');
      showToast('새로운 추천 콘텐츠 조합을 불러왔습니다.');
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
        showSnackbar('보관함에서 제거되었습니다.', '실행 취소', () => {
          state.savedIds.add(id);
          persistBookmarks();
          renderAllViews();
          triggerHaptic('success');
          showToast('보관함에 다시 복원되었습니다.');
        }, 4500);
      } else {
        state.savedIds.add(id);
        persistBookmarks();
        renderAllViews();
        triggerHaptic('success');
        showToast('보관함에 저장되었습니다.');
      }
      return;
    }

    const card = e.target.closest('.content-feed-card');
    if (card) {
      const type = card.dataset.type;
      const id = card.dataset.id;
      const item = CONTENT_DATA.find((c) => c.id === id);

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
      showSnackbar('보관함에서 제거되었습니다.', '실행 취소', () => {
        state.savedIds.add(id);
        updateArticleBookmarkButtonState();
        persistBookmarks();
        renderAllViews();
        triggerHaptic('success');
        showToast('보관함에 다시 복원되었습니다.');
      }, 4500);
    } else {
      state.savedIds.add(id);
      updateArticleBookmarkButtonState();
      persistBookmarks();
      renderAllViews();
      triggerHaptic('success');
      showToast('보관함에 저장되었습니다.');
    }
  });

  // 보관함 전체 비우기 버튼 (확인 모달 다이얼로그 + 실행 취소 스낵바)
  document.getElementById('btnClearSaved')?.addEventListener('click', () => {
    if (state.savedIds.size === 0) return;
    const count = state.savedIds.size;
    showConfirmModal({
      title: '보관함 전체 비우기',
      message: `보관함에 저장된 콘텐츠 ${count}개를 모두 삭제하시겠습니까?`,
      confirmText: '전체 삭제',
      cancelText: '취소',
      isDanger: true,
      onConfirm: () => {
        const previous = new Set(state.savedIds);
        state.savedIds.clear();
        persistBookmarks();
        renderAllViews();
        triggerHaptic('delete');
        showSnackbar(`${count}개의 콘텐츠가 모두 삭제되었습니다.`, '실행 취소', () => {
          state.savedIds = new Set(previous);
          persistBookmarks();
          renderAllViews();
          triggerHaptic('success');
          showToast('보관함 콘텐츠가 모두 복원되었습니다.');
        }, 5000);
      }
    });
  });

  // 13) 컨텍스추얼 툴팁 이벤트
  document.getElementById('btnStatsTooltip')?.addEventListener('click', (e) => {
    e.stopPropagation();
    triggerHaptic('light');
    showTooltip(
      e.currentTarget,
      '맘고리즘은 전체 가중치 합산 대비 각 분야의 비율을 최대 잔여수(Largest Remainder) 방식으로 정밀 계산하여 피드 12장의 구성을 투명하게 맞춥니다.'
    );
  });

  document.getElementById('btnMixerTooltip')?.addEventListener('click', (e) => {
    e.stopPropagation();
    triggerHaptic('light');
    showTooltip(
      e.currentTarget,
      '슬라이더를 조절하면 다른 분야와의 상대 비율이 실시간 계산됩니다. 0%로 맞춘 분야는 피드에서 100% 원천 배제됩니다.'
    );
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.tooltip-popover') && !e.target.closest('.btn-tooltip-trigger')) {
      hideTooltip();
    }
  });

  window.addEventListener('scroll', () => {
    hideTooltip();
  }, { passive: true });

  // 14) 코치마크 투어 제어
  document.getElementById('btnCoachmarkSkip')?.addEventListener('click', () => {
    triggerHaptic('light');
    dismissCoachmark();
  });

  document.getElementById('btnCoachmarkNext')?.addEventListener('click', () => {
    if (currentCoachmarkStep < COACHMARK_STEPS.length - 1) {
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
    startCoachmarkTour();
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

  // 15) 다크모드 토글
  document.getElementById('btnThemeToggle')?.addEventListener('click', () => {
    state.darkMode = !state.darkMode;
    document.body.classList.toggle('dark-mode', state.darkMode);
    triggerHaptic('light');
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, state.darkMode ? 'dark' : 'light');
    } catch (err) {}
  });

  // 16) UI 모드 (클래식 모던 vs 애플 글래스) 전환 이벤트
  document.getElementById('btnUiQuickToggle')?.addEventListener('click', () => {
    const nextMode = state.uiMode === 'glass' ? 'classic' : 'glass';
    setUiMode(nextMode, true);
  });

  document.getElementById('btnSelectClassic')?.addEventListener('click', () => {
    if (state.uiMode !== 'classic') {
      setUiMode('classic', true);
    }
  });

  document.getElementById('btnSelectGlass')?.addEventListener('click', () => {
    if (state.uiMode !== 'glass') {
      setUiMode('glass', true);
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

function openVideoModal(item) {
  const backdrop = document.getElementById('videoSheetBackdrop');
  const iframe = document.getElementById('youtubeIframe');
  const badgeName = document.getElementById('sheetCategoryName');
  const indicator = document.getElementById('sheetIndicator');
  const extLink = document.getElementById('sheetExternalLink');
  const title = document.getElementById('sheetVideoTitle');
  const channel = document.getElementById('sheetChannelName');
  const duration = document.getElementById('sheetDuration');
  const summary = document.getElementById('sheetSummary');

  if (!backdrop || !iframe) return;

  const meta = CATEGORY_META[item.category];
  const ytId = item.youtubeId || extractYouTubeVideoId(item.url);

  iframe.src = `https://www.youtube.com/embed/${ytId}?autoplay=1&playsinline=1&rel=0`;

  if (badgeName) badgeName.textContent = `${meta.name} · 영상`;
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

function openArticleModal(item) {
  const backdrop = document.getElementById('articleSheetBackdrop');
  if (!backdrop || !item) return;

  currentReadingArticle = item;
  const meta = CATEGORY_META[item.category] || CATEGORY_META.study;

  // 1. 카테고리 뱃지 & 읽기 시간
  const badgeName = document.getElementById('articleCategoryName');
  const indicator = document.getElementById('articleIndicator');
  const readTime = document.getElementById('articleReadTime');
  if (badgeName) badgeName.textContent = `${meta.name} · 기사`;
  if (indicator) indicator.style.backgroundColor = meta.color;
  if (readTime) readTime.textContent = item.duration || '5분 읽기';

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
          <div class="article-recom-badge">맘고리즘 추천 이유</div>
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
  if (algoTitle) algoTitle.textContent = `${meta.name} 알고리즘 피드백`;
  if (algoDesc) algoDesc.textContent = `이 기사가 유익하셨다면 알고리즘 믹서에서 ${meta.name} 비율을 높여보세요.`;

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
  currentReadingArticle = null;
  document.body.style.overflow = '';
}

function updateArticleBookmarkButtonState() {
  const btn = document.getElementById('btnArticleBookmark');
  if (!btn || !currentReadingArticle) return;
  const isSaved = state.savedIds.has(currentReadingArticle.id);
  btn.classList.toggle('saved', isSaved);
  btn.title = isSaved ? '보관함에서 제거' : '보관함 저장';
  btn.setAttribute('aria-label', isSaved ? '보관함에서 제거' : '보관함 저장');
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
  btnEl.textContent = actionText || '실행 취소';

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
function showConfirmModal({ title, message, confirmText = '확인', cancelText = '취소', isDanger = true, onConfirm, onCancel }) {
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
const COACHMARK_STEPS = [
  {
    targetId: 'dockPeekBar',
    badge: 'TIP 1 / 2',
    title: '하단 미니 독으로 언제든 조절하세요',
    desc: '피드를 읽다가 언제든 하단 바를 살짝 위로 올리면 4가지 관심도의 추천 비율을 실시간으로 믹싱할 수 있습니다.',
    nextText: '다음'
  },
  {
    targetId: 'presetContainer',
    badge: 'TIP 2 / 2',
    title: '원터치 프리셋 & 셔플',
    desc: '상황에 맞는 프리셋 버튼을 눌러 분위기를 바꾸거나, 새로고침(셔플)으로 새로운 조합을 즉시 탐색해보세요.',
    nextText: '시작하기'
  }
];

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

  if (!overlay || !spotlight || !card || !badge || !title || !desc || !btnNext) return;

  const step = COACHMARK_STEPS[stepIndex];
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
