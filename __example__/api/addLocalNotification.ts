import { NotificationManager } from '../controllers';
import { toastPresets } from '../config';
import { $Toast } from '../components';
import { Themer } from '../theme';

export async function addNotification(
  title: string,
  body: string,
  date: Date,
  time: Date,
  type: string,
  response: string,
) {
  const messageProps = Themer.getProps($Toast.theming.message, {
    // @ts-ignore
    ...toastPresets[type],
    autoDismiss: false,
    showDismiss: !response,
  });

  const hours = time.getHours();
  const minutes = time.getMinutes();

  const formattedDate = new Date(date);
  formattedDate.setHours(hours);
  formattedDate.setMinutes(minutes);

  await NotificationManager.scheduleNotification({
    content: {
      title,
      body,
      data: {
        messageProps,
      },
      categoryIdentifier: response || undefined,
    },
    trigger: formattedDate > new Date() ? { date: formattedDate } : null,
  });
}
