import { Link, useLocation } from "wouter";
import { NAVIGATION_ITEMS } from "@/lib/constants";

const MobileNavigation = () => {
  const [currentLocation] = useLocation();

  return (
    <nav className="md:hidden bg-white dark:bg-gray-800 fixed bottom-0 w-full border-t border-gray-200 dark:border-gray-700 flex justify-around z-50">
      {NAVIGATION_ITEMS.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          className={`flex flex-col items-center justify-center py-2 ${
            currentLocation === item.path
              ? "text-primary dark:text-primary-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <i className={`${item.icon} text-lg`}></i>
          <span className="text-xs mt-1">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default MobileNavigation;
