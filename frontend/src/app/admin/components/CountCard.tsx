"use client";
import React from "react";
import { Card } from "flowbite-react";

interface CountCardProps {
  count: number;
  title: string;
  className?: string;
}

const CountCard: React.FC<CountCardProps> = ({ count, title, className }) => {
  return (
    <Card
      className={`${className}  bg-purple-700 p-4 rounded-xl shadow-md w-1/5`}
    >
      <div className="text-center">
        <div className="text-3xl font-bold text-white mt-2">{count}</div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
    </Card>
  );
};

export default CountCard;
