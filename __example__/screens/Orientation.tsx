import React from 'react';

import { useOrientation, usePickerInput } from '@huds0n/expo';

import {
  $Button,
  $Container,
  $PickerInput,
  $Separator,
  $Text,
} from '../components';
import { getOrientationLock, setOrientationLock } from '../controllers';

export default function Orientation() {
  const orientation = useOrientation();

  const orientationLockPicker = usePickerInput({
    defaultValue: getOrientationLock(),
  });

  return (
    <$Container padded center>
      <$Text center>
        {`Current orientation is ${
          orientation === 'PORTRAIT' ? 'portrait' : 'landscape'
        }`}
      </$Text>

      <$Separator />

      <$Button onPress={orientationLockPicker.focus}>
        <$OrientationLockPicker
          {...orientationLockPicker}
          onBlur={setOrientationLock}
        />
      </$Button>
    </$Container>
  );
}

const $OrientationLockPicker = $PickerInput.addProps({
  nullable: false,
  pickerItems: [
    { placeholder: 'No Orientation Lock', label: 'None', value: 'DEFAULT' },
    { placeholder: 'Lock: Current', label: 'Current', value: 'CURRENT' },
    { placeholder: 'Lock: Portrait', label: 'Portrait', value: 'PORTRAIT_UP' },
    { placeholder: 'Lock: Landscape', label: 'Landscape', value: 'LANDSCAPE' },
    {
      placeholder: 'Lock: Left',
      label: 'Landscape Left',
      value: 'LANDSCAPE_LEFT',
    },
    {
      placeholder: 'Lock: Right',
      label: 'Landscape Right',
      value: 'LANDSCAPE_RIGHT',
    },
  ],
  placeholderStyle: {
    alignSelf: 'center',
    color: 'BACKGROUND',
    fontSize: 'BODY',
    textAlign: 'center',
  },
});
