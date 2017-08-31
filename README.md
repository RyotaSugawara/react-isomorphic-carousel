# react-isomorphic-carousel
Isomorphic React Carousel Component.

* Isomorphic
* Responsive
* Touch and Swipe (is not draggable yet)

WIP: It is still under development.

## Install
```sh
npm i @ryo_suga/react-isomorphic-carousel
```

## Usage

```tsx
import * as React from 'react';
import * as Carouse from '@ryo_suga/react-isomorphic-carousel';

React.render(
  <Carousel>
    <img src="//placehold.it/320x160?text=a" />
    <img src="//placehold.it/320x160?text=b" />
    <img src="//placehold.it/320x160?text=c" />
  </Carousel>,
  document.getElementById('app')
);
```

### Carousel

#### Props

| name              | type                | description                                                                       |
|-------------------|---------------------|-----------------------------------------------------------------------------------|
| useDots           | boolean             | use dots or not. (default false)                                                  |
| dotStyle          | React.CSSProperties | custom css properties for dot button. (default {})                                |
| duration          | number              | miliseconds for animation speed. (default 500)                                    |
| autoSlideInterval | number              | miliseconds for auto slide. if 0 or less than 0, auto slide disabled. (default 0) |

#### Next/Prev Button

if you want to call next or prev to move slide position from script, use ref to get Carousel instance.

```tsx
class App extends React.Component {
  carousel: Carousel
  render() {
    <div>
      <Carousel
        ref={(instance) => { this.carousel = instance; }}
      >
        {/* some element */}
      </Carousel>
      <button
        onClick={() => {
          // call prev
          this.carousel && this.carousel.prev();
        }}
      >
        prev
      </button>
      <button
        onClick={() => {
          // call next
          this.carousel && this.carousel.next();
        }}
      >
        next
      </button>
    </div>
  }
}
```

## Develop
```sh
npm start
```

## Test
```sh
npm test
```

