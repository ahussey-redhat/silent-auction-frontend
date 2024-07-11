import { i18n } from '@lingui/core';
import { model } from '@modern-js/runtime/model';

const pseudoLocales = {
  'en-PL': 'Ƥśēũďō Ēńĝĺĩśĥ',
};

export const locales = {
  en: 'English',
  ...(process.env.NODE_ENV === 'development' ? pseudoLocales : {}),
};

export type Locale = keyof typeof locales;

type State = {
  locale: Locale;
};

export const isLocale = (value: string): value is Locale => value in locales;

const i18nModel = model<State>('i18n').define((_, { use }) => ({
  state: {
    locale: 'en',
  },
  actions: {
    setLocale(state, locale: string) {
      if (isLocale(locale)) {
        state.locale = locale;
      }
    },
  },
  effects: {
    async activateLocale() {
      const [{ locale }] = use(i18nModel);
      const { messages } = await import(`@/locales/${locale}/messages`);

      i18n.load(locale, messages);
      i18n.activate(locale);
    },
  },
}));

export default i18nModel;
