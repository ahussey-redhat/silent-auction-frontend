import { model } from '@modern-js/runtime/model';
import { EffectState, handleEffect, handleFetch, handlePost } from './utils';
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
    createMe: (createMeRequest: CreateMeRequest) =>
      handlePost(use, 'me', null, mapUser, createMeRequest)(),
    getMe: handleFetch(use, 'me', null, mapUser),
  },
}));

export default userModel;
