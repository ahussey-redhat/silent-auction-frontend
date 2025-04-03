import {
  Content,
  ContentVariants,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from '@patternfly/react-core';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Auction } from '@app/types';
import { useAuth } from '@app/providers/Auth';
import { useAuctions } from '@app/providers/Auctions';

export type AuctionDescriptionListProps = {
  auction: Auction;
};

export default ({ auction }: AuctionDescriptionListProps) => {
  const { isAuthenticated } = useAuth();
  const { getHighestBidForAuction } = useAuctions();

  const [auctionData, setAuctionData] = useState<Auction | null>(null);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Don't run the effect if user is not authenticated
    if (!isAuthenticated) return;

    const fetchAuctionData = async () => {
      try {
        setLoading(true);
        // Handle both Promise and Axios response cases
        if (auction instanceof Promise) {
          const resolvedAuction = await auction;
          // Check if this is an Axios response with data property
          setAuctionData(resolvedAuction.data || resolvedAuction);
        } else {
          // Handle case where auction is already the data object
          setAuctionData(auction);
        }

        const highestBid = getHighestBidForAuction(String(auction.id));
        const newBidAmount = highestBid?.amount || auction.startingBid;
        setBidAmount(newBidAmount);
      } catch (error) {
        console.error("Error resolving auction data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctionData();
  }, [auction, isAuthenticated, getHighestBidForAuction]);

  if (!isAuthenticated || auctionData == null) return null;

  return (
    <DescriptionList isHorizontal>
      <DescriptionListGroup>
        <Image alt={`${auctionData.name}'s image`} src={auctionData.imageUrl.toString()} width={100} height={100} />
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>
          <strong>Current highest bid</strong>
        </DescriptionListTerm>
        <DescriptionListDescription>
          <strong>${bidAmount ?? 0}</strong>
        </DescriptionListDescription>
      </DescriptionListGroup>
      {/* Rest of your component remains the same */}
      <DescriptionListGroup>
        <DescriptionListTerm>
          Description
        </DescriptionListTerm>
        <DescriptionListDescription>
          <Content component={ContentVariants.p}>{auctionData.description}</Content>
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>
          Auction Start
        </DescriptionListTerm>
        <DescriptionListDescription>
          {auctionData.start.toString()}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>
          Auction End
        </DescriptionListTerm>
        <DescriptionListDescription>
          {auctionData.end.toString()}
        </DescriptionListDescription>
      </DescriptionListGroup>
    </DescriptionList>
  );
};