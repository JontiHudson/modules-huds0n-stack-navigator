import { createNotificationManager, NotificationTypes } from '@huds0n/expo';

import { $Toast } from '../components';
import { toastPresets } from '../config';

function responseHandler(
  identifier: string,
  notification: NotificationTypes.Notification,
  userText?: string,
) {
  console.log({ identifier, notification, userText });

  switch (identifier) {
    case 'YES_NO.YES':
      $Toast.$display({
        title: 'Confirmed',
        message: `You replied yes to '${notification.content.title}'`,
        ...toastPresets.success,
      });
      break;

    case 'YES_NO.NO':
      $Toast.$display({
        title: 'Rejected',
        message: `You replied no to '${notification.content.title}'`,
        ...toastPresets.warn,
      });
      break;

    case 'REPLY.INPUT':
      $Toast.$display({
        title: 'Reply',
        message: `You replied '${userText}' to '${notification.content.title}'`,
        ...toastPresets.notify,
      });
      break;

    case 'REPLY.CANCEL':
      $Toast.$display({
        title: 'No Reply',
        message: `You did not reply to '${notification.content.title}'`,
        ...toastPresets.notify,
      });
      break;
  }
}

export const NotificationManager = createNotificationManager({
  responseHandler,
});
NotificationManager.onPushTokenRetrieved((token) =>
  console.log({ retrived: token }),
);
