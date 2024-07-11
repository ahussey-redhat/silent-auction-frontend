import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from '@patternfly/react-core';
import { Plan } from '@/types';

export type PlanDescriptionListProps = {
  plan: Plan;
};

export default ({ plan }: PlanDescriptionListProps) => {
  const { _ } = useLingui();

  return (
    <DescriptionList isHorizontal>
      <DescriptionListGroup>
        <DescriptionListTerm>
          <Trans>Type</Trans>
        </DescriptionListTerm>
        <DescriptionListDescription>
          {_(
            {
              industry: msg`Industry`,
              retail: msg`Retail`,
            }[plan.type],
          )}
        </DescriptionListDescription>
      </DescriptionListGroup>
    </DescriptionList>
  );
};
