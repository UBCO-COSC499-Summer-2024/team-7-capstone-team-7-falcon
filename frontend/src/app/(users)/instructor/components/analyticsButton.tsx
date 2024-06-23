"use client";
import ButtonTemplate from "../../../components/buttonTemplate";
import { ChartLineUp } from "flowbite-react-icons/outline";

interface AnalyticsButtonProps {
  course_id: number;
  className?: string;
}

const AnalyticsButton: React.FC<AnalyticsButtonProps> = ({
  course_id,
  className,
}) => {
  return (
    <ButtonTemplate
      icon={ChartLineUp}
      text={"Analytics"}
      link={`/instructor/course/${course_id}/analytics`}
      className={className}
    ></ButtonTemplate>
  );
};

export default AnalyticsButton;
