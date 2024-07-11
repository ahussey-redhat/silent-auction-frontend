import { simulatedLatency, simulateError, simulateNotFound } from '../simulate';
import { handleGet, handleGetId } from '../utils';
import { members, memberPlans } from './data';

export default {
  '/api/members': handleGet(url => {
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
          resolve(members);
        }

        resolve(
          members.filter(
            ({
              active,
              customerReference,
              givenNames,
              memberNumber,
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
                    memberNumber.toLowerCase().includes(lowerCaseSearchParam) ||
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
  '/api/members/:id': handleGetId(members),
  '/api/members/:id/plans': handleGet(url => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (simulateError) {
          reject(new Error('Simulated Error'));
        } else if (simulateNotFound) {
          resolve(null);
        }

        const pathSegments = url.pathname.split('/');
        const memberId = pathSegments[pathSegments.length - 2];

        resolve(
          memberPlans.filter(memberPlan => memberPlan.memberId === memberId),
        );
      }, simulatedLatency);
    });
  }),
};
