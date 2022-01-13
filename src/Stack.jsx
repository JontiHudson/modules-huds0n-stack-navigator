"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stack = void 0;
const tslib_1 = require("tslib");
const react_1 = (0, tslib_1.__importDefault)(require("react"));
const react_native_1 = require("react-native");
const animations_1 = require("@huds0n/animations");
const BASE_STYLE = {
    position: "absolute",
    height: "100%",
    width: "100%",
};
function Stack({ navigator, screens, screenStyle, }) {
    const { animating, animation, currentRoute, prevRoute, stack } = navigator.use();
    const backgroundStacks = stack
        .slice(2)
        .filter((route) => route.isMounted && route.id !== prevRoute.id);
    function getScreen(route) {
        const Screen = screens[route.screen];
        const NavigationContext = navigator._Context;
        return (<NavigationContext.Provider value={route}>
        {Screen}
      </NavigationContext.Provider>);
    }
    const screenArray = backgroundStacks.map((route) => (<animations_1.AnimatedView key={route.id} pointerEvents="none" style={Object.assign(Object.assign(Object.assign({}, screenStyle), BASE_STYLE), { opacity: 0, zIndex: -1 })}>
      {getScreen(route)}
    </animations_1.AnimatedView>));
    if (prevRoute) {
        if (animation && animating === "OUT") {
            screenArray.push(<animations_1.AnimatedView key={prevRoute.id} pointerEvents="none" animate={{
                    to: animation.out,
                    duration: animation.duration,
                    easing: animation.easing,
                    onAnimationEnd: navigator.setAnimationEnd,
                }} style={Object.assign(Object.assign(Object.assign(Object.assign({}, screenStyle), BASE_STYLE), animation.in), { zIndex: 2 })} useNativeDriver={animation.useNativeDriver}>
          {getScreen(prevRoute)}
        </animations_1.AnimatedView>);
        }
        else if (animating === "IN" || prevRoute.isMounted) {
            screenArray.push(<animations_1.AnimatedView key={prevRoute.id} pointerEvents="none" style={Object.assign(Object.assign(Object.assign({}, screenStyle), BASE_STYLE), { zIndex: 0 })}>
          {getScreen(prevRoute)}
        </animations_1.AnimatedView>);
        }
    }
    const animateIn = animating === "IN";
    screenArray.push(<animations_1.AnimatedView key={currentRoute.id} pointerEvents={animateIn ? "none" : "auto"} animate={animation && animateIn
            ? {
                to: animation.in,
                duration: animation.duration,
                easing: animation.easing,
                onAnimationEnd: navigator.setAnimationEnd,
            }
            : undefined} style={Object.assign(Object.assign(Object.assign(Object.assign({}, screenStyle), BASE_STYLE), (animateIn && animation && animation.out)), { zIndex: 1 })} useNativeDriver>
      {getScreen(currentRoute)}
    </animations_1.AnimatedView>);
    return <react_native_1.View style={{ flex: 1, overflow: "hidden" }}>{screenArray}</react_native_1.View>;
}
exports.Stack = Stack;
