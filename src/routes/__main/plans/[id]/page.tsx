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
import { Suspense } from 'react';
import { DeferredLoaderData, LoaderData } from './page.data';
import PlanMembersDataList from './plan-members-data-list';
import './page.css';
import { PlanDescriptionList } from '@/components';

export default () => {
  const { _ } = useLingui();
  const data = useLoaderData() as DeferredLoaderData;

  return (
    <PageSection>
      <Suspense
        fallback={<EmptyState titleText={_(msg`Loading`)} icon={Spinner} />}
      >
        <Await resolve={data.plan}>
          {(plan: LoaderData['plan']) => (
            <DetailsPage
              pageHeading={{
                title: plan.description,
              }}
              actionButtons={[
                {
                  children: <Trans>Primary action</Trans>,
                  onClick: () => console.log('Primary action clicked'),
                  tooltip: <Trans>Click me!</Trans>,
                },
              ]}
              actionMenu={{
                id: 'plan-details-page-action-menu',
                actions: [
                  {
                    children: <Trans>Edit plan</Trans>,
                    itemId: 'plan-details-page-action-menu-example-1',
                    onClick: () => console.log('Edit plan clicked'),
                  },
                  {
                    children: <Trans>Delete plan</Trans>,
                    itemId: 'plan-details-page-action-menu-example-2',
                    onClick: () => console.log('Delete plan clicked'),
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
                        <PlanDescriptionList plan={plan} />
                      </FlexItem>
                    </Flex>
                  ),
                },
                {
                  eventKey: 'plan-members',
                  title: <Trans>Members</Trans>,
                  children: (
                    <Flex
                      className="plan-members-tab"
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
                          <Await resolve={data.planMembers}>
                            {(planMembers: LoaderData['planMembers']) => (
                              <PlanMembersDataList planMembers={planMembers} />
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
