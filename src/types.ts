import { EasingFunction, ViewStyle } from "react-native";
import { UtilityTypes } from "@huds0n/utilities";

import type { Navigator } from "./Navigator";

export declare namespace Types {
  export type Animation =
    | {
        duration: number;
        easing?: EasingFunction;
        in: ViewStyle;
        out: ViewStyle;
        useNativeDriver?: boolean;
      }
    | false;

  type RouteParams = Record<string, any> | null;
  export type RoutesParams = Record<string, RouteParams>;

  export type Route<R extends RoutesParams, S extends keyof R = keyof R> = {
    id: number;
    isBackground: boolean;
    isFocused: boolean;
    isMounted: boolean;
    isVisible: boolean;
    keepMounted: boolean;
    params: R[S];
    screen: S;
  };

  export type Key<R extends RoutesParams, S extends keyof R = keyof R> = {
    id?: number;
    screen: S;
  };

  export type NavigateRoute<
    R extends RoutesParams,
    S extends keyof R = keyof R
  > = R[S] extends null
    ? { keepMounted?: boolean; screen: S; params?: R[S] }
    : { keepMounted?: boolean; screen: S; params: R[S] };

  export type BackRoute<R extends RoutesParams, S extends keyof R> = {
    id?: number;
    screen: S;
    params?: Partial<R[S]>;
  };

  export type NavigatorProps<R extends RoutesParams> = {
    defaultAnimation?: Animation;
    initialRoute: NavigateRoute<R>;
    defaultRoutesParams?: Partial<R>;
  };

  export type setParams<R extends RoutesParams, K extends keyof R> = (
    props: R[K]
  ) => void;

  export type UseOnFocus = (
    focusFn: () => void | (() => any),
    layout?: UtilityTypes.LayoutTiming
  ) => void;

  export type initializeParams<R extends RoutesParams, K extends keyof R> = (
    props: R[K]
  ) => void;

  export type useProps<R extends RoutesParams, K extends keyof R> = () => R[K];

  export type StackScreens<R extends RoutesParams> = {
    [K in keyof R]: React.ReactNode;
  };

  export type StackProps<R extends RoutesParams> = {
    navigator: Navigator<R>;
    screens: StackScreens<R>;
    screenStyle?: ViewStyle;
  };
}
