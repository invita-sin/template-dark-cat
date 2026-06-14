import { progress } from './progress.js';
import { util } from '../../common/util.js';

export const video = (() => {

    const load = () => {
        const wrap = document.getElementById('video-love-stroy');
        if (!wrap || !wrap.hasAttribute('data-src')) {
            wrap?.remove();
            progress.complete('video', true);
            return Promise.resolve();
        }

        const src = wrap.getAttribute('data-src');
        if (!src) {
            progress.complete('video', true);
            return Promise.resolve();
        }

        const vid = document.createElement('video');
        vid.className = wrap.getAttribute('data-vid-class');
        vid.loop = true;
        vid.muted = true;
        vid.controls = false;
        vid.autoplay = false;
        vid.playsInline = true;
        vid.preload = 'metadata';
        vid.src = util.escapeHtml(src);
        wrap.appendChild(vid);

        const observer = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting ? vid.play() : vid.pause()));
        observer.observe(vid);

        vid.addEventListener('loadedmetadata', () => progress.complete('video'), { once: true });
        vid.addEventListener('error', () => progress.invalid('video'), { once: true });

        const loadingDiv = wrap.querySelector('.position-absolute');
        if (loadingDiv) {
            loadingDiv.remove();
        }

        return Promise.resolve();
    };

    const init = () => {
        progress.add();

        return {
            load,
        };
    };

    return {
        init,
    };
})();