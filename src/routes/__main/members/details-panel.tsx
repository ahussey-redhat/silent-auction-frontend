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
import { LocaleLink, MemberDescriptionList } from '@/components';
import type { Member } from '@/types';

export type DetailsPanelProps = {
  member: Member;
  onCloseDrawer: MouseEventHandler<HTMLDivElement>;
};

export default ({ member, onCloseDrawer }: DetailsPanelProps) => (
  <DrawerPanelContent>
    <DrawerHead>
      <Title headingLevel="h2" size="xl">
        {member ? (
          <LocaleLink prefetch="intent" to={`/members/${member?.id}`}>
            {member?.surname}, {member?.givenNames}
          </LocaleLink>
        ) : (
          ''
        )}
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
          <MemberDescriptionList member={member} />
        </FlexItem>
      </Flex>
    </DrawerPanelBody>
  </DrawerPanelContent>
);
