import * as React from 'react';
export interface Touch {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    swipeDirection: number;
}
export interface CarouselProps {
    label?: string;
    useDots?: boolean;
    dotStyle?: React.CSSProperties;
    activeDotStyle?: React.CSSProperties;
    duration?: number;
    autoSlideInterval?: number;
    style?: React.CSSProperties;
    useControl?: boolean;
}
export interface CarouselState {
    animate: boolean;
    canUseDOM: boolean;
    currentIndex: number;
    slideCount: number;
    slideWidth: any;
    slideHeight: any;
    swipePosition: number;
    showIndex: number;
}
export default class Carousel extends React.Component<CarouselProps, CarouselState> {
    id: string;
    container: Element;
    swiping: boolean;
    moving: boolean;
    direction: number;
    touch: Touch;
    timer: any;
    static readonly defaultProps: CarouselProps;
    constructor(props: any);
    componentDidMount(): void;
    componentDidUpdate(prevProps: any): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
    renderInitialRect(): JSX.Element;
    renderCarouselChild(): JSX.Element | JSX.Element[];
    renderControls(): JSX.Element;
    renderNextButton(action: any): JSX.Element;
    renderPrevButton(action: any): JSX.Element;
    autoSlide(): void;
    resetAutoSlide(): void;
    addEvents(): void;
    removeEvents(): void;
    onResize: () => void;
    getFrameStyle(): any;
    getSlideStyle(index: any): any;
    canDisplaySlide(index: any): boolean;
    getNextIndex(): number;
    getPrevIndex(): number;
    getIndexDirection(index: any): 1 | 0 | -1;
    getButtonStyle(isActive: any): React.CSSProperties;
    updateFrameRect(): void;
    move(index: number, direction?: number): void;
    next: () => void;
    prev: () => void;
    initialize(): void;
    handleTouchStart: (e: any) => void;
    handleTouchMove: (e: any) => boolean;
    handleTouchEnd: () => void;
    judgeSwipeDirection(startX: number, startY: number, endX: number, endY: number): 1 | 0 | -1;
}
