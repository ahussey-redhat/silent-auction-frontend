import { simulatedLatency, simulateError, simulateNotFound } from '../simulate';
import { handleGet, handleGetId } from '../utils';
import { auctions, auctionPlans } from './data';

export default {
  '/api/auctions': handleGet(url => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (simulateError) {
          reject(new Error('Simulated Error'));
        } else if (simulateNotFound) {
          resolve(null);
        }

        const searchParam = url.searchParams.get('search')?.toLowerCase();
        const statusParam = url.searchParams.get('status')?.toLowerCase();
        const riskParam = url.searchParams.get('risk')?.toLowerCase();

        if (!searchParam && !statusParam && !riskParam) {
          resolve(auctions);
        }

        resolve(
          auctions.filter(
            ({
              active,
              customerReference,
              givenNames,
              auctionNumber,
              risk,
              surname,
            }) => {
              let meetsFilterCriteria = true;

              if (searchParam) {
                const lowerCaseSearchParam = searchParam.toLowerCase();

                meetsFilterCriteria =
                  meetsFilterCriteria &&
                  (customerReference
                    .toLowerCase()
                    .includes(lowerCaseSearchParam) ||
                    auctionNumber
                      .toLowerCase()
                      .includes(lowerCaseSearchParam) ||
                    givenNames.toLowerCase().includes(lowerCaseSearchParam) ||
                    surname.toLowerCase().includes(lowerCaseSearchParam));
              }

              if (
                (statusParam === 'active' && !active) ||
                (statusParam === 'inactive' && active)
              ) {
                meetsFilterCriteria = false;
              }

              if (
                riskParam === 'low' ||
                riskParam === 'medium' ||
                riskParam === 'high'
              ) {
                meetsFilterCriteria = meetsFilterCriteria && risk === riskParam;
              }

              return meetsFilterCriteria;
            },
          ),
        );
      }, simulatedLatency);
    });
  }),
  '/api/auctions/:id': handleGetId(auctions),
  '/api/auctions/:id/plans': handleGet(url => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (simulateError) {
          reject(new Error('Simulated Error'));
        } else if (simulateNotFound) {
          resolve(null);
        }

        const pathSegments = url.pathname.split('/');
        const auctionId = pathSegments[pathSegments.length - 2];

        resolve(
          auctionPlans.filter(
            auctionPlan => auctionPlan.auctionId === auctionId,
          ),
        );
      }, simulatedLatency);
    });
  }),
};
