import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useModel } from '@modern-js/runtime/model';
import { useNavigate, useParams } from '@modern-js/runtime/router';
import DetailsPage from '@patternfly/react-component-groups/dist/dynamic/DetailsPage';
import ErrorState from '@patternfly/react-component-groups/dist/dynamic/ErrorState';
import NotAuthorized from '@patternfly/react-component-groups/dist/dynamic/NotAuthorized';
import {
  Button,
  EmptyState,
  Flex,
  FlexItem,
  PageSection,
  Spinner,
} from '@patternfly/react-core';
import { useEffect } from 'react';
import { useUnmount } from 'react-use';
import { AuctionDescriptionList } from '@/components';
import auctionModel from '@/models/auction';
import './page.css';

export default () => {
  const { _ } = useLingui();
  const navigate = useNavigate();
  const { id: auctionId } = useParams();
  const [
    {
      auction: { value: auction, error, loading },
    },
    { getAuction, clearAuction },
  ] = useModel(auctionModel);

  useEffect(() => {
    if (auctionId) {
      getAuction(auctionId);
    }
  }, [auctionId]);

  useUnmount(() => {
    clearAuction();
  });

  function active(auctionStart: string, auctionEnd: string): boolean {
    const currentDate: Date = new Date();
    const auctionStartDate: Date = new Date(auctionStart);
    const auctionEndDate: Date = new Date(auctionEnd);

    if (auctionStartDate >= currentDate && currentDate <= auctionEndDate) {
      return true;
    }
    return false;
  }

  return (
    <PageSection>
      {loading ? (
        <EmptyState titleText={_(msg`Loading`)} icon={Spinner} />
      ) : null}
      {error?.status === 401 ? (
        <NotAuthorized
          bodyText={_(msg`Unauthorized`)}
          serviceName={_(msg`Auction`)}
        />
      ) : null}
      {error?.status === 403 ? (
        <NotAuthorized
          bodyText={_(msg`Forbidden`)}
          serviceName={_(msg`Auction`)}
        />
      ) : null}
      {error && error.status !== 401 && error.status !== 403 ? (
        <ErrorState
          titleText={_(msg`This page is temporarily unavailable`)}
          bodyText={_(
            msg`Try refreshing the page. If the problem persists, please ask for help.`,
          )}
          customFooter={
            <Button onClick={() => navigate('/')}>
              <Trans>Go to home page</Trans>
            </Button>
          }
        />
      ) : null}
      {auction ? (
        <DetailsPage
          pageHeading={{
            title: auction.item_name,
          }}
          actionButtons={[
            {
              children: <Trans>Place a bid</Trans>,
              onClick: () => console.log('Primary action clicked'),
              tooltip: <Trans>Place a bid</Trans>,
              isDisabled: active(auction.auction_start, auction.auction_end),
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
      ) : null}
    </PageSection>
  );
};
