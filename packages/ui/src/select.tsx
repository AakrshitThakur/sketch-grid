"use client";
import { useState, useEffect, useRef } from "react";

interface Option<T extends string | number> {
  label: string;
  value: T;
}

interface SelectProps<T extends string | number> {
  label?: string;
  value: T | null;
  options: Option<T>[];
  on_change: (value: T) => void;
  placeholder?: string;
  class_name: string;
}

function Select<T extends string | number>(props: SelectProps<T>) {
  const [open, set_open] = useState(false);
  const container_ref = useRef<HTMLDivElement | null>(null);

  // close dropdown when clicking outside
  useEffect(() => {
    const handle_click_outside = (e: MouseEvent) => {
      if (
        container_ref.current &&
        !container_ref.current.contains(e.target as Node)
      ) {
        set_open(false);
      }
    };
    document.addEventListener("mousedown", handle_click_outside);
    return () =>
      document.removeEventListener("mousedown", handle_click_outside);
  }, []);

  // get selected-option
  const selected_option = props.options.find(
    (option) => option.value === props.value
  );

  return (
    <div
      ref={container_ref}
      id="select"
      className={`flex flex-col gap-1 ${props.class_name}`}
    >
      {props.label && (
        <label className="text-sm font-medium text-gray-700">
          {props.label}
        </label>
      )}

      <div className="relative">
        {/* selected display */}
        <button
          type="button"
          onClick={() => set_open((prev) => !prev)}
          className={`w-full p-2 border rounded-lg flex justify-between items-center text-sm bg-white hover:bg-gray-50 transition ${open ? "ring-2 ring-blue-500 border-blue-500" : ""}`}
        >
          <span>
            {selected_option ? selected_option.label : props.placeholder}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-4 h-4 ml-2 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* dropdown options */}
        {open && (
          <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-auto animate-fadeIn">
            {props.options.map((option) => (
              <div
                key={option.value}
                onClick={() => {
                  props.on_change(option.value);
                  set_open(false);
                }}
                className={`cursor-pointer px-3 py-2 text-sm hover:bg-blue-100 ${
                  props.value === option.value
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : ""
                }`}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Select;
