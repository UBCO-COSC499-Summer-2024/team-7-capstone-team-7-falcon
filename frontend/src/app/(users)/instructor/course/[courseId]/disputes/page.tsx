import ExamsSubmissionsDisputesTable from "../../../components/examsSubmissionsDisputesTable";

const DisputesPage = async ({ params }: { params: { courseId: string } }) => {
  return (
    <div>
      <h1 className="text-xl font-bold mb-5">Exams Submissions Disputes</h1>
      <ExamsSubmissionsDisputesTable courseId={Number(params.courseId)} />
    </div>
  );
};

export default DisputesPage;
