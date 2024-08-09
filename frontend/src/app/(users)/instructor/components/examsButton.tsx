"use client";
import ButtonTemplate from "../../../components/buttonTemplate";
import { Newspaper } from "flowbite-react-icons/solid";

interface ExamsButtonProps {
  course_id: number;
  className?: string;
}

const ExamsButton: React.FC<ExamsButtonProps> = ({ course_id, className }) => {
  return (
    <ButtonTemplate
      icon={Newspaper}
      text={"Exams"}
      link={`/instructor/course/${course_id}/exam`}
      className={className}
    />
  );
};

export default ExamsButton;
