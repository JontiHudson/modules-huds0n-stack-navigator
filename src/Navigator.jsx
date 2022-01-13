"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Navigator = void 0;
const tslib_1 = require("tslib");
const react_1 = (0, tslib_1.__importStar)(require("react"));
const error_1 = require("@huds0n/error");
const shared_state_1 = require("@huds0n/shared-state");
const utilities_1 = require("@huds0n/utilities");
const transitions_1 = require("./transitions");
class Navigator {
    _defaultAnimation;
    _nextId = 0;
    _internalState;
    _defaultRoutesParams;
    _Context;
    static transitions = transitions_1.transitions;
    constructor(props) {
        const { defaultAnimation = Navigator.transitions.slideAcross, initialRoute, defaultRoutesParams = {}, } = typeof props === "function" ? props(this) : props;
        this._defaultAnimation = defaultAnimation;
        this._internalState = new shared_state_1.SharedState({
            animation: defaultAnimation,
            stack: [],
            prevStack: [],
            animating: false,
        });
        this._defaultRoutesParams = defaultRoutesParams;
        this._Context = react_1.default.createContext({});
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
    getRoute({ id, screen, }) {
        const route = this.stack.find((r) => r.screen === screen && (id === undefined || r.id === id));
        if (!route) {
            throw new error_1.Huds0nError({
                name: "NavigatorError",
                code: "GET_ROUTE_ERROR",
                severity: "HIGH",
                message: "Route not found",
                info: { id, screen },
            });
        }
        return route;
    }
    navigate(newRoute, animation) {
        return this.dispatch({ routes: [newRoute], animation })[0];
    }
    dispatch({ routes: newRoutes, startingRoute, animation = this._defaultAnimation, }) {
        let newStack = [...this.stack];
        if (startingRoute === null) {
            newStack = [];
        }
        else if (startingRoute) {
            const index = this.stack.findIndex((route) => route === this.getRoute(startingRoute));
            if (index === -1) {
                throw new error_1.Huds0nError({
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
                    params: defaultParams || params
                        ? {
                            ...(defaultParams && defaultParams),
                            ...(params && params),
                        }
                        : null,
                };
                return route;
            });
            newStack = [...newRoutesWithIds.reverse(), ...newStack];
            this._nextId += newRoutes.length;
        }
        const newTopRoute = newStack[0];
        const prevTopRoute = this.stack[0];
        if (newTopRoute === prevTopRoute) {
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
    switch(newRoute, animation = Navigator.transitions.fade) {
        return this.dispatch({
            routes: [newRoute],
            startingRoute: null,
            animation,
        });
    }
    goBack(backRoute, animation) {
        const { params, ...specifier } = backRoute || this.stack[1];
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
    useRoute() {
        try {
            return (0, react_1.useContext)(this._Context);
        }
        catch {
            throw new error_1.Huds0nError({
                name: "NavigatorError",
                code: "USE_ROUTE_ERROR",
                severity: "HIGH",
                message: "Use route can only be used within a Stack Component tree.",
            });
        }
    }
    setParams(params, specifier) {
        let route;
        if (specifier) {
            route = this.getRoute(specifier);
            if (!route) {
                throw new error_1.Huds0nError({
                    name: "NavigatorError",
                    code: "SET_PROPS_ERROR",
                    severity: "HIGH",
                    message: "Route not found",
                    info: { params, specifier },
                });
            }
        }
        else {
            route = this.useRoute();
        }
        route.params = { ...route.params, ...params };
        this._internalState.refresh();
    }
    initializeParams(params) {
        this.useOnFocus(() => {
            const route = this.currentRoute;
            route.params = { ...route.params, ...params };
            this._internalState.refresh();
        });
    }
    useOnFocus(focusFn, layout) {
        const { isFocused } = this.useRoute();
        (0, utilities_1.useEffect)(() => {
            if (isFocused)
                focusFn();
        }, [isFocused], { layout });
    }
    useOnUnfocus(unfocusFn, layout) {
        const { isFocused } = this.useRoute();
        (0, utilities_1.useEffect)(() => () => {
            if (!isFocused)
                unfocusFn();
        }, [isFocused], { layout });
    }
}
exports.Navigator = Navigator;
