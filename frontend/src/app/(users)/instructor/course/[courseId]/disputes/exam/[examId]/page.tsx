import Link from "next/link";
import ExamSubmissionsDisputesTable from "../../../../../components/examSubmissionsDisputesTable";
import { ArrowLeft } from "flowbite-react-icons/outline";

const DisputesExamPage = ({
  params,
}: {
  params: { courseId: string; examId: string };
}) => {
  const courseId = Number(params.courseId);
  const examId = Number(params.examId);

  return (
    <div>
      <div className="flex items-center mb-3 space-x-3">
        <Link href="../" className="space-x-4 flex items-center btn-primary">
          <ArrowLeft />
          Back
        </Link>
        <h1 className="block text-xl font-bold">Exam Submissions Disputes</h1>
      </div>
      <ExamSubmissionsDisputesTable courseId={courseId} examId={examId} />
    </div>
  );
};

export default DisputesExamPage;
