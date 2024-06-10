import Navigation from "../../components/navigation";
import { Book, Clipboard, QuestionCircle } from "flowbite-react-icons/solid";

const instructorLinks = [
  {
    title: "Courses",
    href: "/instructor",
    icon: <Book className="w-5 h-5" />,
  },
  {
    title: "Exams",
    href: "/instructor/exams",
    icon: <Clipboard className="w-5 h-5" />,
  },
  {
    title: "Help",
    href: "/instructor/help",
    icon: <QuestionCircle className="w-5 h-5" />,
  }
];

const InstructorNavigation: React.FC = () => {
  return <Navigation links={instructorLinks} />;
}

export default InstructorNavigation;
