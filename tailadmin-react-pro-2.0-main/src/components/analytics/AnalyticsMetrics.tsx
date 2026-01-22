import React from "react";
import Badge from "../ui/badge/Badge";
import {
  DollarSign,
  ArrowDown,
  Percent,
  ClipboardCheck,
  CheckCircle,
} from "lucide-react";

const metrics = [
  {
    id: 1,
    title: "Total Spend",
    value: "$1.2M",
    change: "+2.01%",
    direction: "up",
    icon: DollarSign,
  },
  {
    id: 2,
    title: "Total Savings",
    value: "$185K",
    change: "+1.21%",
    direction: "up",
    icon: ArrowDown,
  },
  {
    id: 3,
    title: "Savings Rate",
    value: "15.4%",
    change: "-11.01%",
    direction: "down",
    icon: Percent,
  },
  {
    id: 4,
    title: "Open Requests",
    value: "12",
    icon: ClipboardCheck,
  },
  {
    id: 5,
    title: "Closed Requests",
    value: "8",
    icon: CheckCircle,
  },
];

const AnalyticsMetrics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {metrics.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.id}
            className="relative rounded-2xl bg-white p-5 shadow-sm border border-gray-200"
          >
            {/* Top Row */}
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                <Icon className="h-5 w-5 text-gray-600" />
              </div>

              {item.change && (
                <Badge
                  color={item.direction === "up" ? "success" : "error"}
                >
                  {item.change}
                </Badge>
              )}
            </div>

            {/* Content */}
            <div className="mt-4">
              <p className="text-sm text-gray-500">{item.title}</p>
              <h3 className="mt-1 text-2xl font-semibold text-gray-900">
                {item.value}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AnalyticsMetrics;
