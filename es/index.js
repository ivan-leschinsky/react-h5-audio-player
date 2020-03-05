import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import React, { Component } from 'react';
import { Icon } from '@iconify/react';
import playCircle from '@iconify/icons-mdi/play-circle';
import pauseCircle from '@iconify/icons-mdi/pause-circle';
import skipPrevious from '@iconify/icons-mdi/skip-previous';
import skipNext from '@iconify/icons-mdi/skip-next';
import fastForward from '@iconify/icons-mdi/fast-forward';
import rewind from '@iconify/icons-mdi/rewind';
import volumeHigh from '@iconify/icons-mdi/volume-high';
import volumeMute from '@iconify/icons-mdi/volume-mute';
import repeat from '@iconify/icons-mdi/repeat';
import repeatOff from '@iconify/icons-mdi/repeat-off';
import ProgressBar from './ProgressBar';
import CurrentTime from './CurrentTime';
import Duration from './Duration';
import VolumeBar from './VolumeBar';
import MidiPlayer from 'web-midi-player';

var H5AudioPlayer = function (_Component) {
  _inheritsLoose(H5AudioPlayer, _Component);

  function H5AudioPlayer(props) {
    var _this;

    _this = _Component.call(this, props) || this;

    _defineProperty(_assertThisInitialized(_this), "state", void 0);

    _defineProperty(_assertThisInitialized(_this), "audio", void 0);

    _defineProperty(_assertThisInitialized(_this), "volumeControl", void 0);

    _defineProperty(_assertThisInitialized(_this), "progressBarInstance", void 0);

    _defineProperty(_assertThisInitialized(_this), "container", void 0);

    _defineProperty(_assertThisInitialized(_this), "lastVolume", void 0);

    _defineProperty(_assertThisInitialized(_this), "listenTracker", void 0);

    _defineProperty(_assertThisInitialized(_this), "volumeAnimationTimer", void 0);

    _defineProperty(_assertThisInitialized(_this), "downloadProgressAnimationTimer", void 0);

    _defineProperty(_assertThisInitialized(_this), "midiPlayer", void 0);

    _defineProperty(_assertThisInitialized(_this), "togglePlay", function (e) {
      e.stopPropagation();

      if (_this.audio && _this.audio.src.endsWith('.midi') || _this.audio.src.endsWith('.mid')) {
        _this.audio.pause();

        if (_this.state.isPlaying) _this.midiPlayer.pause();else _this.midiPlayer.play({
          url: _this.audio.src
        });
      } else {
        _this.midiPlayer.stop();

        if (_this.audio.paused && _this.audio.src) {
          var audioPromise = _this.audio.play();

          audioPromise.then(null).catch(function (err) {
            var onPlayError = _this.props.onPlayError;
            onPlayError && onPlayError(new Error(err));
          });
        } else if (!_this.audio.paused) {
          _this.audio.pause();
        }
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleClickVolumeButton", function () {
      if (_this.audio.volume > 0) {
        _this.lastVolume = _this.audio.volume;
        _this.audio.volume = 0;
      } else {
        _this.audio.volume = _this.lastVolume;
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleMuteChange", function () {
      _this.forceUpdate();
    });

    _defineProperty(_assertThisInitialized(_this), "handleClickLoopButton", function () {
      _this.setState(function (prevState) {
        return {
          isLoopEnabled: !prevState.isLoopEnabled
        };
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleClickRewind", function () {
      _this.setJumpTime(-_this.props.progressJumpStep);
    });

    _defineProperty(_assertThisInitialized(_this), "handleClickForward", function () {
      _this.setJumpTime(_this.props.progressJumpStep);
    });

    _defineProperty(_assertThisInitialized(_this), "setJumpTime", function (time) {
      var _this$audio = _this.audio,
          duration = _this$audio.duration,
          prevTime = _this$audio.currentTime;
      if (!isFinite(duration) || !isFinite(prevTime)) return;
      var currentTime = prevTime + time / 1000;

      if (currentTime < 0) {
        _this.audio.currentTime = 0;
        currentTime = 0;
      } else if (currentTime > duration) {
        _this.audio.currentTime = duration;
        currentTime = duration;
      } else {
        _this.audio.currentTime = currentTime;
      }
    });

    _defineProperty(_assertThisInitialized(_this), "setJumpVolume", function (volume) {
      var newVolume = _this.audio.volume + volume;
      if (newVolume < 0) newVolume = 0;else if (newVolume > 1) newVolume = 1;
      _this.audio.volume = newVolume;
    });

    _defineProperty(_assertThisInitialized(_this), "setListenTrack", function () {
      if (!_this.listenTracker) {
        var listenInterval = _this.props.listenInterval;
        _this.listenTracker = setInterval(function () {
          _this.props.onListen && _this.props.onListen(_this.audio.currentTime);
        }, listenInterval);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "clearListenTrack", function () {
      if (_this.listenTracker) {
        clearInterval(_this.listenTracker);
        delete _this.listenTracker;
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleKeyDown", function (e) {
      switch (e.keyCode) {
        case 32:
          if (e.target === _this.container || e.target === _this.progressBarInstance.progressBarEl) {
            _this.togglePlay(e);
          }

          break;

        case 37:
          _this.handleClickRewind();

          break;

        case 39:
          _this.handleClickForward();

          break;

        case 38:
          _this.setJumpVolume(_this.props.volumeJumpStep);

          break;

        case 40:
          _this.setJumpVolume(-_this.props.volumeJumpStep);

          break;

        case 76:
          _this.handleClickLoopButton();

          break;

        case 77:
          _this.handleClickVolumeButton();

          break;
      }
    });

    var _volume = props.volume;
    _this.state = {
      isPlaying: false,
      isLoopEnabled: _this.props.loop
    };

    var eventLogger = function eventLogger(payload) {
      if (payload.event === 'MIDI_END') {
        _this.clearListenTrack();

        _this.props.onEnded && _this.props.onEnded(payload);
      }

      if (payload.event === 'MIDI_PLAY') {
        _this.setState({
          isPlaying: true
        });

        _this.setListenTrack();

        _this.props.onPlay && _this.props.onPlay(payload);
      }

      if (payload.event === 'MIDI_PAUSE') {
        _this.clearListenTrack();

        if (!_this.midiPlayer) return;

        _this.setState({
          isPlaying: false
        });

        _this.props.onPause && _this.props.onPause(payload);
      }

      if (payload.event === 'MIDI_STOP') {
        _this.clearListenTrack();

        _this.props.onEnded && _this.props.onEnded(payload);
      }

      if (payload.event === 'MIDI_RESUME') {
        _this.clearListenTrack();

        _this.props.onEnded && _this.props.onEnded(payload);
      }

      if (payload.event === 'MIDI_ERROR') {
        _this.props.onError && _this.props.onError(payload);
      }
    };

    _this.midiPlayer = new MidiPlayer({
      eventLogger: eventLogger,
      patchUrl: props.midiPatchUrl
    });
    _this.lastVolume = _volume;
    return _this;
  }

  var _proto = H5AudioPlayer.prototype;

  _proto.componentDidMount = function componentDidMount() {
    var _this2 = this;

    this.forceUpdate();
    var audio = this.audio;

    if (this.props.muted) {
      audio.volume = 0;
    } else {
      audio.volume = this.lastVolume;
    }

    audio.addEventListener('error', function (e) {
      _this2.props.onError && _this2.props.onError(e);
    });
    audio.addEventListener('canplay', function (e) {
      _this2.props.onCanPlay && _this2.props.onCanPlay(e);
    });
    audio.addEventListener('canplaythrough', function (e) {
      _this2.props.onCanPlayThrough && _this2.props.onCanPlayThrough(e);
    });
    audio.addEventListener('play', function (e) {
      _this2.setState({
        isPlaying: true
      });

      _this2.setListenTrack();

      _this2.props.onPlay && _this2.props.onPlay(e);
    });
    audio.addEventListener('abort', function (e) {
      _this2.clearListenTrack();

      var autoPlayAfterSrcChange = _this2.props.autoPlayAfterSrcChange;

      if (autoPlayAfterSrcChange) {
        if (_this2.audio && _this2.audio.src.endsWith('.midi') || _this2.audio.src.endsWith('.mid')) {
          _this2.audio.pause();
        } else {
          _this2.audio.play();
        }
      } else {
        _this2.setState({
          isPlaying: false
        });
      }

      _this2.props.onAbort && _this2.props.onAbort(e);
    });
    audio.addEventListener('ended', function (e) {
      _this2.clearListenTrack();

      _this2.props.onEnded && _this2.props.onEnded(e);
    });
    audio.addEventListener('pause', function (e) {
      _this2.clearListenTrack();

      if (!_this2.audio) return;

      _this2.setState({
        isPlaying: false
      });

      _this2.props.onPause && _this2.props.onPause(e);
    });
  };

  _proto.render = function render() {
    var _this3 = this;

    var _this$props = this.props,
        className = _this$props.className,
        src = _this$props.src,
        preload = _this$props.preload,
        autoPlay = _this$props.autoPlay,
        crossOrigin = _this$props.crossOrigin,
        mediaGroup = _this$props.mediaGroup,
        showLoopControl = _this$props.showLoopControl,
        showSkipControls = _this$props.showSkipControls,
        showJumpControls = _this$props.showJumpControls,
        showVolumeControl = _this$props.showVolumeControl,
        onClickPrevious = _this$props.onClickPrevious,
        onClickNext = _this$props.onClickNext,
        showDownloadProgress = _this$props.showDownloadProgress,
        ShowFilledProgress = _this$props.ShowFilledProgress,
        volumeProp = _this$props.volume,
        defaultCurrentTime = _this$props.defaultCurrentTime,
        defaultDuration = _this$props.defaultDuration,
        muted = _this$props.muted,
        progressUpdateInterval = _this$props.progressUpdateInterval,
        header = _this$props.header,
        footer = _this$props.footer,
        customIcons = _this$props.customIcons,
        children = _this$props.children,
        style = _this$props.style;
    var _this$state = this.state,
        isPlaying = _this$state.isPlaying,
        isLoopEnabled = _this$state.isLoopEnabled;

    var _ref = this.audio || {},
        _ref$volume = _ref.volume,
        volume = _ref$volume === void 0 ? muted ? 0 : volumeProp : _ref$volume;

    var loopIcon;

    if (isLoopEnabled) {
      loopIcon = customIcons.loop ? customIcons.loop : React.createElement(Icon, {
        icon: repeat
      });
    } else {
      loopIcon = customIcons.loopOff ? customIcons.loopOff : React.createElement(Icon, {
        icon: repeatOff
      });
    }

    var actionIcon;

    if (isPlaying) {
      actionIcon = customIcons.pause ? customIcons.pause : React.createElement(Icon, {
        icon: pauseCircle
      });
    } else {
      actionIcon = customIcons.play ? customIcons.play : React.createElement(Icon, {
        icon: playCircle
      });
    }

    var volumeIcon;

    if (volume) {
      volumeIcon = customIcons.volume ? customIcons.volume : React.createElement(Icon, {
        icon: volumeHigh
      });
    } else {
      volumeIcon = customIcons.volume ? customIcons.volumeMute : React.createElement(Icon, {
        icon: volumeMute
      });
    }

    return React.createElement("div", {
      role: "group",
      tabIndex: 0,
      "aria-label": "Audio Player",
      className: "rhap_container " + className,
      onKeyDown: this.handleKeyDown,
      ref: function ref(_ref3) {
        _this3.container = _ref3;
      },
      style: style
    }, React.createElement("audio", {
      src: src,
      controls: false,
      loop: isLoopEnabled,
      autoPlay: autoPlay,
      preload: preload,
      crossOrigin: crossOrigin,
      mediaGroup: mediaGroup,
      ref: function ref(_ref2) {
        _this3.audio = _ref2;
      }
    }, children), header && React.createElement("div", {
      className: "rhap_header"
    }, header), React.createElement("div", {
      className: "rhap_progress-section"
    }, React.createElement("div", {
      id: "rhap_current-time",
      className: "rhap_time rhap_current-time"
    }, React.createElement(CurrentTime, {
      audio: this.audio,
      defaultCurrentTime: defaultCurrentTime
    })), React.createElement(ProgressBar, {
      ref: function ref(node) {
        _this3.progressBarInstance = node;
      },
      audio: this.audio,
      progressUpdateInterval: progressUpdateInterval,
      showDownloadProgress: showDownloadProgress,
      ShowFilledProgress: ShowFilledProgress
    }), React.createElement("div", {
      className: "rhap_time rhap_total-time"
    }, React.createElement(Duration, {
      audio: this.audio,
      defaultDuration: defaultDuration
    }))), React.createElement("div", {
      className: "rhap_controls-section"
    }, React.createElement("div", {
      className: "rhap_additional-controls"
    }, showLoopControl && React.createElement("button", {
      "aria-label": isLoopEnabled ? 'Enable Loop' : 'Disable Loop',
      className: "rhap_button-clear rhap_repeat-button",
      onClick: this.handleClickLoopButton
    }, loopIcon)), React.createElement("div", {
      className: "rhap_main-controls"
    }, showSkipControls && React.createElement("button", {
      "aria-label": "Previous",
      className: "rhap_button-clear rhap_main-controls-button rhap_skip-button",
      onClick: onClickPrevious
    }, customIcons.previous ? customIcons.previous : React.createElement(Icon, {
      icon: skipPrevious
    })), showJumpControls && React.createElement("button", {
      "aria-label": "Rewind",
      className: "rhap_button-clear rhap_main-controls-button rhap_rewind-button",
      onClick: this.handleClickRewind
    }, customIcons.rewind ? customIcons.rewind : React.createElement(Icon, {
      icon: rewind
    })), React.createElement("button", {
      "aria-label": isPlaying ? 'Pause' : 'Play',
      className: "rhap_button-clear rhap_main-controls-button rhap_play-pause-button",
      onClick: this.togglePlay
    }, actionIcon), showJumpControls && React.createElement("button", {
      "aria-label": "Forward",
      className: "rhap_button-clear rhap_main-controls-button rhap_forward-button",
      onClick: this.handleClickForward
    }, customIcons.forward ? customIcons.forward : React.createElement(Icon, {
      icon: fastForward
    })), showSkipControls && React.createElement("button", {
      "aria-label": "Skip",
      className: "rhap_button-clear rhap_main-controls-button rhap_skip-button",
      onClick: onClickNext
    }, customIcons.next ? customIcons.next : React.createElement(Icon, {
      icon: skipNext
    }))), React.createElement("div", {
      className: "rhap_volume-controls"
    }, showVolumeControl && React.createElement("div", {
      className: "rhap_volume-container"
    }, React.createElement("button", {
      "aria-label": volume ? 'Mute' : 'Unmute',
      onClick: this.handleClickVolumeButton,
      className: "rhap_button-clear rhap_volume-button"
    }, volumeIcon), React.createElement(VolumeBar, {
      audio: this.audio,
      volume: volume,
      onMuteChange: this.handleMuteChange
    })))), footer && React.createElement("div", {
      className: "rhap_footer"
    }, footer));
  };

  return H5AudioPlayer;
}(Component);

_defineProperty(H5AudioPlayer, "defaultProps", {
  autoPlay: false,
  autoPlayAfterSrcChange: true,
  listenInterval: 1000,
  progressJumpStep: 5000,
  volumeJumpStep: 0.1,
  loop: false,
  muted: false,
  preload: 'auto',
  progressUpdateInterval: 20,
  defaultCurrentTime: '--:--',
  defaultDuration: '--:--',
  volume: 1,
  className: '',
  showLoopControl: true,
  showVolumeControl: true,
  showJumpControls: true,
  showSkipControls: false,
  showDownloadProgress: true,
  ShowFilledProgress: true,
  customIcons: {}
});

export default H5AudioPlayer;