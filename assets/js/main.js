/* ============================================
   凤飞花香作品集 — 暗黑诗意风格交互脚本
   ============================================ */

// ---- 导航栏滚动效果 ----
(function () {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();

// ---- 汉堡菜单 ----
(function () {
  const hamburger = document.querySelector('.navbar__hamburger');
  const navLinks = document.querySelector('.navbar__links');
  if (!hamburger || !navLinks) return;
  hamburger.addEventListener('click', function () {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      navLinks.classList.remove('open');
    });
  });
})();

// ---- 滚动淡入动画（Intersection Observer）----
var fadeObserver = null;
(function () {
  var fadeEls = document.querySelectorAll('.fade-up, .fade-in');
  if (!fadeEls.length) return;
  fadeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.01, rootMargin: '0px 0px -40px 0px' });
  fadeEls.forEach(function (el) { fadeObserver.observe(el); });
})();

// ---- 辅助：将元素加入淡入观察（供 DOMContentLoaded 复用）----
function observeFadeEl(el) {
  if (fadeObserver && el) fadeObserver.observe(el);
}

// ---- 图片 Lightbox ----
(function () {
  var lb = document.getElementById('lightbox');
  if (!lb) return;
  var lbImg = document.getElementById('lightbox-img');
  var lbImgs = [];
  var lbIdx = 0;

  function openLB(imgs, idx) {
    lbImgs = imgs;
    lbIdx = idx;
    lbImg.src = imgs[idx].src;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLB() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  function lbNav(d) {
    lbIdx = (lbIdx + d + lbImgs.length) % lbImgs.length;
    lbImg.src = lbImgs[lbIdx].src;
  }

  window.openLightbox = openLB;
  window.closeLightbox = closeLB;
  window.lbNav = lbNav;

  // 所有带 data-lightbox 的图片点击放大
  document.querySelectorAll('[data-lightbox]').forEach(function (img, i) {
    img.style.cursor = 'pointer';
    img.addEventListener('click', function () {
      var all = document.querySelectorAll('[data-lightbox]');
      var arr = [];
      for (var j = 0; j < all.length; j++) arr.push(all[j]);
      openLB(arr, arr.indexOf(img));
    });
  });

  lb.addEventListener('click', function (e) {
    if (e.target === lb) closeLB();
  });

  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLB();
    if (e.key === 'ArrowLeft') lbNav(-1);
    if (e.key === 'ArrowRight') lbNav(1);
  });
})();

// ---- 作品筛选 ----
(function () {
  var filterBtns = document.querySelectorAll('[data-filter]');
  var workCards = document.querySelectorAll('[data-category]');
  if (!filterBtns.length || !workCards.length) return;
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('tag--active'); });
      btn.classList.add('tag--active');
      var f = btn.dataset.filter;
      workCards.forEach(function (card) {
        if (f === 'all' || card.dataset.category === f) {
          card.style.display = '';
          card.classList.add('fade-up');
          setTimeout(function () { card.classList.add('visible'); }, 50);
        } else {
          card.style.display = 'none';
          card.classList.remove('visible');
        }
      });
    });
  });
})();

// ---- 章节导航高亮（作品详情页）----
(function () {
  var snLinks = document.querySelectorAll('.sn-link');
  var sections = document.querySelectorAll('.work-section');
  if (!snLinks.length || !sections.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.id;
        snLinks.forEach(function (l) {
          l.classList.remove('active');
          l.style.background = 'transparent';
          l.style.color = 'rgba(255,255,255,0.5)';
        });
        var active = document.querySelector('.sn-link[href="#' + id + '"]');
        if (active) {
          active.classList.add('active');
          active.style.background = 'rgba(255,255,255,0.08)';
          active.style.color = '#FFFFFF';
        }
      }
    });
  }, { threshold: 0.2, rootMargin: '-80px 0px -60% 0px' });

  sections.forEach(function (s) { observer.observe(s); });

  // 章节导航点击平滑滚动
  snLinks.forEach(function (l) {
    l.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.querySelector(l.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

// ---- 页面加载后初始化 ----
document.addEventListener('DOMContentLoaded', function () {
  // 为首页/列表页元素补充 fade-up 类（排除 page-header，避免父容器遮挡子元素）
  document.querySelectorAll(
    '.work-card, .about-brief, .tags, .work-detail__overview, .work-section, .timeline__item, .skill-tag, .contact-link'
  ).forEach(function (el) {
    if (!el.classList.contains('fade-up') && !el.classList.contains('fade-in')) {
      el.classList.add('fade-up');
      observeFadeEl(el); // 新增的元素也要加入观察，否则永远 opacity:0
    }
  });

  // 触发一次滚动检查
  setTimeout(function () {
    window.dispatchEvent(new Event('scroll'));
  }, 100);
});
