"use client";
import ReactApexChart from "react-apexcharts";

interface LineChartProps {
  data: number[];
  x_label: string[];
}

const LineChart: React.FC<LineChartProps> = ({ data, x_label }) => {
  const options = {
    chart: {
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    title: {
      text: "Student Exam Averages",
      align: "center",
      style: {
        fontSize: "20px",
        fontWeight: "bold",
      },
    } as ApexTitleSubtitle,
    tooltip: {
      enabled: true,
      x: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 6,
    },
    grid: {
      show: false,
      strokeDashArray: 4,
      padding: {
        left: 8,
        right: 2,
        top: 0,
      },
    },
    series: [
      {
        name: "grades",
        data: data,
        color: "#6B46C1",
      },
    ],
    xaxis: {
      categories: x_label,
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: true,
      min: 0,
      max: 100,
    },
  };

  return (
    <ReactApexChart
      type="line"
      series={options.series}
      options={options}
      height="100%"
    />
  );
};

export default LineChart;
