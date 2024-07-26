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
  useInterval,
} from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import { TimesCircleIcon } from '@patternfly/react-icons/dist/esm/icons/times-circle-icon';
import { useCallback, useEffect, useState } from 'react';
import { useUnmount } from 'react-use';
import PlaceBidModal from './place-bid-modal';
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
      bid: { loading: placingBid },
    },
    { getAuction, clearAuction, placeBid, updateHighestBid },
  ] = useModel(auctionModel);
  const [placeBidModalIsOpen, setPlaceBidModalIsOpen] = useState(false);

  const togglePlaceBidModalIsOpen = useCallback(
    () => setPlaceBidModalIsOpen(!placeBidModalIsOpen),
    [placeBidModalIsOpen, setPlaceBidModalIsOpen],
  );

  useEffect(() => {
    if (auctionId) {
      getAuction(auctionId);
    }
  }, [auctionId]);

  useInterval(() => {
    if (auctionId) {
      updateHighestBid(auctionId);
    }
  }, 10000);

  useUnmount(() => {
    clearAuction();
  });

  return (
    <PageSection>
      {!auction && loading ? (
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
        <>
          <DetailsPage
            pageHeading={{
              title: auction.name,
              label: auction.isActive
                ? {
                    variant: 'outline',
                    color: 'green',
                    children: <Trans>Open</Trans>,
                    icon: (
                      <CheckCircleIcon color="var(--pf-t--color--green--60)" />
                    ),
                  }
                : {
                    variant: 'outline',
                    color: 'red',
                    children: <Trans>Closed</Trans>,
                    icon: (
                      <TimesCircleIcon color="var(--pf-t--color--red--60)" />
                    ),
                  },
            }}
            actionButtons={[
              {
                children: <Trans>Place a bid</Trans>,
                onClick: togglePlaceBidModalIsOpen,
                tooltip: <Trans>Place a bid</Trans>,
                isDisabled: !auction.isActive,
              },
            ]}
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
          <PlaceBidModal
            isOpen={placeBidModalIsOpen}
            onClose={togglePlaceBidModalIsOpen}
            currentHighestBid={auction.highestBid}
            onPlaceBid={bidAmount =>
              placeBid(auction.id, { bid_amount: bidAmount }).then(() =>
                getAuction(auction.id),
              )
            }
            placingBid={placingBid}
          />
        </>
      ) : null}
    </PageSection>
  );
};
