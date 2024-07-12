import { Edit } from "flowbite-react-icons/solid";
import Link from "next/link";

const EditCourseButton: React.FC = () => {
  return (
    <button type="button" className="btn-primary">
      <Link href={""} className="space-x-4 flex items-center">
        <Edit />
        Course Settings
      </Link>
    </button>
  );
};

export default EditCourseButton;
