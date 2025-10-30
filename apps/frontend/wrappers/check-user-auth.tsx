import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import { error_notification } from "@/utils/toast.utils";

interface CheckUserAuthProps {
  children: ReactNode;
}
interface CallApi {
  url: string;
  options: RequestInit;
}

// constants
const HTTP_BACKEND_BASE_URL = process.env.NEXT_PUBLIC_HTTP_BACKEND_BASE_URL;

const URL = HTTP_BACKEND_BASE_URL + "/api/v1/auth/check-user-auth";

const OPTIONS: RequestInit = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
};

export default function CheckUserAuth(props: CheckUserAuthProps) {
  const [call_api, set_call_api] = useState<CallApi>({ url: URL, options: OPTIONS });

  // hook for navigations
  const router = useRouter();

  // custom use-fetch hook
  const { data, error, loading } = useFetch<{ message: string }>(call_api);

  // check values from use-fetch hook
  useEffect(() => {
    if (error) {
      error_notification(error);
      router.push("/");
    }
  }, [data, error]);

  if (!loading && data) {
    return props.children;
  } else {
    return <div>Loading...</div>;
  }
}
