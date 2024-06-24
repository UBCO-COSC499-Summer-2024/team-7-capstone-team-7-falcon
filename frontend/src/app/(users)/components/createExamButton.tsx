"use client";
import ButtonTemplate from "../../components/buttonTemplate";
import { FileCirclePlus } from "flowbite-react-icons/solid";

interface CreateExamButtonProps {
  course_id: number;
  className?: string;
}

const CreateExamButton: React.FC<CreateExamButtonProps> = ({
  course_id,
  className,
}) => {
  return (
    <ButtonTemplate
      icon={FileCirclePlus}
      text={"Create Exam"}
      link={`/instructor/course/${course_id}/create-exam`}
      className={className}
    ></ButtonTemplate>
  );
};

export default CreateExamButton;
