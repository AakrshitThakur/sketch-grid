import { useState, useEffect, useContext, useRef, useCallback } from "react";
import type { InputFetch, ResponseFetch } from "@/types/hooks.types";

function useFetch<T>(props: InputFetch): ResponseFetch<T> {
  // set all the states
  const [states, set_states] = useState<ResponseFetch<T>>({
    data: null,
    error: null,
    loading: true,
  });

  // to abort previous running api call
  const controller_ref = useRef<AbortController | null>(null);

  // returning memoized version to call unique apis
  const fetch_api = useCallback(async () => {
    if (!props.url) {
      set_states({ data: null, error: null, loading: false });
      return;
    }
    // set initial states
    set_states({ data: null, error: null, loading: true });

    // abort previous api call
    controller_ref.current?.abort();

    // assign new abort controller instance
    controller_ref.current = new AbortController();

    try {
      // The signal read-only property of the AbortController interface returns an AbortSignal object instance, which can be used to communicate with/abort an asynchronous operation as desired.
      const res = await fetch(props.url, {
        ...props.options,
        signal: controller_ref.current?.signal,
      });

      // not getting 200 status code
      if (!res.ok) {
        const json = await res.json();
        set_states({ data: null, error: json.message, loading: false });
        return;
      }

      // success response
      const json = await res.json();
      set_states({ data: json.data, error: null, loading: false });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        console.error(error.message);
        set_states({ data: null, error: error.message, loading: false });
      } else if (error instanceof Error) {
        console.error(error.message);
        set_states({ data: null, error: error.message, loading: false });
      } else {
        console.error(error as string);
        set_states({ data: null, error: error as string, loading: false });
      }
    }
  }, [props.url, props.options]);

  // call memoized function
  useEffect(() => {
    async function exec() {
      await fetch_api();
    }
    exec();
  }, [fetch_api]);

  // return all states
  return states;
}

export default useFetch;
