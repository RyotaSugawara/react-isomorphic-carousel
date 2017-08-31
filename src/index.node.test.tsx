import test from 'ava';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import Carousel from './index';

test('should render first child at server side rendering.', (t) => {
  const html = renderToString(
    <Carousel
      duration={100}
      autoSlideInterval={30}
    >
      <img src="//placehold.it/320x160" alt="" />
      <img src="//placehold.it/320x160" alt="" />
      <img src="//placehold.it/320x160" alt="" />
    </Carousel>
  );
  t.is(html.match(/img/gi).length, 1);
});
