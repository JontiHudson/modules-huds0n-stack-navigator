import React from 'react';

import { InputManager } from '@huds0n/expo';

import {
  $ActionFAB,
  $InfoFAB,
  $ScreenManager,
  $ScreenHandler,
  $Toast,
} from '../components';
import { NavigationState } from '../controllers';
import { useColorScheme } from '../theme';

import AddNotification from './Notifications/AddNotification';
import CacheImage from './CacheImage';
import EditBadge from './Notifications/EditBadge';
import FlatList from './FlatList';
import Home from './Home';
import Inputs from './Inputs';
import Orientation from './Orientation';
import ScheduledNotifications from './Notifications';
import Text from './Text';
import ToastScreen from './Toast';

export default function Root() {
  useColorScheme();
  const [screenName] = NavigationState.useProp('screenName');

  const ScreenSwitch = {
    ADD_NOTIFICATION: <AddNotification />,
    CACHE_IMAGE: <CacheImage />,
    EDIT_BADGE: <EditBadge />,
    FLATLIST: <FlatList />,
    HOME: <Home />,
    INPUTS: <Inputs />,
    ORIENTATION: <Orientation />,
    SCHEDULED_NOTIFICATIONS: <ScheduledNotifications />,
    TEXT: <Text />,
    TOAST: <ToastScreen />,
  };

  const CurrentScreen = ScreenSwitch[screenName];

  return (
    <$ScreenManager>
      <$Toast>
        <InputManager>
          <$InfoFAB>
            <$ActionFAB>
              <$ScreenHandler>{CurrentScreen}</$ScreenHandler>
            </$ActionFAB>
          </$InfoFAB>
        </InputManager>
      </$Toast>
    </$ScreenManager>
  );
}
