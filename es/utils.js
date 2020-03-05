export var getPosX = function getPosX(event) {
  if (event instanceof MouseEvent) {
    return event.pageX || event.clientX;
  } else {
    return event.touches[0].pageX || event.touches[0].clientX;
  }
};

var addHeadingZero = function addHeadingZero(num) {
  return num > 9 ? num.toString() : "0" + num;
};

export var getDisplayTimeBySeconds = function getDisplayTimeBySeconds(seconds) {
  if (!isFinite(seconds)) {
    return '00:00';
  }

  var min = addHeadingZero(Math.floor(seconds / 60));
  var sec = addHeadingZero(Math.floor(seconds % 60));
  return min + ":" + sec;
};
export function throttle(func, limit) {
  var inThrottle = false;
  return function (arg) {
    if (!inThrottle) {
      func(arg);
      inThrottle = true;
      setTimeout(function () {
        return inThrottle = false;
      }, limit);
    }
  };
}