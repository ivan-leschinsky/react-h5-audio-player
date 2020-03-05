import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import React, { Component } from 'react';
import { getPosX, throttle } from './utils';

var ProgressBar = function (_Component) {
  _inheritsLoose(ProgressBar, _Component);

  function ProgressBar() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Component.call.apply(_Component, [this].concat(args)) || this;

    _defineProperty(_assertThisInitialized(_this), "audio", void 0);

    _defineProperty(_assertThisInitialized(_this), "timeOnMouseMove", 0);

    _defineProperty(_assertThisInitialized(_this), "hasAddedAudioEventListener", false);

    _defineProperty(_assertThisInitialized(_this), "downloadProgressAnimationTimer", void 0);

    _defineProperty(_assertThisInitialized(_this), "progressBarEl", void 0);

    _defineProperty(_assertThisInitialized(_this), "state", {
      isDraggingProgress: false,
      currentTimePos: '0%',
      hasDownloadProgressAnimation: false,
      downloadProgressArr: []
    });

    _defineProperty(_assertThisInitialized(_this), "getCurrentProgress", function (event) {
      var audio = _this.props.audio;

      if (!audio.src || !isFinite(audio.currentTime) || !_this.progressBarEl) {
        return {
          currentTime: 0,
          currentTimePos: '0%'
        };
      }

      var progressBarRect = _this.progressBarEl.getBoundingClientRect();

      var maxRelativePos = progressBarRect.width;
      var relativePos = getPosX(event) - progressBarRect.left;

      if (relativePos < 0) {
        relativePos = 0;
      } else if (relativePos > maxRelativePos) {
        relativePos = maxRelativePos;
      }

      var currentTime = _this.props.audio.duration * relativePos / maxRelativePos;
      return {
        currentTime: currentTime,
        currentTimePos: (relativePos / maxRelativePos * 100).toFixed(2) + "%"
      };
    });

    _defineProperty(_assertThisInitialized(_this), "handleMouseDownProgressBar", function (event) {
      event.stopPropagation();

      var _this$getCurrentProgr = _this.getCurrentProgress(event.nativeEvent),
          currentTime = _this$getCurrentProgr.currentTime,
          currentTimePos = _this$getCurrentProgr.currentTimePos;

      if (isFinite(currentTime)) {
        _this.timeOnMouseMove = currentTime;

        _this.setState({
          isDraggingProgress: true,
          currentTimePos: currentTimePos
        });

        if (event.nativeEvent instanceof MouseEvent) {
          window.addEventListener('mousemove', _this.handleWindowMouseOrTouchMove);
          window.addEventListener('mouseup', _this.handleWindowMouseOrTouchUp);
        } else {
          window.addEventListener('touchmove', _this.handleWindowMouseOrTouchMove);
          window.addEventListener('touchend', _this.handleWindowMouseOrTouchUp);
        }
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleWindowMouseOrTouchMove", function (event) {
      event.preventDefault();
      event.stopPropagation();
      var windowSelection = window.getSelection();

      if (windowSelection && windowSelection.type === 'Range') {
        windowSelection.empty();
      }

      var isDraggingProgress = _this.state.isDraggingProgress;

      if (isDraggingProgress) {
        var _this$getCurrentProgr2 = _this.getCurrentProgress(event),
            currentTime = _this$getCurrentProgr2.currentTime,
            currentTimePos = _this$getCurrentProgr2.currentTimePos;

        _this.timeOnMouseMove = currentTime;

        _this.setState({
          currentTimePos: currentTimePos
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleWindowMouseOrTouchUp", function (event) {
      event.stopPropagation();

      _this.setState(function (prevState) {
        if (prevState.isDraggingProgress && isFinite(_this.timeOnMouseMove)) {
          _this.props.audio.currentTime = _this.timeOnMouseMove;
        }

        return {
          isDraggingProgress: false
        };
      });

      if (event instanceof MouseEvent) {
        window.removeEventListener('mousemove', _this.handleWindowMouseOrTouchMove);
        window.removeEventListener('mouseup', _this.handleWindowMouseOrTouchUp);
      } else {
        window.removeEventListener('touchmove', _this.handleWindowMouseOrTouchMove);
        window.removeEventListener('touchend', _this.handleWindowMouseOrTouchUp);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleAudioTimeUpdate", throttle(function (e) {
      var isDraggingProgress = _this.state.isDraggingProgress;
      var audio = e.target;
      if (isDraggingProgress) return;
      var duration = audio.duration,
          currentTime = audio.currentTime;

      _this.setState({
        currentTimePos: (currentTime / duration * 100 || 0).toFixed(2) + "%"
      });
    }, _this.props.progressUpdateInterval));

    _defineProperty(_assertThisInitialized(_this), "handleAudioDownloadProgressUpdate", function (e) {
      var audio = e.target;
      var downloadProgressArr = [];

      for (var i = 0; i < audio.buffered.length; i++) {
        var bufferedStart = audio.buffered.start(i);
        var bufferedEnd = audio.buffered.end(i);
        downloadProgressArr.push({
          left: (Math.round(100 / audio.duration * bufferedStart) || 0) + "%",
          width: (Math.round(100 / audio.duration * (bufferedEnd - bufferedStart)) || 0) + "%"
        });
      }

      clearTimeout(_this.downloadProgressAnimationTimer);

      _this.setState({
        downloadProgressArr: downloadProgressArr,
        hasDownloadProgressAnimation: true
      });

      _this.downloadProgressAnimationTimer = setTimeout(function () {
        _this.setState({
          hasDownloadProgressAnimation: false
        });
      }, 200);
    });

    return _this;
  }

  var _proto = ProgressBar.prototype;

  _proto.componentDidUpdate = function componentDidUpdate() {
    var audio = this.props.audio;

    if (audio && !this.hasAddedAudioEventListener) {
      this.audio = audio;
      this.hasAddedAudioEventListener = true;
      audio.addEventListener('timeupdate', this.handleAudioTimeUpdate);
      audio.addEventListener('progress', this.handleAudioDownloadProgressUpdate);
    }
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    if (this.audio && this.hasAddedAudioEventListener) {
      this.audio.removeEventListener('timeupdate', this.handleAudioTimeUpdate);
      this.audio.removeEventListener('progress', this.handleAudioDownloadProgressUpdate);
    }

    clearTimeout(this.downloadProgressAnimationTimer);
  };

  _proto.render = function render() {
    var _this2 = this;

    var _this$props = this.props,
        showDownloadProgress = _this$props.showDownloadProgress,
        ShowFilledProgress = _this$props.ShowFilledProgress;
    var _this$state = this.state,
        currentTimePos = _this$state.currentTimePos,
        downloadProgressArr = _this$state.downloadProgressArr,
        hasDownloadProgressAnimation = _this$state.hasDownloadProgressAnimation;
    return React.createElement("div", {
      className: "rhap_progress-container",
      ref: function ref(el) {
        _this2.progressBarEl = el;
      },
      "aria-label": "Audio Progress Control",
      "aria-describedby": "rhap_current-time",
      role: "progressbar",
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      "aria-valuenow": Number(currentTimePos.split('%')[0]),
      tabIndex: 0,
      onMouseDown: this.handleMouseDownProgressBar,
      onTouchStart: this.handleMouseDownProgressBar
    }, React.createElement("div", {
      className: "rhap_progress-bar " + (showDownloadProgress ? 'rhap_progress-bar-show-download' : '')
    }, React.createElement("div", {
      className: "rhap_progress-indicator",
      style: {
        left: currentTimePos
      }
    }), ShowFilledProgress && React.createElement("div", {
      className: "rhap_progress-filled",
      style: {
        width: currentTimePos
      }
    }), showDownloadProgress && downloadProgressArr.map(function (_ref, i) {
      var left = _ref.left,
          width = _ref.width;
      return React.createElement("div", {
        key: i,
        className: "rhap_download-progress",
        style: {
          left: left,
          width: width,
          transitionDuration: hasDownloadProgressAnimation ? '.2s' : '0s'
        }
      });
    })));
  };

  return ProgressBar;
}(Component);

export default ProgressBar;