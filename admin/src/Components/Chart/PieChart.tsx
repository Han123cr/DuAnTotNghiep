import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
    labels: string[]; // Nhãn của các phần
    data: number[];   // Dữ liệu tương ứng với từng nhãn
    title: string;    // Tiêu đề biểu đồ
}

const PieChart: React.FC<PieChartProps> = ({ labels, data, title }) => {
    const chartData = {
        labels: labels,
        datasets: [
            {
                label: title,
                data: data,
                backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",  // Màu từng phần
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(255, 206, 86, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(153, 102, 255, 0.2)",
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",  // Viền từng phần
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
        },
    };

    return <Pie data={chartData} options={options} />;
};

export default PieChart;
