"use client";
import ButtonTemplate from "../../components/buttonTemplate";
import { FileCirclePlus } from "flowbite-react-icons/solid";

interface CreateExamButtonProps {
  className?: string;
}

const CreateExamButton: React.FC<CreateExamButtonProps> = (className) => {
  return (
    <ButtonTemplate
      icon={FileCirclePlus}
      text={"Create Exam"}
      link={`http://localhost:3000/instructor/course/create_exam`}
      className={className.className}
    ></ButtonTemplate>
  );
};

export default CreateExamButton;
