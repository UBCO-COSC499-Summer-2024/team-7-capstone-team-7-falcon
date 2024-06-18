"use client";
import ButtonTemplate from "../../components/buttonTemplate";
import { ChartLineUp } from "flowbite-react-icons/outline";

const AnalyticsButton: React.FC = () => {
  return (
    <ButtonTemplate
      icon={ChartLineUp}
      text={"Analytics"}
      link={`http://localhost:3000/instructor/course/analytics`}
    ></ButtonTemplate>
  );
};

export default AnalyticsButton;
