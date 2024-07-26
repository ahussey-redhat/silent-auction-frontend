import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  ActionGroup,
  Button,
  Form,
  FormGroup,
  Modal,
  ModalBody,
  ModalHeader,
  ModalVariant,
  NumberInput,
  ValidatedOptions,
} from '@patternfly/react-core';
import { useCallback, useState } from 'react';
import { env } from '@/constants';

type NumberInputValue = number | '';

export type CreateUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreateUser: (tableNumber: number) => void;
};

export default ({ isOpen, onClose, onCreateUser }: CreateUserModalProps) => {
  const { _ } = useLingui();
  const [tableNumber, setTableNumber] = useState<NumberInputValue>(1);
  const [validated, setValidated] = useState<ValidatedOptions>(
    ValidatedOptions.success,
  );

  const validate = (value: NumberInputValue) => {
    if (value === '') {
      setValidated(ValidatedOptions.error);
    } else if (value >= env.minTableNumber && value <= env.maxTableNumber) {
      setValidated(ValidatedOptions.success);
    } else {
      setValidated(ValidatedOptions.error);
    }
  };

  const onMinusTableNumber = useCallback(() => {
    const newTableNumber = (tableNumber || 0) - 1;
    setTableNumber(newTableNumber);
    validate(newTableNumber);
  }, [tableNumber, setTableNumber]);

  const onChangeTableNumber = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      const { value } = event.target as HTMLInputElement;
      const newTableNumber = value === '' ? value : Number(value);
      setTableNumber(newTableNumber);
      validate(newTableNumber);
    },
    [tableNumber, setTableNumber],
  );

  const onPlusTableNumber = useCallback(() => {
    const newTableNumber = (tableNumber || 0) + 1;
    setTableNumber(newTableNumber);
    validate(newTableNumber);
  }, [tableNumber, setTableNumber]);

  const onSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (validated === ValidatedOptions.success) {
        onCreateUser(tableNumber as number);
        onClose();
      } else {
        console.log(validated);
      }
    },
    [onCreateUser, onClose, tableNumber, validated],
  );

  return (
    <Modal
      variant={ModalVariant.small}
      isOpen={isOpen}
      onClose={onClose}
      aria-labelledby="create-user-modal-title"
      aria-describedby="create-user-modal-description"
    >
      <ModalHeader
        title={_(msg`What is your table number?`)}
        description={_(msg`Enter the table number in front of you`)}
        labelId="create-user-modal-title"
        descriptorId="create-user-modal-description"
      />
      <ModalBody>
        <Form id="create-user-form" onSubmit={onSubmit}>
          <FormGroup
            label={<Trans>Table Number</Trans>}
            isRequired
            fieldId="table-number"
          >
            <NumberInput
              id="table-number"
              value={tableNumber}
              validated={validated}
              onMinus={onMinusTableNumber}
              onChange={onChangeTableNumber}
              onPlus={onPlusTableNumber}
              inputName="table-number"
              inputAriaLabel={_(msg`Table Number`)}
              minusBtnAriaLabel={_(msg`Minus`)}
              plusBtnAriaLabel={_(msg`Plus`)}
              min={env.minTableNumber}
              max={env.maxTableNumber}
            />
          </FormGroup>
          <ActionGroup>
            <Button type="submit" variant="primary">
              <Trans>Submit</Trans>
            </Button>
          </ActionGroup>
        </Form>
      </ModalBody>
    </Modal>
  );
};
