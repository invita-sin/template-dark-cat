import { progress } from './progress.js';

export const image = (() => {

    let images = null;

    const loadImage = (el) => new Promise((res) => {
        const src = el.getAttribute('data-src') || el.src;
        const img = new Image();
        img.onload = () => {
            el.width = img.naturalWidth;
            el.height = img.naturalHeight;
            el.classList.remove('opacity-0');
            el.src = img.src;
            img.remove();
            progress.complete('image');
            res();
        };
        img.onerror = () => {
            console.error('Failed to load image:', src);
            progress.invalid('image');
            res();
        };
        img.src = src;
    });

    const hasDataSrc = () => Array.from(images).some((i) => i.hasAttribute('data-src'));

    const load = async () => {
        const imgs = Array.from(images);
        const priority = imgs.filter((el) => el.hasAttribute('fetchpriority'));
        const normal = imgs.filter((el) => !el.hasAttribute('fetchpriority'));

        for (const el of priority) {
            await loadImage(el);
        }
        for (const el of normal) {
            await loadImage(el);
        }
    };

    const download = (src) => {
        const a = document.createElement('a');
        a.href = src;
        a.download = `${window.location.hostname}_image_${Date.now()}`;
        a.click();
        a.remove();
    };

    const init = () => {
        images = document.querySelectorAll('img');
        images.forEach(progress.add);

        return {
            load,
            download,
            hasDataSrc,
        };
    };

    return {
        init,
    };
})();