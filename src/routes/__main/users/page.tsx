import { Trans, msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  DataList,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  EmptyState,
  PageSection,
  Spinner,
  Text,
  TextContent,
} from '@patternfly/react-core';
import { useEffectOnce } from 'react-use';
import { useModel } from '@modern-js/runtime/model';
import { PageTitle } from '@/components';
import userModel from '@/models/user';
import './page.css';

export default () => {
  const { _ } = useLingui();
  const [
    {
      users: { value: users, loading },
    },
    { getUsers },
  ] = useModel(userModel);

  useEffectOnce(() => {
    getUsers();
  });

  return (
    <>
      <PageTitle title={_(msg`Users`)} />
      <PageSection>
        <TextContent>
          <Text component="h1">
            <Trans>Users</Trans>
          </Text>
        </TextContent>
      </PageSection>
      <PageSection className="users-page" isFilled>
        {users.length === 0 && loading ? (
          <EmptyState titleText={_(msg`Loading`)} icon={Spinner} />
        ) : (
          <DataList aria-label={_(msg`User list`)}>
            {users?.map(
              ({ id, username, firstName, lastName, tableNumber }) => (
                <DataListItem key={id} id={id}>
                  <DataListItemRow>
                    <DataListItemCells
                      dataListCells={[
                        <DataListCell key="name">
                          <p>
                            <strong>Name</strong>: {firstName} {lastName}
                          </p>
                        </DataListCell>,
                        <DataListCell key="username">
                          <p>
                            <strong>Username</strong>: {username}
                          </p>
                        </DataListCell>,
                        <DataListCell key="table-number">
                          <p>
                            <strong>Table Number</strong>: {tableNumber}
                          </p>
                        </DataListCell>,
                      ]}
                    />
                  </DataListItemRow>
                </DataListItem>
              ),
            )}
          </DataList>
        )}
      </PageSection>
    </>
  );
};