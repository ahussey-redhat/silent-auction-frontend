'use client'

import { useEffect, useState } from 'react';
import ApiClient from '@app/components/ApiClient';
import { useAuth } from '@app/providers/Auth';
import { Auction, AuctionDTO, Bid, BidDTO, PlaceBidRequest } from '@app/types';

type AuctionBids = {
  auction: string;
  bids: Bid[];
};

const [auctions, setAuctions] = useState<Auction[]>([]);
const [bids, setBids] = useState<AuctionBids[]>([]);

const mapAuction = ({
                      id,
                      item_name,
                      description,
                      auction_start,
                      auction_end,
                      starting_bid,
                      image_path,
                    }: AuctionDTO): Auction => {
  const current = new Date();
  const start = new Date(`${auction_start}Z`);
  const end = new Date(`${auction_end}Z`);

  return {
    id: id.toString(),
    name: item_name,
    description,
    imageUrl: URL.canParse(image_path)
      ? new URL(image_path)
      : new URL(image_path, window.location.origin),
    start,
    end,
    isActive: current >= start && current < end,
    startingBid: starting_bid,
    highestBid: null,
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

function placeBid(auctionId: string, bid: PlaceBidRequest){
  // POST request to place bid
  const response = ApiClient.post(`/api/v1/auctions/${auctionId}/bids`, bid)
  return response;
};

export default function AuctionProvider(){
    const { token } = useAuth();

    /* useEffects:
      1. Get all auctions
      2. Iterate through all auctions, and get specific auction details
      3. Get all bids for an auction
      4. Get specific bid for an auction
    */

    useEffect(() => {
      // Get all auctions
      //  setAuctions();
    }, [auctions, token])

    useEffect(() => {
      // Get specific auction details

    }, [token])

    useEffect(() => {
      // Get all bids for a specific auction

    }, [token])

    useEffect(() => {
      // Get specific bid for a specific auction

    }, [token])

    // Place a bid

};
