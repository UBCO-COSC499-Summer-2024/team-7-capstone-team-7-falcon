"use client";
import React from "react";
import Link from "next/link";

interface ButtonTemplateProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  text: string;
  link: string;
  className?: string;
}

const ButtonTemplate: React.FC<ButtonTemplateProps> = ({
  icon: Icon,
  text,
  link,
  className,
}) => {
  return (
    <button
      className={`p-1 pr-2.5 text-l items-center space-x-2 text-black hover:bg-purple-700 hover:text-white
        focus:outline-none ring ring-gray-200 hover:ring-purple-800 rounded-lg ${className}`}
    >
      <Link href={link} className="flex space-x-4">
        <Icon width={25} height={25} />
        {text}
      </Link>
    </button>
  );
};

export default ButtonTemplate;
