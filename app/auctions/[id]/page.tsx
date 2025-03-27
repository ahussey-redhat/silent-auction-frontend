'use client'
import DetailsPage from '@patternfly/react-component-groups/dist/dynamic/DetailsPage';
import {
  Flex,
  FlexItem,
  PageSection,
  Skeleton,
} from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import { TimesCircleIcon } from '@patternfly/react-icons/dist/esm/icons/times-circle-icon';
import { useCallback, useState } from 'react';
import BidsDataList from './bids-data-list';
import PlaceBidModal from './place-bid-modal';
import { AuctionDescriptionList, SkeletonDescriptionList } from '@app/components/Auction';
import { useAuth } from '@app/providers/Auth';
import { useAuctions } from '@app/providers/Auctions';
// import './page.css';

export default async function AuctionDetailsPage ({
  params,
}: {
  params: Promise<{ auctionId: string }>
}){
  const { auctionId } = await params;

  console.log(auctionId);

  const { user } = useAuth();
  const { getAuctionDetails, placeBid } = useAuctions();

  const auction = getAuctionDetails(auctionId);
  console.log(auction);

  const [placeBidModalIsOpen, setPlaceBidModalIsOpen] = useState(false);

  const togglePlaceBidModalIsOpen = useCallback(
    () => setPlaceBidModalIsOpen(!placeBidModalIsOpen),
    [placeBidModalIsOpen, setPlaceBidModalIsOpen],
  );

  return (
    <PageSection hasBodyWrapper={false}>
      {!auction ? (
        <DetailsPage
          pageHeading={{
            title: 'loading',
            label: {
              variant: 'outline',
              color: 'grey',
              children: <Skeleton screenreaderText="Loading auction status" />,
              icon: <CheckCircleIcon color="var(--pf-t--color--grey--60)" />,
            },
          }}
          actionButtons={[
            {
              children: "Place a bid",
              onClick: togglePlaceBidModalIsOpen,
              tooltip: "Place a bid",
              isDisabled: true,
            },
          ]}
          tabs={[
            {
              eventKey: 'details',
              title: "Details",
              children: (
                <Flex
                  className="details-tab"
                  spaceItems={{ default: 'spaceItemsLg' }}
                  direction={{ default: 'column' }}
                >
                  <FlexItem>
                    <SkeletonDescriptionList />
                  </FlexItem>
                </Flex>
              ),
            },
          ]}
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
                    children: 'Open',
                    icon: (
                      <CheckCircleIcon color="var(--pf-t--color--green--60)" />
                    ),
                  }
                : {
                    variant: 'outline',
                    color: 'red',
                    children: "Closed",
                    icon: (
                      <TimesCircleIcon color="var(--pf-t--color--red--60)" />
                    ),
                  },
            }}
            actionButtons={[
              {
                children: 'Place a bid',
                onClick: togglePlaceBidModalIsOpen,
                tooltip: 'Place a bid',
                isDisabled: !auction.isActive,
              },
            ]}
            tabs={[
              {
                eventKey: 'details',
                title: 'Details',
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
              ...[
                user?.groups?.includes('admin')
                  ? {
                      eventKey: 'bids',
                      title: 'Bids',
                      children: (
                        <Flex
                          className="details-tab"
                          spaceItems={{ default: 'spaceItemsLg' }}
                          direction={{ default: 'column' }}
                        >
                          <FlexItem>
                            <BidsDataList auctionId={auctionId}/>
                          </FlexItem>
                        </Flex>
                      ),
                    }
                  : null,
              ].filter(tab => tab !== null),
            ]}
          />
          <PlaceBidModal
            isOpen={placeBidModalIsOpen}
            onClose={togglePlaceBidModalIsOpen}
            currentHighestBid={auction.highestBid}
            startingBid={auction.startingBid}
            onPlaceBid={bidAmount =>
              placeBid(auction.id, { bid_amount: bidAmount }).then(() =>
                getAuctionDetails(auction.id),
              )
            }
            placingBid={placingBid}
          />
        </>
      ) : null}
    </PageSection>
  );
};
