'use client'

import {
  DataList,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  PageSection,
  Content,
  ContentVariants, useInterval, Timestamp,
} from '@patternfly/react-core';
import { useEffectOnce } from 'react-use';
import userModel from '@app/models/user';
import './page.css';
import auctionModel from '@app/providers/auction';

export default function HighestBids() {

  const [
    {
      bids: { value: bids },
    },
    { getHighestBids },
  ] = useModel(auctionModel);

  const [
    {
      auctions: { value: auctions },
    },
    { getAuctions },
  ] = useModel(auctionModel);

  const [
    {
      users: { value: users },
    },
    { getUsers },
  ] = useModel(userModel);

  useEffectOnce(() => {
    getHighestBids();
    getUsers();
    getAuctions();
  });

  useInterval(() => {
    getHighestBids();
    getUsers();
    getAuctions();
  }, 10000);

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Content component={ContentVariants.h1}>
          Highest Bids Per Auction
        </Content>
      </PageSection>
      <PageSection hasBodyWrapper={false} className="highest-bids-page" isFilled>
        <DataList aria-label={`Bids list`}>
        {bids?.map(({ id, auctionId, userId, amount, time }) => (
          <DataListItem key={id} id={id}>
            <DataListItemRow>
              <DataListItemCells
                dataListCells={[
                  <DataListCell key="auction">
                    <p>
                      <strong>Auction</strong>:{' '}
                      {(auction =>
                        auction ? `${auction?.name}` : '')(
                        auctions.find(({ id }) => id === auctionId),
                      )}
                    </p>
                  </DataListCell>,
                  <DataListCell key="user">
                    <p>
                      <strong>User</strong>:{' '}
                      {(user =>
                        user ? `${user?.firstName} ${user?.lastName}` : '')(
                        users.find(({ id }) => id === userId),
                      )}
                    </p>
                  </DataListCell>,
                  <DataListCell key="table">
                    <p>
                      <strong>Table Number</strong>:{' '}
                      {(user =>
                        user ? `${user?.tableNumber}` : '')(
                        users.find(({ id }) => id === userId),
                      )}
                    </p>
                  </DataListCell>,
                  <DataListCell key="amount">
                    <p>
                      <strong>Amount</strong>: ${amount}
                    </p>
                  </DataListCell>,
                  <DataListCell key="time">
                    <p>
                      <strong>Time</strong>: <Timestamp date={time} />
                    </p>
                  </DataListCell>,
                ]}
              />
            </DataListItemRow>
          </DataListItem>
        ))}
        </DataList>
      </PageSection>
    </>
  );
};
