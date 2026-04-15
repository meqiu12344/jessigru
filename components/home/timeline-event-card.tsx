import Image from "next/image";
import type { TimelineEvent } from "@/lib/timeline";

type TimelineEventCardProps = {
  event: TimelineEvent;
};

function hasRenderableImage(image: string | undefined) {
  return typeof image === "string" && image.length > 0;
}

export function TimelineEventCard({ event }: TimelineEventCardProps) {
  return (
    <article className="glass-card timeline-card overflow-hidden rounded-3xl">
      <div className="grid gap-0 md:grid-cols-[220px_1fr]">
        <div className="relative h-44 md:h-full">
          {hasRenderableImage(event.image) ? (
            <Image
              src={event.image}
              alt={event.title}
              fill
              unoptimized={event.image.startsWith("data:") || event.image.startsWith("http")}
              className="timeline-image object-cover"
              sizes="(max-width: 768px) 100vw, 220px"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-rose-100 via-white to-fuchsia-100">
              <span className="text-sm font-medium text-zinc-500">Brak zdjęcia</span>
            </div>
          )}
        </div>

        <div className="p-5 md:p-6">
          <time className="text-sm font-medium text-rose-500">{event.date}</time>
          <h3 className="mt-2 text-xl font-semibold text-zinc-800">{event.title}</h3>
          <p className="mt-2 text-zinc-600">{event.description}</p>
        </div>
      </div>
    </article>
  );
}