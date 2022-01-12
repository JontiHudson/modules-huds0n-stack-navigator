import { Navigator as NavigatorClass } from "@huds0n/stack-navigator";

type StackParams = {
  HomeScreen: null;
  SwitchScreen: null;
  NavigateScreen: null;
};

export const Navigator = new NavigatorClass<StackParams>({
  initialRoute: { screen: "HomeScreen" },
});
