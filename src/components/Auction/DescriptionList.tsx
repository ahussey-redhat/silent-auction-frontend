import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
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
  const { _ } = useLingui();

  return (
    <DescriptionList isHorizontal>
      <DescriptionListGroup>
        <DescriptionListTerm>
          <Trans>Auction</Trans>
        </DescriptionListTerm>
        <DescriptionListDescription>
          {auction?.auctionNumber}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>
          <Trans>Customer Reference</Trans>
        </DescriptionListTerm>
        <DescriptionListDescription>
          {auction?.customerReference}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>
          <Trans>Surname</Trans>
        </DescriptionListTerm>
        <DescriptionListDescription>
          {auction?.surname}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>
          <Trans>Given Names</Trans>
        </DescriptionListTerm>
        <DescriptionListDescription>
          {auction?.givenNames}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>
          <Trans>Title</Trans>
        </DescriptionListTerm>
        <DescriptionListDescription>
          {auction
            ? {
                Doctor: <Trans>Doctor</Trans>,
                Mister: <Trans>Mister</Trans>,
                Miss: <Trans>Miss</Trans>,
                Misses: <Trans>Misses</Trans>,
              }[auction.title]
            : null}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>
          <Trans>Gender</Trans>
        </DescriptionListTerm>
        <DescriptionListDescription>
          {auction
            ? {
                Male: <Trans>Male</Trans>,
                Female: <Trans>Female</Trans>,
              }[auction.gender]
            : null}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>
          <Trans>Date of Birth</Trans>
        </DescriptionListTerm>
        <DescriptionListDescription>
          {auction?.dateOfBirth}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>
          <Trans>Status</Trans>
        </DescriptionListTerm>
        <DescriptionListDescription>
          {auction?.active ? _(msg`Active`) : _(msg`Inactive`)}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>
          <Trans>High Risk Auction</Trans>
        </DescriptionListTerm>
        <DescriptionListDescription>
          {auction?.risk === 'high' ? _(msg`Yes`) : _(msg`No`)}
        </DescriptionListDescription>
      </DescriptionListGroup>
    </DescriptionList>
  );
};
