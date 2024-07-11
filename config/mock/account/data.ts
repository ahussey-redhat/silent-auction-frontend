import Chance from 'chance';
import type { Account, AccountTransaction } from '@/types';

const chance = new Chance();

export const generateAccount = (minDate: Date, maxDate: Date): Account => {
  const transactions: AccountTransaction[] = [];

  let numberOfContributions = 0;
  numberOfContributions = (maxDate.getFullYear() - minDate.getFullYear()) * 12;
  numberOfContributions -= minDate.getMonth();
  numberOfContributions += maxDate.getMonth();
  numberOfContributions =
    numberOfContributions <= 0 ? 0 : numberOfContributions;

  const effectiveDate = new Date(minDate);
  const employerName = chance.company();

  for (let i = 0; i < numberOfContributions; i++) {
    transactions.push({
      id: chance.guid(),
      effectiveDate: [
        effectiveDate.getDate(),
        effectiveDate.getMonth() + 1,
        effectiveDate.getFullYear(),
      ].join('/'),
      totalValue: chance.integer({ min: 0, max: 1000 }),
      employerName,
      type: 'Contribution',
    });

    const day = effectiveDate.getDate();

    effectiveDate.setMonth(effectiveDate.getMonth() + 1);

    if (effectiveDate.getDate() !== day) {
      effectiveDate.setDate(0);
    }
  }

  return {
    id: chance.guid(),
    balance: transactions.reduce<number>(
      (balance, transaction) =>
        transaction.type === 'Contribution'
          ? balance + transaction.totalValue
          : balance - transaction.totalValue,
      0,
    ),
    transactions,
  };
};
