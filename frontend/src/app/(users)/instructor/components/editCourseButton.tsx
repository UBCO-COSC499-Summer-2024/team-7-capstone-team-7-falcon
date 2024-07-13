import { Edit } from "flowbite-react-icons/solid";
import Link from "next/link";
import {
  Course,
  CourseData,
  CourseEditData,
  SelectedButton,
} from "../../../typings/backendDataTypes";
interface EditCourseButtonProps {
  course_id: number;
  className?: string;
}
const EditCourseButton: React.FC<EditCourseButtonProps> = (
  course_id,
  className,
) => {
  return (
    <button type="button" className="btn-primary">
      <Link
        href={`/instructor/course/1/edit-course`} //href = {'/instructor/course/${course_id}/edit-course'} gives undefined error
        className="space-x-4 flex items-center"
      >
        <Edit />
        Course Settings
      </Link>
    </button>
  );
};

export default EditCourseButton;

