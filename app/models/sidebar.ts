import { model } from '@modern-js/runtime/model';

type State = {
  isSidebarOpen: boolean;
};

const sidebarModel = model<State>('sidebar').define((_, { use }) => ({
  state: {
    isSidebarOpen: false,
  },
  effects: {
    loadIsSidebarOpenFromLocalStorage() {
      const [, { setIsSidebarOpen }] = use(sidebarModel);
      const isSidebarOpen = localStorage.getItem('isSidebarOpen');
      setIsSidebarOpen(isSidebarOpen === 'true');
    },
    saveIsSidebarOpenToLocalStorage() {
      const [{ isSidebarOpen }] = use(sidebarModel);
      localStorage.setItem('isSidebarOpen', `${isSidebarOpen}`);
    },
    removeIsSidebarOpenFromLocalStorage() {
      localStorage.removeItem('isSidebarOpen');
    },
  },
}));

export default sidebarModel;
