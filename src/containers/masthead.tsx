import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useModel } from '@modern-js/runtime/model';
import { Link } from '@modern-js/runtime/router';
import {
  Avatar,
  Brand,
  Dropdown,
  DropdownItem,
  DropdownItemProps,
  DropdownList,
  Masthead,
  MastheadBrand,
  MastheadContent,
  MastheadMain,
  MastheadToggle,
  MenuToggle,
  PageToggleButton,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import avatarImgSrc from '@patternfly/react-core/src/components/assets/avatarImg.svg';
import { BarsIcon } from '@patternfly/react-icons/dist/esm/icons/bars-icon';
import { EllipsisVIcon } from '@patternfly/react-icons/dist/esm/icons/ellipsis-v-icon';
import { MouseEvent as ReactMouseEvent, useCallback, useState } from 'react';
import { useAsync, useEffectOnce } from 'react-use';
import { LocaleLink, logoImgSrc, useAuth } from '@/components';
import { useLocationWithParams } from '@/hooks';
import i18nModel, { locales } from '@/models/i18n';
import sidebarModel from '@/models/sidebar';

const LocaleDropdownItem = ({ value, ...props }: DropdownItemProps) => {
  const to = useLocationWithParams([['locale', value]]);

  return (
    <DropdownItem
      {...props}
      component={props => <Link {...props} to={to} />}
      value={value}
    />
  );
};

export default () => {
  const { _ } = useLingui();
  const { profile, logout } = useAuth();
  const [{ locale }] = useModel(i18nModel);
  const [
    { isSidebarOpen },
    {
      loadIsSidebarOpenFromLocalStorage,
      saveIsSidebarOpenToLocalStorage,
      setIsSidebarOpen,
    },
  ] = useModel(sidebarModel);

  useEffectOnce(() => {
    loadIsSidebarOpenFromLocalStorage();
  });

  const onSidebarToggle = useCallback(() => {
    setIsSidebarOpen(!isSidebarOpen);
    saveIsSidebarOpenToLocalStorage();
  }, [isSidebarOpen, setIsSidebarOpen, saveIsSidebarOpenToLocalStorage]);

  const [isFullKebabDropdownOpen, setIsFullKebabDropdownOpen] = useState(false);

  const onFullKebabToggle = useCallback(() => {
    setIsFullKebabDropdownOpen(!isFullKebabDropdownOpen);
  }, [isFullKebabDropdownOpen, setIsFullKebabDropdownOpen]);

  const onFullKebabSelect = useCallback(() => {
    setIsFullKebabDropdownOpen(false);
  }, [setIsFullKebabDropdownOpen]);

  const [isLocaleDropdownOpen, setIsLocaleDropdownOpen] = useState(false);

  const onLocaleDropdownToggle = useCallback(() => {
    setIsLocaleDropdownOpen(!isLocaleDropdownOpen);
  }, [isLocaleDropdownOpen, setIsLocaleDropdownOpen]);

  const onLocaleDropdownSelect = useCallback(() => {
    setIsLocaleDropdownOpen(false);
  }, [setIsLocaleDropdownOpen]);

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const onUserDropdownToggle = useCallback(() => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  }, [isUserDropdownOpen, setIsUserDropdownOpen]);

  const onUserDropdownSelect = useCallback(() => {
    setIsUserDropdownOpen(false);
  }, [setIsUserDropdownOpen]);

  const localeDropdownItems = Object.entries(locales).map(([key, value]) => (
    <LocaleDropdownItem key={key} value={key}>
      {value}
    </LocaleDropdownItem>
  ));

  const onClickLogout = useCallback(
    (event: ReactMouseEvent<Element, MouseEvent>) => {
      event.preventDefault();
      logout();
    },
    [logout],
  );

  const { value: avatarUrl = avatarImgSrc as string } =
    useAsync(async (): Promise<string | undefined> => {
      if (!profile?.email) {
        return undefined;
      }

      const hash = Array.from(
        new Uint8Array(
          await crypto.subtle.digest(
            'SHA-256',
            new TextEncoder().encode(profile.email),
          ),
        ),
      )
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');

      return `https://gravatar.com/avatar/${hash}?s=32&d=identicon`;
    }, [profile?.email]);

  const userDropdownItems = [
    <DropdownItem key="logout" onClick={onClickLogout}>
      <Trans>Logout</Trans>
    </DropdownItem>,
  ];

  return (
    <Masthead>
      <MastheadToggle>
        <PageToggleButton
          id="nav-sidebar-toggle"
          variant="plain"
          aria-label={_(msg`Global navigation`)}
          isSidebarOpen={isSidebarOpen}
          onSidebarToggle={onSidebarToggle}
        >
          <BarsIcon />
        </PageToggleButton>
      </MastheadToggle>
      <MastheadMain>
        <MastheadBrand component={props => <LocaleLink {...props} to="/" />}>
          <Brand
            src={logoImgSrc}
            alt={_(msg`SILENT AUCTION`)}
            widths={{ default: '170px' }}
          />
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>
        <Toolbar>
          <ToolbarContent>
            <ToolbarGroup
              align={{ default: 'alignEnd' }}
              gap={{ default: 'gapNone', md: 'gapMd' }}
            >
              <ToolbarItem alignSelf="center">
                <Dropdown
                  isOpen={isLocaleDropdownOpen}
                  onSelect={onLocaleDropdownSelect}
                  onOpenChange={setIsLocaleDropdownOpen}
                  popperProps={{ position: 'right' }}
                  toggle={(toggleRef: React.RefObject<any>) => (
                    <MenuToggle
                      ref={toggleRef}
                      isExpanded={isLocaleDropdownOpen}
                      onClick={onLocaleDropdownToggle}
                      isFullHeight
                    >
                      {_(locales[locale]!)}
                    </MenuToggle>
                  )}
                >
                  <DropdownList>{localeDropdownItems}</DropdownList>
                </Dropdown>
              </ToolbarItem>
              <ToolbarItem visibility={{ md: 'hidden' }}>
                <Dropdown
                  isOpen={isFullKebabDropdownOpen}
                  onSelect={onFullKebabSelect}
                  onOpenChange={setIsFullKebabDropdownOpen}
                  popperProps={{ position: 'right' }}
                  toggle={(toggleRef: React.RefObject<any>) => (
                    <MenuToggle
                      ref={toggleRef}
                      isExpanded={isFullKebabDropdownOpen}
                      onClick={onFullKebabToggle}
                      variant="plain"
                      aria-label={_(msg`Toolbar menu`)}
                    >
                      <EllipsisVIcon aria-hidden="true" />
                    </MenuToggle>
                  )}
                >
                  <DropdownList>{userDropdownItems}</DropdownList>
                </Dropdown>
              </ToolbarItem>
              <ToolbarItem visibility={{ default: 'hidden', md: 'visible' }}>
                <Dropdown
                  isOpen={isUserDropdownOpen}
                  onSelect={onUserDropdownSelect}
                  onOpenChange={setIsUserDropdownOpen}
                  popperProps={{ position: 'right' }}
                  toggle={(toggleRef: React.RefObject<any>) => (
                    <MenuToggle
                      ref={toggleRef}
                      isExpanded={isUserDropdownOpen}
                      onClick={onUserDropdownToggle}
                      icon={
                        <Avatar src={avatarUrl} alt={_(msg`Avatar image`)} />
                      }
                      isFullHeight
                    >
                      {`${profile?.firstName} ${profile?.lastName}` ?? (
                        <Trans>Guest</Trans>
                      )}
                    </MenuToggle>
                  )}
                >
                  <DropdownList>{userDropdownItems}</DropdownList>
                </Dropdown>
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
      </MastheadContent>
    </Masthead>
  );
};
