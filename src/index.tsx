import * as React from 'react';

interface Props { }

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

  constructor() {
    super();
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.onResize = this.onResize.bind(this);
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
        <button onClick={this.prev}>prev</button>
        <button onClick={this.next}>next</button>
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
  addEvents() {
    window.addEventListener('resize', this.onResize);
  }

  removeEvents() {
    window.removeEventListener('resize', this.onResize);
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
    let transform;
    if (canDisplay) {
      if (this.state.showNextSlide && this.getNextIndex() === index) {
        transform = `translate3d(${this.state.swipePosition + this.state.slideWidth}px, 0px, 1px)`;
      } else if (this.state.showPrevSlide && this.getPrevIndex() === index) {
        transform = `translate3d(${this.state.swipePosition - this.state.slideWidth}px, 0px, 1px)`;
      } else if (this.state.currentIndex === index) {
        transform = `translate3d(${this.state.swipePosition}px, 0px, 1px)`;
      }
    }
    return {
      position: this.state.canUseDOM ? 'absolute' : 'relative',
      display: canDisplay ? 'block' : 'none',
      width: '100%',
      top: 0,
      left: 0,
      transition: this.state.animate ? 'transform 0.5s ease' : null,
      WebkitTransition: this.state.animate ? 'transform 0.5s ease' : null,
      transform,
      WebkitTransform: transform
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
      })
    });
  }

  next() {
    if (this.state.animate) {
      return;
    }
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
            })
          }, 500);
        });
      });
    });
  }

  prev() {
    if (this.state.animate) {
      return;
    }
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
            })
          }, 500);
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
}
