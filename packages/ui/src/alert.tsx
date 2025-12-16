import { BsFillInfoCircleFill } from "react-icons/bs";
import { SiTicktick } from "react-icons/si";
import { BiSolidMessageSquareError } from "react-icons/bi";
import type { WsResponseStatus } from "@repo/zod/index";

interface AlertProps {
  status: WsResponseStatus;
  class_name?: string;
  text: string;
}

export default function Alert(props: AlertProps) {
  let add_css_to_alert = props.class_name ? `text-sm p-2 rounded-lg ${props.class_name} ` : "text-sm p-2 rounded-lg ";

  switch (props.status) {
    case "info":
      add_css_to_alert += "color-info color-info-content flex justify-center items-center gap-1";
      return (
        <div id="info-alert" className={add_css_to_alert}>
          <span className="inline-block w-5 h-auto">
            <BsFillInfoCircleFill className="w-full h-full" />
          </span>
          {props.text}
        </div>
      );
    case "success":
      add_css_to_alert += "color-success color-success-content flex justify-center items-center gap-1";
      return (
        <div id="success-alert" className={add_css_to_alert}>
          <span className="inline-block w-5 h-auto">
            <SiTicktick className="w-full h-full" />
          </span>
          {props.text}
        </div>
      );
    case "error":
      add_css_to_alert += "color-error color-error-content flex justify-center items-center gap-1";
      return (
        <div id="error-alert" className={add_css_to_alert}>
          <span className="inline-block w-5 h-auto">
            <BiSolidMessageSquareError className="w-full h-full" />
          </span>
          {props.text}
        </div>
      );
  }
}
