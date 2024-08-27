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
import { useCallback } from 'react';

export default () => {
  const { hasRole } = useAuth();
  const location = useLocation();
  const locationPathname = location.pathname.toLowerCase();

  const [
    { isSidebarOpen },
    {
      saveIsSidebarOpenToLocalStorage,
      setIsSidebarOpen,
    },
  ] = useModel(sidebarModel);

  const onSidebarToggle = useCallback(() => {
    setIsSidebarOpen(!isSidebarOpen);
    saveIsSidebarOpenToLocalStorage();
  }, [isSidebarOpen, setIsSidebarOpen, saveIsSidebarOpenToLocalStorage]);

  return (
    <PageSidebar id="nav-sidebar" isSidebarOpen={isSidebarOpen}>
      <PageSidebarBody>
        <Nav>
          <NavList>
            <NavItem
              id="nav-sidebar-link-home"
              itemID="1"
              isActive={locationPathname === '/'}
              onClick={onSidebarToggle}
            >
              <LocaleLink prefetch="intent" to="/">
                <Trans>Home</Trans>
              </LocaleLink>
            </NavItem>
            <NavItem
              id="nav-sidebar-link-auctions"
              itemID="1"
              isActive={locationPathname.startsWith('/auctions')}
              onClick={onSidebarToggle}
            >
              <LocaleLink prefetch="intent" to="/auctions">
                <Trans>Auctions</Trans>
              </LocaleLink>
            </NavItem>
            {hasRole('admin') ? (
              <>
                <NavItem
                  id="nav-sidebar-link-highest-bids"
                  itemID="1"
                  isActive={locationPathname.startsWith('/highest-bids')}
                  onClick={onSidebarToggle}
                >
                  <LocaleLink prefetch="intent" to="/highest-bids">
                    <Trans>Highest Bids</Trans>
                  </LocaleLink>
                </NavItem><NavItem
                  id="nav-sidebar-link-users"
                  itemID="1"
                  isActive={locationPathname.startsWith('/users')}
                  onClick={onSidebarToggle}
                >
                  <LocaleLink prefetch="intent" to="/users">
                    <Trans>Users</Trans>
                  </LocaleLink>
                </NavItem>
              </>
            ) : null}
          </NavList>
        </Nav>
      </PageSidebarBody>
    </PageSidebar>
  );
};
