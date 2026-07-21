import type { ElementType, HTMLAttributes } from "react";

interface ContainerProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
}

export default function Container({ as: Tag = "div", className = "", ...props }: ContainerProps) {
  return (
    <Tag
      className={`mx-auto w-full max-w-[1600px] px-6 sm:px-8 lg:px-12 ${className}`}
      {...props}
    />
  );
}
