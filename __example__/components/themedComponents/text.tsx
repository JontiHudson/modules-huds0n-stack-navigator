import themedComponents from './createThemedComponents';

export const $Text = themedComponents.$Text.addPresets({
  body: {
    style: {
      fontSize: 'BODY',
    },
  },
  bold: {
    style: {
      fontWeight: 'bold',
    },
  },
  center: {
    style: {
      alignSelf: 'center',
    },
  },
  contrast: {
    style: {
      color: 'BACKGROUND',
    },
  },
  header: {
    style: {
      fontSize: 'HEADER',
    },
  },
  label: {
    style: {
      fontSize: 'LABEL',
    },
  },
  note: {
    style: {
      fontSize: 'NOTE',
    },
  },
  singleLine: {
    adjustsFontSizeToFit: true,
    numberOfLines: 1,
  },
  underline: {
    style: {
      textDecorationLine: 'underline',
    },
  },
  subheader: {
    style: {
      fontSize: 'SUBHEADER',
    },
  },
});
