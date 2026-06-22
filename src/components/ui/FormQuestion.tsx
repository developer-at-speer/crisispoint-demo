interface FormQuestionProps {
  id?: string;
  highlighted?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function questionClasses(highlighted?: boolean, className?: string) {
  return ["form-question", highlighted && "field-highlight", className]
    .filter(Boolean)
    .join(" ");
}

export function FormQuestion({
  id,
  highlighted,
  className,
  children,
}: FormQuestionProps) {
  return (
    <div id={id} className={questionClasses(highlighted, className)}>
      {children}
    </div>
  );
}
