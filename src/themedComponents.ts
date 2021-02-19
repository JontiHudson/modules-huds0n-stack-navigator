import { CacheImage } from '@huds0n/expo-cache-image';

import { ThemerTypes } from '@huds0n/themer';
import { createThemedComponents as createThemedComponentsRN } from '@huds0n/react-native';

export function createThemedComponents<cT extends ThemerTypes.CustomTheme>(
  Themer: ThemerTypes.ThemerClass<cT>,
) {
  return {
    ...createThemedComponentsRN(Themer),

    $CacheImage: Themer.createComponent(CacheImage, CacheImage.theming.props)
      .addProps({
        style: { borderColor: 'BORDER' },
        activityIndicatorColor: 'TEXT',
        loadingBackgroundColor: 'TRANSPARENT',
        useColorScheme: true,
      })
      .addStatics({
        clear: CacheImage.clear,
        load: CacheImage.load,
      })
      .setMemo(true),
  };
}
