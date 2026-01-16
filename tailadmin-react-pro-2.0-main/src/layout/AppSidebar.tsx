import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";

// Import icons from different libraries
import HomeIcon from '@mui/icons-material/Home';
import FolderIcon from '@mui/icons-material/Folder';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import CodeIcon from '@mui/icons-material/Code';
import BuildIcon from '@mui/icons-material/Build';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import { House, Folder, File, Code, Gear, Wrench, ChartLine, FileText } from "phosphor-react";
import { HiHome, HiFolder, HiDocument, HiCode, HiCog, HiChartBar, HiClipboardList } from "react-icons/hi";

// Other imports
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../context/AuthContext";
import SidebarWidget from "./SidebarWidget";
import PrimaryDropdownButton from "../components/sidebar/Dropdown";
import { useClickOutside } from "../components/sidebar/Functionalites";
import { HorizontaLDots } from "../icons";

type NavItem = {
  name: string;
  icon: React.ReactNode | null;
  path?: string;
  new?: boolean;
  pro?: boolean;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  // Search bar item - special handling in renderMenuItems
  {
    name: "search-bar",
    icon: null,
    path: "#",
  },
  // HOME Icons (all libraries)
  {
    name: "HOME (Google)",
    icon: <HomeIcon className="text-red-500 dark:text-blue-400" fontSize="medium" />,
    path: "/",
  },
  {
    name: "HOME (Phosphor)",
    icon: <House weight="fill" className="text-green-500 dark:text-green-400" size={24} />,
    path: "/",
  },
  {
    name: "HOME (Iconear)",
    icon: <HiHome className="text-green-500 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-700 rounded-md p-1" size={22} />,
    path: "/",
  },
  // FILE Icons (all libraries)
  {
    name: "FILE (Google)",
    icon: <FileOpenIcon className="text-yellow-500 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-700 rounded-full p-1" fontSize="medium" />,
    path: "/",
  },
  {
    name: "FILE (Phosphor)",
    icon: <File weight="regular" className="text-red-500 dark:text-red-400" size={24} />,
    path: "/",
  },
  {
    name: "FILE (Iconear)",
    icon: <HiDocument className="text-indigo-500 dark:text-indigo-400" size={24} />,
    path: "/",
  },
  // FOLDER Icons (all libraries)
  {
    name: "FOLDER (Google)",
    icon: <FolderIcon className="text-orange-500 dark:text-orange-400" fontSize="medium" />,
    path: "/",
  },
  {
    name: "FOLDER (Phosphor)",
    icon: <Folder weight="fill" className="text-teal-500 dark:text-teal-400 border border-teal-300 dark:border-teal-700 rounded-md p-1" size={22} />,
    path: "/",
  },
  {
    name: "FOLDER (Iconear)",
    icon: <HiFolder className="text-pink-500 dark:text-pink-400" size={24} />,
    path: "/",
  },
  // CODE Icons (all libraries)
  {
    name: "CODE (Google)",
    icon: <CodeIcon className="text-cyan-500 dark:text-cyan-400" fontSize="medium" />,
    path: "/",
  },
  {
    name: "CODE (Phosphor)",
    icon: <Code weight="fill" className="text-lime-500 dark:text-lime-400 border border-lime-300 dark:border-lime-700 rounded-md p-1" size={22} />,
    path: "/",
  },
  {
    name: "CODE (Iconear)",
    icon: <HiCode className="text-amber-500 dark:text-amber-400" size={24} />,
    path: "/",
  },
  // SETTINGS Icons (all libraries)
  {
    name: "SETTINGS (Google)",
    icon: <SettingsIcon className="text-emerald-500 dark:text-emerald-400" fontSize="medium" />,
    path: "/",
  },
  {
    name: "SETTINGS (Phosphor)",
    icon: <Gear weight="fill" className="text-rose-500 dark:text-rose-400" size={24} />,
    path: "/",
  },
  {
    name: "SETTINGS (Iconear)",
    icon: <HiCog className="text-violet-500 dark:text-violet-400 border border-violet-300 dark:border-violet-700 rounded-full p-1" size={22} />,
    path: "/",
  },
  // BUILD/WRENCH Icons (all libraries)
  {
    name: "BUILD (Google)",
    icon: <BuildIcon className="text-sky-500 dark:text-sky-400 border border-sky-300 dark:border-sky-700 rounded-md p-1" fontSize="medium" />,
    path: "/",
  },
  {
    name: "BUILD (Phosphor)",
    icon: <Wrench weight="fill" className="text-fuchsia-500 dark:text-fuchsia-400" size={24} />,
    path: "/",
  },
  // DASHBOARD Icons (all libraries)
  {
    name: "DASHBOARD (Google)",
    icon: <DashboardIcon className="text-rose-500 dark:text-rose-400" fontSize="medium" />,
    path: "/",
  },
  // CHART Icons (all libraries)
  {
    name: "CHART (Phosphor)",
    icon: <ChartLine weight="fill" className="text-emerald-500 dark:text-emerald-400" size={24} />,
    path: "/",
  },
  {
    name: "CHART (Iconear)",
    icon: <HiChartBar className="text-amber-500 dark:text-amber-400 border border-amber-300 dark:border-amber-700 rounded-full p-1" size={22} />,
    path: "/",
  },
  // DOCUMENT/DESCRIPTION Icons (all libraries)
  {
    name: "DESCRIPTION (Google)",
    icon: <DescriptionIcon className="text-teal-500 dark:text-teal-400" fontSize="medium" />,
    path: "/",
  },
  {
    name: "DOCUMENT (Phosphor)",
    icon: <FileText weight="fill" className="text-cyan-500 dark:text-cyan-400" size={24} />,
    path: "/",
  },
  // CLIPBOARD/CLIPBOARDLIST Icons (all libraries)
  {
    name: "CLIPBOARD (Iconear)",
    icon: <HiClipboardList className="text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700 rounded-md p-1" size={22} />,
    path: "/",
  },
  // Search bar item - special handling in renderMenuItems
  {
    name: "search-bar",
    icon: null,
    path: "#",
  },
];

// Adding Others section similar to reference project
const othersItems: NavItem[] = [];

// Support items removed as per user request
// const supportItems: NavItem[] = [
//   {
//     icon: <ChatIcon />,
//     name: "Chat",
//     path: "/chat",
//   },
//   {
//     icon: <CallIcon />,
//     name: "Support Ticket",
//     new: true,
//     subItems: [
//       { name: "Ticket List", path: "/support-tickets" },
//       { name: "Ticket Reply", path: "/support-ticket-reply" },
//     ],
//   },
//   {
//     icon: <MailIcon />,
//     name: "Email",
//     subItems: [
//       { name: "Inbox", path: "/inbox" },
//       { name: "Details", path: "/inbox-details" },
//     ],
//   },
// ];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, setIsMobileOpen, setIsExpanded } =
    useSidebar();
  const { isAdmin, isSuperAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLElement>(null);

  // Search bar state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredNavItems, setFilteredNavItems] = useState<NavItem[]>(navItems);
  const [filteredOthersItems, setFilteredOthersItems] = useState<NavItem[]>(othersItems);

  // Filter items based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredNavItems(navItems);
      setFilteredOthersItems(othersItems);
      return;
    }

    const filterItems = (items: NavItem[]): NavItem[] => {
      return items.filter(item => {
        if (item.name === "search-bar") return true; // Always show search bar

        const nameMatch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const subItemMatch = item.subItems?.some(subItem =>
          subItem.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (nameMatch) return true;

        if (subItemMatch && item.subItems) {
          // Return item with filtered subItems
          return {
            ...item,
            subItems: item.subItems.filter(subItem =>
              subItem.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
          };
        }

        return false;
      });
    };

    setFilteredNavItems(filterItems(navItems));
    setFilteredOthersItems(filterItems(othersItems));
  }, [searchTerm]);
  // Auto-close sidebar on mobile after route change
  useEffect(() => {
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Close sidebar when clicking outside
  useClickOutside(sidebarRef, () => {
    if (isMobileOpen) {
      setIsMobileOpen(false);
    } else if (isExpanded) {
      setIsExpanded(false);
    }
  });

  // Close any open dropdowns when sidebar closes
  useEffect(() => {
    if (!isExpanded && !isMobileOpen) {
      setOpenSubmenu(null);
    }
  }, [isExpanded, isMobileOpen]);

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  
  // Bottom icons state management
  const [openBottomDropdown, setOpenBottomDropdown] = useState<'settings' | 'profile' | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items =
        menuType === "main"
          ? navItems
          : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (
    index: number,
    menuType: "main" | "others"
  ) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (
    items: NavItem[],
    menuType: "main" | "others"
  ) => (
    <ul className="flex flex-col gap-1">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.name === "search-bar" ? (
            // Special case: Render search bar instead of navigation item
            <div className="menu-item group menu-item-inactive">
              <div className="flex items-center flex-1">
                <div className="menu-item-icon-size menu-item-icon-inactive">
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <div className="flex-1 ml-3">
                    <input
                      type="text"
                      placeholder="Evaluate Tool"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          // Handle search submission
                          if (searchTerm.trim()) {
                            // Navigate to search results page
                            navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
                          }
                        }
                      }}
                      className="w-full px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : nav.subItems ? (
            <PrimaryDropdownButton
              onClick={() => handleSubmenuToggle(index, menuType)}
              isActive={openSubmenu?.type === menuType && openSubmenu?.index === index}
              isExpanded={isExpanded}
              isHovered={isHovered}
              isMobileOpen={isMobileOpen}
              icon={nav.icon}
              name={nav.name}
              hasNewBadge={nav.new}
            />
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-pro-active"
                                : "menu-dropdown-badge-pro-inactive"
                            } menu-dropdown-badge-pro`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      <aside
        ref={sidebarRef}
        className={`fixed  flex flex-col  top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200
          ${
            isExpanded || isMobileOpen
              ? "w-[290px]"
              : isHovered
              ? "w-[290px]"
              : "w-[90px]"
          }
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          xl:translate-x-0`}
        onMouseEnter={() => !isExpanded && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
      <div
        className={`py-8  flex ${
          !isExpanded && !isHovered ? "xl:justify-center" : "justify-start"
        }`}
      >
        <Link to="/ecommerce/dashboard">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={40}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <img
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "xl:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(filteredNavItems, "main")}
            </div>
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "xl:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(filteredOthersItems, "others")}
            </div>
            
          </div>
        </nav>
        {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
        
        {/* Fixed bottom items */}
        <div className="flex-shrink-0 pb-4 px-5">
          <div className="flex flex-col gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">



          </div>
        </div>
      </div>
    </aside>
  </>
  );
};

export default AppSidebar;
