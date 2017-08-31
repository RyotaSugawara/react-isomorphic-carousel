import test from 'ava';
import * as React from 'react';
import * as ReactTestRenderer from 'react-test-renderer';
import Carousel from './index';

test('should render', (t) => {
  const instance: any = ReactTestRenderer.create(
    <Carousel
      duration={100}
      autoSlideInterval={30}
    >
      <img src="//placehold.it/320x160" alt="" />
      <img src="//placehold.it/320x160" alt="" />
      <img src="//placehold.it/320x160" alt="" />
    </Carousel>
  ).toJSON();
  t.is(instance.children[0]['type'], 'ul');
  t.is(instance.children[0].children[0].children[0].type, 'img');
});
