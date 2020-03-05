import React, { Component } from 'react';
interface ProgressBarProps {
    audio: HTMLAudioElement;
    progressUpdateInterval: number;
    showDownloadProgress: boolean;
    ShowFilledProgress: boolean;
}
interface ProgressBarState {
    isDraggingProgress: boolean;
    currentTimePos: string;
    hasDownloadProgressAnimation: boolean;
    downloadProgressArr: DownloadProgress[];
}
interface DownloadProgress {
    left: string;
    width: string;
}
interface TimePosInfo {
    currentTime: number;
    currentTimePos: string;
}
declare class ProgressBar extends Component<ProgressBarProps, ProgressBarState> {
    audio?: HTMLAudioElement;
    timeOnMouseMove: number;
    hasAddedAudioEventListener: boolean;
    downloadProgressAnimationTimer?: number;
    progressBarEl?: HTMLDivElement;
    state: ProgressBarState;
    getCurrentProgress: (event: MouseEvent | TouchEvent) => TimePosInfo;
    handleMouseDownProgressBar: (event: React.MouseEvent<Element, MouseEvent> | React.TouchEvent<Element>) => void;
    handleWindowMouseOrTouchMove: (event: MouseEvent | TouchEvent) => void;
    handleWindowMouseOrTouchUp: (event: MouseEvent | TouchEvent) => void;
    handleAudioTimeUpdate: (arg: Event) => void;
    handleAudioDownloadProgressUpdate: (e: Event) => void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    render(): React.ReactNode;
}
export default ProgressBar;
