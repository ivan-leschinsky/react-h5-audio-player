import React, { PureComponent, ReactNode } from 'react';
interface DurationProps {
    audio?: HTMLAudioElement;
    defaultDuration: ReactNode;
}
interface DurationState {
    duration: ReactNode;
}
declare class Duration extends PureComponent<DurationProps, DurationState> {
    audio?: HTMLAudioElement;
    hasAddedAudioEventListener: boolean;
    state: DurationState;
    handleAudioDurationChange: (e: Event) => void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    render(): React.ReactNode;
}
export default Duration;
