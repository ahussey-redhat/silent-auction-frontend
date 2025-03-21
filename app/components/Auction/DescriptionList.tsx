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
function getBidAmount(auction: Auction): number {
  if (auction?.highestBid?.amount) {
    return auction?.highestBid?.amount;
  } else {
    return auction.startingBid;
  }
}
export default ({ auction }: AuctionDescriptionListProps) => {
  return (
    <DescriptionList isHorizontal>
      <DescriptionListGroup>
        <img src={auction?.imageUrl.toString()} />
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>
          <Trans>
            <strong>Current highest bid</strong>
          </Trans>
        </DescriptionListTerm>
        <DescriptionListDescription>
          <strong>${getBidAmount(auction) ?? 0}</strong>
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
          <Trans>Auction Start</Trans>
        </DescriptionListTerm>
        <DescriptionListDescription>
          {auction?.start.toString()}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>
          <Trans>Auction End</Trans>
        </DescriptionListTerm>
        <DescriptionListDescription>
          {auction?.end.toString()}
        </DescriptionListDescription>
      </DescriptionListGroup>
    </DescriptionList>
  );
};
