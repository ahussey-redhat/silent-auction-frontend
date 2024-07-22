import Chance from 'chance';
import { generateAccount } from '../account';
import { planAuctions, plans } from '../plans';
import type { Auction, AuctionPlan, Plan } from '@/types';

const chance = new Chance();
const currentDate = new Date();
const currentYear = currentDate.getFullYear();

const auctions: Auction[] = [];
let _auctionPlans: AuctionPlan[] = [];

const generateAuctionPlans = (
  auctionId: Auction['id'],
  plan: Plan,
  minJoinDate: Date,
  maxJoinDate: Date,
) => {
  const auctionPlans = chance.pickset(
    plans,
    chance.integer({ min: 0, max: 5 }),
  );

  if (!auctionPlans.some(({ id }) => id === plan.id)) {
    auctionPlans.push(plan);
    auctionPlans.reverse();
  }

  return auctionPlans.map(plan =>
    generateAuctionPlan(auctionId, plan, minJoinDate, maxJoinDate),
  );
};

const generateAuctionPlan = (
  auctionId: Auction['id'],
  plan: Plan,
  minJoinDate: Date,
  maxJoinDate: Date,
): AuctionPlan => {
  const joinDate = chance.date({
    min: minJoinDate,
    max: maxJoinDate,
  }) as Date;

  const activeLikelihood =
    ((joinDate.getFullYear() - minJoinDate.getFullYear()) /
      (maxJoinDate.getFullYear() - minJoinDate.getFullYear())) *
    100;

  return {
    ...plan,
    id: chance.guid(),
    auctionId,
    planId: plan.id,
    active: chance.bool({
      likelihood: activeLikelihood,
    }),
    joinDate: [
      joinDate.getDate(),
      joinDate.getMonth() + 1,
      joinDate.getFullYear(),
    ].join('/'),
    account: generateAccount(joinDate, maxJoinDate),
  };
};

export const generateAuctionData = (plan: Plan): [Auction, AuctionPlan[]] => {
  const auctionId = chance.guid();
  const gender = chance.gender() as Auction['gender'];
  const genderOption = gender.toLowerCase() as Lowercase<Auction['gender']>;
  const surname = chance.last();
  const givenNames = chance.name({ gender: genderOption });
  const dateOfBirth = chance.birthday({
    year: chance.year({ min: currentYear - 100, max: currentYear - 18 }),
  }) as Date;
  const eighteenthBirthday = new Date(
    dateOfBirth.getFullYear() + 18,
    dateOfBirth.getMonth(),
    dateOfBirth.getDate(),
  );
  const eightiethBirthday = new Date(
    dateOfBirth.getFullYear() + 80,
    dateOfBirth.getMonth(),
    dateOfBirth.getDate(),
  );
  const isHighRisk = chance.bool({ likelihood: 10 });
  const otherRisk = chance.bool() ? 'medium' : 'low';

  const auctionPlans: AuctionPlan[] = generateAuctionPlans(
    auctionId,
    plan,
    eighteenthBirthday > currentDate ? currentDate : eighteenthBirthday,
    eightiethBirthday > currentDate ? currentDate : eightiethBirthday,
  );

  const auction: Auction = {
    id: auctionId,
    auctionNumber: chance.integer({ min: 10000000, max: 99999999 }).toString(),
    customerReference: chance
      .integer({ min: 10000000, max: 99999999 })
      .toString(),
    surname,
    givenNames,
    title: chance.prefix({
      gender: genderOption,
      full: true,
    }) as Auction['title'],
    gender,
    dateOfBirth: [
      dateOfBirth.getDate(),
      dateOfBirth.getMonth() + 1,
      dateOfBirth.getFullYear(),
    ].join('/'),
    active: auctionPlans.some(({ active }) => active),
    risk: isHighRisk ? 'high' : otherRisk,
  };

  auctionPlans.forEach(auctionPlan => {
    planAuctions.push({
      ...auction,
      id: chance.guid(),
      planId: auctionPlan.planId,
      auctionId: auctionPlan.auctionId,
      active: auctionPlan.active,
      joinDate: auctionPlan.joinDate,
    });
  });

  return [auction, auctionPlans];
};

plans.forEach(plan => {
  for (let i = 0; i < chance.integer({ min: 1, max: 2 }); i++) {
    const [auction, auctionPlans] = generateAuctionData(plan);
    auctions.push(auction);
    _auctionPlans = _auctionPlans.concat(auctionPlans);
  }
});

const auctionPlans = _auctionPlans;

export { auctions, auctionPlans };
