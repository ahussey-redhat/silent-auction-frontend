import type { MessageDescriptor } from '@lingui/core';
import { useLingui } from '@lingui/react';
import { Outlet, UIMatch, useMatches } from '@modern-js/runtime/router';
import { Breadcrumb, BreadcrumbItem, Page } from '@patternfly/react-core';
import { useModel } from '@modern-js/runtime/model';
import { useEffect } from 'react';
import { useEffectOnce } from 'react-use';
import { LocaleLink, RequireAuth } from '@/components';
import Masthead from '@/containers/masthead';
import Sidebar from '@/containers/sidebar';
import './layout.css';
import userModel from '@/models/user';

export default () => {
  const { _ } = useLingui();
  const [
    {
      me: { value: me },
    },
    { createMe, getMe },
  ] = useModel(userModel);

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

  useEffectOnce(() => {
    getMe();
  });

  useEffect(() => {
    if (me === null) {
      createMe();
    }
  }, [me]);

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
