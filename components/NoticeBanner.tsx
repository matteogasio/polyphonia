// components/NoticeBanner.tsx
'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { noticeConfig } from '@/lib/notice';

export default function NoticeBanner() {
  const t = useTranslations('Notice');
  const locale = useLocale();

  if (!noticeConfig.enabled) {
    return null;
  }

  const typeStyles = {
    info: 'bg-amber-100 text-amber-900 border-amber-300',
    warning: 'bg-orange-100 text-orange-900 border-orange-300',
    urgent: 'bg-red-100 text-red-900 border-red-300',
  };

  const linkStyles = {
    info: 'text-amber-900 hover:text-amber-950',
    warning: 'text-orange-900 hover:text-orange-950',
    urgent: 'text-red-900 hover:text-red-950',
  };

  return (
    <div className={`${typeStyles[noticeConfig.type]} px-6 py-2.5 rounded-3xl border shadow-lg flex flex-col sm:flex-row items-center justify-center gap-3`}>
      <p className="text-sm font-medium text-center sm:text-left">
        {t(noticeConfig.messageKey)}
      </p>
      <Link 
        href={`/${locale}/join`}
        className={`${linkStyles[noticeConfig.type]} text-sm font-medium transition-colors whitespace-nowrap`}
      >
        {t('learnMore')} →
      </Link>
    </div>
  );
}
