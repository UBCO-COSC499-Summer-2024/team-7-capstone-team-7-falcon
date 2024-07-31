import Navigation from "../../components/navigation";
import { Book, Clipboard, QuestionCircle } from "flowbite-react-icons/solid";

const instructorLinks = [
  {
    title: "Courses",
    href: {
      base: "/instructor/course",
      exact: "/instructor",
    },
    icon: <Book />,
  },
  {
    title: "My Exams",
    href: {
      base: "/instructor/exams",
    },
    icon: <Clipboard />,
  },
  {
    title: "Help",
    href: {
      base: "/instructor/faq",
    },
    icon: <QuestionCircle />,
  },
];

/**
 * Renders the navigation component for the instructor
 * @returns {JSX.Element} - Instructor navigation component
 */
const InstructorNavigation: React.FC = () => {
  return <Navigation links={instructorLinks} />;
};

export default InstructorNavigation;
