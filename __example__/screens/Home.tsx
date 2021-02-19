import React from 'react';

import { $Button, $Container } from '../components';
import { goToScreen } from '../controllers';

export default function Home() {
  return (
    <$Container padded center>
      <$HomeButton
        label="Cache Image Example"
        onPress={() => goToScreen('CACHE_IMAGE')}
      />

      <$HomeButton
        label="FlatList Example"
        onPress={() => goToScreen('FLATLIST')}
      />

      <$HomeButton
        label="Input Examples"
        onPress={() => goToScreen('INPUTS')}
      />

      <$HomeButton label="Text Examples" onPress={() => goToScreen('TEXT')} />

      <$HomeButton
        label="Orientation"
        onPress={() => goToScreen('ORIENTATION')}
      />

      <$HomeButton label="Toast Examples" onPress={() => goToScreen('TOAST')} />

      <$HomeButton
        label="Notifications"
        onPress={() => goToScreen('SCHEDULED_NOTIFICATIONS')}
      />
    </$Container>
  );
}

const $HomeButton = $Button.addProps({
  pressedStyle: { backgroundColor: 'GREY' },
  pressedLabelStyle: { color: 'BLACK' },
  style: { marginBottom: 'L' },
});
