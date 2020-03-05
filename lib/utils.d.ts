declare type throttleFunction<T> = (arg: T) => void;
export declare const getPosX: (event: MouseEvent | TouchEvent) => number;
export declare const getDisplayTimeBySeconds: (seconds: number) => string;
export declare function throttle<K>(func: throttleFunction<K>, limit: number): throttleFunction<K>;
export {};
