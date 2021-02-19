import React from 'react';

import {
  useForm,
  useDateTimeInput,
  usePickerInput,
  useTextInput,
  validators,
  InputManager,
} from '@huds0n/expo';

import { addNotification } from '../../api';
import { NetworkManager, goBack } from '../../controllers';
import {
  $Button,
  $Container,
  $DateTimeField,
  $PickerField,
  $Separator,
  $TextField,
  $View,
} from '../../components';

export default function AddNotification() {
  const titleField = useTextInput();
  const bodyField = useTextInput();

  const dateField = useDateTimeInput();
  const timeField = useDateTimeInput();

  const typeField = usePickerInput();
  const responseField = usePickerInput<string>();

  const { isError, isModified, revertAll, valueArray } = useForm(
    titleField,
    bodyField,
    dateField,
    timeField,
    typeField,
    responseField,
  );

  const [submit, submitStatus] = NetworkManager.useSubmit(
    async () => {
      InputManager.dismiss();

      const [title, body, date, time, type, response] = valueArray;

      if (date && time) {
        await addNotification(title, body, date, time, type, response);

        goBack();
      }
    },
    valueArray,
    { disabled: isError },
  );

  return (
    <$Container form>
      <$TitleField {...titleField} />
      <$BodyField {...bodyField} />
      <$DateField {...dateField} />
      <$TimeField {...timeField} />
      <$TypeField {...typeField} />
      <$ResponseField {...responseField} onSubmitEditing={submit} />

      <$Separator />

      <$ButtonWrapper>
        <$SubmitButton onPress={submit} submitStatus={submitStatus} />

        <$Separator size="L" />

        <$RevertButton disabled={!isModified} onPress={revertAll} />
      </$ButtonWrapper>
    </$Container>
  );
}

const $TitleField = $TextField.addProps({
  isRequired: true,
  title: 'Title',
  validation: validators.textOnly,
});

const $BodyField = $TextField.addProps({
  title: 'Body',
  validation: validators.textOnly,
});

const $DateField = $DateTimeField
  .addProps({
    title: 'Date',
    isRequired: true,
  })
  .inject(() => ({
    minimumDate: new Date(new Date().setHours(0, 0, 0, 0)),
  }));

const $TimeField = $DateTimeField
  .addProps({
    title: 'Time',
    mode: 'time',
    isRequired: true,
  })
  .inject(() => ({
    minimumDate: new Date(new Date().setSeconds(0, 0)),
  }));

const $TypeField = $PickerField.addProps({
  title: 'Type',
  pickerItems: [
    { label: 'Notify', value: 'notify' },
    { label: 'Success', value: 'success' },
    { label: 'Warn', value: 'warn' },
    { label: 'Error', value: 'error' },
  ],
});

const $ResponseField = $PickerField.addProps({
  title: 'Response',
  nullLabel: 'None',
  pickerItems: [
    { label: 'Yes/No', value: 'YES_NO' },
    { label: 'Reply', value: 'REPLY' },
  ],
});

const $ButtonWrapper = $View.addStyle({
  flexDirection: 'row',
});

const $FormButton = $Button.addProps({
  style: { flex: 1 },
});

const $SubmitButton = $FormButton.addProps({
  label: 'Submit',
  outline: 'SUCCESS',
});

const $RevertButton = $FormButton.addProps({
  outline: 'ERROR',
  label: 'Revert',
  labelStyle: { color: 'ERROR' },
  style: { borderColor: 'ERROR' },
});
