import React from "react";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface LineChartProps {
    labels: string[];
    data: number[];
    title: string;
}

const LineChart: React.FC<LineChartProps> = ({ labels, data, title }) => {
    const chartData = {
        labels: labels,
        datasets: [
            {
                label: title,
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true, // Đổ màu bên dưới đường
                tension: 0.4, // Độ cong của đường
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
    };

    return <Line data={chartData} options={options} />;
};

export default LineChart;