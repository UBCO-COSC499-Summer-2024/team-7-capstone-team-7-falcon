"use client";
import ButtonTemplate from "../../components/buttonTemplate";
import { UsersGroup } from "flowbite-react-icons/solid";

interface PeopleButtonProps {
  className?: string;
}

const PeopleButton: React.FC<PeopleButtonProps> = (className) => {
  return (
    <ButtonTemplate
      icon={UsersGroup}
      text={"People"}
      link={`http://localhost:3000/instructor/course/people`}
      className={className.className}
    ></ButtonTemplate>
  );
};

export default PeopleButton;
