import React from 'react';

import { onMount, onDismount } from '@huds0n/expo';

import { $ActionFAB, $CacheImage } from '../components';

export default function CacheImageScreen() {
  handleFAB();

  return <$DisplayImage />;
}

const $DisplayImage = $CacheImage.addProps({
  source: {
    uri: 'https://my.alfred.edu/zoom/_images/foster-lake-thumbnail.jpg',
  },
  style: { flex: 1 },
});

function handleFAB() {
  onMount(() => {
    $ActionFAB.setActions([
      {
        title: 'Clear Cache',
        icon: {
          name: 'image-not-supported',
          set: 'MaterialIcons',
        },
        onPress: $CacheImage.clear,
      },
    ]);
  });

  onDismount($ActionFAB.hide);
}
