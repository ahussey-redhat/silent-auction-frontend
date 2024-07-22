import { Trans } from '@lingui/macro';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from '@patternfly/react-core';
import { Auction } from '@/types';

export type AuctionDescriptionListProps = {
  auction: Auction;
};

export default ({ auction }: AuctionDescriptionListProps) => {
  return (
    <DescriptionList isHorizontal>
      <DescriptionListGroup>
        <DescriptionListTerm>
          <Trans>Name</Trans>
        </DescriptionListTerm>
        <DescriptionListDescription>
          {auction?.item_name}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>
          <Trans>Description</Trans>
        </DescriptionListTerm>
        <DescriptionListDescription>
          {auction?.description}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>
          <Trans>Start</Trans>
        </DescriptionListTerm>
        <DescriptionListDescription>
          {auction?.auction_start}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>
          <Trans>End</Trans>
        </DescriptionListTerm>
        <DescriptionListDescription>
          {auction?.auction_end}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>
          <Trans>Image</Trans>
        </DescriptionListTerm>
        <DescriptionListDescription>
          {auction?.image_path}
        </DescriptionListDescription>
      </DescriptionListGroup>
    </DescriptionList>
  );
};
