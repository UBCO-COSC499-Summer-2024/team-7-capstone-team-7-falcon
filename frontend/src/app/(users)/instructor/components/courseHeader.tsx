import { SelectedButton } from "../../../typings/backendDataTypes";
import AnalyticsButton from "./analyticsButton";
import CreateExamButton from "./createExamButton";
import PeopleButton from "./peopleButton";
import SubmissionsDisputesButton from "./submissionsDisputesButton";

interface CourseHeaderProps {
  course_code: string;
  course_desc: string;
  course_id: number;
  selected: SelectedButton;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({
  course_code,
  course_desc,
  course_id,
  selected,
}) => {
  return (
    <div className="p-1 space-y-2">
      <h1 className="text-4xl font-bold">{course_code}</h1>
      <h2 className="text-xl">{course_desc}</h2>
      <div className="pt-6 flex space-x-6">
        <CreateExamButton
          course_id={course_id}
          className={
            selected === SelectedButton.Create_Exam
              ? "bg-purple-700 ring-purple-800 text-white"
              : ""
          }
        />
        <PeopleButton
          course_id={course_id}
          className={
            selected === SelectedButton.People
              ? "bg-purple-700 ring-purple-800 text-white"
              : ""
          }
        />
        <AnalyticsButton
          course_id={course_id}
          className={
            selected === SelectedButton.Analytics
              ? "bg-purple-700 ring-purple-800 text-white"
              : ""
          }
        />
        <SubmissionsDisputesButton
          courseId={course_id}
          className={
            selected === SelectedButton.Submissions_Disputes
              ? "bg-purple-700 ring-purple-800 text-white"
              : ""
          }
        />
      </div>
    </div>
  );
};

export default CourseHeader;
