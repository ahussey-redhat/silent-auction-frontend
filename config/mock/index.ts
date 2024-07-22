import loginHandlers from './login';
import auctionHandlers from './auctions';
import planHandlers from './plans';

export default {
  ...loginHandlers,
  ...auctionHandlers,
  ...planHandlers,
};
