import themedComponents from './themedComponents/createThemedComponents';

export const $ActionFAB = themedComponents.$createFAB().addProps({
  positionBottom: true,
  positionRight: true,
  positionOffsetY: 85,
});

export const $InfoFAB = themedComponents.$createFAB().addProps({
  positionBottom: true,
  positionRight: true,
  FABColor: 'GREY',
});

$InfoFAB.$setActions([
  { title: 'Version: 1.*.*', textStyle: { fontSize: 'LABEL' } },
]);
