import React from 'react';
import { ListRenderItemInfo } from 'react-native';

import { AnimatedLazyList, SharedLazyArray, timeout } from '@huds0n/expo';

import { $Container, $Text } from '../components';
import { getColor } from '../theme';

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
    <AnimatedLazyList
      itemStartStyle={{ opacity: 0, transform: [{ scale: 0 }] }}
      itemAnimate={{
        to: { opacity: 1, transform: [{ scale: 1 }] },
        duration: 500,
        stagger: 50,
      }}
      fade={{ bottom: { color: getColor('BACKGROUND') } }}
      refreshItemAnimate={{
        to: { opacity: 1, transform: [{ scale: 1 }] },
        duration: 500,
        stagger: 50,
      }}
      SharedLazyArray={LazyArray}
      renderItem={renderItem}
      keyExtractor={({ index }: ElementType) => index.toString()}
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

const $ItemWrapper = $Container.addStyle({
  backgroundColor: 'SECONDARY',
  borderRadius: 'M',
  padding: 'M',
  margin: 'M',
});
