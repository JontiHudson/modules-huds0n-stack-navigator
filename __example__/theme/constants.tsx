const BLACK = '#000000';
const BROWN = '#995422';
const GREEN = '#229954';
const WHITE = '#FFFFFF';

export const LIGHT_THEME = {
  colors: {
    BACKGROUND: WHITE,
    BORDER: BLACK,
    PRIMARY: GREEN,
    SECONDARY: BROWN,
    TEXT: BLACK,
  },
  spacings: {
    BUTTON_PADDING: 10,
  },
};

export const DARK_COLOR_SCHEME = {
  BACKGROUND: BLACK,
  BORDER: WHITE,
  PRIMARY: BROWN,
  SECONDARY: GREEN,
  TEXT: WHITE,
} as const;
