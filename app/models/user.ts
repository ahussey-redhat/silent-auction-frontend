import { model } from '@modern-js/runtime/model';
import { EffectState, handleEffect, handleFetch, handlePost } from './utils';
import { User, UserDTO } from '@/types';

type State = {
  me: EffectState<User | null>;
  users: EffectState<User[]>;
};

const mapUser = ({
  id,
  username,
  first_name,
  last_name,
  table_number,
}: UserDTO): User => {
  return {
    id: id.toString(),
    username,
    firstName: first_name,
    lastName: last_name,
    tableNumber: table_number.toString(),
  };
};

const userModel = model<State>('user').define((_, { use }) => ({
  state: {
    me: {
      value: null,
      loading: false,
      error: null,
    },
    users: {
      value: [],
      loading: false,
      error: null,
    },
  },
  actions: {
    createMe: handleEffect('me'),
    getMe: handleEffect('me'),
    getUsers: handleEffect('users'),
  },
  effects: {
    createMe: handlePost(use, 'me', null, mapUser, {}),
    getMe: handleFetch(use, 'me', null, mapUser),
    getUsers: handleFetch(use, 'users', [], (users: UserDTO[]) =>
      users.map(mapUser),
    ),
  },
}));

export default userModel;
