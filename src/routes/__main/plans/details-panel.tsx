import {
  DrawerActions,
  DrawerCloseButton,
  DrawerHead,
  DrawerPanelBody,
  DrawerPanelContent,
  Flex,
  FlexItem,
  Title,
} from '@patternfly/react-core';
import { MouseEventHandler } from 'react';
import { LocaleLink, PlanDescriptionList } from '@/components';
import type { Plan } from '@/types';

export type DetailsPanelProps = {
  plan: Plan;
  onCloseDrawer: MouseEventHandler<HTMLDivElement>;
};

export default ({ plan, onCloseDrawer }: DetailsPanelProps) => (
  <DrawerPanelContent>
    <DrawerHead>
      <Title headingLevel="h2" size="xl">
        <LocaleLink prefetch="intent" to={`/plans/${plan.id}`}>
          {plan.description}
        </LocaleLink>
      </Title>
      <DrawerActions>
        <DrawerCloseButton onClick={onCloseDrawer} />
      </DrawerActions>
    </DrawerHead>
    <DrawerPanelBody>
      <Flex
        spaceItems={{ default: 'spaceItemsLg' }}
        direction={{ default: 'column' }}
      >
        <FlexItem>
          <PlanDescriptionList plan={plan} />
        </FlexItem>
      </Flex>
    </DrawerPanelBody>
  </DrawerPanelContent>
);
