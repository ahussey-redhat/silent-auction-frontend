import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Button,
  ButtonVariant,
  DataList,
  DataListAction,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Flex,
  FlexItem,
  Label,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import { ExclamationTriangleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';
import { TimesCircleIcon } from '@patternfly/react-icons/dist/esm/icons/times-circle-icon';
import { KeyboardEvent, MouseEvent as ReactMouseEvent } from 'react';
import type { Auction } from '@/types';
import { LocaleLink } from '@/components';

export type DataListProps = {
  auctions: Auction[];
  selectedAuctionId: Auction['id'];
  onSelectAuction: (
    event: ReactMouseEvent<Element, MouseEvent> | KeyboardEvent<Element>,
    id: string,
  ) => void;
};

export default ({
  auctions,
  selectedAuctionId,
  onSelectAuction,
}: DataListProps) => {
  const { _ } = useLingui();

  return (
    <DataList
      aria-label={_(msg`Auctions list`)}
      selectedDataListItemId={selectedAuctionId}
      onSelectDataListItem={onSelectAuction}
    >
      {auctions.map(
        ({ id, auctionNumber, givenNames, surname, active, risk }) => (
          <DataListItem key={id} id={id}>
            <DataListItemRow>
              <DataListItemCells
                dataListCells={[
                  <DataListCell key="primary-content">
                    <Flex
                      spaceItems={{ default: 'spaceItemsMd' }}
                      direction={{ default: 'column' }}
                    >
                      <FlexItem>
                        <p>
                          <LocaleLink prefetch="intent" to={`/auctions/${id}`}>
                            {surname}, {givenNames}
                          </LocaleLink>
                        </p>
                        <small>{auctionNumber}</small>
                      </FlexItem>
                    </Flex>
                  </DataListCell>,
                  <DataListCell key="status">
                    <Label
                      icon={
                        active ? (
                          <CheckCircleIcon color="var(--pf-t--color--green--60)" />
                        ) : (
                          <TimesCircleIcon color="var(--pf-t--color--red--60)" />
                        )
                      }
                    >
                      {active ? <Trans>Active</Trans> : <Trans>Inactive</Trans>}
                    </Label>
                  </DataListCell>,
                  <DataListCell key="risk">
                    <Label
                      icon={
                        {
                          low: (
                            <CheckCircleIcon color="var(--pf-t--color--green--60)" />
                          ),
                          medium: (
                            <ExclamationTriangleIcon color="var(--pf-t--color--yellow--40)" />
                          ),
                          high: (
                            <TimesCircleIcon color="var(--pf-t--color--red--60)" />
                          ),
                        }[risk]
                      }
                    >
                      {
                        {
                          low: <Trans>Low Risk</Trans>,
                          medium: <Trans>Medium Risk</Trans>,
                          high: <Trans>High Risk</Trans>,
                        }[risk]
                      }
                    </Label>
                  </DataListCell>,
                  <DataListAction
                    key="actions"
                    aria-labelledby={`${id} ${id}-action`}
                    id={`${id}-action`}
                    aria-label={_(msg`Actions`)}
                  >
                    <Stack>
                      <StackItem>
                        <Button variant={ButtonVariant.secondary}>
                          <Trans>Action</Trans>
                        </Button>
                      </StackItem>
                    </Stack>
                  </DataListAction>,
                ]}
              />
            </DataListItemRow>
          </DataListItem>
        ),
      )}
    </DataList>
  );
};
