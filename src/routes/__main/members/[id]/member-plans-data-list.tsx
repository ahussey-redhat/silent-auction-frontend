import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  DataList,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Flex,
  FlexItem,
  Label,
} from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import { TimesCircleIcon } from '@patternfly/react-icons/dist/esm/icons/times-circle-icon';
import type { MemberPlan } from '@/types';
import { LocaleLink } from '@/components';

export type DataListProps = {
  memberPlans: MemberPlan[];
};

export default ({ memberPlans }: DataListProps) => {
  const { _ } = useLingui();

  return (
    <DataList aria-label={_(msg`Member plans list`)}>
      {memberPlans.map(({ id, planId, description, joinDate, active }) => (
        <DataListItem key={id} id={id}>
          <DataListItemRow>
            <DataListItemCells
              dataListCells={[
                <DataListCell key="plan-details">
                  <Flex
                    spaceItems={{
                      default: 'spaceItemsMd',
                    }}
                    direction={{ default: 'column' }}
                  >
                    <FlexItem>
                      <p>
                        <LocaleLink prefetch="intent" to={`/plans/${planId}`}>
                          {description}
                        </LocaleLink>
                      </p>
                      <small>
                        <Trans>Join Date: {joinDate}</Trans>
                      </small>
                    </FlexItem>
                  </Flex>
                </DataListCell>,
                <DataListCell key="status">
                  <Label
                    icon={
                      active ? (
                        <CheckCircleIcon color="var(--pf-t--color--green--60)" />
                      ) : (
                        <TimesCircleIcon color="var(--pf-t--color--red--60)" />
                      )
                    }
                  >
                    {active ? <Trans>Active</Trans> : <Trans>Inactive</Trans>}
                  </Label>
                </DataListCell>,
              ]}
            />
          </DataListItemRow>
        </DataListItem>
      ))}
    </DataList>
  );
};
