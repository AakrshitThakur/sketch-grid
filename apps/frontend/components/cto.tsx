import { Button } from "@repo/ui/index";
import { FaGithub } from "react-icons/fa";

export default function CallToAction() {
  return (
    <section
      id="call-to-action"
      className="color-accent color-accent-content flex justify-center h-[50vh] items-center"
    >
      <div className="max-w-lg flex flex-col justify-center items-center solid-border gap-5 color-base-200 color-base-content rounded-xl p-7">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
          Say hi to SketchGrid
        </h2>
        <p>No account is needed. Just start drawing.</p>
        <div className="flex items-center gap-5">
          <Button type="success" size="md" text="Start Drawing" />
          <a href="">
            <FaGithub className="inline-block w-8 h-auto" />
          </a>
        </div>
      </div>
    </section>
  );
}
