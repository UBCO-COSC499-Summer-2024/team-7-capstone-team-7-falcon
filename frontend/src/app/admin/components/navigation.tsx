import Navigation from "../../(users)/components/navigation";
import {
  Users,
  Book,
  ChartPie,
  CalendarPlus,
} from "flowbite-react-icons/solid";

const adminLinks = [
  {
    title: "Dashboard",
    href: {
      base: "/admin/dashboard",
      exact: "/admin",
    },
    icon: <ChartPie />,
  },
  {
    title: "Users",
    href: {
      base: "/admin/users",
    },
    icon: <Users />,
  },
  {
    title: "Courses",
    href: {
      base: "/admin/courses",
    },
    icon: <Book />,
  },
  {
    title: "Semesters",
    href: {
      base: "/admin/semesters",
    },
    icon: <CalendarPlus />,
  },
];

/**
 * Renders the navigation component for the instructor
 * @returns {JSX.Element} - Instructor navigation component
 */
const AdminNavigation: React.FC = () => {
  return <Navigation links={adminLinks} />;
};

export default AdminNavigation;
