import { handlePost } from './utils';

type LoginRequest = {
  username: string;
  password: string;
};

type UserInfo = {
  username: string;
};

export default {
  'POST /api/login': handlePost<LoginRequest, UserInfo>(
    ({ username, password }) => {
      if (!username) {
        throw new Error('"username" is required');
      }

      if (!password) {
        throw new Error('"password" is required');
      }

      return { username };
    },
  ),
};
