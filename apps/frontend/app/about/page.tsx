import Image from "next/image";
import { Card } from "@repo/ui/index";

export default function About() {
  return (
    <div
      id="about-page"
      className="w-full min-h-[75vh] flex flex-col justify-center items-center bg-linear-to-b to-blue-500 gap-3 p-5 sm:p-7 md:p-9"
    >
      <Card size="3xl" class_name="color-accent color-accent-content w-full h-auto space-y-5 p-5 rounded-2xl">
        <div className="flex flex-col md:flex-row justify-center items-center gap-3 p-1">
          <div>
            <p className="text-sm sm:text-base md:text-lg text-center md:text-left">
              Collaborate Visually. Design Intuitively. <br />— Create Without Limits.
            </p>
          </div>
          <div className="w-3xs sm:w-2xs h-auto rounded-full overflow-hidden solid-border">
            <Image src="/favicon.jpg" alt="Sketch Grid Icon" className="w-full h-full" />
          </div>
        </div>
        {/* The default display behavior of flex items is block-level within the flex container */}
        <div className="color-info color-info-content flex flex-col md:flex-row justify-center items-center gap-3 p-3 rounded-xl">
          <div className="w-3xs sm:w-2xs shrink-0 h-auto rounded-full overflow-hidden">
            <Image src="/aakrshit-th-pic.jpg" alt="Aakrshit Thakur's pic" className="w-full h-full" />
          </div>
          <div>
            <p className="text-sm sm:text-base md:text-lg text-center md:text-left">
              A software developer proficient in software development. Demonstrated ability to build and maintain
              full-lifecycle web applications, backed by strong academic achievements. <br />— Software Developer
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
