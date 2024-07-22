import {
  DrawerActions,
  DrawerCloseButton,
  DrawerHead,
  DrawerPanelBody,
  DrawerPanelContent,
  Flex,
  FlexItem,
  Title,
} from '@patternfly/react-core';
import { MouseEventHandler } from 'react';
import { LocaleLink, AuctionDescriptionList } from '@/components';
import type { Auction } from '@/types';

export type DetailsPanelProps = {
  auction: Auction;
  onCloseDrawer: MouseEventHandler<HTMLDivElement>;
};

export default ({ auction, onCloseDrawer }: DetailsPanelProps) => (
  <DrawerPanelContent>
    <DrawerHead>
      <Title headingLevel="h2" size="xl">
        {auction ? (
          <LocaleLink prefetch="intent" to={`/auctions/${auction?.id}`}>
            {auction?.item_name}
          </LocaleLink>
        ) : (
          ''
        )}
      </Title>
      <DrawerActions>
        <DrawerCloseButton onClick={onCloseDrawer} />
      </DrawerActions>
    </DrawerHead>
    <DrawerPanelBody>
      <Flex
        spaceItems={{ default: 'spaceItemsLg' }}
        direction={{ default: 'column' }}
      >
        <FlexItem>
          <AuctionDescriptionList auction={auction} />
        </FlexItem>
      </Flex>
    </DrawerPanelBody>
  </DrawerPanelContent>
);
