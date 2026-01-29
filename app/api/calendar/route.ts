// app/api/calendar/route.ts
import { NextResponse } from 'next/server';
import rehearsalsData from '@/content/schedule/rehearsals.json';
import type { RehearsalFilter } from '@/types/index';
import type { Rehearsal } from '@/types/index';

/*
interface Rehearsal {
  date: string;
  date_end?: string;
  time?: string;
  location?: string;
  notes_de: string;
  notes_en: string;
}
*/

const ALL_FILTERS: RehearsalFilter[] = [
  "tutti",
  "strings",
  "winds",
  "woodwinds",
  "brass",
];

function formatICSDate(date: Date, allDay = false): string {
  if (allDay) {
    return date.toISOString().split('T')[0].replace(/-/g, '');
  }
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function escapeText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

function generateICS(rehearsals: Rehearsal[], locale: string): string {
  const events = rehearsals
    .map((rehearsal) => {
      const summaryText =
        (locale === 'de' ? rehearsal.notes_de : rehearsal.notes_en)
        ?? rehearsal.notes ?? '';
      const summary = `Polyphonia – ${summaryText}`;
      const uid = `${rehearsal.date}-${summaryText.replace(/\s/g, '-').toLowerCase()}@polyphonia.ch`;

      let start: Date;
      let end: Date;
      let allDay = false;

      if (rehearsal.time) {
        const match = rehearsal.time.match(/^(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})$/);
        if (match) {
          const [_, sh, sm, eh, em] = match;
          start = new Date(`${rehearsal.date}T${sh.padStart(2, '0')}:${sm}:00`);
          end = new Date(`${rehearsal.date}T${eh.padStart(2, '0')}:${em}:00`);
        } else {
          start = new Date(`${rehearsal.date}T12:00:00`);
          end = new Date(`${rehearsal.date}T13:00:00`);
        }
      } else if (rehearsal.date_end) {
        start = new Date(rehearsal.date);
        end = new Date(rehearsal.date_end);
        end.setDate(end.getDate() + 1);
        allDay = true;
      } else {
        start = new Date(rehearsal.date);
        end = new Date(start);
        end.setDate(end.getDate() + 1);
        allDay = true;
      }

      const lines = [
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${formatICSDate(new Date())}`,
        `DTSTART${allDay ? ';VALUE=DATE' : ''}:${formatICSDate(start, allDay)}`,
        `DTEND${allDay ? ';VALUE=DATE' : ''}:${formatICSDate(end, allDay)}`,
        `SUMMARY:${escapeText(summary)}`,
      ];

      if (rehearsal.location) {
        lines.push(`LOCATION:${escapeText(rehearsal.location)}`);
      }

      lines.push('END:VEVENT');
      return lines.join('\r\n');
    })
    .join('\r\n');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Polyphonia Zürich//Rehearsal Schedule//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Polyphonia Rehearsals',
    'X-WR-TIMEZONE:Europe/Zurich',
    events,
    'END:VCALENDAR',
  ].join('\r\n');
}

function resolveFilters(
  rawFilters: string[],
  clear: boolean
): RehearsalFilter[] {
  if (clear) return [];
  const filters = rawFilters.filter((f) => ALL_FILTERS.includes(f as RehearsalFilter)) as RehearsalFilter[];
  return filters.length > 0 ? filters : ALL_FILTERS;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'en';

  const rawFilters = searchParams.getAll("filter");
  const clear = searchParams.get("clear") === "1";

  const filters = resolveFilters(rawFilters, clear);

  // filter rehearsals by type
  const filteredRehearsals = (rehearsalsData as Rehearsal[]).filter((r) =>
    filters.includes(r.section)
  );

  const ics = generateICS(filteredRehearsals, locale);

  return new NextResponse(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="polyphonia-rehearsals.ics"',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  });
}

