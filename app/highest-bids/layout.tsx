import { Outlet } from '@modern-js/runtime/router';
import { RequireRole } from '@/components';

export default () => {
  return (
    <RequireRole role="admin">
      <Outlet />
    </RequireRole>
  );
};
