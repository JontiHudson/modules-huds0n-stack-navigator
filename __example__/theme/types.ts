import { ThemerTypes } from '@huds0n/expo';

import { LIGHT_THEME } from './constants';

export type CustomTheme = typeof LIGHT_THEME;
export type Color = ThemerTypes.Color<CustomTheme>;
export type Dimension = ThemerTypes.Dimension<CustomTheme>;
export type FontSize = ThemerTypes.FontSize<CustomTheme>;
export type Spacing = ThemerTypes.Spacing<CustomTheme>;
export type TextStyle = ThemerTypes.TextStyle<CustomTheme>;
export type ViewStyle = ThemerTypes.ViewStyle<CustomTheme>;
