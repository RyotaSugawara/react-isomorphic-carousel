import * as React from 'react';

interface Touch {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  swipeDirection: number;
}

interface Props {
  duration?: number;
  autoSlideInterval?: number;
}

interface State {
  animate: boolean,
  canUseDOM: boolean;
  currentIndex: number;
  slideCount: number;
  slideWidth: any;
  slideHeight: any;
  swipePosition: number;
  showNextSlide: boolean;
  showPrevSlide: boolean;
}

export class Carousel extends React.Component<Props, State> {

  container: Element;
  swiping: boolean;
  moving: boolean;
  touch: Touch;
  timer;

  state = {
    animate: false,
    canUseDOM: false,
    currentIndex: 0,
    slideCount: 0,
    slideWidth: null,
    slideHeight: null,
    swipePosition: 0,
    showNextSlide: false,
    showPrevSlide: false
  };

  static get defaultProps() {
    return {
      duration: 500, // ms
      autoSlideInterval: 0, // ms
    };
  }

  constructor() {
    super();
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.onResize = this.onResize.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
  }

  /* Lifecycle Methods */
  componentWillMount() {
    // CAUTION: Do not use dom methods in this method!
    const slideCount = React.Children.count(this.props.children);

    this.setState({
      canUseDOM: false,
      slideCount
    });
  }

  componentDidMount() {
    this.initialize();
    this.addEvents();
    this.autoSlide();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.children !== this.props.children) {
      this.initialize();
    }
  }

  componentWillUnmount() {
    this.removeEvents();
  }

  /* render methods */
  render() {
    if (!this.props.children) {
      return null;
    }
    return (
      <div>
        <ul
          ref={(node) => (this.container = node)}
          style={(this.state.canUseDOM) ? this.getFrameStyle() : { width: '100%' }}
        >
          {this.renderCarouselChild()}
        </ul>
      </div>
    );
  }

  renderInitialRect() {
    return (
      <li>{this.props.children[0]}</li>
    );
  }

  renderCarouselChild() {
    if (!this.state.canUseDOM) {
      return this.renderInitialRect();
    }
    const { children } = this.props;
    return React.Children.map(children, (child, index) => {
      return (
        <li
          style={this.getSlideStyle(index)}
        >
          {child}
        </li>
      );
    });
  }

  /* other methods */
  autoSlide() {
    if (this.props.autoSlideInterval <= 0 || this.timer) {
      return;
    }

    this.timer = setInterval(() => {
      this.next();
    }, this.props.autoSlideInterval);
  }

  resetAutoSlide() {
    clearInterval(this.timer);
    delete this.timer;
    this.autoSlide();
  }

  addEvents() {
    window.addEventListener('resize', this.onResize);
    if (this.container) {
      this.container.addEventListener('touchstart', this.handleTouchStart);
      this.container.addEventListener('touchmove', this.handleTouchMove);
      this.container.addEventListener('touchend', this.handleTouchEnd);
      this.container.addEventListener('touchcancel', this.handleTouchEnd);
    }
  }

  removeEvents() {
    window.removeEventListener('resize', this.onResize);
    if (this.container) {
      this.container.removeEventListener('touchstart', this.handleTouchStart);
      this.container.removeEventListener('touchmove', this.handleTouchMove);
      this.container.removeEventListener('touchend', this.handleTouchEnd);
      this.container.removeEventListener('touchcancel', this.handleTouchEnd);
    }
    if (this.timer) {
      clearInterval(this.timer);
      delete this.timer;
    }
  }

  onResize() {
    this.updateFrameRect();
  }

  getFrameStyle(): any {
    return {
      position: 'relative',
      overflow: 'hidden',
      width: 'auto',
      height: this.state.slideHeight,
      transform: 'translate3d(0, 0, 0)',
      WebkitTransform: 'translate3d(0, 0, 0)',
      msTransform: 'translate(0, 0)'
    };
  }

  getSlideStyle(index): any {
    const canDisplay = this.canDisplaySlide(index);
    const duration = this.swiping ? 0 : this.props.duration / 1000; // to milisec
    const transition = this.state.animate ? `transform ${duration}s ease` : null;
    let transform, msTransform;
    if (canDisplay) {
      if (this.state.showNextSlide && this.getNextIndex() === index) {
        transform = `translate3d(${this.state.swipePosition + this.state.slideWidth}px, 0px, 1px)`;
        msTransform = `translate(${this.state.swipePosition + this.state.slideWidth}px, 0px)`;
      } else if (this.state.showPrevSlide && this.getPrevIndex() === index) {
        transform = `translate3d(${this.state.swipePosition - this.state.slideWidth}px, 0px, 1px)`;
        msTransform = `translate3d(${this.state.swipePosition - this.state.slideWidth}px, 0px)`;
      } else if (this.state.currentIndex === index) {
        transform = `translate3d(${this.state.swipePosition}px, 0px, 1px)`;
        msTransform = `translate3d(${this.state.swipePosition}px, 0px)`;
      }
    }
    return {
      position: this.state.canUseDOM ? 'absolute' : 'relative',
      display: canDisplay ? 'block' : 'none',
      width: '100%',
      top: 0,
      left: 0,
      transition,
      WebkitTransition: transition,
      msTransition: transition,
      transform,
      WebkitTransform: transform,
      msTransform
    };
  }

  canDisplaySlide(index) {
    if (index === this.state.currentIndex) {
      return true;
    }

    if (!this.state.animate) {
      return false;
    }

    if (this.state.showNextSlide && this.getNextIndex() === index) {
      return true;
    }

    if (this.state.showPrevSlide && this.getPrevIndex() === index) {
      return true;
    }

    return false;
  }

  getNextIndex() {
    return (this.state.currentIndex === this.state.slideCount - 1) ? 0 : this.state.currentIndex + 1
  }

  getPrevIndex() {
    return (this.state.currentIndex === 0) ? this.state.slideCount - 1 : this.state.currentIndex - 1;
  }

  updateFrameRect() {
    const slideCount = React.Children.count(this.props.children);
    const container = this.container;
    const slide = this.container.children[this.state.currentIndex];
    let slideHeight = 100;
    let slideWidth = 100;
    if (slide) {
      const clientRect = slide.getBoundingClientRect();
      slideWidth = clientRect.width;
      slideHeight = clientRect.height;
    }
    this.setState({
      slideCount,
      slideWidth,
      slideHeight
    }, () => {
      this.setState({
        canUseDOM: true
      });
    });
  }

  next() {
    if (this.swiping || this.moving) {
      return;
    }
    this.moving = true;
    this.setState({
      animate: true,
      showNextSlide: true,
    }, () => {
      setTimeout(() => {
        // animation
        this.setState({
          swipePosition: -this.state.slideWidth
        }, () => {
          setTimeout(() => {
            this.setState({
              animate: false,
              showNextSlide: false,
              currentIndex: this.getNextIndex(),
              swipePosition: 0
            }, () => {
              this.moving = false;
            })
          }, this.props.duration);
        });
      });
    });
  }

  prev() {
    if (this.swiping || this.moving) {
      return;
    }
    this.moving = true;
    this.setState({
      animate: true,
      showPrevSlide: true,
    }, () => {
      setTimeout(() => {
        // animation
        this.setState({
          swipePosition: this.state.slideWidth
        }, () => {
          setTimeout(() => {
            this.setState({
              animate: false,
              showPrevSlide: false,
              currentIndex: this.getPrevIndex(),
              swipePosition: 0
            }, () => {
              this.moving = false;
            })
          }, this.props.duration);
        });
      });
    });
  }

  initialize() {
    this.updateFrameRect();
    const imgs = this.container.getElementsByTagName('img');
    for (let i = 0; i < imgs.length; i++) {
      imgs[i].onload = () => {
        this.updateFrameRect();
      };
    }
  }

  handleTouchStart(e) {
    if (this.moving) return;
    this.swiping = true;
    this.touch = {
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
      endX: null,
      endY: null,
      swipeDirection: null
    };

    this.setState({
      animate: true
    });
  }

  handleTouchMove(e) {
    if (this.moving || !this.touch) return;
    const swipeDirection = this.judgeSwipeDirection(
      this.touch.startX,
      this.touch.startY,
      e.touches[0].clientX,
      e.touches[0].clientY
    );

    if (swipeDirection === 0) {
      e.nativeEvent ? e.nativeEvent.preventDefault() : e.preventDefault();
      return false;
    }

    this.touch = {
      startX: this.touch.startX,
      startY: this.touch.startY,
      endX: e.touches[0].clientX,
      endY: e.touches[0].clientY,
      swipeDirection
    };

    const diff = this.touch.endX - this.touch.startX;
    const showNextSlide = this.touch.swipeDirection === 1;
    const showPrevSlide = this.touch.swipeDirection === -1;

    this.setState({
      swipePosition: diff,
      showNextSlide,
      showPrevSlide
    });
  }

  handleTouchEnd() {
    if (this.moving || !this.touch) return;
    this.swiping = false;
    if (this.touch.swipeDirection === 1) {
      this.next();
    } else if (this.touch.swipeDirection === -1) {
      this.prev();
    }
    this.touch = null;
    this.resetAutoSlide();
  }

  judgeSwipeDirection(startX: number, startY: number, endX: number, endY: number) {
    const x = startX - endX;
    const y = startY - endY;
    const r = Math.atan2(y, x);
    let angle = Math.round(r * 180 / Math.PI);
    if (angle < 0) {
      angle = 360 - Math.abs(angle);
    }
    if (angle <= 45 && 0 <= angle) {
      return 1;
    }
    if (angle <= 360 && 315 <= angle) {
      return 1;
    }
    if (angle <= 225 && 135 <= angle) {
      return -1;
    }
    return 0;
  }
}
