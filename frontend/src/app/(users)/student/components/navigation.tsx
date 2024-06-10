import Navigation from "../../components/navigation";
import { Book, Clipboard, QuestionCircle } from "flowbite-react-icons/solid";

const studentLinks = [
  {
    title: "Courses",
    href: "/student",
    icon: <Book />,
  },
  {
    title: "Exams",
    href: "/student/exams",
    icon: <Clipboard />,
  },
  {
    title: "Help",
    href: "/student/help",
    icon: <QuestionCircle />,
  }
];

const StudentNavigation: React.FC = () => {
  return <Navigation links={studentLinks} />;
}

export default StudentNavigation;
