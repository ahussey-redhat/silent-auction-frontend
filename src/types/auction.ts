export type Auction = {
  id: string;
  auctionNumber: string;
  customerReference: string;
  surname: string;
  givenNames: string;
  title: 'Doctor' | 'Mister' | 'Miss' | 'Misses';
  gender: 'Male' | 'Female';
  dateOfBirth: string;
  active: boolean;
  risk: 'low' | 'medium' | 'high';
};
