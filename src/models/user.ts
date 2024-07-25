import { model } from '@modern-js/runtime/model';
import { EffectState, handleEffect, handleFetch } from './utils';
import { User, UserDTO } from '@/types';

type State = {
  me: EffectState<User | null>;
};

const mapUser = ({ id, username, table_number }: UserDTO): User => ({
  id: id.toString(),
  username,
  tableNumber: table_number.toString(),
});

const userModel = model<State>('user').define((_, { use }) => ({
  state: {
    me: {
      value: null,
      loading: false,
      error: null,
    },
  },
  actions: {
    getMe: handleEffect('me'),
  },
  effects: {
    getMe: handleFetch(use, 'me', null, mapUser),
  },
}));

export default userModel;
