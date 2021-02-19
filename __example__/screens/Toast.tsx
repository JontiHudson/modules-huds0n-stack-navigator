import React from 'react';

import { $Button, $Container, $Toast } from '../components';
import { toastPresets } from '../config';
import { spacings } from '../theme';

export default function Home() {
  const isCustomToastShowing = $Toast.useIsMessageShowing('CUSTOM_TOAST');

  return (
    <$Container form>
      <$SuccessToastButton
        onPress={() =>
          $Toast.$display({
            title: 'Success',
            message: 'Success message',
            ...toastPresets.success,
          })
        }
      />

      <$WarnToastButton
        onPress={() =>
          $Toast.$display({
            title: 'Warn',
            message: 'Warn message',
            ...toastPresets.warn,
          })
        }
      />

      <$ErrorToastButton
        onPress={() =>
          $Toast.$display({
            title: 'Error',
            message: 'Error message',
            ...toastPresets.error,
          })
        }
      />

      <$NotifyToastButton
        onPress={() =>
          $Toast.$display({
            title: 'Notify',
            message: 'Notify message',
            ...toastPresets.notify,
          })
        }
      />

      <$CustomToastButton
        onPress={() =>
          $Toast.$display({
            _id: 'CUSTOM_TOAST',
            autoDismiss: false,
            backgroundColor: 'BACKGROUND',
            containerStyle: { borderBottomWidth: spacings.HAIRLINE },
            contentsColor: 'TEXT',
            disableScreenTouch: true,
            layout: 'relative',
            icon: {
              name: 'questioncircleo',
              set: 'AntDesign',
              color: 'TEXT',
            },
            message: 'Custom Message',
            actions: [
              { label: 'Cancel' },
              {
                label: 'Reply',
                onTextSubmit: (reply: string) => console.log({ reply }),
              },
            ],
            actionProps: {
              textInputProps: {
                multiline: true,
              },
            },
            title: 'Custom',
          })
        }
      />
    </$Container>
  );
}

const $ToastButton = $Button.addStyle({
  marginBottom: 'L',
});

const $SuccessToastButton = $ToastButton.addProps({
  color: 'SUCCESS',
  label: 'Success',
});
const $WarnToastButton = $ToastButton.addProps({
  color: 'WARN',
  label: 'Warn',
});
const $ErrorToastButton = $ToastButton.addProps({
  color: 'ERROR',
  label: 'Error',
});
const $NotifyToastButton = $ToastButton.addProps({
  color: 'GREY',
  label: 'Notify',
});
const $CustomToastButton = $ToastButton.addProps({
  border: 1,
  color: 'WHITE',
  label: 'Custom',
  labelStyle: { color: 'BLACK' },
});
