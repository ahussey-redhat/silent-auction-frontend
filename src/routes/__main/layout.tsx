import type { MessageDescriptor } from '@lingui/core';
import { useLingui } from '@lingui/react';
import { Outlet, UIMatch, useMatches } from '@modern-js/runtime/router';
import { Breadcrumb, BreadcrumbItem, Page } from '@patternfly/react-core';
import { LocaleLink, RequireAuth } from '@/components';
import Masthead from '@/containers/masthead';
import Sidebar from '@/containers/sidebar';
import './layout.css';

export default () => {
  const { _ } = useLingui();
  const matches = useMatches();
  const breadcrumbRoutes = matches.filter(
    (route): route is UIMatch<unknown, { breadcrumbName: MessageDescriptor }> =>
      typeof route.handle === 'object' &&
      route.handle !== null &&
      'breadcrumbName' in route.handle,
  );
  const breadcrumbs = breadcrumbRoutes.map((route, index) => (
    <BreadcrumbItem
      key={route.id}
      isActive={index === breadcrumbRoutes.length - 1}
      render={({ ariaCurrent, className }) => (
        <LocaleLink
          aria-current={ariaCurrent}
          className={className}
          to={route.pathname}
        >
          {_(route.handle.breadcrumbName)}
        </LocaleLink>
      )}
    />
  ));

  return (
    <RequireAuth>
      <Page
        breadcrumb={
          breadcrumbs.length > 1 ? <Breadcrumb>{breadcrumbs}</Breadcrumb> : null
        }
        masthead={<Masthead />}
        sidebar={<Sidebar />}
      >
        <Outlet />
      </Page>
    </RequireAuth>
  );
};
