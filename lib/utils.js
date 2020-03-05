"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPosX = (event) => {
    if (event instanceof MouseEvent) {
        return event.pageX || event.clientX;
    }
    else {
        return event.touches[0].pageX || event.touches[0].clientX;
    }
};
const addHeadingZero = (num) => {
    return num > 9 ? num.toString() : `0${num}`;
};
exports.getDisplayTimeBySeconds = (seconds) => {
    if (!isFinite(seconds)) {
        return '00:00';
    }
    const min = addHeadingZero(Math.floor(seconds / 60));
    const sec = addHeadingZero(Math.floor(seconds % 60));
    return `${min}:${sec}`;
};
function throttle(func, limit) {
    let inThrottle = false;
    return function (arg) {
        if (!inThrottle) {
            func(arg);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}
exports.throttle = throttle;
