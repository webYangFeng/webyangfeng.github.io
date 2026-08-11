/* ============================================================
   个人简介网站 - 交互脚本
   功能：语言切换 / 滚动动画 / 抽屉式菜单 / 返回顶部 / 移动端适配
   ============================================================ */

(function () {
    'use strict';

    // ---------- DOM 元素 ----------
    const body = document.body;
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navOverlay = document.querySelector('.nav-overlay');
    const drawerClose = document.querySelector('.nav-drawer-close');

    // 语言切换按钮（桌面端 + 抽屉面板）
    const langToggleDesktop = document.querySelector('.nav-lang-desktop .lang-toggle');
    const langToggleDrawer = document.querySelector('.nav-drawer-lang .lang-toggle-drawer');

    // 返回顶部按钮
    const backToTop = document.querySelector('.back-to-top');

    // 所有导航链接（用于点击后关闭菜单）
    const allNavLinks = navLinks.querySelectorAll('a[href^="#"]');

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

        // 同步所有语言切换按钮文字
        const btnText = lang === 'zh' ? 'EN' : '中';
        if (langToggleDesktop) langToggleDesktop.textContent = btnText;
        if (langToggleDrawer) langToggleDrawer.textContent = btnText;
    }

    setLanguage(savedLang);

    // 桌面端语言切换
    if (langToggleDesktop) {
        langToggleDesktop.addEventListener('click', function () {
            const nextLang = body.classList.contains('lang-zh') ? 'en' : 'zh';
            setLanguage(nextLang);
        });
    }

    // 抽屉面板语言切换
    if (langToggleDrawer) {
        langToggleDrawer.addEventListener('click', function () {
            const nextLang = body.classList.contains('lang-zh') ? 'en' : 'zh';
            setLanguage(nextLang);
        });
    }

    // ---------- 菜单状态管理 ----------
    let menuOpen = false;

    /**
     * 打开移动端菜单
     */
    function openMenu() {
        if (menuOpen) return;
        menuOpen = true;

        // 记录当前滚动位置，防止 body 跳动
        const scrollY = window.scrollY;
        body.dataset.scrollY = scrollY;

        body.classList.add('menu-open');
        navLinks.classList.add('active');
        navOverlay.classList.add('active');
        menuToggle.classList.add('active');

        // 保持页面视觉位置
        body.style.top = '-' + scrollY + 'px';
    }

    /**
     * 关闭移动端菜单
     */
    function closeMenu() {
        if (!menuOpen) return;
        menuOpen = false;

        body.classList.remove('menu-open');
        navLinks.classList.remove('active');
        navOverlay.classList.remove('active');
        menuToggle.classList.remove('active');

        // 恢复滚动位置
        body.style.top = '';
        const savedScrollY = parseInt(body.dataset.scrollY || '0', 10);
        window.scrollTo(0, savedScrollY);
    }

    // 汉堡按钮切换
    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            if (menuOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }

    // 抽屉关闭按钮
    if (drawerClose) {
        drawerClose.addEventListener('click', function () {
            closeMenu();
        });
    }

    // 遮罩层点击关闭
    if (navOverlay) {
        navOverlay.addEventListener('click', function () {
            closeMenu();
        });
    }

    // 点击导航链接后关闭菜单
    allNavLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            if (menuOpen) {
                // 延迟关闭，让用户感知到点击反馈
                setTimeout(closeMenu, 150);
            }
        });
    });

    // 窗口大小变化时：从移动端切换到桌面端时自动关闭菜单
    window.addEventListener('resize', function () {
        if (!isMobile() && menuOpen) {
            closeMenu();
        }
    });

    // ---------- 导航栏滚动效果 ----------
    function updateNavbar() {
        const scrollY = window.scrollY;
        const heroHeight = window.innerHeight;

        if (scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // 移动端不使用 mix-blend-mode，手动切换导航颜色
        if (isMobile()) {
            if (scrollY > heroHeight - 60) {
                // 已经滚出 hero 区域
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

    // 初始调用
    updateNavbar();
    updateBackToTop();

})();
