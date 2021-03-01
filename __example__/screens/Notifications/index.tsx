import React from 'react';
import { ListRenderItemInfo } from 'react-native';

import {
  AnimatedList,
  AnimationSheet,
  onDismount,
  useEffect,
  NotificationTypes,
} from '@huds0n/expo';

import { NotificationManager, goToScreen } from '../../controllers';
import { $ActionFAB, $Container, $Text } from '../../components';
import { getColor, spacings } from '../../theme';

export default function Flatlist() {
  const [{ scheduledNotifications }] = NotificationManager.useState(
    'scheduledNotifications',
  );

  handleFAB();

  return (
    <AnimatedList
      animationDuration={4000}
      itemLength={ELEMENT_HEIGHT + 2 * spacings.M}
      at={animations.list}
      fade={{ bottom: { color: getColor('BACKGROUND') } }}
      renderItem={renderItem}
      data={scheduledNotifications}
      keyName="identifier"
      useNativeDriver
    />
  );
}

function renderItem({
  item,
}: ListRenderItemInfo<NotificationTypes.Notification>) {
  const {
    content: {
      title,
      body,
      data: { triggerJSON },
    },
  } = item;

  const date = new Date(JSON.parse(triggerJSON).date);

  return (
    <$ItemWrapper>
      <$Text header center>
        {title}
      </$Text>
      {!!body && <$Text style={{ textAlign: 'center' }}>{body}</$Text>}
      <$Text note center>
        {date.toLocaleDateString() + ' ' + date.toLocaleTimeString()}
      </$Text>
    </$ItemWrapper>
  );
}

const ELEMENT_HEIGHT = 80;

const $ItemWrapper = $Container.addStyle({
  borderWidth: 1,
  borderRadius: 'M',
  padding: 'M',
  margin: 'M',
  height: ELEMENT_HEIGHT,
});

function handleFAB() {
  const badge = NotificationManager.useBadge();

  useEffect(() => {
    $ActionFAB.setActions([
      {
        title: 'Add Notification',
        icon: {
          name: 'notification',
          set: 'AntDesign',
        },
        onPress: () => goToScreen('ADD_NOTIFICATION'),
      },
      {
        title: 'Badge',
        icon: {
          badge,
          name: badge ? 'notifications-active' : 'notifications',
          set: 'MaterialIcons',
        },
        onPress: () => goToScreen('EDIT_BADGE'),
      },
    ]);
  }, [badge]);

  onDismount($ActionFAB.hide);
}

const animations = AnimationSheet.create({
  list: ({ end }) => [
    {
      input: end + ELEMENT_HEIGHT,
      style: { opacity: 1, transform: [{ translateY: 0 }] },
    },
    {
      input: end,
      style: { opacity: 0, transform: [{ translateY: 50 }] },
    },
  ],
});
