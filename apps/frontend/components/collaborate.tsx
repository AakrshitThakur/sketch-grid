import Image from "next/image";
import { FcIdea } from "react-icons/fc";
import { Heading } from "@repo/ui/index";

// collaborate section
export default function Collaborate() {
  return (
    <section id="collaborate" className="flex flex-col md:flex-row justify-center items-center gap-3 p-5 sm:p-7 md:p-9">
      <div className="flex flex-col justify-center items-center gap-3">
        <Heading
          class_name="text-center font-bold leading-tight"
          text="Collaborate with friends using a whiteboard to share your awesome ideas and thoughts"
          size="h3"
        />
        <FcIdea className="w-15 h-auto" />
      </div>

      <div className="w-xs sm:w-sm md:w-md relative aspect-square shrink-0 rounded-xl overflow-hidden">
        <Image className="w-full h-full" src="/collaborate.png" alt="Collaborate image" fill />
      </div>
    </section>
  );
}
