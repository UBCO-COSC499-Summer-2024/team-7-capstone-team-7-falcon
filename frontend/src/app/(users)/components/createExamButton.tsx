"use client";
import ButtonTemplate from "../../components/buttonTemplate";
import { FileCirclePlus } from "flowbite-react-icons/solid";

const CreateExamButton: React.FC = () => {
  return (
    <ButtonTemplate
      icon={FileCirclePlus}
      text={"Create Exam"}
      link={`http://localhost:3000/instructor/course/create_exam`}
    ></ButtonTemplate>
  );
};

export default CreateExamButton;
