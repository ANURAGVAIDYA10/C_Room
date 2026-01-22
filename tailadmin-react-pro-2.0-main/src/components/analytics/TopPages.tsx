import { useState } from "react";

type Status = "danger" | "warning" | "neutral" | "expired";

interface Renewal {
  id: number;
  name: string;
  plan: string;
  owner: string;
  dueIn: string;
  status: Status;
  logo: string;
}

/* Active / upcoming renewals */
const upcomingRenewals: Renewal[] = [
  {
    id: 1,
    name: "Slack",
    plan: "Business Plus",
    owner: "Wilson Gouse",
    dueIn: "9 days",
    status: "danger",
    logo: "🟢",
  },
  {
    id: 2,
    name: "AWS",
    plan: "Cloud Infrastructure",
    owner: "Terry Franci",
    dueIn: "14 days",
    status: "warning",
    logo: "🟠",
  },
  {
    id: 3,
    name: "Salesforce",
    plan: "Enterprise CRM License",
    owner: "Alena Franci",
    dueIn: "20 days",
    status: "warning",
    logo: "🔵",
  },
  {
    id: 4,
    name: "Figma",
    plan: "Organization Plan",
    owner: "Jocelyn Kenter",
    dueIn: "45 days",
    status: "neutral",
    logo: "🟣",
  },
];

/* Recently expired contracts */
const expiredRenewals: Renewal[] = [
  {
    id: 101,
    name: "Notion",
    plan: "Team Plan",
    owner: "David Miller",
    dueIn: "Expired 3 days ago",
    status: "expired",
    logo: "⚫",
  },
  {
    id: 102,
    name: "Zoom",
    plan: "Enterprise Plan",
    owner: "Rachel Green",
    dueIn: "Expired 7 days ago",
    status: "expired",
    logo: "🔵",
  },
];

function DueBadge({ status, text }: { status: Status; text: string }) {
  const styles = {
    danger: "bg-red-100 text-red-600",
    warning: "bg-orange-100 text-orange-600",
    neutral: "bg-gray-100 text-gray-600",
    expired: "bg-gray-200 text-gray-500",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}
    >
      {text}
    </span>
  );
}

export default function UpcomingRenewals() {
  const [activeTab, setActiveTab] = useState<
    "3 months" | "1 month" | "This week" | "Recently Expired"
  >("3 months");

  const data =
    activeTab === "Recently Expired"
      ? expiredRenewals
      : upcomingRenewals;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 w-full h-full">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          Upcoming Renewals
        </h3>

        <div className="flex gap-2 rounded-lg bg-gray-100 p-1">
          {["3 months", "1 month", "This week", "Recently Expired"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() =>
                  setActiveTab(tab as typeof activeTab)
                }
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${activeTab === tab
                  ? "bg-white text-gray-800 shadow"
                  : "text-gray-500"
                  }`}
              >
                {tab}
              </button>
            )
          )}
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-3 gap-4 border-b border-gray-200 pb-2 text-sm text-gray-400">
        <span>Contract</span>
        <span>Owner</span>
        <span className="text-right">Status</span>
      </div>

      {/* Rows */}
      <div className="mt-3 space-y-4">
        {data.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-3 items-center gap-4"
          >
            {/* Contract */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                {item.logo}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {item.name}
                </p>
                <p className="text-xs text-gray-500">{item.plan}</p>
              </div>
            </div>

            {/* Owner */}
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600">
                {item.owner
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <span className="text-sm text-gray-700">
                {item.owner}
              </span>
            </div>

            {/* Due / Status */}
            <div className="flex justify-end">
              <DueBadge status={item.status} text={item.dueIn} />
            </div>
          </div>
        ))}

        {data.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-6">
            No records found
          </p>
        )}
      </div>
    </div>
  );
}
