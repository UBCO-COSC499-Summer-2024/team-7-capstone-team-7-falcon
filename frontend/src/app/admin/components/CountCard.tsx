"use client";
import React from "react";
import { Card } from "flowbite-react";

interface CountCardProps {
  count: number;
  title: string;
  className?: string;
  width?: string; // Add width prop
}

const CountCard: React.FC<CountCardProps> = ({
  count,
  title,
  className,
  width = "w-1/3",
}) => {
  return (
    <Card
      className={`${className} ${width} bg-purple-700 p-2 rounded-xl shadow-md`}
    >
      <div className="text-center">
        <div className="text-3xl font-bold text-white mt-2">{count}</div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
    </Card>
  );
};

export default CountCard;
