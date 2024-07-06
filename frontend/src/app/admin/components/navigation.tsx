import Navigation from "../../(users)/components/navigation";
import { Users, Book, Pie, CalendarPlus } from "flowbite-react-icons/solid";

const adminLinks = [
  {
    title: "Dashboard",
    href: {
      base: "/admin",
      exact: "/admin",
    },
    icon: (
      <svg
        className="w-6 h-6 text-white dark:text-white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M13.5 2c-.178 0-.356.013-.492.022l-.074.005a1 1 0 0 0-.934.998V11a1 1 0 0 0 1 1h7.975a1 1 0 0 0 .998-.934l.005-.074A7.04 7.04 0 0 0 22 10.5 8.5 8.5 0 0 0 13.5 2Z" />
        <path d="M11 6.025a1 1 0 0 0-1.065-.998 8.5 8.5 0 1 0 9.038 9.039A1 1 0 0 0 17.975 13H11V6.025Z" />
      </svg>
    ),
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
