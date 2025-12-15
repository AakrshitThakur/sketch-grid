"use client";
import { useEffect, useState } from "react";
import { CiDark, CiLight } from "react-icons/ci";

// dark/light mode toggle button
export default function ToggleMode() {
  // state to manage dark-mode
  const [is_dark_mode, set_is_dark_mode] = useState(false);

  // check prev saved mode
  useEffect(() => {
    const get_dark_mode_status = localStorage.getItem("dark-mode") === "true";

    // change from light to dark
    if (get_dark_mode_status) {
      document.documentElement.classList.add("dark-mode"); 
      // call setter function after side-effect is fully executed
      setTimeout(() => set_is_dark_mode(true), 0);
    }
  }, []);

  // toggle-mode
  function toggle_mode() {
    if (is_dark_mode) {
      document.documentElement.classList.remove("dark-mode");
      localStorage.setItem("dark-mode", "false");
      set_is_dark_mode(false);
      return;
    }
    document.documentElement.classList.add("dark-mode");
    localStorage.setItem("dark-mode", "true");
    set_is_dark_mode(true);
  }
  return (
    <span id="toggle-mode" onClick={toggle_mode} className="flex justify-center items-center">
      {is_dark_mode ? <CiLight className="w-6 h-auto cursor-pointer" /> : <CiDark className="w-6 h-auto cursor-pointer" />}
    </span>
  );
}
