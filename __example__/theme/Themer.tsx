import { createThemer } from '@huds0n/expo';

import { LIGHT_THEME, DARK_COLOR_SCHEME } from './constants';

export const Themer = createThemer(LIGHT_THEME);

Themer.addDarkMode(DARK_COLOR_SCHEME);

export const {
  changeColorScheme,
  dimensions,
  fontSizes,
  getColor,
  getTextStyle,
  getViewStyle,
  spacings,
  useColorScheme,
} = Themer;
