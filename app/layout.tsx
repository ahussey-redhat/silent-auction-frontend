'use client'

import "./globals.css";
import React, { useState, useEffect } from 'react';

import AuthProvider from './providers/Auth';
import AuctionProvider from '@app/providers/Auctions';
import AppMasthead from './containers/masthead';
import AppSidebar from './containers/sidebar';
// import AppNotificationDrawer from './containers/notificationdrawer';

import { Page } from '@patternfly/react-core';

export default function RootLayout({ children }: { children: React.ReactNode }){
  const [isDarkThemeEnabled, setDarkThemeEnabled] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = React.useState(false);
  const onCloseNotificationDrawer = () => {setIsNotificationDrawerOpen((prevState) => !prevState);};
  const [userProfile] = React.useState(null);

  /*
  * Handle Dark Theme
  * Credit: https://sreetamdas.com/blog/the-perfect-dark-mode
  */
  const getMediaQueryPreference = () => {
    const mediaQuery = "(prefers-color-scheme: dark)";
    const mql = window.matchMedia(mediaQuery);
    const hasPreference = typeof mql.matches === "boolean";
    if (hasPreference) {
      return mql.matches ? "dark" : "light";
    }
  };
  const storeUserSetPreference = (pref: string): void => {
    localStorage.setItem("theme", pref);
  };
  const getUserSetPreference = (): string | null => {
    return localStorage.getItem("theme");
  };
  useEffect(() => {
    const userSetPreference: string | null = getUserSetPreference();
    if (userSetPreference !== null) {
      setDarkThemeEnabled(userSetPreference === "dark");
    } else {
      const mediaQueryPreference = getMediaQueryPreference();
      setDarkThemeEnabled(mediaQueryPreference === "dark");
    }
  }, []);

  useEffect(() => {
    if (typeof isDarkThemeEnabled !== "undefined") {
      if (isDarkThemeEnabled) {
        storeUserSetPreference("dark");
      } else {
        storeUserSetPreference("light");
      }
    }
  }, [isDarkThemeEnabled]);

  return (
    isDarkThemeEnabled ?
      <html lang="en" className={"pf-v6-theme-dark"}>
        <body>
          <AuthProvider>
            <AuctionProvider>
              <Page
                masthead={
                  <AppMasthead
                    isDarkThemeEnabled={isDarkThemeEnabled}
                    setDarkThemeEnabled={setDarkThemeEnabled}
                    isSidebarOpen={isSidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    // isNotificationDrawerOpen={isNotificationDrawerOpen}
                    // onCloseNotificationDrawer={onCloseNotificationDrawer}
                  />
                }
                sidebar={
                  <AppSidebar
                    isSidebarOpen={isSidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                  />
                }
                // notificationDrawer={
                //   isNotificationDrawerOpen && (
                //     <AppNotificationDrawer
                //       onCloseNotificationDrawer={onCloseNotificationDrawer}
                //       isNotificationDrawerOpen={isNotificationDrawerOpen}
                //     />)
                // }
                // isNotificationDrawerExpanded={isNotificationDrawerOpen}
              >
                {children}
              </Page>
            </AuctionProvider>
          </AuthProvider>
        </body>
      </html>
      :
      <html lang="en">
        <body>
          <AuthProvider>
            <AuctionProvider>
              <Page
                masthead={
                  <AppMasthead
                    isDarkThemeEnabled={isDarkThemeEnabled}
                    setDarkThemeEnabled={setDarkThemeEnabled}
                    isSidebarOpen={isSidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    // isNotificationDrawerOpen={isNotificationDrawerOpen}
                    // onCloseNotificationDrawer={onCloseNotificationDrawer}
                  />
                }
                sidebar={
                  <AppSidebar
                    isSidebarOpen={isSidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                  />
                }
                // notificationDrawer={
                //   isNotificationDrawerOpen && (
                //     <AppNotificationDrawer
                //       onCloseNotificationDrawer={onCloseNotificationDrawer}
                //       isNotificationDrawerOpen={isNotificationDrawerOpen}
                //     />)
                // }
                // isNotificationDrawerExpanded={isNotificationDrawerOpen}
              >
                {children}
              </Page>
            </AuctionProvider>
          </AuthProvider>
        </body>
      </html>
  );
};
