"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = (0, tslib_1.__importDefault)(require("react"));
const react_native_1 = require("react-native");
const stack_navigator_1 = require("@huds0n/stack-navigator");
const navigator_1 = require("./navigator");
const HomeScreen_1 = (0, tslib_1.__importDefault)(require("./HomeScreen"));
const SwitchScreen_1 = (0, tslib_1.__importDefault)(require("./SwitchScreen"));
const NavigateScreen_1 = (0, tslib_1.__importDefault)(require("./NavigateScreen"));
function App() {
    return (<react_native_1.SafeAreaView style={styles.safeAreaView}>
      <stack_navigator_1.Stack navigator={navigator_1.Navigator} screens={{
            HomeScreen: <HomeScreen_1.default />,
            SwitchScreen: <SwitchScreen_1.default />,
            NavigateScreen: <NavigateScreen_1.default />,
        }} screenStyle={styles.stackScreen}/>
    </react_native_1.SafeAreaView>);
}
exports.default = App;
const styles = react_native_1.StyleSheet.create({
    stackScreen: {
        backgroundColor: "white",
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 10,
        shadowOpacity: 0.25,
        shadowColor: "grey",
    },
    safeAreaView: { flex: 1 },
});
