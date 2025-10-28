import { FcIdea, FcCollaboration  } from "react-icons/fc";

export default function Collaborate() {
  return (
    <section
      id="collaborate"
      className="flex flex-col md:flex-row justify-center items-center gap-3 p-5"
    >
      <div className="flex flex-col justify-center items-center gap-3">
        <h2 className="max-w-lg text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
          Collaborate with friends using a whiteboard to share your awesome ideas and thoughts
        </h2>
        <FcIdea className="w-15 h-auto" />
      </div>

      <div className="w-sm md:w-md aspect-square shrink-0 rounded-xl overflow-hidden">
        <img className="w-full h-full" src="/collaborate.png" alt="" />
      </div>
    </section>
  );
}
