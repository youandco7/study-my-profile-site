// Typewriter Effect
class Typewriter {
    constructor(elementId, phrases, options = {}) {
        this.element = document.getElementById(elementId);
        this.phrases = phrases;
        this.speed = options.typeSpeed || 90;
        this.deleteSpeed = options.deleteSpeed || 45;
        this.pauseTime = options.pauseTime || 2000;
        this.currentPhrase = 0;
        this.currentChar = 0;
        this.isTyping = true;

        if (this.element) {
            this.start();
        }
    }

    start() {
        this.type();
    }

    type() {
        if (this.currentChar < this.phrases[this.currentPhrase].length) {
            this.element.textContent += this.phrases[this.currentPhrase][this.currentChar];
            this.currentChar++;
            setTimeout(() => this.type(), this.speed);
        } else {
            // Completed typing current phrase, pause then delete
            setTimeout(() => this.delete(), this.pauseTime);
        }
    }

    delete() {
        if (this.currentChar > 0) {
            const text = this.phrases[this.currentPhrase].substring(0, this.currentChar - 1);
            this.element.textContent = text;
            this.currentChar--;
            setTimeout(() => this.delete(), this.deleteSpeed);
        } else {
            // Move to next phrase
            this.currentPhrase = (this.currentPhrase + 1) % this.phrases.length;
            setTimeout(() => this.type(), this.speed);
        }
    }
}

// Initialize typewriter on page load
window.addEventListener('DOMContentLoaded', () => {
    const phrases = [
        '사업가',
        '사업가 · 크리에이터',
        'Business Builder',
        'Building Brands',
        'Creating Opportunities'
    ];

    new Typewriter('typewriter', phrases, {
        typeSpeed: 90,
        deleteSpeed: 45,
        pauseTime: 2000
    });
});

// Dark mode toggle functionality
const darkModeToggle = document.getElementById('darkModeToggle');
const darkModeIcon = document.getElementById('darkModeIcon');
const htmlElement = document.documentElement;

// Check for saved dark mode preference or system preference
function initDarkMode() {
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedMode === 'true' || (savedMode === null && prefersDark)) {
        enableDarkMode();
    } else if (savedMode === 'false') {
        disableDarkMode();
    }
}

// Enable dark mode
function enableDarkMode() {
    htmlElement.classList.add('dark');
    darkModeIcon.textContent = '☀️';
    localStorage.setItem('darkMode', 'true');
}

// Disable dark mode
function disableDarkMode() {
    htmlElement.classList.remove('dark');
    darkModeIcon.textContent = '🌙';
    localStorage.setItem('darkMode', 'false');
}

// Toggle dark mode
darkModeToggle.addEventListener('click', () => {
    if (htmlElement.classList.contains('dark')) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
});

// Initialize dark mode on page load
window.addEventListener('DOMContentLoaded', initDarkMode);

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// Stats Section — stagger reveal + count-up on scroll
function initStatsSection() {
    const section = document.getElementById('stats');
    if (!section) return;

    const revealEls = section.querySelectorAll('.stat-reveal');
    const numberEls = section.querySelectorAll('.stat-number');
    let hasAnimated = false;

    function animateCount(el) {
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1400;
        const start = performance.now();

        function frame(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            el.textContent = current.toLocaleString('en-US') + suffix;
            if (progress < 1) {
                requestAnimationFrame(frame);
            }
        }

        requestAnimationFrame(frame);
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                revealEls.forEach((el) => el.classList.add('is-visible'));
                numberEls.forEach((el) => animateCount(el));
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    statsObserver.observe(section);
}

window.addEventListener('DOMContentLoaded', initStatsSection);

// Feature Tabs (Core Competencies) — auto-rotating tabs with progress bar
const competencyData = [
    { num: '01', title: 'Strategy', desc: '비즈니스 목표를 달성하기 위한 명확한 전략과 실행 계획을 수립합니다.' },
    { num: '02', title: 'Execution', desc: '계획을 현실로 변환하는 강한 실행력과 적응력을 갖추고 있습니다.' },
    { num: '03', title: 'Innovation', desc: '시장의 변화에 빠르게 대응하며 새로운 기회를 창출합니다.' }
];

function initFeatureTabs() {
    const container = document.getElementById('featureTabs');
    const progressFill = document.getElementById('progressFill');
    const activeContent = document.getElementById('activeCardContent');
    const activeNum = document.getElementById('activeNum');
    const activeTitle = document.getElementById('activeTitle');
    const activeDesc = document.getElementById('activeDesc');
    const tabList = document.getElementById('tabList');

    if (!container || !progressFill || !activeContent || !tabList) return;

    let activeIndex = 0;
    let isPaused = false;
    let isTransitioning = false;

    function renderList() {
        tabList.innerHTML = '';
        competencyData.forEach((item, idx) => {
            if (idx === activeIndex) return;
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'text-left py-6 transition-all duration-300 hover:translate-x-1 hover:opacity-80 focus:outline-none';
            btn.innerHTML = `
                <span class="text-sm font-semibold text-navy-700 dark:text-navy-400">${item.num}</span>
                <h3 class="text-xl font-black text-gray-900 dark:text-white mt-2 mb-2">${item.title}</h3>
                <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">${item.desc}</p>
            `;
            btn.addEventListener('click', () => goTo(idx));
            tabList.appendChild(btn);
        });
    }

    function restartProgress() {
        progressFill.classList.remove('progress-fill');
        void progressFill.offsetWidth;
        progressFill.classList.add('progress-fill');
        progressFill.style.animationPlayState = isPaused ? 'paused' : 'running';
    }

    function goTo(newIndex) {
        if (newIndex === activeIndex || isTransitioning) return;
        isTransitioning = true;

        activeContent.style.opacity = '0';
        activeContent.style.transform = 'translateY(-8px)';

        setTimeout(() => {
            activeIndex = newIndex;
            const item = competencyData[activeIndex];
            activeNum.textContent = item.num;
            activeTitle.textContent = item.title;
            activeDesc.textContent = item.desc;
            renderList();
            restartProgress();

            activeContent.style.transition = 'none';
            activeContent.style.transform = 'translateY(8px)';
            void activeContent.offsetWidth;
            activeContent.style.transition = '';
            activeContent.style.opacity = '1';
            activeContent.style.transform = 'translateY(0)';

            isTransitioning = false;
        }, 300);
    }

    progressFill.addEventListener('animationend', () => {
        goTo((activeIndex + 1) % competencyData.length);
    });

    container.addEventListener('mouseenter', () => {
        isPaused = true;
        progressFill.style.animationPlayState = 'paused';
    });

    container.addEventListener('mouseleave', () => {
        isPaused = false;
        progressFill.style.animationPlayState = 'running';
    });

    renderList();
    restartProgress();
}

window.addEventListener('DOMContentLoaded', initFeatureTabs);

// Scroll animation for elements with fade-in-up
const fadeInUpObserverOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
};

const fadeInUpObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('fade-in-up')) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
            fadeInUpObserver.unobserve(entry.target);
        }
    });
}, fadeInUpObserverOptions);

// Observe all elements with fade-in-up class
document.querySelectorAll('.fade-in-up').forEach(element => {
    fadeInUpObserver.observe(element);
});
