import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function RequestStatusChart() {
  const series = [1800, 2200, 1600, 2100, 1300, 2500, 1000];

  const options: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "Outfit, sans-serif",
    },

    labels: [
      "Request Created",
      "Pre-Approval",
      "Request Review Stage",
      "Negotiation Stage",
      "Post Approval",
      "Completed",
      "Declined",
    ],

    colors: [
      "#7C3AED", // Request Created
      "#38BDF8", // Pre-Approval
      "#FBBF24", // Review
      "#FB923C", // Negotiation
      "#A3E635", // Post Approval
      "#22C55E", // Completed
      "#EF4444", // Declined
    ],

    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            name: {
              show: true,
              offsetY: -5,
              color: "#6B7280",
              fontSize: "14px",
            },
            value: {
              show: true,
              fontSize: "28px",
              fontWeight: 600,
              color: "#111827",
              offsetY: 8,
              formatter: () => "12.5K",
            },
            total: {
              show: true,
              label: "Total",
              fontSize: "14px",
              color: "#6B7280",
            },
          },
        },
      },
    },

    dataLabels: {
      enabled: false,
    },

    stroke: {
      width: 2,
      colors: ["#fff"],
    },

    legend: {
      show: true,
      position: "bottom",
      fontSize: "13px",
      markers: {
        size: 8,
        shape: "circle",
      },
      itemMargin: {
        horizontal: 10,
        vertical: 6,
      },
    },

    tooltip: {
      enabled: true,
    },
  };

  return (
    <div className="rounded-2xl bg-white border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Request Status
      </h3>

      <div className="flex justify-center">
        <Chart options={options} series={series} type="donut" height={320} />
      </div>
    </div>
  );
}
