import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Carousel } from '../src';

class App extends React.Component {
  state = {
    count: ['a']
  };
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        count: ['a', 'b', 'c']
      });
    }, 1000);
  }
  render() {
    return (
      <div>
        <Carousel>
          {this.state.count.map((c) => {
            return (
              <div key={c}>
                <img src={`//placehold.it/320x160?text=${c}`} width="100%" />
              </div>
            );
          })}
        </Carousel>
        <div style={{width: '100%', height: 100, background: '#000'}} />
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);

