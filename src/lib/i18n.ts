'use client';

import { useSyncExternalStore } from 'react';

export type Locale = 'en' | 'fr' | 'ar';

export const LOCALES: Locale[] = ['en', 'fr', 'ar'];
export const LOCALE_LABEL: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  ar: 'العربية',
};
export const LOCALE_DIR: Record<Locale, 'ltr' | 'rtl'> = {
  en: 'ltr',
  fr: 'ltr',
  ar: 'rtl',
};

/**
 * UI chrome strings only (header, footer, navigation, page titles).
 * Clinical content (foundations, modalities, integration scenarios) stays English at v1
 *, translation requires real medical translators, not auto-translation.
 */
export const STRINGS: Record<string, Record<Locale, string>> = {
  'nav.foundations': { en: 'Foundations', fr: 'Fondamentaux', ar: 'الأساسيات' },
  'nav.modalities': { en: 'Modalities', fr: 'Modalités', ar: 'الطرائق' },
  'nav.integration': { en: 'Integration', fr: 'Intégration', ar: 'التكامل' },
  'nav.pediatrics': { en: 'Pediatrics', fr: 'Pédiatrie', ar: 'طب الأطفال' },
  'nav.evidence': { en: 'Evidence', fr: 'Preuves', ar: 'الأدلة' },
  'nav.glossary': { en: 'Glossary', fr: 'Glossaire', ar: 'مسرد' },
  'nav.search': { en: 'Search', fr: 'Recherche', ar: 'بحث' },
  'header.tagline': {
    en: 'Multimodal Neuromonitoring',
    fr: 'Neuromonitorage multimodal',
    ar: 'المراقبة العصبية متعددة الوسائط',
  },
  'header.toggle.essentials': { en: 'Essentials', fr: 'Essentiel', ar: 'الأساسي' },
  'header.toggle.deep': { en: 'Deep dive', fr: 'Approfondi', ar: 'متعمق' },
  'lang.banner': {
    en: '',
    fr:
      'La navigation et le chapitre « Autorégulation » sont traduits en français. Les autres pages cliniques restent en anglais à la v1, relecture par un traducteur médical recommandée avant déploiement.',
    ar: 'تمت ترجمة التنقل وفصل «التنظيم الذاتي للأوعية الدماغية» إلى العربية. الصفحات السريرية الأخرى لا تزال بالإنجليزية في الإصدار الأول, يُنصح بمراجعة مترجم طبي قبل النشر.',
  },
};

const STORAGE_KEY = 'mnm-locale';
const EVENT_NAME = 'mnm-locale-change';

export function getLocale(): Locale {
  if (typeof document === 'undefined') return 'en';
  const attr = document.documentElement.getAttribute('lang');
  return (attr === 'fr' || attr === 'ar') ? attr : 'en';
}

export function setLocale(next: Locale): void {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('lang', next);
  document.documentElement.setAttribute('dir', LOCALE_DIR[next]);
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: next }));
}

function subscribeLocale(onStoreChange: () => void): () => void {
  window.addEventListener(EVENT_NAME, onStoreChange);
  return () => window.removeEventListener(EVENT_NAME, onStoreChange);
}

// The locale lives in the DOM lang attribute (set by the no-flash bootstrap script
// and by setLocale), an external store read with useSyncExternalStore. getLocale is
// SSR-safe (returns 'en' when there is no document), so it is both the client and
// server snapshot, keeping SSR consistent with the en default.
export function useLocale(): Locale {
  return useSyncExternalStore(subscribeLocale, getLocale, getLocale);
}

export function t(key: string, locale?: Locale): string {
  const loc = locale ?? getLocale();
  const entry = STRINGS[key];
  if (!entry) return key;
  return entry[loc] ?? entry.en ?? key;
}

export const LOCALE_BOOTSTRAP_SCRIPT = `(function(){try{var l=localStorage.getItem('${STORAGE_KEY}')||'en';document.documentElement.setAttribute('lang',l);document.documentElement.setAttribute('dir', l==='ar'?'rtl':'ltr');}catch(e){document.documentElement.setAttribute('lang','en');document.documentElement.setAttribute('dir','ltr');}})();`;
