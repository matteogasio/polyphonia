// components/schedule/FilterMenu.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from 'next-intl';
import type { RehearsalFilter } from "@/types/index";

export function FilterMenu({
  activeFilters,
}: {
  activeFilters: RehearsalFilter[];
}) {
  const t = useTranslations('Schedule');

  const FILTERS: { label: string; value: RehearsalFilter }[] = [
    { label: t("tutti"), value: "tutti" },
    { label: t("winds"), value: "winds" },
    { label: t("strings"), value: "strings" },
    { label: t("woodwinds"), value: "woodwinds" },
    { label: t("brass"), value: "brass" },
  ];

  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  function pushFilters(filters: RehearsalFilter[]) {
    const params = new URLSearchParams(searchParams);
    params.delete("filter");
    filters.forEach(f => params.append("filter", f));
    router.push(`?${params.toString()}`);
  }

  function toggleFilter(filter: RehearsalFilter) {
    const params = new URLSearchParams(searchParams);
    params.delete("clear");

    const current = params.getAll("filter");

    if (current.includes(filter)) {
      const next = current.filter(f => f !== filter);
      params.delete("filter");
      next.forEach(f => params.append("filter", f));
    } else {
      params.append("filter", filter);
    }

    router.push(`?${params.toString()}`);
  }

  function selectAll() {
    const params = new URLSearchParams(searchParams);
    params.delete("filter");
    params.delete("clear");
    router.push(`?${params.toString()}`);
  }

  function clearAll() {
    const params = new URLSearchParams(searchParams);
    params.delete("filter");
    params.set("clear", "1");
    router.push(`?${params.toString()}`);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const allSelected = activeFilters.length === FILTERS.length;

  activeFilters.length === 0;
  return (
    <div ref={ref} className="relative w-52">
      <button
        onClick={() => setOpen(o => !o)}
        className="inline-flex items-center gap-2 rounded-md border border-stone-400 bg-stone-100 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-stone-200"
      >
        Filter{" "}
      </button>

      {open && (
        <div className="absolute mt-2 w-full border rounded-md bg-white shadow z-20">
          {/* Select / Clear */}
          <div className="flex justify-between px-3 py-2 border-b text-sm">
            <button
              onClick={selectAll}
              disabled={allSelected}
              className="text-blue-600 disabled:text-neutral-400"
            >
              Select all
            </button>
            <button
              onClick={clearAll}
              disabled={activeFilters.length === 0}
              className="text-blue-600 disabled:text-neutral-400"
            >
              Clear all
            </button>
          </div>

          {/* Filters */}
          {FILTERS.map(f => (
            <label
              key={f.value}
              className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-neutral-100"
            >
              <input
                type="checkbox"
                checked={activeFilters.includes(f.value)}
                onChange={() => toggleFilter(f.value)}
              />
              {f.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

