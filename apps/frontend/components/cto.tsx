import { FaGithub } from "react-icons/fa";
import { Button, Heading } from "@repo/ui/index";

// cto section
export default function CallToAction() {
  return (
    <section
      id="call-to-action"
      className="color-accent color-accent-content grid-lines-light flex justify-center h-[50vh] text-base items-center p-5 sm:p-7 md:p-9"
    >
      <div className="max-w-lg flex flex-col justify-center items-center solid-border gap-5 color-base-200 color-base-content rounded-xl p-7">
        <Heading class_name="text-center font-bold leading-tight" text="Say hi to SketchGrid" size="h3" />
        <p>No account is needed. Just start drawing.</p>
        <div className="flex items-center gap-5">
          <Button type="success" size="md" text="Start Drawing" />
          <a href="">
            <FaGithub className="inline-block w-7 h-auto" />
          </a>
        </div>
      </div>
    </section>
  );
}
