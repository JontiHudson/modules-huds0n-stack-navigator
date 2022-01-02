import React from 'react';
import { View, ViewStyle } from 'react-native';
import { AnimatedView } from '@huds0n/animations';
import { useEffect } from '@huds0n/utilities';

import { Navigator } from './Navigator';

export namespace Stack {
  export type onFocused = (
    focusFn: () => void | (() => any),
    layout?: useEffect.LayoutTiming,
  ) => void;

  export type useProps<
    R extends Navigator.RoutesParams,
    K extends keyof R,
  > = () => R[K];

  export type NavigatorScreens<R extends Navigator.RoutesParams> = {
    [K in keyof R]: React.ReactNode;
  };

  export type Props<R extends Navigator.RoutesParams> = {
    navigator: Navigator<R>;
    screens: NavigatorScreens<R>;
    screenStyle?: ViewStyle;
  };
}

const BASE_STYLE = {
  position: 'absolute',
  height: '100%',
  width: '100%',
} as const;

export function Stack<R extends Navigator.RoutesParams>({
  navigator,
  screens,
  screenStyle,
}: Stack.Props<R>) {
  const { animating, animation, canGoBack, currentRoute, prevRoute, stack } =
    navigator;

  const backgroundStacks = stack
    .slice(2)
    .filter((route) => route.isMounted && route.id !== prevRoute.id);

  function getScreen(route: Navigator.Route<R>) {
    const Screen = screens[route.screen];

    // @ts-ignore
    const NavigationContext = navigator._Context;

    return (
      <NavigationContext.Provider
        value={{
          ...route,
          setParams: (props: any) => navigator.setProps(props, route),
        }}
      >
        {Screen}
      </NavigationContext.Provider>
    );
  }

  const screenArray = backgroundStacks.map((route) => (
    <AnimatedView
      key={route.id}
      pointerEvents="none"
      style={{
        ...screenStyle,
        ...BASE_STYLE,
        opacity: 0,
        zIndex: -1,
      }}
    >
      {getScreen(route)}
    </AnimatedView>
  ));

  if (prevRoute) {
    if (animation && animating === 'OUT') {
      screenArray.push(
        <AnimatedView
          key={prevRoute.id}
          pointerEvents="none"
          animate={{
            to: animation.out,
            duration: animation.duration,
            easing: animation.easing,
            onAnimationEnd: navigator.setAnimationEnd,
          }}
          style={{ ...screenStyle, ...BASE_STYLE, ...animation.in, zIndex: 2 }}
          useNativeDriver={animation.useNativeDriver}
        >
          {getScreen(prevRoute)}
        </AnimatedView>,
      );
    } else if (animating === 'IN' || prevRoute.isMounted) {
      screenArray.push(
        <AnimatedView
          key={prevRoute.id}
          pointerEvents="none"
          style={{ ...screenStyle, ...BASE_STYLE, zIndex: 0 }}
        >
          {getScreen(prevRoute)}
        </AnimatedView>,
      );
    }
  }

  const animateIn = canGoBack && animating === 'IN';

  screenArray.push(
    <AnimatedView
      key={currentRoute.id}
      pointerEvents={animating === 'IN' ? 'none' : 'auto'}
      animate={
        animation && animateIn
          ? {
              to: animation.in,
              duration: animation.duration,
              easing: animation.easing,
              onAnimationEnd: navigator.setAnimationEnd,
            }
          : undefined
      }
      style={{
        ...screenStyle,
        ...BASE_STYLE,
        ...(animateIn && animation && animation.out),
        zIndex: 1,
      }}
      useNativeDriver
    >
      {getScreen(currentRoute)}
    </AnimatedView>,
  );

  return <View style={{ flex: 1 }}>{screenArray}</View>;
}
