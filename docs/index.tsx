import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Carousel from '../src';

class App extends React.Component {
  carousel: Carousel;
  state = {
    count: ['abcd']
  };
  constructor() {
    super();
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        count: [
          ...this.state.count,
          'efghi',
          'jklmn',
          'opqrs',
          'tuvwx',
          'yz'
        ]
      });
    }, 1000);
  }

  next() {
    this.carousel && this.carousel.next();
  }

  prev() {
    this.carousel && this.carousel.prev();
  }

  render() {
    return (
      <div>
        <Carousel
          style={{
            width: 320
          }}
        >
          <img src="//placehold.it/320x160?text=1of2" alt="a" />
          <img src="//placehold.it/320x160?text=2of2" alt="a" />
        </Carousel>
        <Carousel
          ref={(instance) => { this.carousel = instance; }}
          autoSlideInterval={3000}
          useDots={true}
        >
          {this.state.count.map((c) => {
            return (
              <div key={c}>
                <img src={`//placehold.it/320x160?text=${c}`} width="100%" />
              </div>
            );
          })}
        </Carousel>
        <button onClick={this.prev}>prev</button>
        <button onClick={this.next}>next</button>
        <div style={{ width: '100%', height: 100, background: '#000' }} />
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);

