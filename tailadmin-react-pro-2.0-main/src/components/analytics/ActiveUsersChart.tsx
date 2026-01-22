import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function SpendOverviewChart() {
  const series = [
    {
      name: "Spend",
      data: [720, 740, 750, 760, 780, 800, 770, 810, 840, 820, 850, 900],
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "area", // 🔑 MUST be area
      height: 300,
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
      zoom: { enabled: false },
    },

    /* ✅ EXACT LINE COLOR */
    colors: ["#0E7490"],

    stroke: {
      curve: "smooth",
      width: 2,
      colors: ["#0E7490"], // force line color
    },

    /* ✅ VERY LIGHT AREA FILL (like image) */
    fill: {
      type: "gradient",
      colors: ["#0E7490"],
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0,
        opacityFrom: 0.12, // subtle highlight
        opacityTo: 0,
        stops: [0, 100],
      },
    },

    /* ❌ NO DOTS */
    markers: {
      size: 0,
    },

    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 4,
    },

    dataLabels: {
      enabled: false,
    },

    xaxis: {
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
        },
      },
      crosshairs: {
        stroke: {
          color: "#9CA3AF",
          width: 1,
          dashArray: 3,
        },
      },
    },

    yaxis: {
      labels: {
        formatter: (val) => `$${val}`,
        style: {
          colors: "#6B7280",
          fontSize: "12px",
        },
      },
    },

    tooltip: {
      x: {
        show: true,
      },
      y: {
        formatter: (val) => `$${val}K`,
      },
      marker: {
        show: true,
      },
    },
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Spend Overview
          </h3>
          <p className="text-sm text-gray-500">
            Monthly software & cloud spend
          </p>
        </div>

        <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
          Last 12 months
        </button>
      </div>

      <Chart options={options} series={series} type="area" height={300} />
    </div>
  );
}
