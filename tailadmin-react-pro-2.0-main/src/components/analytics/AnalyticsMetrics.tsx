// import React from "react";
// import Badge from "../ui/badge/Badge";

// const mockData = [
//   {
//     id: 1,
//     title: "Unique Visitors",
//     value: "24.7K",
//     change: "+20%",
//     direction: "up",
//     comparisonText: "Vs last month",
//   },
//   {
//     id: 2,
//     title: "Total Pageviews",
//     value: "55.9K",
//     change: "+4%",
//     direction: "up",
//     comparisonText: "Vs last month",
//   },
//   {
//     id: 3,
//     title: "Bounce Rate",
//     value: "54%",
//     change: "-1.59%",
//     direction: "down",
//     comparisonText: "Vs last month",
//   },
//   {
//     id: 4,
//     title: "Visit Duration",
//     value: "2m 56s",
//     change: "+7%",
//     direction: "up",
//     comparisonText: "Vs last month",
//   },
// ];

// const AnalyticsMetrics: React.FC = () => {
//   return (
//     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
//       {/* <!-- Metric Item Start --> */}
//       {mockData.map((item) => (
//         <div
//           key={item.id}
//           className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]"
//         >
//           <p className="text-gray-500 text-theme-sm dark:text-gray-400">
//             {item.title}
//           </p>
//           <div className="flex items-end justify-between mt-3">
//             <div>
//               <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">
//                 {item.value}
//               </h4>
//             </div>
//             <div className="flex items-center gap-1">
//               <Badge
//                 color={
//                   item.direction === "up"
//                     ? "success"
//                     : item.direction === "down"
//                     ? "error"
//                     : "warning"
//                 }
//               >
//                 <span className="text-xs"> {item.change}</span>
//               </Badge>
//               <span className="text-gray-500 text-theme-xs dark:text-gray-400">
//                 {item.comparisonText}
//               </span>
//             </div>
//           </div>
//         </div>
//       ))}

//       {/* <!-- Metric Item End --> */}
//     </div>
//   );
// };

// export default AnalyticsMetrics;

import React from "react";
import Badge from "../ui/badge/Badge";
import { useAnalytics, TotalSpendData } from "../../hooks/useAnalytics";

const AnalyticsMetrics: React.FC = () => {
  const { totalSpendData, loading, error } = useAnalytics();

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]"
          >
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="flex items-end justify-between mt-3">
              <div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
        <div className="col-span-full text-center py-8 text-red-500">
          Error loading analytics data: {error}
        </div>
      </div>
    );
  }

  // Prepare the dynamic data based on fetched analytics
  const metricData = totalSpendData ? [
    {
      id: 1,
      title: "Total Vendors",
      value: totalSpendData.vendorCount.toString(),
      change: totalSpendData.changePercentage,
      direction: "up",
      comparisonText: "Vs last month",
    },
    {
      id: 2,
      title: "Total Products",
      value: totalSpendData.productCount.toString(),
      change: "+5%",
      direction: "up",
      comparisonText: "Vs last month",
    },
    {
      id: 3,
      title: "Total Vendor Spend",
      value: totalSpendData.formattedTotalSpend,
      change: totalSpendData.changePercentage,
      direction: "up",
      comparisonText: "Vs last month",
    },
    {
      id: 4,
      title: "Avg Spend Per Vendor",
      value: `$${totalSpendData.averageSpendPerVendor.toFixed(2)}`,
      change: "+3%",
      direction: "up",
      comparisonText: "Vs last month",
    },
  ] : [
    {
      id: 1,
      title: "Total Vendors",
      value: "0",
      change: "0%",
      direction: "up",
      comparisonText: "Vs last month",
    },
    {
      id: 2,
      title: "Total Products",
      value: "0",
      change: "0%",
      direction: "up",
      comparisonText: "Vs last month",
    },
    {
      id: 3,
      title: "Total Vendor Spend",
      value: "$0.00",
      change: "0%",
      direction: "up",
      comparisonText: "Vs last month",
    },
    {
      id: 4,
      title: "Avg Spend Per Vendor",
      value: "$0.00",
      change: "0%",
      direction: "up",
      comparisonText: "Vs last month",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
      {/* <!-- Metric Item Start --> */}
      {metricData.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]"
        >
          <p className="text-gray-500 text-theme-sm dark:text-gray-400">
            {item.title}
          </p>
          <div className="flex items-end justify-between mt-3">
            <div>
              <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">
                {item.value}
              </h4>
            </div>
            <div className="flex items-center gap-1">
              <Badge
                color={
                  item.direction === "up"
                    ? "success"
                    : item.direction === "down"
                    ? "error"
                    : "warning"
                }
              >
                <span className="text-xs"> {item.change}</span>
              </Badge>
              <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                {item.comparisonText}
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* <!-- Metric Item End --> */}
    </div>
  );
};

export default AnalyticsMetrics;