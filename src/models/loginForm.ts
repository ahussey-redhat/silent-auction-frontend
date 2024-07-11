import { handleEffect, model } from '@modern-js/runtime/model';
import { isUser, User } from '@/models/auth';

type Field = {
  value: string;
  isValid: boolean;
};

type State = {
  username: Field;
  password: Field;
  showHelperText: boolean;
  result: User | null;
  loading: boolean;
  error: string | null;
};

const loginFormModel = model<State>('loginForm').define((_, { use }) => ({
  state: {
    username: {
      value: '',
      isValid: false,
    },
    password: {
      value: '',
      isValid: false,
    },
    showHelperText: false,
    result: null,
    loading: false,
    error: null,
  },
  actions: {
    setUsername(state, payload: string) {
      state.username.value = payload;
    },
    setPassword(state, payload: string) {
      state.password.value = payload;
    },
    validate(state) {
      state.username.isValid = Boolean(state.username.value);
      state.password.isValid = Boolean(state.password.value);
      state.showHelperText = !state.username.isValid || !state.password.isValid;
    },
    login: handleEffect(),
  },
  effects: {
    async login(): Promise<User | null> {
      const [, { validate }] = use(loginFormModel);

      validate();

      const [{ username, password }] = use(loginFormModel);

      if (!username.isValid || !password.isValid) {
        return null;
      }

      const response = await (
        await fetch('/api/login', {
          method: 'POST',
          body: JSON.stringify({
            username: username.value,
            password: password.value,
          }),
        })
      ).json();

      // Validate response is a User
      if (!isUser(response)) {
        throw new Error('Bad login response');
      }

      return response;
    },
  },
}));

export default loginFormModel;
