interface Props {
  selected_btn_id: string | null;
  start_point: { x: number; y: number };
  end_point: { x: number; y: number };
  ctx: CanvasRenderingContext2D;
}

// const BTNS_CANVAS = [
//   { id: "cursor", icon: <BsCursorFill className="w-full h-full" /> },
//   { id: "circle", icon: <FaCircle className="w-full h-full" /> },
//   { id: "box", icon: <RiCheckboxBlankFill className="w-full h-full" /> },
//   { id: "arrow", icon: <HiOutlineArrowRight className="w-full h-full" /> },
//   { id: "text", icon: <IoText className="w-full h-full" /> },
//   { id: "pencil", icon: <BiSolidPencil className="w-full h-full" /> },
//   { id: "eraser", icon: <BsEraserFill className="w-full h-full" /> },
// ];

export default function mouse_move_draw_canvas(props: Props) {
  switch (props.selected_btn_id) {
    case "circle": {
      const radius = Math.sqrt(
        Math.pow(props.end_point.x - props.start_point.x, 2) + Math.pow(props.end_point.y - props.start_point.y, 2)
      );
      console.info("radius", radius);
      props.ctx.beginPath();
      props.ctx.arc(props.start_point.x, props.start_point.y, radius, 0, 2 * Math.PI, false);
      props.ctx.stroke();
    }
  }
}
