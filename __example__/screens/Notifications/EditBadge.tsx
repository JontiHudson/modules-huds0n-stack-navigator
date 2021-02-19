import React from 'react';

import { useTextInput, validators } from '@huds0n/expo';

import { NotificationManager } from '../../controllers';
import { $Button, $Container, $TextInput } from '../../components';

export default function EditBadge() {
  const badgeInput = useTextInput({
    defaultValue: NotificationManager.getBadge().toString(),
    onValueChange: (value, error) => {
      NotificationManager.setBadge(error ? 0 : Number(value));
    },
  });

  return (
    <$Container form>
      <$Button onPress={badgeInput.focus}>
        <$BadgeInput {...badgeInput} />
      </$Button>
    </$Container>
  );
}

const $BadgeInput = $TextInput.addProps({
  title: 'Badge',
  keyboardType: 'numeric',
  validation: validators.number({ maxDecimals: 0, greaterThanOrEqual: 0 }),
  style: { textAlign: 'center', color: 'BACKGROUND' },
});
