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
        <img src={auction?.imageUrl.toString()} />
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>
          <Trans>
            <strong>Current highest bid</strong>
          </Trans>
        </DescriptionListTerm>
        <DescriptionListDescription>
          <strong>${auction?.highestBid?.amount ?? 0}</strong>
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
    </DescriptionList>
  );
};
