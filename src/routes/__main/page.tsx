import { Navigate } from '@modern-js/runtime/router';
import { usePathWithParams } from '@/hooks';

export default () => {
  const to = usePathWithParams('/members', ['locale']);

  return <Navigate to={to} />;
};
