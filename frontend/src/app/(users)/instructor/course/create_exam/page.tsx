import React, { useState } from "react";
import CreateExamButton from "../../../components/createExamButton";
import PeopleButton from "../../../components/peopleButton";
import AnalyticsButton from "../../../components/analyticsButton";
import InputExam from "../../components/createExam";

type ButtonType = "Exam" | "People" | "Analytics";

const CreateExam: React.FC = () => {
  return (
    <div className="space-y-5 ">
      <h1 className="text-4xl">Create Exam:</h1>
      <div className="flex space-x-4">
        <CreateExamButton className="bg-purple-700 ring-purple-800 text-white" />
        <PeopleButton />
        <AnalyticsButton />
      </div>
      <InputExam />
    </div>
  );
};

export default CreateExam;
