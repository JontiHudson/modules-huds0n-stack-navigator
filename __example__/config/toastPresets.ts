export const toastPresets = {
  alert: {
    backgroundColor: 'WARN',
    layout: 'relative',
    messageStyle: {
      alignItems: 'center',
    },
    titleStyle: {
      alignItems: 'center',
    },
  },
  error: {
    backgroundColor: 'ERROR',
    disableScreenTouch: true,
    highPriority: true,
    icon: {
      name: 'stop',
      set: 'Octicons',
    },
    showDismiss: true,
  },
  notify: {
    autoDismiss: 2500,
    backgroundColor: 'GREY',
    dismissOnScreenPress: true,
  },
  warn: {
    autoDismiss: 5000,
    backgroundColor: 'WARN',
    dismissOnScreenPress: true,
    icon: {
      name: 'warning-outline',
      set: 'Ionicons',
    },
  },
  success: {
    dismissOnScreenPress: true,
    backgroundColor: 'SUCCESS',
    icon: {
      name: 'checkcircleo',
      set: 'AntDesign',
    },
  },
} as const;
