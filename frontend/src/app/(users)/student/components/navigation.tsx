import Navigation from "../../components/navigation";
import { Book, Clipboard, QuestionCircle } from "flowbite-react-icons/solid";

const studentLinks = [
  {
    title: "Courses",
    href: {
      base: "/student/course",
      exact: "/student",
    },
    icon: <Book />,
  },
  {
    title: "Exams",
    href: {
      base: "/student/exam",
    },
    icon: <Clipboard />,
  },
  {
    title: "Help",
    href: {
      base: "/student/faq",
    },
    icon: <QuestionCircle />,
  },
];

/**
 * Renders the navigation component for the student
 * @returns {JSX.Element} - Student navigation component
 */
const StudentNavigation: React.FC = () => {
  return <Navigation links={studentLinks} />;
};

export default StudentNavigation;
