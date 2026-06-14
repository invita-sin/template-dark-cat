const loadAOS = () => {
    return new Promise((res, rej) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css';
        link.onload = () => {
            const sc = document.createElement('script');
            sc.src = 'https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js';
            sc.onload = () => {
                if (typeof window.AOS === 'undefined') {
                    rej(new Error('AOS library failed to load'));
                    return;
                }
                window.AOS.init();
                res();
            };
            sc.onerror = rej;
            document.head.appendChild(sc);
        };
        link.onerror = rej;
        document.head.appendChild(link);
    });
};

const loadConfetti = () => {
    return new Promise((res, rej) => {
        const sc = document.createElement('script');
        sc.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.js';
        sc.onload = () => {
            typeof window.confetti === 'undefined' ? rej(new Error('Confetti library failed to load')) : res();
        };
        sc.onerror = rej;
        document.head.appendChild(sc);
    });
};

const loadAdditionalFont = () => {
    const fonts = [
        { css: 'https://fonts.googleapis.com/css2?family=Sacramento&display=swap', family: 'Sacramento' },
        { css: 'https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic&display=swap', family: 'Noto Naskh Arabic' },
    ];

    return Promise.all(fonts.map(({ css, family }) => {
        return new Promise((res, rej) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = css;
            link.onload = () => {
                document.fonts.load(`1em "${family}"`).then(() => res()).catch(rej);
            };
            link.onerror = rej;
            document.head.appendChild(link);
        });
    }));
};

export const loader = (opt = {}) => {
    const promises = [];

    if (opt?.aos ?? true) {
        promises.push(loadAOS());
    }

    if (opt?.confetti ?? true) {
        promises.push(loadConfetti());
    }

    if (opt?.additionalFont ?? true) {
        promises.push(loadAdditionalFont());
    }

    return Promise.all(promises);
};