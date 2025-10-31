interface LoadingProps {
  size: "sm" | "md" | "lg";
  class_name?: string;
  text?: string;
}

export default function Loading(props: LoadingProps) {
  let add_css_to_loading = props.class_name ? props.class_name + " " : "";

  switch (props.size) {
    case "sm":
      add_css_to_loading += "w-7 sm:w-8 md:w-9";
      break;
    case "md":
      add_css_to_loading += "w-10 sm:w-11 md:w-12 h-10 sm:h-11 md:h-12";
      break;
    case "lg":
      add_css_to_loading += "w-12 sm:w-13 md:w-14 h-12 sm:h-13 md:h-14";
      break;
  }

  return (
    <span
      id="loading"
      className={`${add_css_to_loading} inline-block shrink-0 animate-spin rounded-full border-2 border-t-transparent`}
    />
  );
}
