import {
	ActionGroup,
	Button,
	Form,
	FormGroup,
	ModalBody,
	ModalHeader,
	NumberInput,
	ValidatedOptions
} from '@patternfly/react-core';
import {
	Modal,
	ModalVariant
} from '@patternfly/react-core/deprecated';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePrevious } from 'react-use';

type NumberInputValue = number | '';

export type PlaceBidModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentHighestBid: number | undefined;
  startingBid: number;
  onPlaceBid: (bidAmount: number) => void;
  placingBid: boolean;
};

export default function PlaceBidModal ({
  isOpen,
  onClose,
  currentHighestBid,
  startingBid,
  onPlaceBid,
  placingBid,
}: PlaceBidModalProps) {
  const minimumBidAmount = useMemo(
    () => currentHighestBid || startingBid || 0,
    [currentHighestBid],
  );
  const previousMinimumBidAmount = usePrevious(minimumBidAmount);
  const [bidAmount, setBidAmount] = useState<NumberInputValue>(
    minimumBidAmount + 10,
  );
  const [validated, setValidated] = useState<ValidatedOptions>(
    ValidatedOptions.success,
  );
  const previousPlacingBid = usePrevious(placingBid);

  useEffect(() => {
    if (minimumBidAmount !== previousMinimumBidAmount && !isOpen) {
      setBidAmount(minimumBidAmount + 10);
    }
  }, [minimumBidAmount, previousMinimumBidAmount, setBidAmount, isOpen]);

  useEffect(() => {
    if (previousPlacingBid && !placingBid) {
      onClose();
    }
  }, [placingBid, previousPlacingBid, onClose]);

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
    const newBidAmount = (bidAmount || 0) - 10;
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
    const newBidAmount = (bidAmount || 0) + 10;
    setBidAmount(newBidAmount);
    validate(newBidAmount);
  }, [bidAmount, setBidAmount]);

  const onSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (bidAmount !== '' && validated === ValidatedOptions.success) {
        onPlaceBid(bidAmount);
      }
    },
    [bidAmount, onPlaceBid, validated],
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
        title={`Place a bid`}
        description={`Enter an amount you would like to bid on this auction item`}
        labelId="place-bid-modal-title"
        descriptorId="place-bid-modal-description"
      />
      <ModalBody>
        <Form id="place-bid-form" onSubmit={onSubmit}>
          <FormGroup
            label={'Bid Amount'}
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
              inputAriaLabel={`Bid Amount`}
              minusBtnAriaLabel={`Minus`}
              plusBtnAriaLabel={`Plus`}
              unitPosition="before"
              unit="$"
              min={0}
            />
          </FormGroup>
          <ActionGroup>
            <Button
              type="submit"
              variant="primary"
              isDisabled={
                bidAmount === '' || bidAmount <= minimumBidAmount || placingBid
              }
            >
              Submit
            </Button>
            <Button variant="link" onClick={onClose}>
              Cancel
            </Button>
          </ActionGroup>
        </Form>
      </ModalBody>
    </Modal>
  );
};
