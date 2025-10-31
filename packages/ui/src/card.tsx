import { ReactNode } from "react";

interface CardProps {
  size: "sm" | "md" | "lg" | "xl";
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
  }

  return <section className={add_css_to_card}>{props.children}</section>;
}
