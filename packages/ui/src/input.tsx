interface TextInputProps {
  title: string;
  placeholder: string;
  value: string;
  on_change: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactElement;
  class_names?: {
    input?: string;
    label?: string;
  };
}

function capitalize_first_char(text: string): string{
    if(!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export function TextInputMd(props: TextInputProps) {
  return (
    <section id="text-input" className="space-y-2">
      {/* field */}
      <label htmlFor={props.title} className={`block text-sm font-medium ${props.class_names?.label}`}>
        {capitalize_first_char(props.title)}
      </label>
      <div className="relative text-base">
        <span className="absolute left-3 top-3 h-4 w-4">{props.icon}</span>
        <input
          id={props.title}
          name={props.title}
          type="text"
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.on_change}
          className={`w-full px-10 pr-3 py-2 border rounded-md ${props.class_names?.input}`}
        />
      </div>
    </section>
  );
}
