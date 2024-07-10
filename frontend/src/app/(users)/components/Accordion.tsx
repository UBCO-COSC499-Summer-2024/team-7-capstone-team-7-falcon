"use client";

import { Accordion } from "flowbite-react";

//passing title and content as props to this component

interface AccordionProps {
  items: {
    question: string;
    answer: string;
  }[];
}

const FAQComponent: React.FC<AccordionProps> = ({ items }) => {
  return (
    <Accordion collapseAll className="w-full">
      {items.map((item, index) => (
        <Accordion.Panel key={index} className="mb-2 border-b">
          <Accordion.Title className="p-4 text-gray-700">
            {item.question}
          </Accordion.Title>
          <Accordion.Content className="p-4 bg-white-800">
            <p className="mb-2 text-black dark:text-gray-400">{item.answer}</p>
          </Accordion.Content>
        </Accordion.Panel>
      ))}
    </Accordion>
  );
};
export default FAQComponent;
