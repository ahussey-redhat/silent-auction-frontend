'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import ApiClient, { configureHeaders } from '@app/components/ApiClient';
import { useAuth } from '@app/providers/Auth';
import { User, UserDTO, Bid, BidDTO } from '@app/types';

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

export function UsersProvider({ children }: UsersProviderProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { token } = useAuth();

  const mapUser = ({
                        id,
                        username,
                        first_name,
                        last_name,
                        table_number,
                      }: UserDTO): { id: string; username: string, firstName: string; lastName: string; tableNumber: number } => {
    return {
      id: id.toString(),
      username: username,
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

  async function getUserDetails(userId: string) {
    try {
      if (!token) throw new Error('Authentication required');
      configureHeaders(token);
      const response = await ApiClient.get(`/api/v1/users/${userId}`);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch user details'));
      throw err;
    }
  }

  // Fetch all users
  useEffect(() => {
    let mounted = true;
    const getUsers = async () => {
      if (!token || !mounted) return;
      setLoading(true);
      try {
        configureHeaders(token);
        const response = await ApiClient.get('/api/v1/users');
        if (mounted) {
          const mappedUsers = response.data.map(mapUser);
          setUsers(mappedUsers);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch users'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getUsers();

    return () => {
      mounted = false;
    };
  }, [token]);



  const value = {
    users,
    loading,
    error
  };

  return (
    <UsersContext.Provider value={value}>
      {children}
    </UsersContext.Provider>
  );
}

export default UsersProvider;