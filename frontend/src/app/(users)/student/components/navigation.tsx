import Navigation from "../../components/navigation";
import { Book, Clipboard, QuestionCircle } from "flowbite-react-icons/solid";

const studentLinks = [
  {
    title: "Courses",
    href: "/student",
    icon: <Book className="w-5 h-5" />,
  },
  {
    title: "Exams",
    href: "/student/exams",
    icon: <Clipboard className="w-5 h-5" />,
  },
  {
    title: "Help",
    href: "/student/help",
    icon: <QuestionCircle className="w-5 h-5" />,
  }
];

const StudentNavigation: React.FC = () => {
  return <Navigation links={studentLinks} />;
}

export default StudentNavigation;
