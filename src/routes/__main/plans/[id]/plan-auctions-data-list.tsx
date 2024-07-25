import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  DataList,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Flex,
  FlexItem,
  Timestamp,
} from '@patternfly/react-core';
import type { PlanAuction } from '@/types';
import { LocaleLink } from '@/components';

export type DataListProps = {
  planAuctions: PlanAuction[];
};

export default ({ planAuctions }: DataListProps) => {
  const { _ } = useLingui();

  return (
    <DataList aria-label={_(msg`Auction plans list`)}>
      {planAuctions.map(({ id, auctionId, name, start, end, imageUrl }) => (
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
                          {name}
                        </LocaleLink>
                      </p>
                    </FlexItem>
                  </Flex>
                </DataListCell>,
                <DataListCell key="start-end">
                  <Timestamp date={start} /> - <Timestamp date={end} />
                </DataListCell>,
                <DataListCell key="image">{imageUrl.toString()}</DataListCell>,
              ]}
            />
          </DataListItemRow>
        </DataListItem>
      ))}
    </DataList>
  );
};
