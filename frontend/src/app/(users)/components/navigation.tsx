import { Sidebar } from "flowbite-react";
import { usePathname } from "next/navigation";

export interface NavigationLink {
  title: string;
  href: string;
  icon: JSX.Element;
}

interface NavigationProps {
  links: NavigationLink[];
}

const Navigation: React.FC<NavigationProps> = ({ links }) => {
  const pathName = usePathname();

  const currentPath = (href: string) => {
    if (pathName === href) {
      return "bg-[#8F3DDE] text-[#fff] hover:bg-[#8F3DDE] hover:text-[#fff]";
    } else {
      return "text-[#A8A9A9]";
    }
  }

  return (
    <Sidebar.ItemGroup>
      {links.map((link, index) => (
        <Sidebar.Item key={index} href={link.href} className={`flex items-center my-5 py-2 px-10 ${currentPath(link.href)}`}>
          <div className="flex items-center space-x-2">
            {link.icon}
            <span>{link.title}</span>
          </div>
        </Sidebar.Item>
      ))}
    </Sidebar.ItemGroup>
  );
}

export default Navigation;
