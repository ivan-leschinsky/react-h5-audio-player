"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const utils_1 = require("./utils");
class Duration extends react_1.PureComponent {
    constructor() {
        super(...arguments);
        this.hasAddedAudioEventListener = false;
        this.state = {
            duration: this.props.defaultDuration,
        };
        this.handleAudioDurationChange = (e) => {
            const audio = e.target;
            this.setState({ duration: utils_1.getDisplayTimeBySeconds(audio.duration) });
        };
    }
    componentDidUpdate() {
        const { audio } = this.props;
        if (audio && !this.hasAddedAudioEventListener) {
            this.audio = audio;
            this.hasAddedAudioEventListener = true;
            audio.addEventListener('durationchange', this.handleAudioDurationChange);
        }
    }
    componentWillUnmount() {
        if (this.audio && this.hasAddedAudioEventListener) {
            this.audio.removeEventListener('durationchange', this.handleAudioDurationChange);
        }
    }
    render() {
        return this.state.duration;
    }
}
exports.default = Duration;
