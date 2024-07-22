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
      {planAuctions.map(
        ({
          id,
          auctionId,
          item_name,
          auction_start,
          auction_end,
          image_path,
        }) => (
          <DataListItem key={id} id={id.toString()}>
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
                            {item_name}
                          </LocaleLink>
                        </p>
                      </FlexItem>
                    </Flex>
                  </DataListCell>,
                  <DataListCell key="start-end">
                    {auction_start} - {auction_end}
                  </DataListCell>,
                  <DataListCell key="image">{image_path}</DataListCell>,
                ]}
              />
            </DataListItemRow>
          </DataListItem>
        ),
      )}
    </DataList>
  );
};
