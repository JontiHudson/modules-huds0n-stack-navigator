import React from "react";
import { View } from "react-native";
import { AnimatedView } from "@huds0n/animations";

import type { Types } from "./types";

const BASE_STYLE = {
  position: "absolute",
  height: "100%",
  width: "100%",
} as const;

export function Stack<R extends Types.RoutesParams>({
  navigator,
  screens,
  screenStyle,
}: Types.StackProps<R>) {
  const { animating, animation, currentRoute, prevRoute, stack } =
    navigator.use();

  const backgroundStacks = stack
    .slice(2)
    .filter((route) => route.isMounted && route.id !== prevRoute.id);

  function getScreen(route: Types.Route<R>) {
    const Screen = screens[route.screen];

    // @ts-ignore
    const NavigationContext = navigator._Context;

    return (
      <NavigationContext.Provider value={route}>
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
    if (animation && animating === "OUT") {
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
        </AnimatedView>
      );
    } else if (animating === "IN" || prevRoute.isMounted) {
      screenArray.push(
        <AnimatedView
          key={prevRoute.id}
          pointerEvents="none"
          style={{ ...screenStyle, ...BASE_STYLE, zIndex: 0 }}
        >
          {getScreen(prevRoute)}
        </AnimatedView>
      );
    }
  }

  const animateIn = animating === "IN";

  screenArray.push(
    <AnimatedView
      key={currentRoute.id}
      pointerEvents={animateIn ? "none" : "auto"}
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
    </AnimatedView>
  );

  return <View style={{ flex: 1, overflow: "hidden" }}>{screenArray}</View>;
}
