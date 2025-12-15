"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/index";

interface HeroSectionProps {
  headline?: string;
  subheading?: string;
  cta_text?: string;
  on_cta_click?: () => void;
}

// hero section
const Hero: React.FC<HeroSectionProps> = ({
  headline = "Collaborate Visually. Design Intuitively. Create Without Limits.",
  subheading = "Where creativity meets clarity. SketchGrid is a collaborative whiteboard designed for thinkers, designers, and teams who love to explore visually. Draw freely, brainstorm together, and bring structure to creativity — all in one seamless digital workspace.",
}) => {
  // hook used for navigation
  const router = useRouter();

  // navigate
  function navigate(to: string) {
    router.push(to);
  }
  return (
    <section
      id="hero"
      className="flex items-center justify-center bg-linear-to-b to-gray-500 overflow-hidden p-5 sm:p-7 md:p-9"
    >
      {/* Content container */}
      <div className="space-y-7 text-center">
        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          {/* color last 2 words of heading */}
          {headline.split(" ").map((word, index) => (
            <span key={index}>
              {index === headline.split(" ").length - 2 || index === headline.split(" ").length - 1 ? (
                <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {word + " "}
                </span>
              ) : (
                <span>{word + " "}</span>
              )}
            </span>
          ))}
        </h1>
        {/* Sub-heading */}
        <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">{subheading}</p>
        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Button type="success" size="lg" text="Get Started" on_click={() => navigate("/rooms")} />
          <Button type="primary" size="lg" text="Learn More" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
