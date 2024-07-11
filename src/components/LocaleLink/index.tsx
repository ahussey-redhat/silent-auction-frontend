import { Link, LinkProps } from '@modern-js/runtime/router';
import { usePathWithParams } from '@/hooks';

export default ({ to, ...props }: LinkProps) => {
  const toWithLocale = usePathWithParams(to, ['locale']);

  return <Link {...props} to={toWithLocale} />;
};
