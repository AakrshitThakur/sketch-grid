"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CiMenuBurger } from "react-icons/ci";
import { TfiClose } from "react-icons/tfi";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import { GoSignIn, GoSignOut, GoSearch } from "react-icons/go";
import { FaUserPlus, FaUserGroup } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { BsRocketTakeoffFill } from "react-icons/bs";
import Profile from "./profile";
import { Button, DropDownLinks } from "@repo/ui/index";
import ToggleMode from "./toggle-mode";
import Image from "next/image";

// app navigation bar
export default function Navbar() {
  const [is_open, set_is_open] = useState(false);

  // programmatic navigation
  const router = useRouter();

  // auth drop-down
  const auth_drop_down_props = {
    label: "Sign In",
    class_names: {
      drop_down: "color-secondary color-secondary-content",
      toggle_btn: "color-secondary color-secondary-content ",
    },
    drop_down_links: [
      {
        label: "Sign Up",
        navigate_func: () => router.push("/auth/signup"),
        icon: <FaUserPlus className="w-full h-full" />,
      },
      {
        label: "Sign In",
        navigate_func: () => router.push("/auth/signin"),
        icon: <GoSignIn className="w-full h-full" />,
      },
      {
        label: "Sign Out",
        navigate_func: () => router.push("/auth/signout"),
        icon: <GoSignOut className="w-full h-full" />,
      },
    ],
  };

  // socials drop-down
  const socials_drop_down_props = {
    label: "Socials",
    class_names: {
      drop_down: "color-secondary color-secondary-content ",
      toggle_btn: "color-secondary color-secondary-content ",
    },
    drop_down_links: [
      {
        label: "GitHub",
        navigate_func: () => router.push("https://github.com/AakrshitThakur"),
        icon: <FaGithub className="w-full h-full" />,
      },
      {
        label: "LinkedIn",
        navigate_func: () => router.push("https://www.linkedin.com/in/aakrshit-thakur-14433627b/"),
        icon: <FaLinkedin className="w-full h-full" />,
      },
      {
        label: "X - ",
        navigate_func: () => router.push("https://x.com/AakrshitThakur"),
        icon: <FaSquareXTwitter className="w-full h-full" />,
      },
      {
        label: "Email - ",
        navigate_func: () => router.push("thakurraakrshitt@gmail.com"),
        icon: <IoMdMail className="w-full h-full" />,
      },
    ],
  };

  // rooms-related links
  const rooms_drop_down_links = {
    label: "Rooms",
    class_names: {
      drop_down: "color-secondary color-secondary-content ",
      toggle_btn: "color-secondary color-secondary-content ",
    },
    drop_down_links: [
      {
        label: "View Rooms",
        navigate_func: () => router.push("/rooms"),
        icon: <GoSearch className="w-full h-full" />,
      },
      {
        label: "Join Room",
        navigate_func: () => router.push("/rooms/join"),
        icon: <BsRocketTakeoffFill className="w-full h-full" />,
      },
      {
        label: "Create Room",
        navigate_func: () => router.push("/rooms/create"),
        icon: <FaUserGroup className="w-full h-full" />,
      },
      {
        label: "Delete Room",
        navigate_func: () => router.push("/rooms/delete"),
        icon: <MdDelete className="w-full h-full" />,
      },
    ],
  };

  return (
    <nav id="navbar" className="color-neutral color-neutral-content sticky top-1 z-50 p-3 mx-3 rounded-full">
      {/* desktop navbar */}
      <div className="flex justify-around items-center">
        {/* logo */}
        <Link href="/">
          <div className="h-10 w-auto fixed rounded-sm overflow-hidden">
            <Image className="w-full h-full" src="/logo.png" alt="Sketch Grid Logo" fill={true} />
          </div>
        </Link>

        {/* navigation links */}
        <div className="hidden md:flex gap-2 items-center">
          <Button type="secondary" size="md" text="About" />
          <Button type="secondary" size="md" text="Contact" />
          <DropDownLinks {...socials_drop_down_props} />
        </div>

        {/* cto and other navigation */}
        <div className="hidden md:flex gap-2 items-center">
          <ToggleMode />
          <DropDownLinks {...auth_drop_down_props} />
          <DropDownLinks {...rooms_drop_down_links} />
          <Button type="success" size="md" text="Get Started" on_click={() => router.push("/rooms")} />
          <Profile class_names={{ drop_down_link: "color-secondary color-secondary-content" }} />
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex justify-center items-center color-base-200 color-base-content rounded-full p-2">
          <button onClick={() => set_is_open(!is_open)} className="inline-flex items-center justify-center">
            <span className="sr-only">Open main menu</span>
            {is_open ? (
              <TfiClose className="h-auto w-5 cursor-pointer" aria-hidden="true" />
            ) : (
              <CiMenuBurger className="h-auto w-5 cursor-pointer" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {is_open && (
          <div className="md:hidden">
            <div className="fixed inset-0 z-49 bg-[rgba(0,0,0,0.85)]" onClick={() => set_is_open(false)} />
            <div className="color-neutral color-neutral-content fixed right-0 top-0 z-50 h-full w-[300px] p-1">
              <div className="solid-border-b flex h-16 items-center justify-between">
                <span className="text-lg font-semibold">Menu</span>
                <button onClick={() => set_is_open(false)} className="rounded-md p-2 cursor-pointer">
                  <TfiClose className="h-auto w-5 cursor-pointer" aria-hidden="true" />
                </button>
              </div>
              {/* navigation links */}
              <div className="flex flex-col text-center gap-1 p-3">
                <Button type="secondary" size="md" text="About" />
                <Button type="secondary" size="md" text="Contact" />
                <ToggleMode />
                <DropDownLinks {...socials_drop_down_props} />
                <DropDownLinks {...auth_drop_down_props} />
                <DropDownLinks {...rooms_drop_down_links} />
                <Button type="success" size="md" text="Get Started" on_click={() => router.push("/rooms")} />
                <Profile class_names={{ drop_down_link: "color-secondary color-secondary-content" }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
