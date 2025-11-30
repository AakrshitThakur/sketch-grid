import { ReactNode } from "react";

interface CardProps {
  size: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  class_name?: string;
  children: ReactNode;
}

export default function Card(props: CardProps) {
  let add_css_to_card = props.class_name ? props.class_name + " " : "";

  // add max-width to card
  switch (props.size) {
    case "sm":
      add_css_to_card += "w-auto sm:w-xs md:w-sm";
      break;
    case "md":
      add_css_to_card += "w-auto sm:w-sm md:w-md";
      break;
    case "lg":
      add_css_to_card += "w-auto sm:w-md md:w-lg";
      break;
    case "xl":
      add_css_to_card += "w-auto sm:w-lg md:w-xl";
      break;
    case "2xl":
      add_css_to_card += "w-auto sm:w-xl md:w-2xl";
      break;
    case "3xl":
      add_css_to_card += "w-auto sm:w-2xl md:w-3xl";
      break;
  }

  return (
    <section id="card" className={add_css_to_card}>
      {props.children}
    </section>
  );
}
