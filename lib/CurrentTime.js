"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const utils_1 = require("./utils");
class CurrentTime extends react_1.PureComponent {
    constructor() {
        super(...arguments);
        this.hasAddedAudioEventListener = false;
        this.state = {
            currentTime: this.props.defaultCurrentTime,
        };
        this.handleAudioCurrentTimeChange = (e) => {
            const audio = e.target;
            this.setState({ currentTime: utils_1.getDisplayTimeBySeconds(audio.currentTime) });
        };
    }
    componentDidUpdate() {
        const { audio } = this.props;
        if (audio && !this.hasAddedAudioEventListener) {
            this.audio = audio;
            this.hasAddedAudioEventListener = true;
            audio.addEventListener('timeupdate', this.handleAudioCurrentTimeChange);
            audio.addEventListener('loadedmetadata', this.handleAudioCurrentTimeChange);
        }
    }
    componentWillUnmount() {
        if (this.audio && this.hasAddedAudioEventListener) {
            this.audio.removeEventListener('timeupdate', this.handleAudioCurrentTimeChange);
            this.audio.removeEventListener('loadedmetadata', this.handleAudioCurrentTimeChange);
        }
    }
    render() {
        return this.state.currentTime;
    }
}
exports.default = CurrentTime;
