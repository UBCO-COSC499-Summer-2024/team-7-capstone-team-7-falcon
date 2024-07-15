import { coursesAPI } from "@/app/api/coursesAPI";
import CourseEditForm from "@/app/components/editCourseForm";
import { CourseProtectedDetails } from "@/app/typings/backendDataTypes";
import { redirect } from "next/navigation";
import { Toaster } from "react-hot-toast";

const AdminEditCoursePage = async ({
  params,
}: {
  params: { courseId: string };
}) => {
  const cid = Number(params.courseId);
  const course: CourseProtectedDetails = await coursesAPI.getCourse(cid);

  if (!course) {
    redirect(`../../`);
  }

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
