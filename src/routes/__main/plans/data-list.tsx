import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Button,
  ButtonVariant,
  DataList,
  DataListAction,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Flex,
  FlexItem,
  Label,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import { KeyboardEvent, MouseEvent as ReactMouseEvent } from 'react';
import { LocaleLink } from '@/components';
import type { Plan } from '@/types';

export type DataListProps = {
  plans: Plan[];
  selectedPlanId: Plan['id'];
  onSelectPlan: (
    event: ReactMouseEvent<Element, MouseEvent> | KeyboardEvent<Element>,
    id: string,
  ) => void;
};

export default ({ plans, selectedPlanId, onSelectPlan }: DataListProps) => {
  const { _ } = useLingui();

  return (
    <DataList
      aria-label={_(msg`Plans list`)}
      selectedDataListItemId={selectedPlanId}
      onSelectDataListItem={onSelectPlan}
    >
      {plans.map(({ id, description, type }) => (
        <DataListItem key={id} id={id}>
          <DataListItemRow>
            <DataListItemCells
              dataListCells={[
                <DataListCell key="primary-content">
                  <Flex
                    spaceItems={{ default: 'spaceItemsMd' }}
                    direction={{ default: 'column' }}
                  >
                    <FlexItem>
                      <p>
                        <LocaleLink prefetch="intent" to={`/plans/${id}`}>
                          {description}
                        </LocaleLink>
                      </p>
                    </FlexItem>
                  </Flex>
                </DataListCell>,
                <DataListCell key="risk">
                  <Label>
                    {
                      {
                        industry: <Trans>Industry</Trans>,
                        retail: <Trans>Retail</Trans>,
                      }[type]
                    }
                  </Label>
                </DataListCell>,
                <DataListAction
                  key="actions"
                  aria-labelledby={`${id} ${id}-action`}
                  id={`${id}-action`}
                  aria-label={_(msg`Actions`)}
                >
                  <Stack>
                    <StackItem>
                      <Button variant={ButtonVariant.secondary}>
                        <Trans>Action</Trans>
                      </Button>
                    </StackItem>
                  </Stack>
                </DataListAction>,
              ]}
            />
          </DataListItemRow>
        </DataListItem>
      ))}
    </DataList>
  );
};
