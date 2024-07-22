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
import AuctionPlansDataList from './auction-plans-data-list';
import { AuctionDescriptionList } from '@/components';
import './page.css';

export default () => {
  const { _ } = useLingui();
  const data = useLoaderData() as DeferredLoaderData;

  return (
    <PageSection>
      <Suspense
        fallback={<EmptyState titleText={_(msg`Loading`)} icon={Spinner} />}
      >
        <Await resolve={data.auction}>
          {(auction: LoaderData['auction']) => (
            <DetailsPage
              pageHeading={{
                title: `${auction.surname}, ${auction.givenNames}`,
                label: auction.active
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
                id: 'auction-details-page-action-menu',
                label: _(msg`Actions`),
                actions: [
                  {
                    children: <Trans>Edit auction</Trans>,
                    itemId: 'auction-details-page-action-menu-example-1',
                    onClick: () => console.log('Edit auction clicked'),
                  },
                  {
                    children: <Trans>Delete auction</Trans>,
                    itemId: 'auction-details-page-action-menu-example-2',
                    onClick: () => console.log('Delete auction clicked'),
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
                        <AuctionDescriptionList auction={auction} />
                      </FlexItem>
                    </Flex>
                  ),
                },
                {
                  eventKey: 'auction-plans',
                  title: <Trans>Plans</Trans>,
                  children: (
                    <Flex
                      className="auction-plans-tab"
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
                          <Await resolve={data.auctionPlans}>
                            {(auctionPlans: LoaderData['auctionPlans']) => (
                              <AuctionPlansDataList
                                auctionPlans={auctionPlans}
                              />
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
