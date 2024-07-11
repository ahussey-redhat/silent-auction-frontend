import { model } from '@modern-js/runtime/model';

export type User = {
  username: string;
};

export const isUser = (value: unknown): value is User =>
  typeof value === 'object' && value !== null && 'username' in value;

type State = {
  user: User | null;
};

const authModel = model<State>('auth').define((_, { use }) => ({
  state: {
    user: null,
  },
  effects: {
    loadFromLocalStorage() {
      const [, { setUser }] = use(authModel);
      const user = localStorage.getItem('user');
      setUser(user ? JSON.parse(user) : null);
    },
    logoutUser() {
      const [, { setUser, removeFromLocalStorage }] = use(authModel);
      removeFromLocalStorage();
      setUser(null);
    },
    saveToLocalStorage() {
      const [{ user }] = use(authModel);
      localStorage.setItem('user', JSON.stringify(user));
    },
    removeFromLocalStorage() {
      localStorage.removeItem('user');
    },
  },
}));

export default authModel;
