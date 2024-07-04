import { Sidebar } from "flowbite-react";
import { usePathname } from "next/navigation";

interface NavigationLink {
  title: string;
  href: {
    base: string;
    exact?: string;
  };
  icon: JSX.Element;
}

interface NavigationProps {
  links: NavigationLink[];
}

/**
 * Renders the navigation component
 * @param param0 {NavigationProps} - Navigation links
 * @returns {JSX.Element} - Navigation component
 */
const Navigation: React.FC<NavigationProps> = ({ links }) => {
  const pathName = usePathname();

  /**
   * Check if the path matches exact path or the start matches the base path and assign styles
   * @param href {string} - The href of the link
   * @returns {string} - The class name
   */
  const currentPath = (href: { base: string; exact?: string }) => {
    if (
      pathName.startsWith(String(href.base)) ||
      (href.exact && href.exact === pathName)
    ) {
      return "bg-purple-700 text-white hover:bg-purple-700 hover:text-white";
    } else {
      return "text-gray-400";
    }
  };

  return (
    <Sidebar.ItemGroup>
      {links.map((link, index) => (
        <Sidebar.Item
          key={index}
          href={link.href.exact || link.href.base}
          className={`my-5 py-2 px-10 ${currentPath(link.href)}`}
        >
          <div className="flex items-center space-x-2 w-28">
            {link.icon}
            <span>{link.title}</span>
          </div>
        </Sidebar.Item>
      ))}
    </Sidebar.ItemGroup>
  );
};

export default Navigation;
