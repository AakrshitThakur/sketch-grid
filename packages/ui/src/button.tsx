// stitching css package/style into this Next.js app
import "@repo/styles/global";

type ButtonType = "primary" | "secondary" | "neutral" | "success" | "error";

interface ButtonParams {
  type: ButtonType;
  size: "sm" | "md" | "lg";
  text: string;
  on_click?: () => void;
}

export default function Button(props: ButtonParams) {
  // add css to button
  let add_css_to_btn = "cursor-pointer  ";

  switch (props.type) {
    case "primary":
      add_css_to_btn += "color-primary color-primary-content ";
      break;
    case "secondary":
      add_css_to_btn += "color-secondary color-secondary-content ";
      break;
    case "neutral":
      add_css_to_btn += "color-neutral color-neutral-content ";
      break;
    case "success":
      add_css_to_btn += "color-success color-success-content ";
      break;
    case "error":
      add_css_to_btn += "color-error color-error-content ";
      break;
    default:
      add_css_to_btn += "color-primary color-primary-content ";
  }

  switch (props.size) {
    case "sm":
      add_css_to_btn += "text-xs px-2 py-1 rounded-sm ";
      break;
    case "md":
      add_css_to_btn += "text-sm px-2 py-1 rounded-md ";
      break;
    case "lg":
      add_css_to_btn += "text-base px-3 py-2 rounded-lg";
      break;
  }

  return (
    <button id="button" onClick={props.on_click} className={add_css_to_btn}>
      {props.text || "Click Me"}
    </button>
  );
}
