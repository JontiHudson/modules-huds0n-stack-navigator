import React, { useContext } from 'react';
import { Dimensions, Easing, EasingFunction, ViewStyle } from 'react-native';
import { Huds0nError } from '@huds0n/error';
import { SharedState } from '@huds0n/shared-state';

export namespace Navigator {
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
    S extends keyof R = keyof R,
  > = { keepMounted?: boolean; screen: S; params?: Partial<R[S]> };

  export type BackRoute<R extends RoutesParams, S extends keyof R> = {
    id?: number;
    screen: S;
    params?: Partial<R[S]>;
  };

  export type Props<R extends RoutesParams> = {
    defaultAnimation?: Animation;
    initialRoute: NavigateRoute<R>;
    routesParams: R;
  };

  export type setParams<R extends RoutesParams, K extends keyof R> = (
    props: R[K],
  ) => void;

  export type Context<R extends RoutesParams, K extends keyof R> = Route<
    R,
    K
  > & {
    setParams: setParams<R, K>;
  };
}

type NavigatorState<R extends Navigator.RoutesParams> = {
  animation: Navigator.Animation;
  stack: Navigator.Route<R>[];
  prevStack: Navigator.Route<R>[];
  animating: false | 'IN' | 'OUT';
};

const DEFAULT_ANIMATION: Navigator.Animation = {
  in: { transform: [{ translateX: 0 }] },
  out: {
    transform: [
      {
        get translateX() {
          return Dimensions.get('screen').width;
        },
      },
    ],
  },
  useNativeDriver: true,
  duration: 350,
  easing: Easing.inOut(Easing.ease),
};

export class Navigator<R extends Navigator.RoutesParams> {
  private _defaultAnimation: Navigator.Animation;
  private _nextId = 0;
  private _internalState: SharedState<NavigatorState<R>>;
  private _routesParams: R;
  private _routeHx: Navigator.Route<R>[];
  private _Context: React.Context<Navigator.Context<R, keyof R>>;

  constructor({
    defaultAnimation = DEFAULT_ANIMATION,
    initialRoute,
    routesParams,
  }: Navigator.Props<R>) {
    this._defaultAnimation = defaultAnimation;
    this._internalState = new SharedState<NavigatorState<R>>({
      animation: defaultAnimation,
      stack: [],
      prevStack: [],
      animating: false,
    });
    this._routesParams = routesParams;
    this._routeHx = [];
    // @ts-ignore  - Context initialised for each screen
    this._Context = React.createContext({});

    this.navigate(initialRoute, false);

    this.dispatch = this.dispatch.bind(this);
    this.getRoute = this.getRoute.bind(this);
    this.goBack = this.goBack.bind(this);
    this.navigate = this.navigate.bind(this);
    this.setAnimationEnd = this.setAnimationEnd.bind(this);
    this.setProps = this.setProps.bind(this);
    this.use = this.use.bind(this);
  }

  get animation() {
    return this._internalState.state.animation;
  }

  get animating() {
    return this._internalState.state.animating;
  }

  get routesParams() {
    return this._routesParams;
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
  }: Navigator.Key<R, S>): Navigator.Route<R> {
    const route =
      this.stack.find(
        (r) => r.screen === screen && (id === undefined || r.id === id),
      ) ||
      this._routeHx.find(
        (r) => r.screen === screen && (id === undefined || r.id === id),
      );

    if (!route) {
      throw new Huds0nError({
        name: 'NavigatorError',
        code: 'GET_ROUTE_ERROR',
        severity: 'HIGH',
        message: 'Route not found',
        info: { id, screen },
      });
    }

    return route;
  }

  navigate<S extends keyof R>(
    newRoute: Navigator.NavigateRoute<R, S>,
    animation?: Navigator.Animation,
  ) {
    return this.dispatch([newRoute], undefined, animation)[0];
  }

  dispatch(
    newRoutes?: Navigator.NavigateRoute<R, keyof R>[],
    startingRoute?: Navigator.Key<R> | null,
    animation: Navigator.Animation = this._defaultAnimation,
  ) {
    let newStack = [...this.stack];

    if (startingRoute !== undefined) {
      const index =
        startingRoute === null
          ? 0
          : this.stack.findIndex(
              (route) => route === this.getRoute(startingRoute),
            ) ?? -1;

      if (index === -1) {
        throw new Huds0nError({
          name: 'NavigatorError',
          code: 'DISPATCH_ERROR',
          severity: 'HIGH',
          message: 'Route not found',
          info: { startingRoute },
        });
      }

      newStack = newStack.slice(index);
    }

    if (newRoutes && newRoutes.length) {
      const startId = this._nextId;

      const newRoutesWithIds = newRoutes.map((navRoute, index) => {
        const { screen, keepMounted = false, params } = navRoute;

        const defaultParams = this._routesParams[screen];

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
                  ...defaultParams,
                  ...params,
                }
              : null,
        } as Navigator.Route<R>;

        this._routeHx.push(route);
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

    const direction = oldRouteInPosition === newTopRoute ? 'OUT' : 'IN';

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

  setProps<S extends keyof R>(params: R[S], specifier?: Navigator.Key<R, S>) {
    const route = specifier ? this.getRoute(specifier) : this.stack[0];

    if (!route) {
      throw new Huds0nError({
        name: 'NavigatorError',
        code: 'SET_PROPS_ERROR',
        severity: 'HIGH',
        message: 'Route not found',
        info: { params, specifier },
      });
    }

    route.params = { ...route.params, ...params };
    this._internalState.refresh();
  }

  goBack<S extends keyof R>(
    backRoute?: Navigator.BackRoute<R, S>,
    animation?: Navigator.Animation,
  ): Navigator.Route<R, keyof R> {
    const { params, ...specifier } = backRoute || this.stack[1];

    // @ts-ignore
    params && this.setProps(params, specifier);

    return this.dispatch(undefined, specifier, animation)[0];
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
    this._internalState.setProp('animating', false);
  }

  use() {
    this._internalState.useState()[0];
  }

  useNavigation<K extends keyof R>(): Navigator.Context<R, K> {
    // @ts-ignore
    return useContext(this._Context);
  }
}
