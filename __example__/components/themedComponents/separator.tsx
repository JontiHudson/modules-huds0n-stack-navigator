import { Spacing } from '../../theme';

import themedComponents from './createThemedComponents';

export const $Separator = themedComponents.$View
  .inject(({ size }: { size: Spacing | number }) => ({
    style: { marginTop: size, marginLeft: size },
  }))
  .addProps({ size: 'M' });
