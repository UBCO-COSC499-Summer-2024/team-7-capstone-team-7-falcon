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
    <Accordion collapseAll>
      {items.map((item, index) => (
        <Accordion.Panel key={index}>
          <Accordion.Title>{item.question}</Accordion.Title>
          <Accordion.Content>
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              {item.answer}
            </p>
          </Accordion.Content>
        </Accordion.Panel>
      ))}
    </Accordion>
  );
};
export default FAQComponent;
