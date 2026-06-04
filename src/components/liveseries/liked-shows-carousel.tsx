"use client";

import type { StackedCarouselSlideProps } from "react-stacked-center-carousel";
import type { Show as TvMazeShow } from "tvmaze-wrapper-ts";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ResponsiveContainer, StackedCarousel } from "react-stacked-center-carousel";

import type { User } from "@/payload-types";
import { getUserShows } from "@/lib/backend/liveseries";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/button";

import { TvShowPreview } from "./tv-show-preview";

const SWIPE_THRESHOLD = 50;

type SlideData = { tvShow: TvMazeShow; user: User | null };

function SlideComponent({ data, dataIndex }: { data: SlideData[]; dataIndex: number }) {
  const item = data[dataIndex];
  if (!item) return null;
  return <TvShowPreview idx={dataIndex} tvShow={item.tvShow} user={item.user} />;
}

export function LikedShowsCarousel({
  likedShows,
  user,
}: {
  likedShows: { [id: number]: TvMazeShow };
  user: User | null;
}) {
  const carouselRef = useRef<StackedCarousel>(null);
  const showIds = getUserShows(user);
  const originalLength = showIds.length;

  const data: SlideData[] = Array.from({ length: 3 }, () =>
    showIds.map((showId) => ({ tvShow: likedShows[showId], user })),
  ).flat();

  const [activeRaw, setActiveRaw] = useState(originalLength);
  const activeIndex = activeRaw % originalLength;

  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const lastDragX = useRef(0);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      lastDragX.current = e.clientX;
    };
    const onMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      const diff = lastDragX.current - dragStartX.current;
      if (Math.abs(diff) > SWIPE_THRESHOLD) {
        if (diff > 0) carouselRef.current?.goBack();
        else carouselRef.current?.goNext();
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      lastDragX.current = e.touches[0].clientX;
    };
    const onTouchEnd = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      const diff = lastDragX.current - dragStartX.current;
      if (Math.abs(diff) > SWIPE_THRESHOLD) {
        if (diff > 0) carouselRef.current?.goBack();
        else carouselRef.current?.goNext();
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("touchend", onTouchEnd);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  if (data.length === 0) return null;

  const onDragStart = (clientX: number) => {
    isDragging.current = true;
    dragStartX.current = clientX;
    lastDragX.current = clientX;
  };

  return (
    <div
      className="group relative select-none"
      style={{ touchAction: "pan-y" }}
      onMouseDown={(e) => onDragStart(e.clientX)}
      onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
    >
      <ResponsiveContainer
        render={(parentWidth) => {
          const slideWidth = Math.max(200, Math.min(parentWidth * 0.55, 260));
          const currentVisibleSlide = parentWidth < 640 ? 3 : 5;
          return (
            <StackedCarousel
              ref={carouselRef}
              data={data}
              carouselWidth={parentWidth}
              slideWidth={slideWidth}
              slideComponent={
                SlideComponent as React.ComponentType<StackedCarouselSlideProps>
              }
              maxVisibleSlide={5}
              currentVisibleSlide={currentVisibleSlide}
              disableSwipe
              onActiveSlideChange={(slide) => setActiveRaw(slide)}
            />
          );
        }}
      />
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 left-2 z-10 size-8 -translate-y-1/2 rounded-full opacity-0 transition-opacity group-hover:opacity-100 sm:left-4 sm:size-10"
        onClick={() => carouselRef.current?.goBack()}
      >
        <ChevronLeft className="size-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 right-2 z-10 size-8 -translate-y-1/2 rounded-full opacity-0 transition-opacity group-hover:opacity-100 sm:right-4 sm:size-10"
        onClick={() => carouselRef.current?.goNext()}
      >
        <ChevronRight className="size-4" />
      </Button>
      <div className="mt-4 flex justify-center gap-1.5">
        {Array.from({ length: originalLength }).map((_, i) => (
          <button
            key={i}
            className={cn("h-2 rounded-full transition-all", {
              "bg-accent w-6": i === activeIndex,
              "bg-primary/40 w-2": i !== activeIndex,
            })}
            onClick={() => {
              const offset = i - activeIndex;
              carouselRef.current?.swipeTo(offset);
            }}
          />
        ))}
      </div>
    </div>
  );
}
