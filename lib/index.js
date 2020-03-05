"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_2 = require("@iconify/react");
const play_circle_1 = __importDefault(require("@iconify/icons-mdi/play-circle"));
const pause_circle_1 = __importDefault(require("@iconify/icons-mdi/pause-circle"));
const skip_previous_1 = __importDefault(require("@iconify/icons-mdi/skip-previous"));
const skip_next_1 = __importDefault(require("@iconify/icons-mdi/skip-next"));
const fast_forward_1 = __importDefault(require("@iconify/icons-mdi/fast-forward"));
const rewind_1 = __importDefault(require("@iconify/icons-mdi/rewind"));
const volume_high_1 = __importDefault(require("@iconify/icons-mdi/volume-high"));
const volume_mute_1 = __importDefault(require("@iconify/icons-mdi/volume-mute"));
const repeat_1 = __importDefault(require("@iconify/icons-mdi/repeat"));
const repeat_off_1 = __importDefault(require("@iconify/icons-mdi/repeat-off"));
const ProgressBar_1 = __importDefault(require("./ProgressBar"));
const CurrentTime_1 = __importDefault(require("./CurrentTime"));
const Duration_1 = __importDefault(require("./Duration"));
const VolumeBar_1 = __importDefault(require("./VolumeBar"));
const web_midi_player_1 = __importDefault(require("web-midi-player"));
class H5AudioPlayer extends react_1.Component {
    constructor(props) {
        super(props);
        this.togglePlay = (e) => {
            e.stopPropagation();
            if (this.audio && this.audio.src.endsWith('.midi') || this.audio.src.endsWith('.mid')) {
                this.audio.pause();
                if (this.state.isPlaying)
                    this.midiPlayer.pause();
                else
                    this.midiPlayer.play({ url: this.audio.src });
            }
            else {
                this.midiPlayer.stop();
                if (this.audio.paused && this.audio.src) {
                    const audioPromise = this.audio.play();
                    audioPromise.then(null).catch((err) => {
                        const { onPlayError } = this.props;
                        onPlayError && onPlayError(new Error(err));
                    });
                }
                else if (!this.audio.paused) {
                    this.audio.pause();
                }
            }
        };
        this.handleClickVolumeButton = () => {
            if (this.audio.volume > 0) {
                this.lastVolume = this.audio.volume;
                this.audio.volume = 0;
            }
            else {
                this.audio.volume = this.lastVolume;
            }
        };
        this.handleMuteChange = () => {
            this.forceUpdate();
        };
        this.handleClickLoopButton = () => {
            this.setState((prevState) => ({ isLoopEnabled: !prevState.isLoopEnabled }));
        };
        this.handleClickRewind = () => {
            this.setJumpTime(-this.props.progressJumpStep);
        };
        this.handleClickForward = () => {
            this.setJumpTime(this.props.progressJumpStep);
        };
        this.setJumpTime = (time) => {
            const { duration, currentTime: prevTime } = this.audio;
            if (!isFinite(duration) || !isFinite(prevTime))
                return;
            let currentTime = prevTime + time / 1000;
            if (currentTime < 0) {
                this.audio.currentTime = 0;
                currentTime = 0;
            }
            else if (currentTime > duration) {
                this.audio.currentTime = duration;
                currentTime = duration;
            }
            else {
                this.audio.currentTime = currentTime;
            }
        };
        this.setJumpVolume = (volume) => {
            let newVolume = this.audio.volume + volume;
            if (newVolume < 0)
                newVolume = 0;
            else if (newVolume > 1)
                newVolume = 1;
            this.audio.volume = newVolume;
        };
        /**
         * Set an interval to call props.onListen every props.listenInterval time period
         */
        this.setListenTrack = () => {
            if (!this.listenTracker) {
                const listenInterval = this.props.listenInterval;
                this.listenTracker = setInterval(() => {
                    this.props.onListen && this.props.onListen(this.audio.currentTime);
                }, listenInterval);
            }
        };
        /**
         * Clear the onListen interval
         */
        this.clearListenTrack = () => {
            if (this.listenTracker) {
                clearInterval(this.listenTracker);
                delete this.listenTracker;
            }
        };
        this.handleKeyDown = (e) => {
            switch (e.keyCode) {
                case 32: // Space
                    if (e.target === this.container || e.target === this.progressBarInstance.progressBarEl) {
                        this.togglePlay(e);
                    }
                    break;
                case 37: // Left arrow
                    this.handleClickRewind();
                    break;
                case 39: // Right arrow
                    this.handleClickForward();
                    break;
                case 38: // Up arrow
                    this.setJumpVolume(this.props.volumeJumpStep);
                    break;
                case 40: // Down arrow
                    this.setJumpVolume(-this.props.volumeJumpStep);
                    break;
                case 76: // L = Loop
                    this.handleClickLoopButton();
                    break;
                case 77: // M = Mute
                    this.handleClickVolumeButton();
                    break;
            }
        };
        const { volume } = props;
        this.state = {
            isPlaying: false,
            isLoopEnabled: this.props.loop,
        };
        const eventLogger = payload => {
            if (payload.event === 'MIDI_END') {
                this.clearListenTrack();
                this.props.onEnded && this.props.onEnded(payload);
            }
            if (payload.event === 'MIDI_PLAY') {
                this.setState({ isPlaying: true });
                this.setListenTrack();
                this.props.onPlay && this.props.onPlay(payload);
            }
            if (payload.event === 'MIDI_PAUSE') {
                this.clearListenTrack();
                if (!this.midiPlayer)
                    return;
                this.setState({ isPlaying: false });
                this.props.onPause && this.props.onPause(payload);
            }
            if (payload.event === 'MIDI_STOP') {
                this.clearListenTrack();
                this.props.onEnded && this.props.onEnded(payload);
            }
            if (payload.event === 'MIDI_RESUME') {
                this.clearListenTrack();
                this.props.onEnded && this.props.onEnded(payload);
            }
            if (payload.event === 'MIDI_ERROR') {
                this.props.onError && this.props.onError(payload);
            }
        };
        this.midiPlayer = new web_midi_player_1.default({ eventLogger, patchUrl: props.midiPatchUrl });
        this.lastVolume = volume;
    }
    componentDidMount() {
        // force update to pass this.audio to child components
        this.forceUpdate();
        // audio player object
        const audio = this.audio;
        if (this.props.muted) {
            audio.volume = 0;
        }
        else {
            audio.volume = this.lastVolume;
        }
        audio.addEventListener('error', (e) => {
            this.props.onError && this.props.onError(e);
        });
        // When enough of the file has downloaded to start playing
        audio.addEventListener('canplay', (e) => {
            this.props.onCanPlay && this.props.onCanPlay(e);
        });
        // When enough of the file has downloaded to play the entire file
        audio.addEventListener('canplaythrough', (e) => {
            this.props.onCanPlayThrough && this.props.onCanPlayThrough(e);
        });
        // When audio play starts
        audio.addEventListener('play', (e) => {
            this.setState({ isPlaying: true });
            this.setListenTrack();
            this.props.onPlay && this.props.onPlay(e);
        });
        // When unloading the audio player (switching to another src)
        audio.addEventListener('abort', (e) => {
            this.clearListenTrack();
            const { autoPlayAfterSrcChange } = this.props;
            if (autoPlayAfterSrcChange) {
                if (this.audio && this.audio.src.endsWith('.midi') || this.audio.src.endsWith('.mid')) {
                    this.audio.pause();
                }
                else {
                    this.audio.play();
                }
            }
            else {
                this.setState({
                    isPlaying: false,
                });
            }
            this.props.onAbort && this.props.onAbort(e);
        });
        // When the file has finished playing to the end
        audio.addEventListener('ended', (e) => {
            this.clearListenTrack();
            this.props.onEnded && this.props.onEnded(e);
        });
        // When the user pauses playback
        audio.addEventListener('pause', (e) => {
            this.clearListenTrack();
            if (!this.audio)
                return;
            this.setState({ isPlaying: false });
            this.props.onPause && this.props.onPause(e);
        });
    }
    render() {
        const { className, src, preload, autoPlay, crossOrigin, mediaGroup, showLoopControl, showSkipControls, showJumpControls, showVolumeControl, onClickPrevious, onClickNext, showDownloadProgress, ShowFilledProgress, volume: volumeProp, defaultCurrentTime, defaultDuration, muted, progressUpdateInterval, header, footer, customIcons, children, style, } = this.props;
        const { isPlaying, isLoopEnabled } = this.state;
        const { volume = muted ? 0 : volumeProp } = this.audio || {};
        let loopIcon;
        if (isLoopEnabled) {
            loopIcon = customIcons.loop ? customIcons.loop : react_1.default.createElement(react_2.Icon, { icon: repeat_1.default });
        }
        else {
            loopIcon = customIcons.loopOff ? customIcons.loopOff : react_1.default.createElement(react_2.Icon, { icon: repeat_off_1.default });
        }
        let actionIcon;
        if (isPlaying) {
            actionIcon = customIcons.pause ? customIcons.pause : react_1.default.createElement(react_2.Icon, { icon: pause_circle_1.default });
        }
        else {
            actionIcon = customIcons.play ? customIcons.play : react_1.default.createElement(react_2.Icon, { icon: play_circle_1.default });
        }
        let volumeIcon;
        if (volume) {
            volumeIcon = customIcons.volume ? customIcons.volume : react_1.default.createElement(react_2.Icon, { icon: volume_high_1.default });
        }
        else {
            volumeIcon = customIcons.volume ? customIcons.volumeMute : react_1.default.createElement(react_2.Icon, { icon: volume_mute_1.default });
        }
        return (
        /* We want the container to catch bubbled events */
        /* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */
        react_1.default.createElement("div", { role: "group", 
            /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
            tabIndex: 0, "aria-label": "Audio Player", className: `rhap_container ${className}`, onKeyDown: this.handleKeyDown, ref: (ref) => {
                this.container = ref;
            }, style: style },
            react_1.default.createElement("audio", { src: src, controls: false, loop: isLoopEnabled, autoPlay: autoPlay, preload: preload, crossOrigin: crossOrigin, mediaGroup: mediaGroup, ref: (ref) => {
                    this.audio = ref;
                } }, children),
            header && react_1.default.createElement("div", { className: "rhap_header" }, header),
            react_1.default.createElement("div", { className: "rhap_progress-section" },
                react_1.default.createElement("div", { id: "rhap_current-time", className: "rhap_time rhap_current-time" },
                    react_1.default.createElement(CurrentTime_1.default, { audio: this.audio, defaultCurrentTime: defaultCurrentTime })),
                react_1.default.createElement(ProgressBar_1.default, { ref: (node) => {
                        this.progressBarInstance = node;
                    }, audio: this.audio, progressUpdateInterval: progressUpdateInterval, showDownloadProgress: showDownloadProgress, ShowFilledProgress: ShowFilledProgress }),
                react_1.default.createElement("div", { className: "rhap_time rhap_total-time" },
                    react_1.default.createElement(Duration_1.default, { audio: this.audio, defaultDuration: defaultDuration }))),
            react_1.default.createElement("div", { className: "rhap_controls-section" },
                react_1.default.createElement("div", { className: "rhap_additional-controls" }, showLoopControl && (react_1.default.createElement("button", { "aria-label": isLoopEnabled ? 'Enable Loop' : 'Disable Loop', className: "rhap_button-clear rhap_repeat-button", onClick: this.handleClickLoopButton }, loopIcon))),
                react_1.default.createElement("div", { className: "rhap_main-controls" },
                    showSkipControls && (react_1.default.createElement("button", { "aria-label": "Previous", className: "rhap_button-clear rhap_main-controls-button rhap_skip-button", onClick: onClickPrevious }, customIcons.previous ? customIcons.previous : react_1.default.createElement(react_2.Icon, { icon: skip_previous_1.default }))),
                    showJumpControls && (react_1.default.createElement("button", { "aria-label": "Rewind", className: "rhap_button-clear rhap_main-controls-button rhap_rewind-button", onClick: this.handleClickRewind }, customIcons.rewind ? customIcons.rewind : react_1.default.createElement(react_2.Icon, { icon: rewind_1.default }))),
                    react_1.default.createElement("button", { "aria-label": isPlaying ? 'Pause' : 'Play', className: "rhap_button-clear rhap_main-controls-button rhap_play-pause-button", onClick: this.togglePlay }, actionIcon),
                    showJumpControls && (react_1.default.createElement("button", { "aria-label": "Forward", className: "rhap_button-clear rhap_main-controls-button rhap_forward-button", onClick: this.handleClickForward }, customIcons.forward ? customIcons.forward : react_1.default.createElement(react_2.Icon, { icon: fast_forward_1.default }))),
                    showSkipControls && (react_1.default.createElement("button", { "aria-label": "Skip", className: "rhap_button-clear rhap_main-controls-button rhap_skip-button", onClick: onClickNext }, customIcons.next ? customIcons.next : react_1.default.createElement(react_2.Icon, { icon: skip_next_1.default })))),
                react_1.default.createElement("div", { className: "rhap_volume-controls" }, showVolumeControl && (react_1.default.createElement("div", { className: "rhap_volume-container" },
                    react_1.default.createElement("button", { "aria-label": volume ? 'Mute' : 'Unmute', onClick: this.handleClickVolumeButton, className: "rhap_button-clear rhap_volume-button" }, volumeIcon),
                    react_1.default.createElement(VolumeBar_1.default, { audio: this.audio, volume: volume, onMuteChange: this.handleMuteChange }))))),
            footer && react_1.default.createElement("div", { className: "rhap_footer" }, footer)));
    }
}
H5AudioPlayer.defaultProps = {
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
    customIcons: {},
};
exports.default = H5AudioPlayer;
