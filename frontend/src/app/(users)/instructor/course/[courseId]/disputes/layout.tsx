import { coursesAPI } from "@/app/api/coursesAPI";
import { Course, SelectedButton } from "@/app/typings/backendDataTypes";
import CourseHeader from "../../../components/courseHeader";
import EditCourseButton from "../../../components/editCourseButton";
import { Toaster } from "react-hot-toast";
import Link from "next/link";
import { ArrowLeft } from "flowbite-react-icons/outline";

interface LayoutProps {
  children: React.ReactNode;
  params: { courseId: string };
}

const Layout: React.FC<LayoutProps> = async ({ children, params }) => {
  const cid = Number(params.courseId);
  const course: Course = await coursesAPI.getCourse(cid);

  return (
    <div>
      <div className="grid grid-cols-2">
        <div className="col-span-1">
          <CourseHeader
            course_code={course.course_code}
            course_desc={course.course_name}
            course_id={course.id}
            selected={SelectedButton.Submissions_Disputes}
          />
        </div>
        <div className="col-span-1 justify-self-end space-y-4">
          <EditCourseButton courseId={cid} />
          <button type="button" className="btn-primary block w-full">
            <Link
              href={`../${course.id}/exam`}
              className="space-x-4 flex items-center text-center"
            >
              <ArrowLeft />
              Back to Course Page
            </Link>
          </button>
        </div>
      </div>
      <div className="w-full mt-5">
        <Toaster />
        {children}
      </div>
    </div>
  );
};

export default Layout;
