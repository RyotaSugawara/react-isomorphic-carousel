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
  duration?: number;
  autoSlideInterval?: number;
  style?: React.CSSProperties;
  useControl?: boolean;
}

export interface CarouselState {
  animate: boolean,
  canUseDOM: boolean;
  currentIndex: number;
  slideCount: number;
  slideWidth: any;
  slideHeight: any;
  swipePosition: number;
  showIndex: number;
}

const CONTROLS_STYLE = {
  display: 'inline-block',
  listStyle: 'none'
};

let id = 0;

export default class Carousel extends React.Component<CarouselProps, CarouselState> {

  id: number;
  container: Element;
  swiping: boolean;
  moving: boolean;
  direction: number;
  touch: Touch;
  timer;

  state: CarouselState = {
    animate: false,
    canUseDOM: false,
    currentIndex: 0,
    slideCount: 0,
    slideWidth: null,
    slideHeight: null,
    swipePosition: 0,
    showIndex: null
  };

  static get defaultProps(): CarouselProps {
    return {
      label: '',
      useDots: false,
      dotStyle: {},
      duration: 500, // ms
      autoSlideInterval: 0, // ms,
      useControl: false
    };
  }

  constructor() {
    super();
    this.id = id++;
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
      <div style={this.props.style}>
        <ul
          ref={(node) => (this.container = node)}
          style={(this.state.canUseDOM) ? this.getFrameStyle() : { width: '100%' }}
        >
          {this.renderCarouselChild()}
        </ul>
        {this.renderControls()}
      </div>
    );
  }

  renderInitialRect() {
    const firstChild = React.Children.toArray(this.props.children)[0];
    return (
      <li style={{ width: '100%' }}>
        {firstChild}
      </li>
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

  renderControls() {
    if (!this.props.useDots || this.state.slideCount <= 1) {
      return null;
    }
    return (
      <ul
        className="Carousel_Dots"
        style={{
          textAlign: 'center'
        }}
      >
        {this.props.useControl ? (
          <li style={CONTROLS_STYLE}>{this.renderPrevButton(this.prev)}</li>
        ) : null}
        {React.Children.map(this.props.children, (child: any, index) => {
          const isActive = this.state.currentIndex === index;
          return (
            <li
              className="Carousel_Dot"
              key={`dot-${this.id}-${index}`}
              style={CONTROLS_STYLE}
            >
              <button
                onClick={() => this.move(index)}
                aria-label={`Move ${this.props.label} carousel current index to ${index}.`}
                className="Carousel_Dot_Button"
                disabled={isActive}
                style={{
                  background: isActive ? '#000' : '#ccc',
                  lineHeight: 10,
                  border: 0,
                  borderRadius: '10px',
                  padding: 5,
                  margin: '0 4px',
                  cursor: 'pointer',
                  ...this.props.dotStyle
                }}
              />
            </li>
          );
        })}
        {this.props.useControl ? (
          <li style={CONTROLS_STYLE}>{this.renderNextButton(this.next)}</li>
        ) : null}
      </ul>
    );
  }

  renderNextButton(action) {
    return (
      <button onClick={action} aria-label={`Move ${this.props.label} carousel current index to next.`}>
        &gt;
      </button>
    );
  }

  renderPrevButton(action) {
    return (
      <button onClick={action} aria-label={`Move ${this.props.label} carousel current index to prev.`}>
        &lt;
      </button>
    );
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
      height: (this.state.slideCount > 1) ? this.state.slideHeight : 'auto',
      transform: 'translate3d(0, 0, 0)',
      WebkitTransform: 'translate3d(0, 0, 0)',
      msTransform: 'translate(0, 0)'
    };
  }

  getSlideStyle(index): any {
    const canDisplay = this.canDisplaySlide(index);
    const duration = this.swiping ? 0 : this.props.duration / 1000; // to milisec
    const transition = this.state.animate ? `transform ${duration}s ease` : null;
    let direction = this.getIndexDirection(index);
    if (direction) {
      if (this.touch) {
        direction = this.touch.swipeDirection;
      } else if (this.direction) {
        direction = this.direction;
      }
    }
    let transform, msTransform;
    if (canDisplay) {
      if (direction === 0) {
        transform = `translate3d(${this.state.swipePosition}px, 0px, 1px)`;
        msTransform = `translate3d(${this.state.swipePosition}px, 0px)`;
      } else if (direction === 1) {
        transform = `translate3d(${this.state.swipePosition + this.state.slideWidth}px, 0px, 1px)`;
        msTransform = `translate(${this.state.swipePosition + this.state.slideWidth}px, 0px)`;
      } else if (direction === -1) {
        transform = `translate3d(${this.state.swipePosition - this.state.slideWidth}px, 0px, 1px)`;
        msTransform = `translate3d(${this.state.swipePosition - this.state.slideWidth}px, 0px)`;
      }
    }
    return {
      position: (this.state.canUseDOM && this.state.slideCount > 1) ? 'absolute' : 'relative',
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

    if (this.state.showIndex === index) {
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

  getIndexDirection(index) {
    if (this.state.currentIndex === index) return 0;
    if (this.getNextIndex() === index) return 1;
    if (this.getPrevIndex() === index) return -1;
    if (this.state.currentIndex < index) return 1;
    if (this.state.currentIndex > index) return -1;
  }

  updateFrameRect() {
    const slideCount = React.Children.count(this.props.children);
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

  move(index: number, direction: number = this.getIndexDirection(index)) {
    if (this.swiping || this.moving || this.state.currentIndex === index) {
      return;
    }
    this.direction = direction;
    this.moving = true;
    this.setState({
      animate: true,
      showIndex: index
    }, () => {
      setTimeout(() => {
        this.setState({
          swipePosition: direction * -this.state.slideWidth
        }, () => {
          setTimeout(() => {
            this.setState({
              swipePosition: 0
            }, () => {
              this.setState({
                animate: false,
                showIndex: null,
                currentIndex: index,
              }, () => {
                this.moving = false;
                this.resetAutoSlide();
              });
            });
          }, this.props.duration);
        });
      }, 1000 / 60 * 2); // wait 2 frame (at 60fps) for animate
    });
  }

  next() {
    this.move(this.getNextIndex(), 1);
  }

  prev() {
    this.move(this.getPrevIndex(), -1);
  }

  initialize() {
    if (!this.container) {
      return;
    }
    this.updateFrameRect();
    const images = this.container.getElementsByTagName('img');
    for (let i = 0; i < images.length; i++) {
      images[i].onload = () => {
        this.updateFrameRect();
      };
    }
  }

  handleTouchStart(e) {
    if (this.state.slideCount <= 1) return;
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
    if (this.state.slideCount <= 1) return;
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
    let showIndex;
    if (this.touch.swipeDirection === 1) showIndex = this.getNextIndex();
    if (this.touch.swipeDirection === -1) showIndex = this.getPrevIndex();

    this.setState({
      swipePosition: diff,
      showIndex
    });
  }

  handleTouchEnd() {
    if (this.state.slideCount <= 1) return;
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
