import { useState, useEffect, useRef } from "react";
import { FaUser } from "react-icons/fa6";
import { GoSearch } from "react-icons/go";
import { useRouter } from "next/navigation";

interface ProfileProps {
  class_names?: {
    drop_down_links?: string;
    drop_down_link?: string;
  };
}

export default function Profile(props: ProfileProps) {
  const router = useRouter();
  const DROPDOWN_LINKS = [
    {
      label: "View My Rooms",
      navigate_func: () => router.push("/demo"),
      icon: <GoSearch className="w-full h-full" />,
    },
  ];
  const [open, set_open] = useState(false);
  const container_ref = useRef<HTMLDivElement | null>(null);

  // close dropdown when clicking outside
  useEffect(() => {
    function handle_click_outside(e: MouseEvent) {
      if (container_ref.current && !container_ref.current.contains(e.target as Node)) {
        set_open(false);
      }
    }
    document.addEventListener("mousedown", handle_click_outside);
    return () => {
      document.removeEventListener("mousedown", handle_click_outside);
    };
  }, []);

  return (
    <div id="profile" className="relative flex justify-center items-center" ref={container_ref}>
      {/* avatar */}
      <span className="inline-block w-[1.85rem] h-auto rounded-full overflow-hidden cursor-pointer border p-1" onClick={() => set_open((curr) => !curr)}>
        <FaUser className="w-full h-full" />
      </span>

      {/* all dropdown links */}
      {open && (
        <div className={`absolute z-10 p-1 top-9 left-0 rounded-md overflow-hidden text-sm ${props.class_names?.drop_down_links}`}>
          {DROPDOWN_LINKS.map((link) => (
            <div
              onClick={() => {
                set_open(false);
                link.navigate_func();
              }}
              className={`flex justify-center items-center gap-1 cursor-pointer px-3 py-2 ${props.class_names?.drop_down_link}`}
            >
              <span className="text-nowrap">{link.label}</span>
              <span className="inline-block w-5 h-auto">{link.icon}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
