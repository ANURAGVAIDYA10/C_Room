import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";

// Assume these icons are imported from an icon library
import {
  AiIcon,
  CalenderIcon,
  CartIcon,
  DocsIcon,
  FolderIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  TableIcon,
  TaskIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../context/AuthContext";
import SidebarWidget from "./SidebarWidget";
import DropdownButton from "../components/sidebar/Dropdown";
import PrimaryDropdownButton from "../components/sidebar/Dropdown";
import { useClickOutside } from "../components/sidebar/Functionalites";
import SettingsDropdown from "../components/header/ui/SettingsDropdown";

type NavItem = {
  name: string;
  icon: React.ReactNode | null;
  path?: string;
  new?: boolean;
  pro?: boolean;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    // Search bar item - special handling in renderMenuItems
    name: "search-bar",
    icon: null,
    path: "#",
  },
  {
    name: "Procurement Request",
    icon: <DocsIcon />,
    subItems: [
      { name: "Renewal", path: "/procurement/renewal", pro: false },
    ],
  },
  {
    name: "Request Management",
    icon: <ListIcon />,
    subItems: [
      { name: "All Request", path: "/request-management/all-open" },
      { name: "Assigned to Me", path: "/request-management/assigned-to-me" },
      { name: "Unassigned", path: "/request-management/unassigned" },
      { name: "Resolved", path: "/request-management/resolved" },
    ],
  },
  // Vendor Management dropdown - Added as requested
  {
    name: "Vendor Management",
    icon: <FolderIcon />,
    subItems: [
      { name: "Vendors", path: "/vendor-management/list" },
      { name: "Renewal", path: "/vendor-management/VendorRenewal/Renewal_vendor" },
      { name: "Agreements", path: "/vendor-management/contracts" },
    ],
  },
  {
    icon: <GridIcon />,
    name: "Dashboard",
    subItems: [
      { name: "Ecommerce", path: "/ecommerce/dashboard", pro: false },
      { name: "Analytics", path: "/analytics", pro: false },
      { name: "Marketing", path: "/marketing", pro: false },
      { name: "CRM", path: "/crm", pro: false },
      { name: "Stocks", path: "/stocks", pro: false },
      { name: "SaaS", path: "/saas", new: true },
      { name: "Logistics", path: "/logistics", new: true },
    ],
  },
  {
    name: "AI Assistant",
    icon: <AiIcon />,
    new: true,
    subItems: [
      { name: "Text Generator", path: "/text-generator", pro: false },
      { name: "Image Generator", path: "/image-generator", pro: false },
      { name: "Code Generator", path: "/code-generator", pro: false },
      { name: "Video Generator", path: "/video-generator", pro: false },
    ],
  },
  {
    name: "E-commerce",
    icon: <CartIcon />,
    new: true,
    subItems: [
      { name: "Products", path: "/products-list", pro: false },
      { name: "Add Product", path: "/add-product", pro: false },
      { name: "Billing", path: "/billing", pro: false },
      { name: "Invoices", path: "/invoices", pro: false },
      { name: "Single Invoice", path: "/single-invoice", pro: false },
      { name: "Create Invoice", path: "/create-invoice", pro: false },
      { name: "Transactions", path: "/transactions", pro: false },
      { name: "Single Transaction", path: "/single-transaction", pro: false },
    ],
  },
  {
    icon: <CalenderIcon />,
    name: "Calendar",
    path: "/calendar",
  },
  {
    name: "Task",
    icon: <TaskIcon />,
    subItems: [
      { name: "List", path: "/task-list", pro: true },
      { name: "Kanban", path: "/task-kanban", pro: true },
    ],
  },
  {
    name: "Forms",
    icon: <ListIcon />,
    subItems: [
      { name: "Form Elements", path: "/form-elements", pro: false },
      { name: "Form Layout", path: "/form-layout", pro: true },
    ],
  },
  {
    name: "Tables",
    icon: <TableIcon />,
    subItems: [
      { name: "Basic Tables", path: "/basic-tables", pro: false },
      { name: "Data Tables", path: "/data-tables", pro: true },
    ],
  },
  {
    name: "Pages",
    icon: <PageIcon />,
    subItems: [
      { name: "File Manager", path: "/file-manager", pro: false },
      { name: "Pricing Tables", path: "/pricing-tables", pro: false },
      { name: "FAQ", path: "/faq", pro: false },
      { name: "API Keys", path: "/api-keys", new: true },
      { name: "Integrations", path: "/integrations", new: true },
      { name: "Blank Page", path: "/blank", pro: false },
      { name: "404 Error", path: "/error-404", pro: false },
      { name: "500 Error", path: "/error-500", pro: false },
      { name: "503 Error", path: "/error-503", pro: false },
      { name: "Coming Soon", path: "/coming-soon", pro: false },
      { name: "Maintenance", path: "/maintenance", pro: false },
      { name: "Success", path: "/success", pro: false },
    ],
  },
];

// Adding Others section similar to reference project
const othersItems: NavItem[] = [
  {
    name: "Request",
    icon: <TaskIcon />,
    path: "/requests",
  },
  {
    name: "Reports",
    icon: <PieChartIcon />,
    path: "/reports",
  },
  {
    icon: <CalenderIcon />,
    name: "Calendar",
    path: "/calendar",
  },
];

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
