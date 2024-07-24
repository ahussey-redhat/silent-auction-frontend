import { Trans } from '@lingui/macro';
import { useModel } from '@modern-js/runtime/model';
import { useLocation } from '@modern-js/runtime/router';
import {
  Nav,
  NavItem,
  NavList,
  Brand,
  PageSidebar,
  PageSidebarBody,
} from '@patternfly/react-core';
import { LocaleLink, useAuth, bannerImgSrc } from '@/components';
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
                id="nav-sidebar-link-plans"
                itemID="2"
                isActive={locationPathname.startsWith('/plans')}
              >
                <LocaleLink prefetch="intent" to="/plans">
                  <Trans>Plans</Trans>
                </LocaleLink>
              </NavItem>
            ) : null}
          </NavList>
        </Nav>
        <Brand
          src={bannerImgSrc}
          alt="lifeline and red hat"
          widths={{ default: '600px' }}
          heights={{ default: '200px' }}
        />
      </PageSidebarBody>
    </PageSidebar>
  );
};
