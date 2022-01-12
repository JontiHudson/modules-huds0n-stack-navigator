import React, { useContext } from "react";

import { Huds0nError } from "@huds0n/error";
import { SharedState } from "@huds0n/shared-state";
import { useEffect, UtilityTypes } from "@huds0n/utilities";

import { transitions } from "./transitions";
import type { Types } from "./types";

type NavigatorState<R extends Types.RoutesParams> = {
  animation: Types.Animation;
  stack: Types.Route<R>[];
  prevStack: Types.Route<R>[];
  animating: false | "IN" | "OUT";
};

export class Navigator<R extends Types.RoutesParams> {
  private _defaultAnimation: Types.Animation;
  private _nextId = 0;
  private _internalState: SharedState<NavigatorState<R>>;
  private _defaultRoutesParams: Partial<R>;
  private _Context: React.Context<Types.Route<R, keyof R>>;

  static transitions = transitions;

  constructor(
    props:
      | Types.NavigatorProps<R>
      | ((Nav: Navigator<R>) => Types.NavigatorProps<R>)
  ) {
    const {
      defaultAnimation = Navigator.transitions.slideAcross,
      initialRoute,
      defaultRoutesParams = {},
    } = typeof props === "function" ? props(this) : props;

    this._defaultAnimation = defaultAnimation;
    this._internalState = new SharedState<NavigatorState<R>>({
      animation: defaultAnimation,
      stack: [],
      prevStack: [],
      animating: false,
    });
    this._defaultRoutesParams = defaultRoutesParams;
    // @ts-ignore  - Context initialised for each screen
    this._Context = React.createContext({});

    this.navigate(initialRoute, false);

    this.dispatch = this.dispatch.bind(this);
    this.getRoute = this.getRoute.bind(this);
    this.goBack = this.goBack.bind(this);
    this.navigate = this.navigate.bind(this);
    this.setAnimationEnd = this.setAnimationEnd.bind(this);
    this.setParams = this.setParams.bind(this);
    this.initializeParams = this.initializeParams.bind(this);
    this.use = this.use.bind(this);
    this.useOnFocus = this.useOnFocus.bind(this);
  }

  get animation() {
    return this._internalState.state.animation;
  }

  get animating() {
    return this._internalState.state.animating;
  }

  get routesParams() {
    return this._defaultRoutesParams;
  }

  get stack() {
    return this._internalState.state.stack;
  }

  get prevStack() {
    return this._internalState.state.prevStack;
  }

  get currentRoute() {
    return this.stack[0];
  }

  get prevRoute() {
    return this.prevStack[0];
  }

  get canGoBack() {
    return this.stack.length > 1;
  }

  get Context() {
    return this._Context;
  }

  getRoute<S extends keyof R>({
    id,
    screen,
  }: Types.Key<R, S>): Types.Route<R, S> {
    const route = this.stack.find(
      (r) => r.screen === screen && (id === undefined || r.id === id)
    );

    if (!route) {
      throw new Huds0nError({
        name: "NavigatorError",
        code: "GET_ROUTE_ERROR",
        severity: "HIGH",
        message: "Route not found",
        info: { id, screen },
      });
    }

    return route as Types.Route<R, S>;
  }

  navigate<S extends keyof R>(
    newRoute: Types.NavigateRoute<R, S>,
    animation?: Types.Animation
  ) {
    return this.dispatch({ routes: [newRoute], animation })[0];
  }

  dispatch({
    routes: newRoutes,
    startingRoute,
    animation = this._defaultAnimation,
  }: {
    routes?: Types.NavigateRoute<R, keyof R>[];
    startingRoute?: Types.Key<R> | null;
    animation?: Types.Animation;
  }) {
    let newStack = [...this.stack];

    if (startingRoute === null) {
      newStack = [];
    } else if (startingRoute) {
      const index = this.stack.findIndex(
        (route) => route === this.getRoute(startingRoute)
      );

      if (index === -1) {
        throw new Huds0nError({
          name: "NavigatorError",
          code: "DISPATCH_ERROR",
          severity: "HIGH",
          message: "Route not found",
          info: { startingRoute },
        });
      }

      newStack = newStack.slice(index);
    }

    if (newRoutes && newRoutes.length) {
      const startId = this._nextId;

      const newRoutesWithIds = newRoutes.map((navRoute, index) => {
        const { screen, keepMounted = false, params } = navRoute;

        const defaultParams = this._defaultRoutesParams[screen];

        const route = {
          screen,
          keepMounted,
          id: startId + index,
          isBackground: !keepMounted,
          isFocused: false,
          isMounted: keepMounted,
          isVisible: false,
          params:
            defaultParams || params
              ? {
                  ...(defaultParams && defaultParams),
                  ...(params && params),
                }
              : null,
        } as Types.Route<R>;

        return route;
      });

      newStack = [...newRoutesWithIds.reverse(), ...newStack];

      this._nextId += newRoutes.length;
    }

    const newTopRoute = newStack[0];
    const prevTopRoute = this.stack[0];

    if (newTopRoute === prevTopRoute) {
      // No stack change
      return this.stack;
    }

    if (prevTopRoute) {
      prevTopRoute.isFocused = false;
    }
    Object.assign(newTopRoute, {
      isBackground: false,
      isFocused: true,
      isMounted: true,
      isVisible: true,
    });

    const oldRouteInPosition = this.stack[this.stack.length - newStack.length];

    const direction = oldRouteInPosition === newTopRoute ? "OUT" : "IN";

    this._internalState.setState({
      animation,
      stack: newStack,
      prevStack: this.stack,
      animating: direction,
    });

    if (animation === false) {
      this.setAnimationEnd();
    }

    return newStack;
  }

  switch<S extends keyof R>(
    newRoute: Types.NavigateRoute<R, S>,
    animation = Navigator.transitions.fade
  ) {
    return this.dispatch({
      routes: [newRoute],
      startingRoute: null,
      animation,
    });
  }

  goBack<S extends keyof R>(
    backRoute?: Types.BackRoute<R, S>,
    animation?: Types.Animation
  ): Types.Route<R, keyof R> {
    const { params, ...specifier } = backRoute || this.stack[1];

    // @ts-ignore
    params && this.setParams(params, specifier);

    return this.dispatch({ startingRoute: specifier, animation })[0];
  }

  setAnimationEnd() {
    if (this.prevRoute) {
      const { keepMounted } = this.prevRoute;

      Object.assign(this.prevRoute, {
        isBackground: keepMounted,
        isMounted: keepMounted,
        isVisible: false,
      });
    }
    this._internalState.setProp("animating", false);
  }

  use() {
    this._internalState.useState()[0];

    return this;
  }

  useRoute<S extends keyof R>(): Types.Route<R, S> {
    try {
      // @ts-ignore
      return useContext(this._Context);
    } catch {
      throw new Huds0nError({
        name: "NavigatorError",
        code: "USE_ROUTE_ERROR",
        severity: "HIGH",
        message: "Use route can only be used within a Stack Component tree.",
      });
    }
  }

  setParams<S extends keyof R>(params: R[S], specifier?: Types.Key<R, S>) {
    let route: Types.Route<R, S>;

    if (specifier) {
      route = this.getRoute<S>(specifier);

      if (!route) {
        throw new Huds0nError({
          name: "NavigatorError",
          code: "SET_PROPS_ERROR",
          severity: "HIGH",
          message: "Route not found",
          info: { params, specifier },
        });
      }
    } else {
      route = this.useRoute<S>();
    }

    route.params = { ...route.params, ...params };
    this._internalState.refresh();
  }

  initializeParams<S extends keyof R>(params: R[S]) {
    this.useOnFocus(() => {
      const route = this.currentRoute;
      route.params = { ...route.params, ...params };
      this._internalState.refresh();
    });
  }

  useOnFocus(focusFn: () => any, layout?: UtilityTypes.LayoutTiming) {
    const { isFocused } = this.useRoute();
    useEffect(
      () => {
        if (isFocused) focusFn();
      },
      [isFocused],
      { layout }
    );
  }

  useOnUnfocus(unfocusFn: () => any, layout?: UtilityTypes.LayoutTiming) {
    const { isFocused } = this.useRoute();
    useEffect(
      () => () => {
        if (!isFocused) unfocusFn();
      },
      [isFocused],
      { layout }
    );
  }
}
