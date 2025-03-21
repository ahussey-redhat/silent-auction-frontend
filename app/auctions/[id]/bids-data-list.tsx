import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useModel } from '@modern-js/runtime/model';
import {
  DataList,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Timestamp,
  useInterval,
} from '@patternfly/react-core';
import { useEffectOnce } from 'react-use';
import auctionModel from '@/models/auction';
import userModel from '@/models/user';

export default () => {
  const { _ } = useLingui();
  const [
    {
      auction: { value: auction },
      bids: { value: bids },
    },
    { getBids },
  ] = useModel(auctionModel);
  const [
    {
      users: { value: users },
    },
    { getUsers },
  ] = useModel(userModel);

  useEffectOnce(() => {
    if (auction?.id) {
      getBids(auction?.id);
    }

    getUsers();
  });

  useInterval(() => {
    if (auction?.id) {
      getBids(auction?.id);
    }

    getUsers();
  }, 10000);

  return (
    <DataList aria-label={_(msg`Bids list`)}>
      {bids.toReversed().map(({ id, userId, amount, time }) => (
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
