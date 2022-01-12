"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = (0, tslib_1.__importDefault)(require("react"));
const react_native_1 = require("react-native");
const components_1 = require("@huds0n/components");
const navigator_1 = require("./navigator");
function NavigateScreen() {
    return (<react_native_1.View style={styles.container}>
      <react_native_1.Text>Navigate Screen</react_native_1.Text>

      <components_1.Separator />

      <components_1.Button onPress={() => navigator_1.Navigator.goBack()}>Go Back</components_1.Button>
    </react_native_1.View>);
}
exports.default = NavigateScreen;
const styles = react_native_1.StyleSheet.create({
    container: { flex: 1, alignItems: "center", justifyContent: "center" },
});