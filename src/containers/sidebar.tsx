import { Trans } from '@lingui/macro';
import { useModel } from '@modern-js/runtime/model';
import { useLocation } from '@modern-js/runtime/router';
import {
  Nav,
  NavItem,
  NavList,
  PageSidebar,
  PageSidebarBody,
} from '@patternfly/react-core';
import { LocaleLink, useAuth } from '@/components';
import sidebarModel from '@/models/sidebar';

export default () => {
  const { hasRole } = useAuth();
  const [{ isSidebarOpen }] = useModel(sidebarModel);
  const location = useLocation();
  const locationPathname = location.pathname.toLowerCase();

  return (
    <PageSidebar id="nav-sidebar" isSidebarOpen={isSidebarOpen}>
      <PageSidebarBody>
        <Nav>
          <NavList>
            <NavItem
              id="nav-sidebar-link-home"
              itemID="1"
              isActive={locationPathname === '/'}
            >
              <LocaleLink prefetch="intent" to="/">
                <Trans>Home</Trans>
              </LocaleLink>
            </NavItem>
            <NavItem
              id="nav-sidebar-link-auctions"
              itemID="1"
              isActive={locationPathname.startsWith('/auctions')}
            >
              <LocaleLink prefetch="intent" to="/auctions">
                <Trans>Auctions</Trans>
              </LocaleLink>
            </NavItem>
            {hasRole('admin') ? (
              <NavItem
                id="nav-sidebar-link-users"
                itemID="1"
                isActive={locationPathname.startsWith('/users')}
              >
                <LocaleLink prefetch="intent" to="/users">
                  <Trans>Users</Trans>
                </LocaleLink>
              </NavItem>
            ) : null}
          </NavList>
        </Nav>
      </PageSidebarBody>
    </PageSidebar>
  );
};
