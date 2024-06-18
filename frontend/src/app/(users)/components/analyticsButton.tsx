"use client";
import ButtonTemplate from "../../components/buttonTemplate";
import { ChartLineUp } from "flowbite-react-icons/outline";

interface AnalyticsButtonProps {
  className?: string;
}

const AnalyticsButton: React.FC<AnalyticsButtonProps> = (className) => {
  return (
    <ButtonTemplate
      icon={ChartLineUp}
      text={"Analytics"}
      link={`http://localhost:3000/instructor/course/analytics`}
      className={className.className}
    ></ButtonTemplate>
  );
};

export default AnalyticsButton;
