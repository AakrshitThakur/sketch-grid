"use client";
import { useState, useEffect, useRef } from "react";
import { SiGoogleclassroom } from "react-icons/si";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import CheckUserAuth from "@/wrappers/check-user-auth";
import type { RoomTable } from "@repo/types/index";
import { Card, Heading, Loading } from "@repo/ui/index";
import { success_notification, error_notification } from "@/utils/toast.utils";

function DrawCanvas() {
  const canvas_ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvas_ref.current;
    console.info(canvas);
    if (!canvas) return;

    // using 2d-canvas context
    const ctx = canvas.getContext("2d");
    console.info(ctx);
    if (!ctx) return;

    console.info(ctx);

    ctx.fillStyle = "purple";
    ctx.fillRect(50, 50, 25, 25);
  }, []);

  return <canvas ref={canvas_ref} style={{ width: "100%", height: "100%" }} className="shrink-0 border rounded-xl" />;
}

export default function Draw() {
  return (
    <div
      id="rooms"
      className="color-base-100 color-base-content min-h-[85vh] flex flex-col justify-center items-center gap-2 bg-linear-to-b to-blue-500 p-3 sm:p-5 md:p-7"
    >
      <div className="flex justify-center items-center gap-2">
        <Heading size="h3" text="Whiteboard" />
        <SiGoogleclassroom className="inline-block w-9 h-auto" />
      </div>
      <CheckUserAuth>
        <DrawCanvas />
      </CheckUserAuth>
    </div>
  );
}
