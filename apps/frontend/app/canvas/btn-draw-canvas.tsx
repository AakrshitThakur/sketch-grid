"use client";
interface BtnDrawCanvasProps {
  id: string;
  selected_btn_id: string | null;
  icon: React.ReactElement;
  on_click: () => void;
}

export default function BtnDrawCanvas(props: BtnDrawCanvasProps) {
  return (
    <div
      id="btn-draw-canvas"
      key={props.id}
      onClick={props.on_click}
      className={`w-5 sm:w-6 md:w-7 h-auto p-1 shrink-0 cursor-pointer rounded-sm ${props.selected_btn_id === props.id ? "color-success color-success-content" : "hover:bg-[rgba(255,255,255,0.1)]"}`}
    >
      {props.icon}
    </div>
  );
}
