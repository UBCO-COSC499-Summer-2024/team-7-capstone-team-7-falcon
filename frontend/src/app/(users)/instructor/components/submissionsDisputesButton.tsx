"use client";

import ButtonTemplate from "../../../components/buttonTemplate";
import { Flag } from "flowbite-react-icons/solid";

interface SubmissionsDisputesButtonProps {
  courseId: number;
  className?: string;
}

const SubmissionsDisputesButton: React.FC<SubmissionsDisputesButtonProps> = ({
  courseId,
  className,
}) => {
  return (
    <ButtonTemplate
      icon={Flag}
      text={"Submissions Disputes"}
      link={`/instructor/course/${courseId}/disputes`}
      className={className}
    />
  );
};

export default SubmissionsDisputesButton;
