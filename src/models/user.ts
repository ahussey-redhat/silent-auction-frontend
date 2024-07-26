import { model } from '@modern-js/runtime/model';
import { EffectState, handleEffect, handleFetch } from './utils';
import { CreateMeRequest, User, UserDTO } from '@/types';

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
    createMe: handleEffect('me'),
    getMe: handleEffect('me'),
  },
  effects: {
    createMe: async (createMeRequest: CreateMeRequest) =>
      await handleFetch(use, 'me', null, mapUser, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createMeRequest),
      })(),
    getMe: handleFetch(use, 'me', null, mapUser),
  },
}));

export default userModel;
