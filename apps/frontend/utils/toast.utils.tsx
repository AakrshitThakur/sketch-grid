import { toast } from "react-toastify";
import { FaCheckCircle, FaInfoCircle } from "react-icons/fa";
import { MdError } from "react-icons/md";
import { TOAST_UI } from "@/constants/toast.constants";

// className property will be applied to .Toastify__toast class
function success_notification(text: string) {
  toast(
    <div className="flex justify-center items-center gap-1">
      <FaCheckCircle className="inline" />
      <p className="inline">{text}</p>
    </div>,
    {
      className: `apply-font color-success color-success-content border text-sm leading-tight`,
      ariaLabel: "Success notification",
      ...TOAST_UI,
    }
  );
}

function error_notification(text: string) {
  toast(
    <div className="flex justify-center items-center gap-1">
      <MdError className="inline" />
      <p className="inline">{text}</p>
    </div>,
    {
      className: `apply-font color-error color-error-content border text-sm leading-tight`,
      ariaLabel: "Error notification",
      ...TOAST_UI,
    }
  );
}

function info_notification(text: string) {
  toast(
    <div className="flex justify-center items-center gap-1">
      <FaInfoCircle className="inline-block w-5 h-auto" />
      <p className="inline">{text}</p>
    </div>,
    {
      className: `apply-font color-info color-info-content border text-sm leading-tight`,
      ariaLabel: "Info notification",
      ...TOAST_UI,
    }
  );
}

export { success_notification, error_notification, info_notification };
