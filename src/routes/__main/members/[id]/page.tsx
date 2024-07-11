import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Await, useLoaderData } from '@modern-js/runtime/router';
import DetailsPage from '@patternfly/react-component-groups/dist/dynamic/DetailsPage';
import {
  EmptyState,
  Flex,
  FlexItem,
  PageSection,
  Spinner,
} from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import { TimesCircleIcon } from '@patternfly/react-icons/dist/esm/icons/times-circle-icon';
import { Suspense } from 'react';
import { DeferredLoaderData, LoaderData } from './page.data';
import MemberPlansDataList from './member-plans-data-list';
import { MemberDescriptionList } from '@/components';
import './page.css';

export default () => {
  const { _ } = useLingui();
  const data = useLoaderData() as DeferredLoaderData;

  return (
    <PageSection>
      <Suspense
        fallback={<EmptyState titleText={_(msg`Loading`)} icon={Spinner} />}
      >
        <Await resolve={data.member}>
          {(member: LoaderData['member']) => (
            <DetailsPage
              pageHeading={{
                title: `${member.surname}, ${member.givenNames}`,
                label: member.active
                  ? {
                      children: <Trans>Active</Trans>,
                      icon: (
                        <CheckCircleIcon color="var(--pf-t--color--green--60)" />
                      ),
                      isCompact: true,
                    }
                  : {
                      children: <Trans>Inactive</Trans>,
                      icon: (
                        <TimesCircleIcon color="var(--pf-t--color--red--60)" />
                      ),
                      isCompact: true,
                    },
              }}
              actionButtons={[
                {
                  children: <Trans>Primary action</Trans>,
                  onClick: () => console.log('Primary action clicked'),
                  tooltip: <Trans>Click me!</Trans>,
                },
              ]}
              actionMenu={{
                id: 'member-details-page-action-menu',
                label: _(msg`Actions`),
                actions: [
                  {
                    children: <Trans>Edit member</Trans>,
                    itemId: 'member-details-page-action-menu-example-1',
                    onClick: () => console.log('Edit member clicked'),
                  },
                  {
                    children: <Trans>Delete member</Trans>,
                    itemId: 'member-details-page-action-menu-example-2',
                    onClick: () => console.log('Delete member clicked'),
                    isDisabled: true,
                  },
                ],
              }}
              tabs={[
                {
                  eventKey: 'details',
                  title: <Trans>Details</Trans>,
                  children: (
                    <Flex
                      className="details-tab"
                      spaceItems={{ default: 'spaceItemsLg' }}
                      direction={{ default: 'column' }}
                    >
                      <FlexItem>
                        <MemberDescriptionList member={member} />
                      </FlexItem>
                    </Flex>
                  ),
                },
                {
                  eventKey: 'member-plans',
                  title: <Trans>Plans</Trans>,
                  children: (
                    <Flex
                      className="member-plans-tab"
                      spaceItems={{ default: 'spaceItemsLg' }}
                      direction={{ default: 'column' }}
                    >
                      <FlexItem>
                        <Suspense
                          fallback={
                            <EmptyState
                              titleText={_(msg`Loading`)}
                              icon={Spinner}
                            />
                          }
                        >
                          <Await resolve={data.memberPlans}>
                            {(memberPlans: LoaderData['memberPlans']) => (
                              <MemberPlansDataList memberPlans={memberPlans} />
                            )}
                          </Await>
                        </Suspense>
                      </FlexItem>
                    </Flex>
                  ),
                },
              ]}
            />
          )}
        </Await>
      </Suspense>
    </PageSection>
  );
};
