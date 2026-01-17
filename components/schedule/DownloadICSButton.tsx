// components/schedule/DownloadICSButton.tsx
"use client";

import { Rehearsal } from "@/types";

export function DownloadICSButton({
  rehearsals,
  locale,
}: {
  rehearsals: Rehearsal[];
  locale: string;
}) {
  function formatICSDate(date: Date): string {
    return date
      .toISOString()
      .replace(/[-:]/g, "")
      .split(".")[0] + "Z";
  }

  function escapeText(text: string): string {
    return text
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,")
      .replace(/\n/g, "\\n");
  }

  function generateICS(): string {
    const events = rehearsals
      .map((rehearsal) => {
        const displayTime =
          rehearsal.time_de ||
          rehearsal.time_en ||
          rehearsal.time ||
          "12:00";

        const match = displayTime.match(/^(\d{1,2}):(\d{2})/);
        const hours = match ? match[1].padStart(2, "0") : "12";
        const minutes = match ? match[2] : "00";

        const start = new Date(
          `${rehearsal.date}T${hours}:${minutes}:00`
        );

        // Default duration: 2 hours
        const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

        const summary =
          rehearsal.notes_de ||
          rehearsal.notes_en ||
          rehearsal.notes ||
          "Rehearsal";

        return `
BEGIN:VEVENT
UID:${crypto.randomUUID()}
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(start)}
DTEND:${formatICSDate(end)}
SUMMARY:${escapeText(summary)}
${rehearsal.location ? `LOCATION:${escapeText(rehearsal.location)}` : ""}
END:VEVENT`;
      })
      .join("");

    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Your Website//Schedule//EN
CALSCALE:GREGORIAN
${events}
END:VCALENDAR`;
  }

  function handleDownload() {
    const ics = generateICS();
    const blob = new Blob([ics], {
      type: "text/calendar;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "rehearsals.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={handleDownload}
      className="mb-8 inline-flex items-center gap-2 rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
    >
      Download calendar (.ics)
    </button>
  );
}
