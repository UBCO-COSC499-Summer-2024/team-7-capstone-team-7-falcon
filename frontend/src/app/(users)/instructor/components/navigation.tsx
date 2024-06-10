import Navigation from "../../components/navigation";
import { Book, Clipboard, QuestionCircle } from "flowbite-react-icons/solid";

const instructorLinks = [
  {
    title: "Courses",
    href: "/instructor",
    icon: <Book />,
  },
  {
    title: "Exams",
    href: "/instructor/exams",
    icon: <Clipboard />,
  },
  {
    title: "Help",
    href: "/instructor/help",
    icon: <QuestionCircle />,
  }
];

const InstructorNavigation: React.FC = () => {
  return <Navigation links={instructorLinks} />;
}

export default InstructorNavigation;
