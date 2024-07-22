import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  DataList,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Flex,
  FlexItem,
  Label,
} from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import { ExclamationTriangleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';
import { TimesCircleIcon } from '@patternfly/react-icons/dist/esm/icons/times-circle-icon';
import type { PlanAuction } from '@/types';
import { LocaleLink } from '@/components';

export type DataListProps = {
  planAuctions: PlanAuction[];
};

export default ({ planAuctions }: DataListProps) => {
  const { _ } = useLingui();

  return (
    <DataList aria-label={_(msg`Auction plans list`)}>
      {planAuctions.map(
        ({
          id,
          auctionId,
          auctionNumber,
          givenNames,
          surname,
          active,
          risk,
        }) => (
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
                          <LocaleLink
                            prefetch="intent"
                            to={`/auctions/${auctionId}`}
                          >
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
                ]}
              />
            </DataListItemRow>
          </DataListItem>
        ),
      )}
    </DataList>
  );
};
