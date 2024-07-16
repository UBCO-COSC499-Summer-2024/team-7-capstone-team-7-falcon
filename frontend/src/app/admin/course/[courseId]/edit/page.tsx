import CourseEditForm from "@/app/components/editCourseForm";
import { Toaster } from "react-hot-toast";

const AdminEditCoursePage = async ({
  params,
}: {
  params: { courseId: string };
}) => {
  const cid = Number(params.courseId);

  return (
    <div>
      <div className="mt-2">
        <h2 className="text-2xl font-bold mb-4">Course</h2>
        <hr />
      </div>
      <Toaster />
      <CourseEditForm courseId={cid} />
    </div>
  );
};

export default AdminEditCoursePage;
