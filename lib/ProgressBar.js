"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const utils_1 = require("./utils");
class ProgressBar extends react_1.Component {
    constructor() {
        super(...arguments);
        this.timeOnMouseMove = 0; // Audio's current time while mouse is down and moving over the progress bar
        this.hasAddedAudioEventListener = false;
        this.state = {
            isDraggingProgress: false,
            currentTimePos: '0%',
            hasDownloadProgressAnimation: false,
            downloadProgressArr: [],
        };
        // Get time info while dragging indicator by mouse or touch
        this.getCurrentProgress = (event) => {
            const { audio } = this.props;
            if (!audio.src || !isFinite(audio.currentTime) || !this.progressBarEl) {
                return { currentTime: 0, currentTimePos: '0%' };
            }
            const progressBarRect = this.progressBarEl.getBoundingClientRect();
            const maxRelativePos = progressBarRect.width;
            let relativePos = utils_1.getPosX(event) - progressBarRect.left;
            if (relativePos < 0) {
                relativePos = 0;
            }
            else if (relativePos > maxRelativePos) {
                relativePos = maxRelativePos;
            }
            const currentTime = (this.props.audio.duration * relativePos) / maxRelativePos;
            return { currentTime, currentTimePos: `${((relativePos / maxRelativePos) * 100).toFixed(2)}%` };
        };
        /* Handle mouse click on progress bar event */
        this.handleMouseDownProgressBar = (event) => {
            event.stopPropagation();
            const { currentTime, currentTimePos } = this.getCurrentProgress(event.nativeEvent);
            if (isFinite(currentTime)) {
                this.timeOnMouseMove = currentTime;
                this.setState({ isDraggingProgress: true, currentTimePos });
                if (event.nativeEvent instanceof MouseEvent) {
                    window.addEventListener('mousemove', this.handleWindowMouseOrTouchMove);
                    window.addEventListener('mouseup', this.handleWindowMouseOrTouchUp);
                }
                else {
                    window.addEventListener('touchmove', this.handleWindowMouseOrTouchMove);
                    window.addEventListener('touchend', this.handleWindowMouseOrTouchUp);
                }
            }
        };
        this.handleWindowMouseOrTouchMove = (event) => {
            event.preventDefault();
            event.stopPropagation();
            // Prevent Chrome drag selection bug
            const windowSelection = window.getSelection();
            if (windowSelection && windowSelection.type === 'Range') {
                windowSelection.empty();
            }
            const { isDraggingProgress } = this.state;
            if (isDraggingProgress) {
                const { currentTime, currentTimePos } = this.getCurrentProgress(event);
                this.timeOnMouseMove = currentTime;
                this.setState({ currentTimePos });
            }
        };
        this.handleWindowMouseOrTouchUp = (event) => {
            event.stopPropagation();
            this.setState((prevState) => {
                if (prevState.isDraggingProgress && isFinite(this.timeOnMouseMove)) {
                    this.props.audio.currentTime = this.timeOnMouseMove;
                }
                return { isDraggingProgress: false };
            });
            if (event instanceof MouseEvent) {
                window.removeEventListener('mousemove', this.handleWindowMouseOrTouchMove);
                window.removeEventListener('mouseup', this.handleWindowMouseOrTouchUp);
            }
            else {
                window.removeEventListener('touchmove', this.handleWindowMouseOrTouchMove);
                window.removeEventListener('touchend', this.handleWindowMouseOrTouchUp);
            }
        };
        this.handleAudioTimeUpdate = utils_1.throttle((e) => {
            const { isDraggingProgress } = this.state;
            const audio = e.target;
            if (isDraggingProgress)
                return;
            const { duration, currentTime } = audio;
            this.setState({
                currentTimePos: `${((currentTime / duration) * 100 || 0).toFixed(2)}%`,
            });
        }, this.props.progressUpdateInterval);
        this.handleAudioDownloadProgressUpdate = (e) => {
            const audio = e.target;
            const downloadProgressArr = [];
            for (let i = 0; i < audio.buffered.length; i++) {
                const bufferedStart = audio.buffered.start(i);
                const bufferedEnd = audio.buffered.end(i);
                downloadProgressArr.push({
                    left: `${Math.round((100 / audio.duration) * bufferedStart) || 0}%`,
                    width: `${Math.round((100 / audio.duration) * (bufferedEnd - bufferedStart)) || 0}%`,
                });
            }
            clearTimeout(this.downloadProgressAnimationTimer);
            this.setState({ downloadProgressArr, hasDownloadProgressAnimation: true });
            this.downloadProgressAnimationTimer = setTimeout(() => {
                this.setState({ hasDownloadProgressAnimation: false });
            }, 200);
        };
    }
    componentDidUpdate() {
        const { audio } = this.props;
        if (audio && !this.hasAddedAudioEventListener) {
            this.audio = audio;
            this.hasAddedAudioEventListener = true;
            audio.addEventListener('timeupdate', this.handleAudioTimeUpdate);
            audio.addEventListener('progress', this.handleAudioDownloadProgressUpdate);
        }
    }
    componentWillUnmount() {
        if (this.audio && this.hasAddedAudioEventListener) {
            this.audio.removeEventListener('timeupdate', this.handleAudioTimeUpdate);
            this.audio.removeEventListener('progress', this.handleAudioDownloadProgressUpdate);
        }
        clearTimeout(this.downloadProgressAnimationTimer);
    }
    render() {
        const { showDownloadProgress, ShowFilledProgress } = this.props;
        const { currentTimePos, downloadProgressArr, hasDownloadProgressAnimation } = this.state;
        return (react_1.default.createElement("div", { className: "rhap_progress-container", ref: (el) => {
                this.progressBarEl = el;
            }, "aria-label": "Audio Progress Control", "aria-describedby": "rhap_current-time", role: "progressbar", "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": Number(currentTimePos.split('%')[0]), tabIndex: 0, onMouseDown: this.handleMouseDownProgressBar, onTouchStart: this.handleMouseDownProgressBar },
            react_1.default.createElement("div", { className: `rhap_progress-bar ${showDownloadProgress ? 'rhap_progress-bar-show-download' : ''}` },
                react_1.default.createElement("div", { className: "rhap_progress-indicator", style: { left: currentTimePos } }),
                ShowFilledProgress && react_1.default.createElement("div", { className: "rhap_progress-filled", style: { width: currentTimePos } }),
                showDownloadProgress &&
                    downloadProgressArr.map(({ left, width }, i) => (react_1.default.createElement("div", { key: i, className: "rhap_download-progress", style: { left, width, transitionDuration: hasDownloadProgressAnimation ? '.2s' : '0s' } }))))));
    }
}
exports.default = ProgressBar;
