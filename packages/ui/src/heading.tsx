interface HeadingProps {
  size: "h1" | "h2" | "h3" | "h4";
  text: string;
  class_name?: string;
}

export default function Heading(props: HeadingProps) {
  // css to be added to heading
  let add_css_to_heading = props.class_name ? props.class_name + " " : "";

  // check size
  switch (props.size) {
    case "h1":
      add_css_to_heading += "text-3xl sm:text-4xl md:text-5xl lg:text-6xl";
      return <h1 className={add_css_to_heading}>{props.text || "Heading-1"}</h1>;
    case "h2":
      add_css_to_heading += "text-2xl sm:text-3xl md:text-4xl lg:text-5xl";
      return <h2 className={add_css_to_heading}>{props.text || "Heading-2"}</h2>;
    case "h3":
      add_css_to_heading += "text-xl sm:text-2xl md:text-3xl lg:text-4xl";
      return <h3 className={add_css_to_heading}>{props.text || "Heading-3"}</h3>;
    case "h4":
      add_css_to_heading += "text-lg sm:text-xl md:text-2xl lg:text-3xl";
      return <h3 className={add_css_to_heading}>{props.text || "Heading-3"}</h3>;
    default:
      add_css_to_heading += "text-3xl sm:text-4xl md:text-5xl lg:text-6xl";
      return <h1 className={add_css_to_heading}>{props.text || "Heading-1"}</h1>;
  }
}
