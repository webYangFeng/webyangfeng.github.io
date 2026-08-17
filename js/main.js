/* ============================================================
   个人简介网站 - 交互脚本
    功能：语言切换 / 滚动动画 / 返回顶部 / 移动端适配
   ============================================================ */

(function () {
    'use strict';

    // ---------- DOM elements ----------
    const body = document.body;
    const navbar = document.querySelector('.navbar');

    // Language toggle button
    const langToggleDesktop = document.querySelector('.nav-lang-desktop .lang-toggle');

    // Back-to-top button
    const backToTop = document.querySelector('.back-to-top');

    // ---------- 移动端断点检测 ----------
    const MOBILE_BREAKPOINT = 768;

    function isMobile() {
        return window.innerWidth <= MOBILE_BREAKPOINT;
    }

    // ---------- 语言切换 ----------
    const savedLang = localStorage.getItem('site-lang') || 'zh';

    /**
     * 应用语言设置并同步所有切换按钮
     * @param {string} lang - 'zh' 或 'en'
     */
    function setLanguage(lang) {
        body.classList.remove('lang-zh', 'lang-en');
        body.classList.add('lang-' + lang);
        localStorage.setItem('site-lang', lang);

        // Sync the language toggle button text
        const btnText = lang === 'zh' ? 'EN' : '中';
        if (langToggleDesktop) langToggleDesktop.textContent = btnText;
    }

    setLanguage(savedLang);

    // Language toggle
    if (langToggleDesktop) {
        langToggleDesktop.addEventListener('click', function () {
            const nextLang = body.classList.contains('lang-zh') ? 'en' : 'zh';
            setLanguage(nextLang);
        });
    }

    // ---------- 导航栏滚动效果 ----------
    function updateNavbar() {
        const scrollY = window.scrollY;
        const heroHeight = window.innerHeight;

        if (scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // On mobile, apply the solid background once scrolled past the hero
        if (isMobile()) {
            if (scrollY > heroHeight - 60) {
                // Scrolled past the hero section
                navbar.classList.add('scrolled');
            }
        }
    }

    // ---------- 返回顶部按钮 ----------
    let backToTopVisible = false;

    function updateBackToTop() {
        const scrollY = window.scrollY;
        const shouldShow = scrollY > 500;

        if (shouldShow && !backToTopVisible) {
            backToTopVisible = true;
            backToTop.classList.add('visible');
        } else if (!shouldShow && backToTopVisible) {
            backToTopVisible = false;
            backToTop.classList.remove('visible');
        }
    }

    if (backToTop) {
        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ---------- 滚动渐显动画 (Intersection Observer) ----------
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            {
                root: null,
                rootMargin: '0px 0px -40px 0px',
                threshold: 0.08
            }
        );

        revealElements.forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        // 降级：不支持时直接显示
        revealElements.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    // ---------- 滚动事件（合并处理，使用 rAF 节流） ----------
    let ticking = false;

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                updateNavbar();
                updateBackToTop();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Initial setup: disable transitions to avoid the navbar "slide" flash on refresh
    navbar.classList.add('no-transition');
    updateNavbar();
    updateBackToTop();

    // Restore transitions on the next frame so later scroll changes stay smooth
    window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
            navbar.classList.remove('no-transition');
        });
    });

})();
