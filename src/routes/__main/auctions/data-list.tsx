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
  Stack,
  StackItem,
} from '@patternfly/react-core';
import { KeyboardEvent, MouseEvent as ReactMouseEvent } from 'react';
import type { Auction } from '@/types';
import { LocaleLink } from '@/components';

export type DataListProps = {
  auctions: Auction[];
  selectedAuctionId: string;
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
        ({ id, item_name, auction_start, auction_end, image_path }) => (
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
                          <LocaleLink prefetch="intent" to={`/auctions/${id}`}>
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
