import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  icon?: ReactNode;
  textColor?: string;
  bgColor?: string;
}

const Button = ({ title, icon, textColor, bgColor, ...rest }: ButtonProps) => {
  return (
    <button
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium x shadow-sm transition-colors 
        ${textColor ? textColor : "text-white"}
        ${bgColor ? bgColor : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"}`}
      {...rest}
    >
      {icon} {title}
    </button>
  );
};

export default Button;
