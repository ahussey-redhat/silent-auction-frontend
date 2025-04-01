'use client'

import {
  DataList,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  PageSection,
  Content,
  ContentVariants, useInterval, Timestamp,
} from '@patternfly/react-core';
import { useEffectOnce } from 'react-use';
import './page.css';
import { useAuctions } from '@app/providers/Auctions';
import { useUsers } from '@app/providers/Users';
import { useState } from 'react';
import { Bid } from '@app/types';

export default function HighestBids() {
  const { auctions, fetchBidsForAuction, getHighestBidForAuction } = useAuctions();
  const { users } = useUsers();
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Function to fetch highest bids for all auctions
  const fetchAllHighestBids = async () => {
    if (!auctions.length) return;

    setLoading(true);
    try {
      // Create an array to store promises for all bid fetch operations
      const fetchPromises = auctions.map(auction =>
        fetchBidsForAuction(auction.id)
      );

      // Wait for all fetches to complete
      await Promise.all(fetchPromises);

      // After all bids are fetched, get the highest bid for each auction
      const highestBidsForAuctions = auctions
        .map(auction => {
          // Use the getHighestBidForAuction function to get the highest bid
          const highestBid = getHighestBidForAuction(auction.id);
          return highestBid;
        })
        .filter(bid => bid !== null) as Bid[];

      setBids(highestBidsForAuctions);
    } catch (error) {
      console.error("Error fetching highest bids:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch when component mounts
  useEffectOnce(() => {
    fetchAllHighestBids();
  });

  // Set up interval to refresh bids every 30 seconds
  useInterval(() => {
    fetchAllHighestBids();
  }, 30000);

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Content component={ContentVariants.h1}>
          Highest Bids Per Auction
        </Content>
      </PageSection>
      <PageSection hasBodyWrapper={false} className="highest-bids-page" isFilled>
        {loading ? (
          <p>Loading highest bids...</p>
        ) : bids.length === 0 ? (
          <p>No bids found for any auctions.</p>
        ) : (
          <DataList aria-label={`Bids list`}>
            {bids.map(({ id, auctionId, userId, amount, time }) => (
              <DataListItem key={id} id={id}>
                <DataListItemRow>
                  <DataListItemCells
                    dataListCells={[
                      <DataListCell key="auction">
                        <p>
                          <strong>Auction</strong>:{' '}
                          {(auction =>
                            auction ? `${auction?.name}` : '')(
                            auctions.find(({ id }) => id === auctionId),
                          )}
                        </p>
                      </DataListCell>,
                      <DataListCell key="user">
                        <p>
                          <strong>User</strong>:{' '}
                          {(user =>
                            user ? `${user?.firstName} ${user?.lastName}` : '')(
                            users.find(({ id }) => id === userId),
                          )}
                        </p>
                      </DataListCell>,
                      <DataListCell key="table">
                        <p>
                          <strong>Table Number</strong>:{' '}
                          {(user =>
                            user ? `${user?.tableNumber}` : '')(
                            users.find(({ id }) => id === userId),
                          )}
                        </p>
                      </DataListCell>,
                      <DataListCell key="amount">
                        <p>
                          <strong>Amount</strong>: ${amount}
                        </p>
                      </DataListCell>,
                      <DataListCell key="time">
                        <p>
                          <strong>Time</strong>: <Timestamp date={time} />
                        </p>
                      </DataListCell>,
                    ]}
                  />
                </DataListItemRow>
              </DataListItem>
            ))}
          </DataList>
        )}
      </PageSection>
    </>
  );
};