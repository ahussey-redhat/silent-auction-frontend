import { Trans } from '@lingui/macro';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Label,
} from '@patternfly/react-core';
// eslint-disable-next-line import/no-named-as-default
import InfoCircleIcon from '@patternfly/react-icons/dist/esm/icons/info-circle-icon';
import { Auction } from '@/types';

export type AuctionDescriptionListProps = {
  auction: Auction;
};

function active(auctionStart: string, auctionEnd: string): boolean {
  const currentDate: Date = new Date();
  const auctionStartDate: Date = new Date(auctionStart);
  const auctionEndDate: Date = new Date(auctionEnd);

  if (auctionStartDate <= currentDate && currentDate >= auctionEndDate) {
    return true;
  }
  return false;
}

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
          <Trans>Active</Trans>
        </DescriptionListTerm>
        <DescriptionListDescription>
          <Label color="blue" icon={<InfoCircleIcon />}>
            {active(auction?.auction_start, auction?.auction_end)
              ? 'true'
              : 'false'}
          </Label>
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <img src={auction?.image_path} />
      </DescriptionListGroup>
    </DescriptionList>
  );
};
