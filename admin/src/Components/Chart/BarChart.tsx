import React from "react";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
    labels: string[];
    data: number[][];
    titles: string[];
}

const BarChart: React.FC<BarChartProps> = ({ labels, data, titles }) => {
    const chartData = {
        labels: labels,
        datasets: data.map((dataset, index) => ({
            label: titles[index],
            data: dataset,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: index === 0 
                ? 'rgba(75, 192, 192)' // Màu nền xanh dương nhạt
                : 'rgba(153, 102, 255)', // Màu nền tím nhạt// Màu sắc khác nhau cho mỗi dataset
        })),
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
    };

    return <Bar data={chartData} options={options} />;
};

export default BarChart;