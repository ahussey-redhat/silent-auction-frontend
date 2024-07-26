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
import { useCallback, useMemo, useState } from 'react';
import { Bid } from '@/types';

type NumberInputValue = number | '';

export type PlaceBidModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentHighestBid: Bid | null;
};

export default ({ isOpen, onClose, currentHighestBid }: PlaceBidModalProps) => {
  const { _ } = useLingui();
  const minimumBidAmount = useMemo(
    () => currentHighestBid?.amount ?? 0,
    [currentHighestBid],
  );
  const [bidAmount, setBidAmount] = useState<NumberInputValue>(
    minimumBidAmount + 1,
  );
  const [validated, setValidated] = useState<ValidatedOptions>(
    ValidatedOptions.default,
  );

  const validate = (value: NumberInputValue) => {
    if (value === '') {
      setValidated(ValidatedOptions.error);
    } else if (value > minimumBidAmount) {
      setValidated(ValidatedOptions.success);
    } else {
      setValidated(ValidatedOptions.error);
    }
  };

  const onMinusBidAmount = useCallback(() => {
    const newBidAmount = (bidAmount || 0) - 1;
    setBidAmount(newBidAmount);
    validate(newBidAmount);
  }, [bidAmount, setBidAmount]);

  const onChangeBidAmount = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      const { value } = event.target as HTMLInputElement;
      const newBidAmount = value === '' ? value : Number(value);
      setBidAmount(newBidAmount);
      validate(newBidAmount);
    },
    [bidAmount, setBidAmount],
  );

  const onPlusBidAmount = useCallback(() => {
    const newBidAmount = (bidAmount || 0) + 1;
    setBidAmount(newBidAmount);
    validate(newBidAmount);
  }, [bidAmount, setBidAmount]);

  const onSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      console.log('Placing bid', bidAmount);
      onClose();
    },
    [bidAmount, onClose],
  );

  return (
    <Modal
      variant={ModalVariant.small}
      isOpen={isOpen}
      onClose={onClose}
      aria-labelledby="place-bid-modal-title"
      aria-describedby="place-bid-modal-description"
    >
      <ModalHeader
        title={_(msg`Place a bid`)}
        description={_(
          msg`Enter an amount you would like to bid on this auction item`,
        )}
        labelId="place-bid-modal-title"
        descriptorId="place-bid-modal-description"
      />
      <ModalBody>
        <Form id="place-bid-form" onSubmit={onSubmit}>
          <FormGroup
            label={<Trans>Bid Amount</Trans>}
            isRequired
            fieldId="bid-amount"
          >
            <NumberInput
              id="bid-amount"
              value={bidAmount}
              validated={validated}
              onMinus={onMinusBidAmount}
              onChange={onChangeBidAmount}
              onPlus={onPlusBidAmount}
              inputName="bid-amount"
              inputAriaLabel={_(msg`Bid Amount`)}
              minusBtnAriaLabel={_(msg`Minus`)}
              plusBtnAriaLabel={_(msg`Plus`)}
              unitPosition="before"
              unit="$"
              min={0}
            />
          </FormGroup>
          <ActionGroup>
            <Button
              type="submit"
              variant="primary"
              isDisabled={bidAmount === '' || bidAmount <= minimumBidAmount}
            >
              <Trans>Submit</Trans>
            </Button>
            <Button variant="link" onClick={onClose}>
              <Trans>Cancel</Trans>
            </Button>
          </ActionGroup>
        </Form>
      </ModalBody>
    </Modal>
  );
};
