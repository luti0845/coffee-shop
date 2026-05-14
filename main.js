/**
 * Artisan Coffee — 網站互動邏輯
 * NOTE: 處理導覽列滾動效果、漢堡選單、菜單分類切換、滾動淡入動畫
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHamburger();
  initMenuTabs();
  initScrollAnimations();
  initFormSubmit();
});

/* ===== 導覽列滾動效果 ===== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  /** NOTE: 滾動超過 80px 時加上背景模糊效果，提升文字可讀性 */
  const handleScroll = () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ===== 手機版漢堡選單 ===== */
function initHamburger() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navLinks = document.getElementById('navLinks');
  if (!hamburgerBtn || !navLinks) return;

  hamburgerBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
  });

  /** NOTE: 點擊選單連結後自動關閉手機版選單 */
  navLinks.querySelectorAll('.navbar__link').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ===== 菜單分類切換 ===== */
function initMenuTabs() {
  const tabs = document.querySelectorAll('.menu__tab');
  const items = document.querySelectorAll('.menu-item');
  if (tabs.length === 0) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const category = tab.dataset.tab;

      // 更新 active 狀態
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      // 切換顯示的菜單項目
      items.forEach((item) => {
        if (item.dataset.category === category) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ===== 滾動淡入動畫 (Intersection Observer) ===== */
function initScrollAnimations() {
  const fadeElements = document.querySelectorAll('.fade-in');
  if (fadeElements.length === 0) return;

  /**
   * NOTE: 使用 IntersectionObserver 取代 scroll 事件監聽，
   * 效能更好且不會造成主執行緒阻塞
   */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  fadeElements.forEach((el) => observer.observe(el));
}

/* ===== 表單提交回饋 ===== */
function initFormSubmit() {
  const form = document.getElementById('ctaForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('.cta__submit');
    const input = form.querySelector('.cta__input');

    // 顯示載入狀態
    submitBtn.textContent = '處理中...';
    submitBtn.disabled = true;

    // NOTE: 模擬 API 呼叫延遲
    setTimeout(() => {
      submitBtn.textContent = '已訂閱 ✓';
      submitBtn.style.background = '#6B7B3C';
      submitBtn.style.color = 'white';
      input.value = '';
      input.placeholder = '感謝你的訂閱！';

      // 3 秒後恢復原狀
      setTimeout(() => {
        submitBtn.textContent = '立即訂閱';
        submitBtn.disabled = false;
        submitBtn.style.background = '';
        submitBtn.style.color = '';
        input.placeholder = '輸入你的 Email';
      }, 3000);
    }, 1200);
  });
}
