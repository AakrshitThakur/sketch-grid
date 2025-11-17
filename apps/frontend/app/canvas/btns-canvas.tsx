"use client";
import { useState } from "react";
import { FaCircle } from "react-icons/fa";
import { RiCheckboxBlankFill } from "react-icons/ri";
import { HiArrowUpRight } from "react-icons/hi2";
import { RxArrowTopRight } from "react-icons/rx";
import { IoText, IoTextOutline, IoPencil } from "react-icons/io5";
import { BiSolidPencil } from "react-icons/bi";
import { BsCursorFill, BsEraserFill } from "react-icons/bs";
import { FaEraser } from "react-icons/fa6";

export default function BtnsCanvas() {
  const BTNS = [
    { text: "Cursor", icon: <BsCursorFill className="w-full h-full" /> },
    { text: "Circle", icon: <FaCircle className="w-full h-full" /> },
    { text: "Box", icon: <RiCheckboxBlankFill className="w-full h-full" /> },
    { text: "Arrow", icon: <RxArrowTopRight className="w-full h-full" /> },
    { text: "Text", icon: <IoTextOutline className="w-full h-full" /> },
    { text: "Pencil", icon: <BiSolidPencil className="w-full h-full" /> },
    { text: "Eraser", icon: <BsEraserFill className="w-full h-full" /> },
  ];
  const [selected_btn_idx, set_selected_btn_idx] = useState<number | null>(null);
  return (
    <div
      id="btns-canvas"
      className="color-accent color-accent-content w-full h-12 flex justify-around items-center gap-3 shrink-0 rounded-full p-1"
    >
      {BTNS.map((btn, idx) => (
        <div
          key={idx}
          onClick={() => set_selected_btn_idx(idx)}
          className={`w-9 h-auto p-1 shrink-0 cursor-pointer rounded-sm ${selected_btn_idx === idx ? "color-success color-success-content" : "hover:bg-[rgba(255,255,255,0.1)]"}`}
        >
          {btn.icon}
        </div>
      ))}
    </div>
  );
}
