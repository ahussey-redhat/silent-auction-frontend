import {
  DataList,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Timestamp,
} from '@patternfly/react-core';
import { useAuctions } from '@app/providers/Auctions';
import { useUsers } from '@app/providers/Users'

export default function BidsDataList({ auctionId }: { auctionId: string }) {
  const { auctionBids } = useAuctions();
  const { users } = useUsers();

  return (
    <DataList aria-label={`Bids list`}>
      {auctionBids.find(auctionBid => auctionBid.auction === auctionId)?.bids.toReversed().map(({ id, userId, amount, time }) => (
        <DataListItem key={id} id={id}>
          <DataListItemRow>
            <DataListItemCells
              dataListCells={[
                <DataListCell key="user">
                  <p>
                    <strong>User</strong>:{' '}
                    {(user =>
                      user ? `${user?.firstName} ${user?.lastName}` : '')(
                      users.find(({ id }) => id === userId),
                    )}
                  </p>
                </DataListCell>,
                <DataListCell key="amount">
                  <p>
                    <strong>Amount</strong>: {amount}
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
  );
};
