import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { useModel } from '@modern-js/runtime/model';
import { Outlet, useLocation } from '@modern-js/runtime/router';
import '@patternfly/react-core/dist/styles/base.css';
import { useEffectOnce, useUpdateEffect } from 'react-use';
import { AuthProvider, Favicon } from '@/components';
import { messages } from '@/locales/en/messages';
import i18nModel from '@/models/i18n';

i18n.load('en', messages);
i18n.activate('en');

export default () => {
  const [, { activateLocale, setLocale }] = useModel(i18nModel);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const localeParam = searchParams.get('locale');

  useEffectOnce(() => {
    if (localeParam) {
      setLocale(localeParam);
    }

    activateLocale();
  });

  useUpdateEffect(() => {
    if (localeParam) {
      setLocale(localeParam);
      activateLocale();
    }
  }, [localeParam]);

  return (
    // @ts-ignore
    <I18nProvider i18n={i18n}>
      <AuthProvider>
        <Favicon />
        <Outlet />
      </AuthProvider>
    </I18nProvider>
  );
};
