import { SharedState } from '@huds0n/expo';

const Screens = {
  ADD_NOTIFICATION: {
    screenName: 'ADD_NOTIFICATION',
    title: 'Add Notification',
  },
  CACHE_IMAGE: {
    screenName: 'CACHE_IMAGE',
    title: 'Cache Image',
    scrollView: false,
  },
  EDIT_BADGE: {
    screenName: 'EDIT_BADGE',
    title: 'Edit Badge',
  },
  FLATLIST: {
    screenName: 'FLATLIST',
    title: 'Flatlist',
    scrollView: false,
  },
  HOME: {
    canGoBack: false,
    screenName: 'HOME',
    title: 'Home',
  },
  INPUTS: {
    screenName: 'INPUTS',
    title: 'Inputs',
  },
  ORIENTATION: {
    screenName: 'ORIENTATION',
    title: 'Orientation',
  },
  SCHEDULED_NOTIFICATIONS: {
    screenName: 'SCHEDULED_NOTIFICATIONS',
    title: 'Schedule Notifications',
    scrollView: false,
  },
  TEXT: {
    screenName: 'TEXT',
    title: 'Text',
  },
  TOAST: {
    screenName: 'TOAST',
    title: 'Toast',
  },
} as const;

const SCREEN_DEFAULTS = {
  canGoBack: true,
  scrollView: true,
};

const INITIAL_SCREEN = {
  ...SCREEN_DEFAULTS,
  ...Screens.HOME,
};

export type ScreenName = keyof typeof Screens;

export type Screen = {
  canGoBack: boolean;
  screenName: ScreenName;
  scrollView: boolean;
  title: string;
};

export const NavigationState = new SharedState<Screen>(INITIAL_SCREEN);

const screenStack: Screen[] = [INITIAL_SCREEN];

export function goToScreen(screenName: ScreenName) {
  const newScreen = { ...SCREEN_DEFAULTS, ...Screens[screenName] };

  screenStack.unshift(newScreen);

  NavigationState.setState(newScreen);
}

export function goBack() {
  screenStack.shift();

  NavigationState.setState(screenStack[0]);
}
