import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from '@patternfly/react-core';
import { Member } from '@/types';

export type MemberDescriptionListProps = {
  member: Member;
};

export default ({ member }: MemberDescriptionListProps) => {
  const { _ } = useLingui();

  return (
    <DescriptionList isHorizontal>
      <DescriptionListGroup>
        <DescriptionListTerm>
          <Trans>Member</Trans>
        </DescriptionListTerm>
        <DescriptionListDescription>
          {member?.memberNumber}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>
          <Trans>Customer Reference</Trans>
        </DescriptionListTerm>
        <DescriptionListDescription>
          {member?.customerReference}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>
          <Trans>Surname</Trans>
        </DescriptionListTerm>
        <DescriptionListDescription>
          {member?.surname}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>
          <Trans>Given Names</Trans>
        </DescriptionListTerm>
        <DescriptionListDescription>
          {member?.givenNames}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>
          <Trans>Title</Trans>
        </DescriptionListTerm>
        <DescriptionListDescription>
          {member
            ? {
                Doctor: <Trans>Doctor</Trans>,
                Mister: <Trans>Mister</Trans>,
                Miss: <Trans>Miss</Trans>,
                Misses: <Trans>Misses</Trans>,
              }[member.title]
            : null}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>
          <Trans>Gender</Trans>
        </DescriptionListTerm>
        <DescriptionListDescription>
          {member
            ? {
                Male: <Trans>Male</Trans>,
                Female: <Trans>Female</Trans>,
              }[member.gender]
            : null}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>
          <Trans>Date of Birth</Trans>
        </DescriptionListTerm>
        <DescriptionListDescription>
          {member?.dateOfBirth}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>
          <Trans>Status</Trans>
        </DescriptionListTerm>
        <DescriptionListDescription>
          {member?.active ? _(msg`Active`) : _(msg`Inactive`)}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>
          <Trans>High Risk Member</Trans>
        </DescriptionListTerm>
        <DescriptionListDescription>
          {member?.risk === 'high' ? _(msg`Yes`) : _(msg`No`)}
        </DescriptionListDescription>
      </DescriptionListGroup>
    </DescriptionList>
  );
};
