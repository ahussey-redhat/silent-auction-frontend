import loginHandlers from './login';
import memberHandlers from './members';
import planHandlers from './plans';

export default {
  ...loginHandlers,
  ...memberHandlers,
  ...planHandlers,
};
