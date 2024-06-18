"use client";
import ButtonTemplate from "../../components/buttonTemplate";
import { UsersGroup } from "flowbite-react-icons/solid";

const PeopleButton: React.FC = () => {
  return (
    <ButtonTemplate
      icon={UsersGroup}
      text={"People"}
      link={`http://localhost:3000/instructor/course/people`}
    ></ButtonTemplate>
  );
};

export default PeopleButton;
