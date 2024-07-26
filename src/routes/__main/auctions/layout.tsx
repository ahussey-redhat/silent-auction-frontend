import { useModel } from '@modern-js/runtime/model';
import { Outlet } from '@modern-js/runtime/router';
import { useEffectOnce } from 'react-use';
import { useCallback, useEffect, useState } from 'react';
import CreateUserModal from './create-user-modal';
import userModel from '@/models/user';

export default () => {
  const [
    {
      me: { value: me },
    },
    { createMe, getMe },
  ] = useModel(userModel);
  const [createUserModalIsOpen, setCreateUserModalIsOpen] = useState(false);

  const toggleCreateUserModalIsOpen = useCallback(
    () => setCreateUserModalIsOpen(!createUserModalIsOpen),
    [createUserModalIsOpen, setCreateUserModalIsOpen],
  );

  useEffectOnce(() => {
    getMe();
  });

  useEffect(() => {
    console.log(me, createUserModalIsOpen);
    if (!me && !createUserModalIsOpen) {
      setCreateUserModalIsOpen(true);
    } else if (me && createUserModalIsOpen) {
      setCreateUserModalIsOpen(false);
    }
  }, [me, createUserModalIsOpen, toggleCreateUserModalIsOpen]);

  return (
    <>
      <Outlet />
      <CreateUserModal
        isOpen={createUserModalIsOpen}
        onClose={toggleCreateUserModalIsOpen}
        onCreateUser={tableNumber => createMe({ table_number: tableNumber })}
      />
    </>
  );
};
