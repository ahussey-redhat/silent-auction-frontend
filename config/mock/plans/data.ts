import Chance from 'chance';
import type { Plan, PlanMember } from '@/types';

const chance = new Chance();

const plans: Plan[] = [
  {
    id: chance.guid(),
    description: 'Active Super',
    type: 'industry',
  },
  {
    id: chance.guid(),
    description: 'Australian Retirement Trust',
    type: 'industry',
  },
  {
    id: chance.guid(),
    description: 'AustralianSuper',
    type: 'industry',
  },
  { id: chance.guid(), description: 'AvSuper', type: 'industry' },
  {
    id: chance.guid(),
    description: 'AwareSuper',
    type: 'industry',
  },
  {
    id: chance.guid(),
    description: 'Brighter Super',
    type: 'industry',
  },
  {
    id: chance.guid(),
    description: 'BUSSQ Superannuation',
    type: 'industry',
  },
  {
    id: chance.guid(),
    description: 'Catholic Super',
    type: 'industry',
  },
  {
    id: chance.guid(),
    description: 'Christian Super',
    type: 'industry',
  },
  {
    id: chance.guid(),
    description: 'Child Care Super',
    type: 'industry',
  },
  {
    id: chance.guid(),
    description: 'CareSuper',
    type: 'industry',
  },
  { id: chance.guid(), description: 'Cbus', type: 'industry' },
  {
    id: chance.guid(),
    description: 'EISS Super',
    type: 'industry',
  },
  {
    id: chance.guid(),
    description: 'Equipsuper',
    type: 'industry',
  },
  {
    id: chance.guid(),
    description: 'First Super',
    type: 'industry',
  },
  { id: chance.guid(), description: 'Hesta', type: 'industry' },
  { id: chance.guid(), description: 'HostPlus', type: 'industry' },
  {
    id: chance.guid(),
    description: 'LegalSuper',
    type: 'industry',
  },
  {
    id: chance.guid(),
    description: 'Mine Super',
    type: 'industry',
  },
  {
    id: chance.guid(),
    description: 'Spirit Super',
    type: 'industry',
  },
  { id: chance.guid(), description: 'UniSuper', type: 'industry' },
  { id: chance.guid(), description: 'REISuper', type: 'industry' },
  {
    id: chance.guid(),
    description: 'RestSuper',
    type: 'industry',
  },
  { id: chance.guid(), description: 'TWUSuper', type: 'industry' },
  { id: chance.guid(), description: 'AMG Super', type: 'retail' },
  {
    id: chance.guid(),
    description: 'AMP Superannuation',
    type: 'retail',
  },
  {
    id: chance.guid(),
    description: 'ANZ Smart Choice Super',
    type: 'retail',
  },
  {
    id: chance.guid(),
    description: 'Australian Ethical Super',
    type: 'retail',
  },
  {
    id: chance.guid(),
    description: 'Bendigo SmartStart Super',
    type: 'retail',
  },
  { id: chance.guid(), description: 'BT Super', type: 'retail' },
  {
    id: chance.guid(),
    description: 'Colonial First State Superannuation',
    type: 'retail',
  },
  {
    id: chance.guid(),
    description: 'Commonwealth Bank Essential Super',
    type: 'retail',
  },
  {
    id: chance.guid(),
    description: 'Crescent Wealth Superannuation',
    type: 'retail',
  },
  {
    id: chance.guid(),
    description: 'Fiducian Superannuation',
    type: 'retail',
  },
  {
    id: chance.guid(),
    description: 'Future Super',
    type: 'retail',
  },
  {
    id: chance.guid(),
    description: 'HUB24 Super Fund',
    type: 'retail',
  },
  {
    id: chance.guid(),
    description: 'ING Living Super',
    type: 'retail',
  },
  {
    id: chance.guid(),
    description: 'IOOF Investment Management Super',
    type: 'retail',
  },
  { id: chance.guid(), description: 'iQ super', type: 'retail' },
  {
    id: chance.guid(),
    description: 'Kogan Super',
    type: 'retail',
  },
  {
    id: chance.guid(),
    description: 'Mercer Super',
    type: 'retail',
  },
  {
    id: chance.guid(),
    description: 'MLC Super Fund',
    type: 'retail',
  },
  { id: chance.guid(), description: 'One Super', type: 'retail' },
  { id: chance.guid(), description: 'Plum Super', type: 'retail' },
  {
    id: chance.guid(),
    description: 'smartMonday',
    type: 'retail',
  },
  {
    id: chance.guid(),
    description: 'Suncorp Everyday Super',
    type: 'retail',
  },
  {
    id: chance.guid(),
    description: 'Superhero Super',
    type: 'retail',
  },
  {
    id: chance.guid(),
    description: 'Super Trace',
    type: 'retail',
  },
  {
    id: chance.guid(),
    description: 'Verve Super',
    type: 'retail',
  },
  {
    id: chance.guid(),
    description: 'Virgin Money Super',
    type: 'retail',
  },
  {
    id: chance.guid(),
    description: 'Vision Super',
    type: 'retail',
  },
];

plans.sort((a, b) => {
  if (a.id < b.id) {
    return -1;
  }

  if (a.id > b.id) {
    return 1;
  }

  return 0;
});

const planMembers: PlanMember[] = [];

export { plans, planMembers };
