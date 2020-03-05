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
class VolumeControls extends react_1.Component {
    constructor() {
        super(...arguments);
        this.hasAddedAudioEventListener = false;
        this.volumeAnimationTimer = 0;
        this.lastVolume = this.props.volume; // To store the volume before clicking mute button
        this.state = {
            currentVolumePos: `${((this.lastVolume / 1) * 100 || 0).toFixed(2)}%`,
            hasVolumeAnimation: false,
            isDraggingVolume: false,
        };
        // get volume info while dragging by indicator mouse or touch
        this.getCurrentVolume = (event) => {
            const { audio } = this.props;
            if (!this.volumeBarEl) {
                return {
                    currentVolume: audio.volume,
                    currentVolumePos: this.state.currentVolumePos,
                };
            }
            const volumeBarRect = this.volumeBarEl.getBoundingClientRect();
            const maxRelativePos = volumeBarRect.width;
            const relativePos = utils_1.getPosX(event) - volumeBarRect.left;
            let currentVolume;
            let currentVolumePos;
            if (relativePos < 0) {
                currentVolume = 0;
                currentVolumePos = '0%';
            }
            else if (relativePos > volumeBarRect.width) {
                currentVolume = 1;
                currentVolumePos = '100%';
            }
            else {
                currentVolume = relativePos / maxRelativePos;
                currentVolumePos = `${(relativePos / maxRelativePos) * 100}%`;
            }
            return { currentVolume, currentVolumePos };
        };
        this.handleClickVolumeButton = () => {
            const { audio } = this.props;
            if (audio.volume > 0) {
                this.lastVolume = audio.volume;
                audio.volume = 0;
            }
            else {
                audio.volume = this.lastVolume;
            }
        };
        this.handleVolumnControlMouseDown = (event) => {
            event.stopPropagation();
            const { audio } = this.props;
            const { currentVolume, currentVolumePos } = this.getCurrentVolume(event.nativeEvent);
            audio.volume = currentVolume;
            this.setState({ isDraggingVolume: true, currentVolumePos });
            if (event.nativeEvent instanceof MouseEvent) {
                window.addEventListener('mousemove', this.handleWindowMouseOrTouchMove);
                window.addEventListener('mouseup', this.handleWindowMouseOrTouchUp);
            }
            else {
                window.addEventListener('touchmove', this.handleWindowMouseOrTouchMove);
                window.addEventListener('touchend', this.handleWindowMouseOrTouchUp);
            }
        };
        this.handleWindowMouseOrTouchMove = (event) => {
            event.preventDefault();
            event.stopPropagation();
            const { audio } = this.props;
            // Prevent Chrome drag selection bug
            const windowSelection = window.getSelection();
            if (windowSelection && windowSelection.type === 'Range') {
                windowSelection.empty();
            }
            const { isDraggingVolume } = this.state;
            if (isDraggingVolume) {
                const { currentVolume, currentVolumePos } = this.getCurrentVolume(event);
                audio.volume = currentVolume;
                this.setState({ currentVolumePos });
            }
        };
        this.handleWindowMouseOrTouchUp = (event) => {
            event.stopPropagation();
            this.setState({ isDraggingVolume: false });
            if (event instanceof MouseEvent) {
                window.removeEventListener('mousemove', this.handleWindowMouseOrTouchMove);
                window.removeEventListener('mouseup', this.handleWindowMouseOrTouchUp);
            }
            else {
                window.removeEventListener('touchmove', this.handleWindowMouseOrTouchMove);
                window.removeEventListener('touchend', this.handleWindowMouseOrTouchUp);
            }
        };
        this.handleAudioVolumeChange = (e) => {
            const { isDraggingVolume } = this.state;
            const { volume } = e.target;
            if ((this.lastVolume > 0 && volume === 0) || (this.lastVolume === 0 && volume > 0)) {
                this.props.onMuteChange();
            }
            this.lastVolume = volume;
            if (isDraggingVolume)
                return;
            this.setState({
                hasVolumeAnimation: true,
                currentVolumePos: `${((volume / 1) * 100 || 0).toFixed(2)}%`,
            });
            clearTimeout(this.volumeAnimationTimer);
            this.volumeAnimationTimer = setTimeout(() => {
                this.setState({ hasVolumeAnimation: false });
            }, 100);
        };
    }
    componentDidUpdate() {
        const { audio } = this.props;
        if (audio && !this.hasAddedAudioEventListener) {
            this.audio = audio;
            this.hasAddedAudioEventListener = true;
            audio.addEventListener('volumechange', this.handleAudioVolumeChange);
        }
    }
    componentWillUnmount() {
        if (this.audio && this.hasAddedAudioEventListener) {
            this.audio.removeEventListener('volumechange', this.handleAudioVolumeChange);
        }
        clearTimeout(this.volumeAnimationTimer);
    }
    render() {
        const { audio } = this.props;
        const { currentVolumePos, hasVolumeAnimation } = this.state;
        const { volume } = audio || {};
        return (react_1.default.createElement("div", { ref: (el) => {
                this.volumeBarEl = el;
            }, onMouseDown: this.handleVolumnControlMouseDown, onTouchStart: this.handleVolumnControlMouseDown, role: "progressbar", "aria-label": "volume Control", "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": Number((volume * 100).toFixed(0)), tabIndex: 0, className: "rhap_volume-bar-area" },
            react_1.default.createElement("div", { className: "rhap_volume-bar" },
                react_1.default.createElement("div", { className: "rhap_volume-indicator", style: { left: currentVolumePos, transitionDuration: hasVolumeAnimation ? '.1s' : '0s' } }))));
    }
}
exports.default = VolumeControls;
