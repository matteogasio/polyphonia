// app/[locale]/schedule/page.tsx

import { getTranslations } from "next-intl/server";
import {
  filter_rehearsals,
  get_grouped_rehearsals,
  get_chrono_rehearsals
} from "@/lib/schedule";
import { RehearsalItems } from "@/components/schedule/RehearsalItems";
import { DownloadICSButton } from "@/components/schedule/DownloadICSButton";
import { FilterMenu } from "@/components/schedule/FilterMenu";
import type { RehearsalFilter } from "@/types/index";

const ALL_FILTERS: RehearsalFilter[] = [
  "tutti",
  "strings",
  "winds",
  "woodwinds",
  "brass",
];

export default async function SchedulePage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    filter?: RehearsalFilter
    clear?: "1";
  }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;

  const filters: RehearsalFilter[] =
    sp.clear === "1"
      ? []
      : sp.filter
        ? Array.isArray(sp.filter)
          ? sp.filter
          : [sp.filter]
        : ALL_FILTERS;

  const t = await getTranslations("Schedule");

  const chronoRehearsals = get_chrono_rehearsals();
  const filteredRehearsals = filter_rehearsals(chronoRehearsals, filters)
  const groupedRehearsals = get_grouped_rehearsals(filteredRehearsals, locale);

  return (
    <div>
      <h1 className="text-4xl font-serif font-semibold mb-3 text-neutral-900">
        {t("title")}
      </h1>
      <p className="text-neutral-800 mb-10 text-sm">{t("subtitle")}</p>

      <div className="flex gap-4 mb-8">
        <DownloadICSButton locale={locale} />
        <FilterMenu activeFilters={filters} />
      </div>

      <RehearsalItems groupedRehearsals={groupedRehearsals} locale={locale} />
    </div>
  );
}

