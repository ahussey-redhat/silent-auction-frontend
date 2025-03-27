'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import ApiClient, { configureHeaders } from '@app/components/ApiClient';
import { useAuth } from '@app/providers/Auth';
import { User, UserDTO } from '@app/types';

// Define the context type
interface UsersContextType {
  users: User[];
  getUserDetails: (userId: string) => Promise<any>;
  loading: boolean;
  error: Error | null;
}

// Create the context with a default value
const UsersContext = createContext<UsersContextType | undefined>(undefined);

// Custom hook to use the auctions context
export function useUsers() {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within an UsersProvider');
  }
  return context;
}

interface UsersProviderProps {
  children: ReactNode;
}

export function AuctionsProvider({ children }: UsersProviderProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { token } = useAuth();

  const mapUser = ({
                        id,
                        first_name,
                        last_name,
                        table_number,
                      }: UserDTO): { id: string; firstName: string; lastName: string; tableNumber: number } => {
    return {
      id: id.toString(),
      firstName: first_name,
      lastName: last_name,
      tableNumber: table_number,
    };
  };

  const mapBid = ({
                    id,
                    auction_id,
                    user_id,
                    bid_time,
                    bid_amount,
                  }: BidDTO): Bid => ({
    id,
    auctionId: auction_id.toString(),
    userId: user_id.toString(),
    time: new Date(bid_time),
    amount: bid_amount,
  });

  async function getAuctionDetails(auctionId: string) {
    try {
      if (!token) throw new Error('Authentication required');
      configureHeaders(token);
      const response = await ApiClient.get(`/api/v1/auctions/${auctionId}`);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch auction details'));
      throw err;
    }
  }

  function placeBid(auctionId: string, bid: PlaceBidRequest) {
    try {
      if (!token) throw new Error('Authentication required');
      configureHeaders(token);
      const response = ApiClient.post(`/api/v1/auctions/${auctionId}/bids`, bid);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to place bid'));
      throw err;
    }
  }

  // Fetch all auctions
  useEffect(() => {
    let mounted = true;
    const getAuctions = async () => {
      if (!token || !mounted) return;
      setLoading(true);
      try {
        configureHeaders(token);
        const response = await ApiClient.get('/api/v1/auctions');
        if (mounted) {
          const mappedAuctions = response.data.map(mapAuction);
          setAuctions(mappedAuctions);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch auctions'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getAuctions();

    return () => {
      mounted = false;
    };
  }, [token]);

  // Get bids for each auction
  useEffect(() => {
    let mounted = true;

    const fetchBids = async () => {
      if (!token || !auctions.length || !mounted) return;

      setLoading(true);
      try {
        configureHeaders(token);

        // Process auctions in parallel
        const bidPromises = auctions.map(async (auction) => {
          const response = await ApiClient.get(`/api/v1/auctions/${auction.id}/bids`);
          return {
            auction: auction.id,
            bids: response.data.map(mapBid)
          };
        });

        const allBids = await Promise.all(bidPromises);

        if (mounted) {
          setBids(allBids);

          // Update auctions with highest bids
          const auctionsWithHighestBids = auctions.map(auction => {
            const auctionBids = allBids.find(b => b.auction === auction.id)?.bids || [];
            const highestBid = auctionBids.length > 0
              ? auctionBids.reduce((prev, current) =>
                (prev.amount > current.amount) ? prev : current, auctionBids[0])
              : null;

            return {
              ...auction,
              highestBid
            };
          });

          setAuctions(auctionsWithHighestBids);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch bids'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchBids();

    return () => {
      mounted = false;
    };
  }, [auctions, token]);

  const value = {
    auctions,
    bids,
    getAuctionDetails,
    placeBid,
    loading,
    error
  };

  return (
    <AuctionsContext.Provider value={value}>
      {children}
    </AuctionsContext.Provider>
  );
}

export default AuctionsProvider;