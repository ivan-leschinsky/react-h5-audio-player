import React, { Component, ReactNode, CSSProperties } from 'react';
import ProgressBar from './ProgressBar';
import MidiPlayer from 'web-midi-player';
interface PlayerProps {
    /**
     * HTML5 Audio tag autoPlay property
     */
    autoPlay?: boolean;
    /**
     * Whether to play music after src prop is changed
     */
    autoPlayAfterSrcChange?: boolean;
    /**
     * custom classNames
     */
    className?: string;
    /**
     * The time interval to trigger onListen
     */
    listenInterval?: number;
    progressJumpStep?: number;
    volumeJumpStep?: number;
    loop?: boolean;
    muted?: boolean;
    crossOrigin?: string;
    mediaGroup?: string;
    onAbort?: (e: Event) => void;
    onCanPlay?: (e: Event) => void;
    onCanPlayThrough?: (e: Event) => void;
    onEnded?: (e: Event) => void;
    onError?: (e: Event) => void;
    onListen?: (currentTime: number) => void;
    onPause?: (e: Event) => void;
    onPlay?: (e: Event) => void;
    onClickPrevious?: (e: React.SyntheticEvent) => void;
    onClickNext?: (e: React.SyntheticEvent) => void;
    onPlayError?: (err: Error) => void;
    /**
     * HTML5 Audio tag preload property
     */
    preload?: 'auto' | 'metadata' | 'none';
    /**
     * Pregress indicator refresh interval
     */
    progressUpdateInterval?: number;
    /**
     * HTML5 Audio tag src property
     */
    src?: string;
    defaultCurrentTime?: ReactNode;
    defaultDuration?: ReactNode;
    volume?: number;
    showLoopControl?: boolean;
    showVolumeControl?: boolean;
    showJumpControls?: boolean;
    showSkipControls?: boolean;
    showDownloadProgress?: boolean;
    ShowFilledProgress?: boolean;
    header?: ReactNode;
    footer?: ReactNode;
    customIcons: CustomIcons;
    children?: ReactNode;
    style?: CSSProperties;
    midiPatchUrl?: string;
}
interface PlayerState {
    isPlaying: boolean;
    isLoopEnabled: boolean;
}
interface CustomIcons {
    play?: ReactNode;
    pause?: ReactNode;
    rewind?: ReactNode;
    forward?: ReactNode;
    previous?: ReactNode;
    next?: ReactNode;
    loop?: ReactNode;
    loopOff?: ReactNode;
    volume?: ReactNode;
    volumeMute?: ReactNode;
}
declare class H5AudioPlayer extends Component<PlayerProps, PlayerState> {
    static defaultProps: PlayerProps;
    state: PlayerState;
    audio: HTMLAudioElement;
    volumeControl?: HTMLDivElement;
    progressBarInstance?: ProgressBar;
    container?: HTMLDivElement;
    lastVolume: number;
    listenTracker?: number;
    volumeAnimationTimer?: number;
    downloadProgressAnimationTimer?: number;
    midiPlayer?: MidiPlayer;
    constructor(props: PlayerProps);
    togglePlay: (e: React.SyntheticEvent<Element, Event>) => void;
    handleClickVolumeButton: () => void;
    handleMuteChange: () => void;
    handleClickLoopButton: () => void;
    handleClickRewind: () => void;
    handleClickForward: () => void;
    setJumpTime: (time: number) => void;
    setJumpVolume: (volume: number) => void;
    /**
     * Set an interval to call props.onListen every props.listenInterval time period
     */
    setListenTrack: () => void;
    /**
     * Clear the onListen interval
     */
    clearListenTrack: () => void;
    handleKeyDown: (e: React.KeyboardEvent<Element>) => void;
    componentDidMount(): void;
    render(): ReactNode;
}
export default H5AudioPlayer;
