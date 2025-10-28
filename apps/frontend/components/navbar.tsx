"use client";
import { useState } from "react";
import { CiMenuBurger } from "react-icons/ci";
import { TfiClose } from "react-icons/tfi";
import { FaGithub,FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { GoMail } from "react-icons/go";
import { Button, DropDownLinks } from "@repo/ui/index";
import ToggleMode from "./toggle-mode";

const drop_down_props = {
  label: "Socials",
  class_names: {
    drop_down: "color-secondary color-secondary-content ",
    toggle_btn: "color-secondary color-secondary-content ",
  },
  drop_down_links: [
    {
      label: "GitHub",
      href: "demo",
      icon: <FaGithub className="inline-block w-5 h-auto" />,
    },
    {
      label: "LinkedIn",
      href: "demo",
      icon: <FaLinkedin className="inline-block w-5 h-auto" />,
    },
    {
      label: "X - ",
      href: "demo",
      icon: <FaXTwitter className="inline-block w-5 h-auto" />,
    },
    {
      label: "Email - ",
      href: "demo",
      icon: <GoMail className="inline-block w-5 h-auto" />,
    },
  ],
};

export default function Navbar() {
  const [is_open, set_is_open] = useState(false);
  return (
    <nav
      id="navbar"
      className="color-neutral color-neutral-content sticky top-1 z-50 p-3 mx-3 rounded-full"
    >
      {/* desktop navbar */}
      <div className="flex justify-around items-center">
        {/* logo */}
        <div className="h-10 w-auto rounded-sm overflow-hidden">
          <img
            className="w-full h-full"
            src="/logo.png"
            alt="Sketch Grid Logo"
          />
        </div>

        {/* navigation links */}
        <div className="hidden md:flex gap-1 items-center">
          <Button type="secondary" size="md" text="About" />
          <Button type="secondary" size="md" text="Contact" />
          <DropDownLinks {...drop_down_props} />
        </div>

        {/* cto and other navigations */}
        <div className="hidden md:flex gap-1 items-center">
          <ToggleMode />
          <Button type="success" size="md" text="Get Started" />
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex justify-center items-center color-base-200 color-base-content rounded-full p-2">
          <button
            onClick={() => set_is_open(!is_open)}
            className="inline-flex items-center justify-center"
          >
            <span className="sr-only">Open main menu</span>
            {is_open ? (
              <TfiClose
                className="h-auto w-5 cursor-pointer"
                aria-hidden="true"
              />
            ) : (
              <CiMenuBurger
                className="h-auto w-5 cursor-pointer"
                aria-hidden="true"
              />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {is_open && (
          <div className="md:hidden">
            <div
              className="fixed inset-0 z-49 bg-[rgba(0,0,0,0.85)]"
              onClick={() => set_is_open(false)}
            />
            <div className="color-neutral color-neutral-content fixed right-0 top-0 z-50 h-full w-[300px] p-1">
              <div className="solid-border-b flex h-16 items-center justify-between">
                <span className="text-lg font-semibold">Menu</span>
                <button
                  onClick={() => set_is_open(false)}
                  className="rounded-md p-2 cursor-pointer"
                >
                  <TfiClose
                    className="h-auto w-5 cursor-pointer"
                    aria-hidden="true"
                  />
                </button>
              </div>
              {/* navigation links */}
              <div className="flex flex-col text-center gap-1 p-3">
                <Button type="secondary" size="md" text="About" />
                <Button type="secondary" size="md" text="Contact" />
                <ToggleMode />
                <Button type="success" size="md" text="Get Started" />
                <DropDownLinks {...drop_down_props} />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
