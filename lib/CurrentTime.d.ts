import React, { PureComponent, ReactNode } from 'react';
interface CurrentTimeProps {
    audio?: HTMLAudioElement;
    defaultCurrentTime: ReactNode;
}
interface CurrentTimeState {
    currentTime: ReactNode;
}
declare class CurrentTime extends PureComponent<CurrentTimeProps, CurrentTimeState> {
    audio?: HTMLAudioElement;
    hasAddedAudioEventListener: boolean;
    state: CurrentTimeState;
    handleAudioCurrentTimeChange: (e: Event) => void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    render(): React.ReactNode;
}
export default CurrentTime;
