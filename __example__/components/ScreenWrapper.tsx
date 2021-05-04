import React from 'react';

import { NavigationState, goBack } from '../controllers/navigation';

import { ContentsFaderContainer } from '@huds0n/expo';

import { Themer } from '../theme';

import {
  $Container,
  $Icon,
  $ScrollView,
  $Text,
  $View,
} from './themedComponents';

type Props = {
  children: React.ReactNode | React.ReactNode[];
};

export function $ScreenHandler({ children }: Props) {
  const [{ canGoBack, title, scrollView }] = NavigationState.useState(
    'screenName',
  );

  console.log(Themer.currentScheme);

  return (
    <$Container>
      <$HeaderContainer>
        <$HeaderButtonContainer>
          {canGoBack && <$HeaderButton onPress={goBack} />}
        </$HeaderButtonContainer>

        <$HeaderTitleContainer>
          <$HeaderTitleText>{title}</$HeaderTitleText>
        </$HeaderTitleContainer>
      </$HeaderContainer>

      <ContentsFaderContainer
        dependencies={title}
        animationDuration={500}
        style={{ flex: 1 }}
      >
        {scrollView ? (
          <$ScrollView fade={{ bottom: { color: 'BACKGROUND' } }}>
            {children}
          </$ScrollView>
        ) : (
          children
        )}
      </ContentsFaderContainer>
    </$Container>
  );
}

const $HeaderContainer = $View.addStyle({
  backgroundColor: 'PRIMARY',
  borderBottomWidth: 'HAIRLINE',
  borderColor: 'BORDER',
  flexDirection: 'row',
  padding: 'M',
  width: 'FULL',
});

const $HeaderButtonContainer = $View.addStyle({
  width: '10%',
});

const $HeaderButton = $Icon.addProps({
  color: 'BACKGROUND',
  containerStyle: { position: 'absolute', padding: 'M' },
  name: 'ios-arrow-back',
  set: 'Ionicons',
});

const $HeaderTitleContainer = $View.addStyle({
  alignItems: 'center',
  width: '80%',
});

const $HeaderTitleText = $Text.addProps({
  contrast: true,
  header: true,
  singleLine: true,
});
