import { ChevronLeft, ChevronRight } from "lucide-react";

const contracts = [
  {
    id: 1,
    name: "AWS",
    category: "Cloud Services",
    value: "$245,000",
    renews: "Renews Mar 2026",
    logo: "/images/logos/aws.svg",
  },
  {
    id: 2,
    name: "Slack",
    category: "Communication",
    value: "$99,000",
    renews: "Renews Apr 2026",
    logo: "/images/logos/slack.svg",
  },
  {
    id: 3,
    name: "AWS",
    category: "Cloud Services",
    value: "$245,000",
    renews: "Renews Mar 2025",
    logo: "/images/logos/aws.svg",
  },
  {
    id: 4,
    name: "AWS",
    category: "Cloud Services",
    value: "$245,000",
    renews: "Renews Mar 2025",
    logo: "/images/logos/aws.svg",
  },
];

export default function TopContracts() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          Top Contracts{" "}
          <span className="text-gray-500 font-normal">
            (By annual value)
          </span>
        </h3>

        <div className="flex gap-2">
          <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50">
            <ChevronLeft size={16} />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {contracts.map((item) => (
          <div
            key={item.id}
            className="min-w-[260px] rounded-xl bg-gray-100 p-4"
          >
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
                <img
                  src={item.logo}
                  alt={item.name}
                  className="h-6 w-6 object-contain"
                />
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  {item.name}
                </p>
                <p className="text-sm text-gray-500">
                  {item.category}
                </p>
              </div>
            </div>

            <p className="text-xl font-semibold text-gray-900">
              {item.value}
            </p>

            <p className="mt-1 text-sm text-green-600">
              {item.renews}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
