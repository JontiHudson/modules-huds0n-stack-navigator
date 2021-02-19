import React from 'react';
import { ListRenderItemInfo } from 'react-native';

import {
  AnimatedFlatList,
  onDismount,
  useEffect,
  NotificationTypes,
} from '@huds0n/expo';

import { NotificationManager, goToScreen } from '../../controllers';
import { $ActionFAB, $Container, $Text } from '../../components';
import { getColor } from '../../theme';

export default function Flatlist() {
  const [{ scheduledNotifications }] = NotificationManager.useState(
    'scheduledNotifications',
  );

  handleFAB();

  return (
    <AnimatedFlatList
      itemStartStyle={{ opacity: 0, transform: [{ translateY: 50 }] }}
      itemAnimate={{
        to: { opacity: 1, transform: [{ translateY: 0 }] },
        duration: 500,
        stagger: 50,
      }}
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

const $ItemWrapper = $Container.addStyle({
  borderWidth: 1,
  borderRadius: 'M',
  padding: 'M',
  margin: 'M',
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
