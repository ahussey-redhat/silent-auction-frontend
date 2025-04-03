'use client'
import {
  DataList,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  EmptyState,
  PageSection,
  Spinner,
  Content,
  ContentVariants,
} from '@patternfly/react-core';
import './page.css';
import { useUsers } from '@app/providers/Users';

export default function Users(){
  const { users, loading } = useUsers();
  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Content component={ContentVariants.h1}>
          Users
        </Content>
      </PageSection>
      <PageSection hasBodyWrapper={false} className="users-page" isFilled>
        {users.length === 0 && loading ? (
          <EmptyState titleText={`Loading`} icon={Spinner} />
        ) : (
          <DataList aria-label={`User list`}>
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