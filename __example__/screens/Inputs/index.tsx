import React from 'react';

import {
  createStoreRN,
  SharedState,
  useCallback,
  useForm,
  useDateTimeInput,
  usePickerInput,
  useTextInput,
  validators,
  InputManager,
} from '@huds0n/expo';

import {
  $Button,
  $Container,
  $DateTimeField,
  $PickerField,
  $Separator,
  $TextField,
  $Text,
  $Toast,
  $View,
} from '../../components';
import { toastPresets } from '../../config';

const FormState = new SharedState({
  name: '',
  title: null,
});

FormState.initializeStorage(createStoreRN({ storeName: 'FORM_STATE' }));

export default function Form() {
  const nameField = useTextInput({ defaultValue: FormState.state.name });
  const titleField = usePickerInput({ defaultValue: FormState.state.title });
  const dobField = useDateTimeInput();
  const timeField = useDateTimeInput();

  const { isError, isModified, revertAll, valueArray } = useForm(
    titleField,
    nameField,
    dobField,
    timeField,
  );
  const disableSubmit = isError || !isModified;

  const onSubmit = useCallback(() => {
    InputManager.dismiss();
    const name = titleField.value
      ? `${titleField.value} ${nameField.value}`
      : nameField.value;

    $Toast.$display({
      title: 'Success',
      message: `Welcome ${name}`,
      ...toastPresets.success,
    });

    FormState.setState({
      name: nameField.value,
      title: titleField.value,
    });

    FormState.save();

    console.log(`Welcome ${name}`);
  }, valueArray);

  return (
    <$Container form>
      <$Text subheader center>
        Form
      </$Text>

      <$Separator />

      <$TitleField {...titleField} />
      <$NameField {...nameField} prefix={titleField.value || undefined} />
      <$DoBField
        {...dobField}
        onSubmitEditing={disableSubmit ? undefined : onSubmit}
      />

      <$Separator />

      <$ButtonWrapper>
        <Submit$Button disabled={disableSubmit} onPress={onSubmit} />

        <$Separator size="L" />

        <Revert$Button disabled={!isModified} onPress={revertAll} />
      </$ButtonWrapper>
    </$Container>
  );
}

const $NameField = $TextField.addProps({
  autoCorrect: false,
  isRequired: true,
  title: 'Name',
  validation: validators.textOnly,
});

const $TitleField = $PickerField.addProps({
  title: 'Title',
  isRequired: true,
  pickerItems: [
    { label: 'Dr', value: 'Dr' },
    { label: 'Miss', value: 'Miss' },
    { label: 'Mr', value: 'Mr' },
    { label: 'Mrs', value: 'Mrs' },
    { label: 'Ms', value: 'Ms' },
    { label: 'Prof', value: 'Prof' },
    { label: 'Rev', value: 'Rev' },
  ],
  nullable: true,
  nullLabel: '- Please Select -',
});

const $DoBField = $DateTimeField.addProps({
  title: 'Date of Birth',
  isRequired: true,
  validation: validators.date({
    isPast: true,
    after: new Date(new Date().setFullYear(1910)),
  }),
});

const $ButtonWrapper = $View.addStyle({
  flexDirection: 'row',
});

const $FormButton = $Button.addProps({
  style: { flex: 1 },
});

const Submit$Button = $FormButton.addProps({
  label: 'Submit',
  outline: 'SUCCESS',
});

const Revert$Button = $FormButton.addProps({
  outline: 'ERROR',
  label: 'Revert',
  labelStyle: { color: 'ERROR' },
  style: { borderColor: 'ERROR' },
});
