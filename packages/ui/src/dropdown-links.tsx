"use client";
import { useEffect, useRef, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

interface DropDownLink {
  label: string;
  navigate_func: () => void;
  icon: React.ReactElement;
}

interface DropDownLinksProps {
  label: string;
  class_names?: {
    drop_down?: string;
    toggle_btn?: string;
  };
  drop_down_links: DropDownLink[];
}

export default function DropDownLinks(props: DropDownLinksProps) {
  const [open, set_open] = useState(false);
  const container_ref = useRef<HTMLDivElement | null>(null);

  // close dropdown when clicking outside
  useEffect(() => {
    function handle_click_outside(e: MouseEvent) {
      if (container_ref.current && !container_ref.current.contains(e.target as Node)) {
        set_open(false);
      }
    }
    document.addEventListener("mousedown", handle_click_outside);
    return () => {
      document.removeEventListener("mousedown", handle_click_outside);
    };
  }, []);

  return (
    <div
      ref={container_ref}
      id="dropdown-links"
      className={`flex flex-col gap-1 text-nowrap cursor-pointer text-sm rounded-md ${props.class_names?.toggle_btn}`}
    >
      <div className="relative">
        {/* selected display */}
        <button
          type="button"
          onClick={() => set_open((prev) => !prev)}
          className="w-full rounded-lg flex justify-center items-center p-1"
        >
          {props.label && <label className="font-medium cursor-pointer pr-1">{props.label}</label>}
          {open ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </button>

        {/* dropdown options */}
        {open && (
          <div
            className={`absolute z-10 p-1 top-[105%] left-[50%] -translate-x-[50%] rounded-md ${props.class_names?.drop_down}`}
          >
            {props.drop_down_links.map((link, idx) => (
              <div
              key={idx}
                onClick={() => {
                  set_open(false);
                  link.navigate_func();
                }}
                className="flex justify-center items-center gap-1 cursor-pointer px-3 py-2"
              >
                <span>{link.label}</span>
                <span className="inline-block w-5 h-auto">{link.icon}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
