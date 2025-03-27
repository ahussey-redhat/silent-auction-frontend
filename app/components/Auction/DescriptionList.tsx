import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from '@patternfly/react-core';
import { Auction } from '@app/types';

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
            <strong>Current highest bid</strong>
        </DescriptionListTerm>
        <DescriptionListDescription>
          <strong>${getBidAmount(auction) ?? 0}</strong>
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>
          Description
        </DescriptionListTerm>
        <DescriptionListDescription>
          {auction?.description}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>
          Auction Start
        </DescriptionListTerm>
        <DescriptionListDescription>
          {auction?.start.toString()}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>
          Auction End
        </DescriptionListTerm>
        <DescriptionListDescription>
          {auction?.end.toString()}
        </DescriptionListDescription>
      </DescriptionListGroup>
    </DescriptionList>
  );
};
