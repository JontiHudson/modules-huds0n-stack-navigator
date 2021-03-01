import React from 'react';
import { ListRenderItemInfo } from 'react-native';

import { LazyList } from '@huds0n/lazy-list';
import {
  AnimatedList,
  AnimationSheet,
  SharedLazyArray,
  timeout,
} from '@huds0n/expo';

import { $Container, $Text } from '../components';
import { getColor, spacings } from '../theme';

type ElementType = { index: number };

const LazyArray = new SharedLazyArray<ElementType>(async (offset, data) => {
  await timeout(500);

  const NUMBER_PER_PAGE = 20;
  const NUMBER_OF_ELEMENTS = 57;

  const array: ElementType[] = [];

  let i = 0;
  let pageEnd = false;

  while (i < NUMBER_PER_PAGE) {
    const index = offset + i;

    if (index === NUMBER_OF_ELEMENTS) {
      pageEnd = true;
      break;
    }

    array.push({ index });
    i++;
  }

  return { data: array, pageEnd };
});

export default function Flatlist() {
  return (
    <AnimatedList
      ListComponent={LazyList}
      itemLength={ELEMENT_HEIGHT + 2 * spacings.M}
      at={animations.list}
      fade={{ bottom: { color: getColor('BACKGROUND') } }}
      // @ts-ignore
      SharedLazyArray={LazyArray}
      renderItem={renderItem}
      keyExtractor={({ index }: ElementType) => index.toString()}
      reverseZIndex
      useNativeDriver
    />
  );
}

function renderItem({ item: { index } }: ListRenderItemInfo<ElementType>) {
  return (
    <$ItemWrapper>
      <$Text contrast>{`Num: ${index}`}</$Text>
    </$ItemWrapper>
  );
}

const ELEMENT_HEIGHT = 80;

const $ItemWrapper = $Container.addStyle({
  backgroundColor: 'SECONDARY',
  borderRadius: 'M',
  padding: 'M',
  margin: 'M',
  height: ELEMENT_HEIGHT,
});

const animations = AnimationSheet.create({
  list: ({ end }) => [
    {
      input: end + 200,
      style: { opacity: 1, transform: [{ scale: 1 }] },
    },
    {
      input: end,
      style: { opacity: 0, transform: [{ scale: 0 }] },
    },
  ],
});
