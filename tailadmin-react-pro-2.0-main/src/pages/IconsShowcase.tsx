import React from 'react';
import { Link } from 'react-router';

// Import phosphor icons
import {
  File,
  Files,
  Folder,
  ShoppingCart,
  Calendar,
  UserCircle,
  List,
  Table,
  ChartBar,
  Lightbulb,
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
  User,
  UserXmark,
  CheckCircle,
} from "iconoir-react";

const IconsShowcase: React.FC = () => {
  // Define 10 icon comparisons
  const iconComparisons = [
    {
      name: "File",
      phosphor: <File size={24} weight="regular" />,
      google: <span className="material-icons text-xl">description</span>,
      iconoir: <Page height={24} width={24} />,
    },
    {
      name: "Files",
      phosphor: <Files size={24} weight="regular" />,
      google: <span className="material-icons text-xl">folder</span>,
      iconoir: <MultiplePages height={24} width={24} />,
    },
    {
      name: "Folder",
      phosphor: <Folder size={24} weight="regular" />,
      google: <span className="material-icons text-xl">folder_open</span>,
      iconoir: <Journal height={24} width={24} />,
    },
    {
      name: "Shopping Cart",
      phosphor: <ShoppingCart size={24} weight="regular" />,
      google: <span className="material-icons text-xl">shopping_cart</span>,
      iconoir: <PagePlus height={24} width={24} />,
    },
    {
      name: "Calendar",
      phosphor: <Calendar size={24} weight="regular" />,
      google: <span className="material-icons text-xl">calendar_today</span>,
      iconoir: <PageStar height={24} width={24} />,
    },
    {
      name: "User",
      phosphor: <UserCircle size={24} weight="regular" />,
      google: <span className="material-icons text-xl">account_circle</span>,
      iconoir: <User height={24} width={24} />,
    },
    {
      name: "List",
      phosphor: <List size={24} weight="regular" />,
      google: <span className="material-icons text-xl">list</span>,
      iconoir: <TaskList height={24} width={24} />,
    },
    {
      name: "Table",
      phosphor: <Table size={24} weight="regular" />,
      google: <span className="material-icons text-xl">table_chart</span>,
      iconoir: <CheckCircle height={24} width={24} />,
    },
    {
      name: "Chart",
      phosphor: <ChartBar size={24} weight="regular" />,
      google: <span className="material-icons text-xl">bar_chart</span>,
      iconoir: <PageMinus height={24} width={24} />,
    },
    {
      name: "Lightbulb",
      phosphor: <Lightbulb size={24} weight="regular" />,
      google: <span className="material-icons text-xl">emoji_objects</span>,
      iconoir: <UserXmark height={24} width={24} />,
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Icons Comparison
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Phosphor Icons • Google Fonts • Iconoir
          </p>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-8 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-700 dark:text-gray-300 text-sm">Phosphor</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-700 dark:text-gray-300 text-sm">Google</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-gray-700 dark:text-gray-300 text-sm">Iconoir</span>
          </div>
        </div>

        {/* Icons Comparison Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-4 gap-px bg-gray-200 dark:bg-gray-700">
            {/* Header Row */}
            <div className="bg-gray-100 dark:bg-gray-700 p-4 font-semibold text-gray-900 dark:text-white text-center">
              Icon Name
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 font-semibold text-blue-600 dark:text-blue-400 text-center">
              Phosphor
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 font-semibold text-green-600 dark:text-green-400 text-center">
              Google
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 font-semibold text-purple-600 dark:text-purple-400 text-center">
              Iconoir
            </div>

            {/* Icon Rows */}
            {iconComparisons.map((icon, index) => (
              <React.Fragment key={index}>
                <div className="bg-white dark:bg-gray-800 p-4 text-gray-900 dark:text-white font-medium flex items-center justify-center">
                  {icon.name}
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 flex items-center justify-center">
                  <div className="text-blue-600 dark:text-blue-400">
                    {icon.phosphor}
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 flex items-center justify-center">
                  <div className="text-green-600 dark:text-green-400">
                    {icon.google}
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 flex items-center justify-center">
                  <div className="text-purple-600 dark:text-purple-400">
                    {icon.iconoir}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
            Key Differences
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <h3 className="font-medium text-blue-600 dark:text-blue-400 mb-2">Phosphor Icons</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Multiple weights, consistent design, React components
              </p>
            </div>
            <div>
              <h3 className="font-medium text-green-600 dark:text-green-400 mb-2">Google Fonts</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Material Design, CSS classes, wide variety
              </p>
            </div>
            <div>
              <h3 className="font-medium text-purple-600 dark:text-purple-400 mb-2">Iconoir</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Minimalist design, SVG components, easy customization
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <Link 
            to="/" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IconsShowcase;