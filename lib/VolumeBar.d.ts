import React, { Component } from 'react';
interface VolumeControlsProps {
    audio: HTMLAudioElement;
    volume: number;
    onMuteChange: () => void;
}
interface VolumeControlsState {
    currentVolumePos: string;
    hasVolumeAnimation: boolean;
    isDraggingVolume: boolean;
}
interface VolumePosInfo {
    currentVolume: number;
    currentVolumePos: string;
}
declare class VolumeControls extends Component<VolumeControlsProps, VolumeControlsState> {
    audio?: HTMLAudioElement;
    hasAddedAudioEventListener: boolean;
    volumeBarEl?: HTMLDivElement;
    volumeAnimationTimer: number;
    lastVolume: number;
    state: VolumeControlsState;
    getCurrentVolume: (event: MouseEvent | TouchEvent) => VolumePosInfo;
    handleClickVolumeButton: () => void;
    handleVolumnControlMouseDown: (event: React.MouseEvent<Element, MouseEvent> | React.TouchEvent<Element>) => void;
    handleWindowMouseOrTouchMove: (event: MouseEvent | TouchEvent) => void;
    handleWindowMouseOrTouchUp: (event: MouseEvent | TouchEvent) => void;
    handleAudioVolumeChange: (e: Event) => void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    render(): React.ReactNode;
}
export default VolumeControls;
