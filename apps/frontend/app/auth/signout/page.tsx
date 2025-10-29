"use client";
import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import { FaSignOutAlt } from "react-icons/fa";
import { success_notification, error_notification } from "@/utils/toast.utils";
import { Button } from "@repo/ui/index";

interface CallApi {
  url: string;
  options: RequestInit;
}

// constants
const HTTP_BACKEND_BASE_URL = process.env.NEXT_PUBLIC_HTTP_BACKEND_BASE_URL;

const URL = HTTP_BACKEND_BASE_URL + "/api/v1/auth/signout";

const OPTIONS: RequestInit = {
  method: "DELETE",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
};

export default function Signin() {
  const [call_api, set_call_api] = useState<CallApi>({ url: "", options: {} });

  // hook for navigations
  const router = useRouter();

  // custom use-fetch hook
  const { data, error, loading } = useFetch<{ message: string }>(call_api);

  // on-submit function
  function sign_out(e: React.FormEvent) {
    // call custom use-fetch hook
    set_call_api({
      url: URL,
      options: OPTIONS,
    });
  }

  // one step back in the browser’s history
  function go_back() {
    router.back();
  }

  // check values from use-fetch hook
  useEffect(() => {
    if (data) {
      success_notification(data.message);
      router.push("/");
    } else if (error) {
      error_notification(error);
      // set use-fetch hook to initial state
      set_call_api({
        url: "",
        options: {},
      });
    }
  }, [data, error]);

  return (
    <div
      id="signout"
      className="color-base-100 color-base-content bg-linear-to-b to-red-500 overflow-hidden p-5 sm:p-7 md:p-9"
    >
      <div className="flex flex-col items-center justify-center overflow-hidden">
        <div className="color-accent color-accent-content w-full max-w-md h-auto space-y-5 p-5 rounded-2xl">
          {/* header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="color-primary p-3 rounded-full">
                <FaSignOutAlt className="h-8 w-8 color-primary-content" />
              </div>
            </div>
            <h3 className="text-3xl font-bold">SketchGrid</h3>
          </div>

          <div className="color-base-200 color-base-content rounded-xl">
            {/* card-header */}
            <div className="space-y-1 px-5 pt-3">
              <h2 className="text-2xl font-semibold text-center">Sign Out</h2>
              <p className="text-base text-center">Are you sure you want to sign out?</p>
            </div>

            {/* card-content */}
            <div className="flex justify-center items-center gap-2 p-3">
              <button
                type="button" 
                onClick={sign_out}
                className="color-error color-error-content font-medium text-sm px-2 py-1 rounded-md cursor-pointer"
                disabled={loading}
                aria-describedby="signout-button-description"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Signing Out...
                  </div>
                ) : (
                  "Sign Out"
                )}
              </button>
              <Button type="neutral" size="md" text="Go Back" on_click={go_back} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
