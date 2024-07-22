import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useParams } from '@modern-js/runtime/router';
import DetailsPage from '@patternfly/react-component-groups/dist/dynamic/DetailsPage';
import {
  EmptyState,
  Flex,
  FlexItem,
  PageSection,
  Spinner,
} from '@patternfly/react-core';
import { useAsyncFn, useEffectOnce } from 'react-use';
import { useModel } from '@modern-js/runtime/model';
import { AuctionDescriptionList } from '@/components';
import './page.css';
import { Auction } from '@/types';
import authModel from '@/models/auth';

export default () => {
  const { _ } = useLingui();
  const [{ token }] = useModel(authModel);
  const { id: auctionId } = useParams();
  const [{ value: auction }, fetchAuction] = useAsyncFn(async () => {
    const response = await fetch(
      `${process.env.BACKEND_URL}/auctions/${auctionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (process.env.NODE_ENV !== 'development' && response.status !== 200) {
      throw response;
    }

    return (await response.json()) as Auction;
  }, [auctionId, token]);

  useEffectOnce(() => {
    fetchAuction();
  });

  return (
    <PageSection>
      {!auction ? (
        <EmptyState titleText={_(msg`Loading`)} icon={Spinner} />
      ) : (
        <DetailsPage
          pageHeading={{
            title: auction.item_name,
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
          ]}
        />
      )}
    </PageSection>
  );
};
