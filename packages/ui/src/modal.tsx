"use client";
import { useEffect, useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";

interface ModalProps {
  is_open: boolean;
  on_close: () => void;
  children?: React.ReactNode;
}

export default function Modal(props: ModalProps) {
  const modal_ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // execute props.on_close() when clicked "Escape" key-btn
    const handle_escape = (e: KeyboardEvent) => e.key === "Escape" && props.on_close();

    if (props.is_open) document.addEventListener("keydown", handle_escape);
    return () => document.removeEventListener("keydown", handle_escape);
  }, []);

  if (!props.is_open) return null;

  // target is what you clicked. currentTarget is who is listening
  const handle_backdrop_click = (e: React.MouseEvent) => e.target === e.currentTarget && props.on_close();

  return (
    <section
      id="modal"
      className="fixed inset-0 z-50 flex justify-center items-center bg-[rgba(0,0,0,0.85)] p-3 sm:p-4 md:p-5"
      onClick={handle_backdrop_click}
    >
      <div ref={modal_ref} className="relative color-base-300 color-base-content shrink-0 w-full max-w-md h-auto" role="dialog" aria-modal={true}>
        <button onClick={props.on_close} className="absolute right-1 top-1">
          <AiOutlineClose className="w-full h-full" />
        </button>
        jsdflkjaklsdfkljalsdkjf;kls
      </div>
    </section>
  );
}
