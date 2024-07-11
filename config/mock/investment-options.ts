import Chance from 'chance';
import { simulatedLatency, simulateError, simulateNotFound } from './simulate';
import { handleGet, handleGetId } from './utils';
import type { InvestmentOption } from '@/types';

const chance = new Chance();

const investmentOptions: InvestmentOption[] = [
  {
    id: chance.guid(),
    description: 'Defensive',
    category: 'Diversified',
  },
  {
    id: chance.guid(),
    description: 'Diversified 50',
    category: 'Diversified',
  },
  {
    id: chance.guid(),
    description: 'Balanced Growth',
    category: 'Diversified',
  },
  {
    id: chance.guid(),
    description: 'Growth',
    category: 'Diversified',
  },
  {
    id: chance.guid(),
    description: 'High Growth',
    category: 'Diversified',
  },
  {
    id: chance.guid(),
    description: 'Australian Cash',
    category: 'Sector',
  },
  {
    id: chance.guid(),
    description: 'Aust Floating Rate',
    category: 'Sector',
  },
  {
    id: chance.guid(),
    description: 'Aust Fix Income',
    category: 'Sector',
  },
  {
    id: chance.guid(),
    description: 'Global Fix IncomeA$H',
    category: 'Sector',
  },
  {
    id: chance.guid(),
    description: 'List Int Pro Sec A$H',
    category: 'Sector',
  },
  {
    id: chance.guid(),
    description: 'Global Shares',
    category: 'Sector',
  },
  {
    id: chance.guid(),
    description: 'Global Shares A$H',
    category: 'Sector',
  },
  {
    id: chance.guid(),
    description: 'Emerging Markets',
    category: 'Sector',
  },
  {
    id: chance.guid(),
    description: 'Australian Shares',
    category: 'Sector',
  },
  {
    id: chance.guid(),
    description: 'Low Carbon Glob Sha',
    category: 'Responsible Investment',
  },
  {
    id: chance.guid(),
    description: 'Low Crbn Aust Sh',
    category: 'Responsible Investment',
  },
  {
    id: chance.guid(),
    description: 'Index Aust Shares',
    category: 'Single Manager, Indexed, Third Party',
  },
  {
    id: chance.guid(),
    description: 'Index Global Shares',
    category: 'Single Manager, Indexed, Third Party',
  },
  {
    id: chance.guid(),
    description: 'Index Global A$H',
    category: 'Single Manager, Indexed, Third Party',
  },
  {
    id: chance.guid(),
    description: 'GoalTracker',
    category: 'Personalised',
  },
];

investmentOptions.sort((a, b) => {
  if (a.id < b.id) {
    return -1;
  }

  if (a.id > b.id) {
    return 1;
  }

  return 0;
});

export { investmentOptions };

export default {
  '/api/investmentOptions': handleGet(url => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (simulateError) {
          reject(new Error('Simulated Error'));
        } else if (simulateNotFound) {
          resolve(null);
        }

        const searchParam = url.searchParams.get('search')?.toLowerCase();
        const categoryParam = url.searchParams.get('category')?.toLowerCase();

        if (!searchParam && !categoryParam) {
          resolve(investmentOptions);
        }

        resolve(
          investmentOptions.filter(({ description, category }) => {
            let meetsFilterCriteria = true;

            if (searchParam) {
              meetsFilterCriteria = description
                .toLowerCase()
                .includes(searchParam);
            }

            if (
              categoryParam === 'Diversified' ||
              categoryParam === 'Sector' ||
              categoryParam === 'Responsible Investment' ||
              categoryParam === 'Single Manager, Indexed, Third Party' ||
              categoryParam === 'Personalised'
            ) {
              meetsFilterCriteria =
                meetsFilterCriteria && categoryParam === category;
            }

            return meetsFilterCriteria;
          }),
        );
      }, simulatedLatency);
    });
  }),
  '/api/investmentOptions/:id': handleGetId(investmentOptions),
};
