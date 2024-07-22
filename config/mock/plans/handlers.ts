import { simulatedLatency, simulateError, simulateNotFound } from '../simulate';
import { handleGet, handleGetId } from '../utils';
import { planAuctions, plans } from './data';

export default {
  '/api/plans': handleGet(url => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (simulateError) {
          reject(new Error('Simulated Error'));
        } else if (simulateNotFound) {
          resolve(null);
        }

        const searchParam = url.searchParams.get('search')?.toLowerCase();
        const typeParam = url.searchParams.get('type')?.toLowerCase();

        if (!searchParam && !typeParam) {
          resolve(plans);
        }

        resolve(
          plans.filter(({ description, type }) => {
            let meetsFilterCriteria = true;

            if (searchParam) {
              meetsFilterCriteria = description
                .toLowerCase()
                .includes(searchParam);
            }

            if (typeParam === 'industry' || typeParam === 'retail') {
              meetsFilterCriteria = meetsFilterCriteria && typeParam === type;
            }

            return meetsFilterCriteria;
          }),
        );
      }, simulatedLatency);
    });
  }),
  '/api/plans/:id': handleGetId(plans),
  '/api/plans/:id/auctions': handleGet(url => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (simulateError) {
          reject(new Error('Simulated Error'));
        } else if (simulateNotFound) {
          resolve(null);
        }

        const pathSegments = url.pathname.split('/');
        const planId = pathSegments[pathSegments.length - 2];

        resolve(
          planAuctions.filter(planAuction => planAuction.planId === planId),
        );
      }, simulatedLatency);
    });
  }),
};
