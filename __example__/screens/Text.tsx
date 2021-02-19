import React from 'react';

import { onMount, onDismount } from '@huds0n/expo';

import { $Container, $Separator, $Text, $Toast } from '../components';
import { useOrientationLock } from '../controllers';

export default function TextScreen() {
  useOrientationLock('PORTRAIT_UP');

  onMount(() => {
    $Toast.$display({
      _id: 'ORIENTATION_LOCK',
      backgroundColor: 'WARN',
      message: 'This page is locked to portait',
      messageStyle: { alignSelf: 'center' },
      layout: 'relative',
    });
  });

  onDismount(() => {
    $Toast.hide('ORIENTATION_LOCK');
  });

  return (
    <$Container form>
      <$Text header center>
        Header
      </$Text>

      <$Separator />

      <$Text subheader>Subheader</$Text>

      <$Separator />

      <$Text>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
        eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
        voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
        clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
        amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
        nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
        sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
        rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
        ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing
        elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna
        aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo
        dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus
        est Lorem ipsum dolor sit amet.
      </$Text>

      <$Separator />

      <$Text label>Label</$Text>

      <$Separator />

      <$Text note underline>
        Note
      </$Text>
    </$Container>
  );
}
