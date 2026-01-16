import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";

// Import phosphor icons with different variants
import {
  File,
  FileText,
  FileDotted,
  FileZip,
  FilePlus,
  Gear,
  ChartBar,
  ShoppingCart,
  Chat,
  Phone,
  Folder,
  Calendar,
  UserCircle as PhosphorUserCircle,
  List,
  Table,
  FilePdf,
  Plugs,
  Cube,
  Lightbulb,
  DotsThreeVertical,
  Files,
  SquaresFour,
} from "phosphor-react";

// Import Iconoir icons
import {
  MultiplePages,
  Page,
  PagePlus,
  PageMinus,
  PageStar,
  Journal,
  TaskList,
  User as IconoirUser,
  UserXmark,
  CheckCircle,
  XmarkCircle,
  Industry,
  Building,
  UserBag,
  Shop,
} from "iconoir-react";
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
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean; icon?: React.ReactNode }[];
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
    icon: (
    <div className="flex items-center gap-1">
      <div className="flex flex-col items-center gap-1">
        <File size={16} weight="thin" />
        <File size={16} weight="light" />
        <File size={16} weight="regular" />
        <File size={16} weight="bold" />
        <File size={16} weight="fill" />
        <File size={16} weight="duotone" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="material-icons text-xs">draft</span>
        <span className="material-icons text-xs">insert_drive_file</span>
        <span className="material-icons text-xs">description</span>
        <span className="material-icons text-xs">receipt</span>
        <span className="material-icons text-xs">file_copy</span>
        <span className="material-icons text-xs">attachment</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <MultiplePages height={16} width={16} color="#3b82f6" />
        <Page height={16} width={16} />
        <PagePlus height={16} width={16} />
        <PageMinus height={16} width={16} />
        <PageStar height={16} width={16} />
        <Journal height={16} width={16} />
      </div>
    </div>
  ),
    subItems: [
      { name: "Renewal", path: "/procurement/renewal", pro: false },
    ],
  },
  {
    name: "Request Management",
    icon: (
    <div className="flex items-center gap-1">
      <div className="flex flex-col items-center gap-1">
        <List size={16} weight="thin" />
        <List size={16} weight="light" />
        <List size={16} weight="regular" />
        <List size={16} weight="bold" />
        <List size={16} weight="fill" />
        <List size={16} weight="duotone" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="material-icons text-xs">list</span>
        <span className="material-icons text-xs">assignment</span>
        <span className="material-icons text-xs">format_list_bulleted</span>
        <span className="material-icons text-xs">checklist</span>
        <span className="material-icons text-xs">task_alt</span>
        <span className="material-icons text-xs">fact_check</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <TaskList height={16} width={16} />
        <IconoirUser height={16} width={16} />
        <CheckCircle height={16} width={16} />
        <XmarkCircle height={16} width={16} />
        <UserXmark height={16} width={16} />
        <UserBag height={16} width={16} />
      </div>
    </div>
  ),
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
    icon: (
    <div className="flex items-center gap-1">
      <div className="flex flex-col items-center gap-1">
        <Folder size={16} weight="thin" />
        <Folder size={16} weight="light" />
        <Folder size={16} weight="regular" />
        <Folder size={16} weight="bold" />
        <Folder size={16} weight="fill" />
        <Folder size={16} weight="duotone" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="material-icons text-xs">folder</span>
        <span className="material-icons text-xs">folder_open</span>
        <span className="material-icons text-xs">folder_shared</span>
        <span className="material-icons text-xs">create_new_folder</span>
        <span className="material-icons text-xs">folder_special</span>
        <span className="material-icons text-xs">source</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Industry height={16} width={16} />
        <Building height={16} width={16} />
        <Shop height={16} width={16} />
        <UserBag height={16} width={16} />
        <IconoirUser height={16} width={16} />
        <UserXmark height={16} width={16} />
      </div>
    </div>
  ),
    subItems: [
      { name: "Vendors", path: "/vendor-management/list" },
      { name: "Renewal", path: "/vendor-management/VendorRenewal/Renewal_vendor" },
      { name: "Agreements", path: "/vendor-management/contracts" },
    ],
  },
  {
    icon: (
    <div className="flex flex-col items-center gap-1">
      <Files size={16} weight="thin" />
      <Files size={16} weight="light" />
      <Files size={16} weight="regular" />
      <Files size={16} weight="bold" />
      <Files size={16} weight="fill" />
      <Files size={16} weight="duotone" />
    </div>
  ),
    name: "Dashboard",
    subItems: [
      { name: "Ecommerce", path: "/", pro: false },
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
    icon: (
    <div className="flex flex-col items-center gap-1">
      <Lightbulb size={16} weight="thin" />
      <Lightbulb size={16} weight="light" />
      <Lightbulb size={16} weight="regular" />
      <Lightbulb size={16} weight="bold" />
      <Lightbulb size={16} weight="fill" />
      <Lightbulb size={16} weight="duotone" />
    </div>
  ),
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
    icon: (
    <div className="flex flex-col items-center gap-1">
      <ShoppingCart size={16} weight="thin" />
      <ShoppingCart size={16} weight="light" />
      <ShoppingCart size={16} weight="regular" />
      <ShoppingCart size={16} weight="bold" />
      <ShoppingCart size={16} weight="fill" />
      <ShoppingCart size={16} weight="duotone" />
    </div>
  ),
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
    icon: (
    <div className="flex flex-col items-center gap-1">
      <Calendar size={16} weight="thin" />
      <Calendar size={16} weight="light" />
      <Calendar size={16} weight="regular" />
      <Calendar size={16} weight="bold" />
      <Calendar size={16} weight="fill" />
      <Calendar size={16} weight="duotone" />
    </div>
  ), // Regular variant
    name: "Calendar",
    path: "/calendar",
  },
  {
    icon: (
    <div className="flex flex-col items-center gap-1">
      <PhosphorUserCircle size={16} weight="thin" />
      <PhosphorUserCircle size={16} weight="light" />
      <PhosphorUserCircle size={16} weight="regular" />
      <PhosphorUserCircle size={16} weight="bold" />
      <PhosphorUserCircle size={16} weight="fill" />
      <PhosphorUserCircle size={16} weight="duotone" />
    </div>
  ), // Light variant
    name: "User Profile",
    path: "/profile",
  },
  {
    name: "Task",
    icon: <List weight="fill" />, // Fill variant
    subItems: [
      { name: "List", path: "/task-list", pro: true },
      { name: "Kanban", path: "/task-kanban", pro: true },
    ],
  },
  {
    name: "Forms",
    icon: <List weight="light" />, // Light variant
    subItems: [
      { name: "Form Elements", path: "/form-elements", pro: false },
      { name: "Form Layout", path: "/form-layout", pro: true },
    ],
  },
  {
    name: "Tables",
    icon: <Table weight="thin" />, // Thin variant
    subItems: [
      { name: "Basic Tables", path: "/basic-tables", pro: false },
      { name: "Data Tables", path: "/data-tables", pro: true },
    ],
  },
  {
    name: "Pages",
    icon: <FileText weight="bold" />, // Bold variant
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
    icon: <List weight="fill" />, // Fill variant
    path: "/requests",
  },
  {
    name: "Reports",
    icon: <ChartBar weight="duotone" />, // Duotone variant
    path: "/reports",
  },
  {
    icon: <Calendar weight="regular" />, // Regular variant
    name: "Calendar",
    path: "/calendar",
  },
  {
    name: "Icons Showcase",
    icon: (
    <div className="flex items-center gap-1">
      <File size={16} weight="regular" />
      <span className="material-icons text-xs">description</span>
      <Page height={16} width={16} />
    </div>
  ),
    path: "/icons-showcase",
  },
];

// Support items with phosphor icon variants
const supportItems: NavItem[] = [
  {
    icon: <Chat weight="thin" />, // Thin variant
    name: "Chat",
    path: "/chat",
  },
  {
    icon: <Phone weight="bold" />, // Bold variant
    name: "Support Ticket",
    new: true,
    subItems: [
      { name: "Ticket List", path: "/support-tickets" },
      { name: "Ticket Reply", path: "/support-ticket-reply" },
    ],
  },
  {
    icon: <FilePdf weight="duotone" />, // Duotone variant
    name: "Email",
    subItems: [
      { name: "Inbox", path: "/inbox" },
      { name: "Details", path: "/inbox-details" },
    ],
  },
];

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
                      {false && subItem.icon && (
                        <span className="mr-2">
                          {subItem.icon}
                        </span>
                      )}
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
                  <SquaresFour className="size-6" weight="fill" />
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
                  <SquaresFour className="size-6" weight="fill" />
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
