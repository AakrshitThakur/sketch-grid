"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import type { RoomTable } from "@repo/types/index";
import { Card, Heading, Loading } from "@repo/ui/index";
import { success_notification, error_notification } from "@/utils/toast.utils";
import { BsTrash } from "react-icons/bs";

interface CallApi {
  url: string;
  options: RequestInit;
}
interface UseFetchResponse {
  rooms: RoomTable[];
  message: string;
}

// constants
const HTTP_BACKEND_BASE_URL = process.env.NEXT_PUBLIC_HTTP_BACKEND_BASE_URL;

const URL = HTTP_BACKEND_BASE_URL + "/api/v1/rooms/mine";

const OPTIONS: RequestInit = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
};

export default function MyRooms() {
  const [call_api, set_call_api] = useState<CallApi>({ url: URL, options: OPTIONS });

  // hook for navigation
  const router = useRouter();

  // custom use-fetch hook
  const { data, error, loading } = useFetch<UseFetchResponse>(call_api);

  // check values from use-fetch hook
  useEffect(() => {
    if (data) {
      success_notification(data.message);
    } else if (error) {
      error_notification(error);
      // set use-fetch hook to initial state
      set_call_api({ url: "", options: {} });
    }
  }, [data, error]);

  return (
    <div
      id="my-rooms"
      className="color-base-100 color-base-content min-h-[65vh] flex justify-center items-center bg-linear-to-b to-blue-500 p-5 sm:p-7 md:p-9"
    >
      {!loading && data ? (
        <Card class_name="color-accent color-accent-content items-center space-y-1 p-3 sm:p-4 md:p-5 rounded-xl" size="xl">
          <Heading class_name="text-center mb-3 sm:mb-4 md:mb-5" size="h2" text="Viewing Rooms" />
          {data?.rooms.map((room) => (
            <button
              type="button"
              key={room.id}
              onClick={() => router.push(`/rooms/whiteboard/${room.slug}`)}
              className="color-base-300 color-base-content flex items-center gap-2 rounded-md cursor-pointer p-2"
            >
              <span className="text-md">{room.slug}&nbsp;|&nbsp;</span>
              <span className="text-xs">{new Date(room.createdAt).toLocaleString()}</span>
              <ul className="text-xs">- Click to join</ul>
              <span className="flex justify-center items-center w-5 sm:w-6 md:w-7 rounded-[50%] color-error color-error-content p-1">
                <BsTrash className="inline-block w-full h-full" />
              </span>
            </button>
          ))}
        </Card>
      ) : (
        <Loading size="lg" />
      )}
    </div>
  );
}
