"use client";
import ButtonTemplate from "../../../components/buttonTemplate";
import { UsersGroup } from "flowbite-react-icons/solid";

interface PeopleButtonProps {
  course_id: number;
  className?: string;
}

const PeopleButton: React.FC<PeopleButtonProps> = ({
  course_id,
  className,
}) => {
  return (
    <ButtonTemplate
      icon={UsersGroup}
      text={"People"}
      link={`/instructor/course/${course_id}/people`}
      className={className}
    ></ButtonTemplate>
  );
};

export default PeopleButton;
