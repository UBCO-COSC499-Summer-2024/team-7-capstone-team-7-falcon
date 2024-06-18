import React from "react";
import CreateExamButton from "../../../components/createExamButton";
import PeopleButton from "../../../components/peopleButton";
import AnalyticsButton from "../../../components/analyticsButton";

const CreateExam: React.FC = () => {
  return (
    <div>
      <h1 className="text-4xl">Create Exam:</h1>
      <div className="flex space-x-4">
        <CreateExamButton />
        <PeopleButton />
        <AnalyticsButton />
      </div>
    </div>
  );
};

export default CreateExam;
