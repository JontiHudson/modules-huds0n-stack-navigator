import { Dimensions, Easing } from "react-native";

import type { Types } from "./types";

export const transitions = {
  slideAcross: {
    in: { transform: [{ translateX: 0 }] },
    out: {
      transform: [
        {
          get translateX() {
            return Dimensions.get("screen").width;
          },
        },
      ],
    },
    useNativeDriver: true,
    duration: 250,
    easing: Easing.inOut(Easing.ease),
  } as Types.Animation,
  fade: {
    in: { opacity: 1 },
    out: { opacity: 0 },
    useNativeDriver: true,
    duration: 250,
    easing: Easing.inOut(Easing.ease),
  } as Types.Animation,
};
