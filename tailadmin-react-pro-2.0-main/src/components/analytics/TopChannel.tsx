import { ArrowRight } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "comment",
    user: "Sarah Chen",
    text: "commented on Salesforce renewal request",
    time: "5 min ago",
    avatar: "/images/avatar-1.jpg",
  },
  {
    id: 2,
    type: "approved",
    text: "AWS contract renewal approved by Finance",
    time: "8 min ago",
  },
  {
    id: 3,
    type: "pending",
    text: "Slack upgrade request moved to negotiation",
    time: "15 min ago",
  },
  {
    id: 4,
    type: "request",
    text: "New request submitted for Figma Enterprise",
    time: "1 hr ago",
  },
  {
    id: 5,
    type: "request",
    text: "New request submitted for Figma Enterprise",
    time: "1 hr ago",
  },
];

function ActivityIcon({ type }: { type: string }) {
  if (type === "approved") {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
        <span className="h-3 w-3 rounded-full bg-green-600" />
      </div>
    );
  }

  if (type === "pending") {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
        <span className="h-3 w-3 rounded-full bg-yellow-500" />
      </div>
    );
  }

  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
      📄
    </div>
  );
}

export default function RecentActivity() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 w-full h-full">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        Recent Activity
      </h3>

      <div className="space-y-4 max-h-[340px] overflow-y-auto pr-2">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start justify-between gap-3"
          >
            {/* Left icon / avatar */}
            <div className="flex items-start gap-3">
              {activity.avatar ? (
                <img
                  src={activity.avatar}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <ActivityIcon type={activity.type} />
              )}

              {/* Text */}
              <div>
                <p className="text-sm text-gray-700">
                  {activity.user && (
                    <span className="font-medium">
                      {activity.user}{" "}
                    </span>
                  )}
                  {activity.text}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {activity.time}
                </p>
              </div>
            </div>

            {/* Right arrow (only for some items) */}
            {activity.type === "approved" && (
              <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50">
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
