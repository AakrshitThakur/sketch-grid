"use client";
import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import { Loading } from "@repo/ui/index";
import { error_notification } from "@/utils/toast.utils";

interface CallApi {
  url: string;
  options: RequestInit;
}

// constants
const HTTP_BACKEND_BASE_URL = process.env.NEXT_PUBLIC_HTTP_BACKEND_BASE_URL;

const URL = HTTP_BACKEND_BASE_URL + "/api/v1/auth/is-user-authenticated";

const OPTIONS: RequestInit = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
};

export default function CheckUserAuth({ children }: { children: ReactNode }) {
  const [call_api, set_call_api] = useState<CallApi>({ url: URL, options: OPTIONS });

  // hook for navigations
  const router = useRouter();

  // custom use-fetch hook
  const { data, error, loading } = useFetch<{ message: string; jwt: string }>(call_api);

  // check values from use-fetch hook
  useEffect(() => {
    if (error) {
      // set "jwt" key's value to an empty-string in local-storage (client-side)
      localStorage.setItem("jwt", "");
      error_notification(error);
      router.push("/auth/signin");
    }
  }, [data, error]);

  if (!loading && data) {
    // set "jwt" key and it's value in local-storage (client-side)
    localStorage.setItem("jwt", data.jwt);
    return children;
  } else {
    return <Loading size="lg" />;
  }
}
