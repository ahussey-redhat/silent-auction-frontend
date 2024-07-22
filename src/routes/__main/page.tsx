import { Navigate } from '@modern-js/runtime/router';
import { usePathWithParams } from '@/hooks';

export default () => {
  const to = usePathWithParams('/auctions', ['locale']);

  return <Navigate to={to} />;
};
