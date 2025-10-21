// components/Navigation.tsx
'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navigation() {
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/concerts`, label: t('concerts') },
    { href: `/${locale}/schedule`, label: t('schedule') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/join`, label: t('join') },
    { href: `/${locale}/contact`, label: t('contact') },
  ];

  const switchLocale = (newLocale: string) => {
    const currentPath = pathname.replace(`/${locale}`, '');
    return `/${newLocale}${currentPath}`;
  };

  return (
    <nav className="border-b border-stone-300 bg-stone-200">
      <div className="container mx-auto px-6 py-4 max-w-4xl">
        <div className="flex justify-between items-center">
          <Link href={`/${locale}`} className="text-xl font-semibold font-serif text-neutral-900 hover:text-red-600 transition-colors">
            Polyphonia
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {links.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-neutral-600 hover:text-red-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            
            <div className="flex items-center gap-1 ml-2">
              <Link
                href={switchLocale('de')}
                className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                  locale === 'de'
                    ? 'bg-red-600 text-white'
                    : 'text-neutral-500 hover:text-red-600'
                }`}
              >
                DE
              </Link>
              <Link
                href={switchLocale('en')}
                className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                  locale === 'en'
                    ? 'bg-red-600 text-white'
                    : 'text-neutral-500 hover:text-red-600'
                }`}
              >
                EN
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-neutral-900 hover:text-red-600 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-stone-300">
            <div className="flex flex-col gap-3">
              {links.slice(1).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm text-neutral-600 hover:text-red-600 transition-colors py-2"
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="flex items-center gap-2 pt-2 mt-2 border-t border-stone-300">
                <Link
                  href={switchLocale('de')}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                    locale === 'de'
                      ? 'bg-red-600 text-white'
                      : 'text-neutral-500 hover:text-red-600 border border-stone-300'
                  }`}
                >
                  DE
                </Link>
                <Link
                  href={switchLocale('en')}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                    locale === 'en'
                      ? 'bg-red-600 text-white'
                      : 'text-neutral-500 hover:text-red-600 border border-stone-300'
                  }`}
                >
                  EN
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
