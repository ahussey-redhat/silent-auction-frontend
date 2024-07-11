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
import { LocaleLink } from '@/components';
import sidebarModel from '@/models/sidebar';

export default () => {
  const [{ isSidebarOpen }] = useModel(sidebarModel);
  const location = useLocation();
  const locationPathname = location.pathname.toLowerCase();

  return (
    <PageSidebar id="nav-sidebar" isSidebarOpen={isSidebarOpen}>
      <PageSidebarBody>
        <Nav>
          <NavList>
            <NavItem
              id="nav-sidebar-link-dashboard"
              itemID="0"
              isActive={locationPathname === '/'}
            >
              <LocaleLink prefetch="intent" to="/">
                <Trans>Dashboard</Trans>
              </LocaleLink>
            </NavItem>
            <NavItem
              id="nav-sidebar-link-members"
              itemID="1"
              isActive={locationPathname.startsWith('/members')}
            >
              <LocaleLink prefetch="intent" to="/members">
                <Trans>Members</Trans>
              </LocaleLink>
            </NavItem>
            <NavItem
              id="nav-sidebar-link-plans"
              itemID="2"
              isActive={locationPathname.startsWith('/plans')}
            >
              <LocaleLink prefetch="intent" to="/plans">
                <Trans>Plans</Trans>
              </LocaleLink>
            </NavItem>
          </NavList>
        </Nav>
      </PageSidebarBody>
    </PageSidebar>
  );
};
