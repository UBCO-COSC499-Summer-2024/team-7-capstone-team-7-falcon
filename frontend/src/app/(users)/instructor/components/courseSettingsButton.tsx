"use client";
import ButtonTemplate from "../../../components/buttonTemplate";
import { FileCirclePlus } from "flowbite-react-icons/solid";

interface CourseSettingsButtonProps {
  course_id: number;
  className?: string;
}

const CourseSettingsButton: React.FC<CourseSettingsButtonProps> = ({
  course_id,
  className,
}) => {
  return (
    <ButtonTemplate
      icon={FileCirclePlus}
      text={"Course Settings"}
      link={`/instructor/course/${course_id}/edit-course`}
      className={className}
    />
  );
};

export default CourseSettingsButton;
