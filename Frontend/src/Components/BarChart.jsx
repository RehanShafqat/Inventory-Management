import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js/auto';

Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const BarChart = () => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        // Simulated API response data
        const apiData = [
            { "category_name": "Grocery", "total_sold": 33 },
            { "category_name": "Sports", "total_sold": 3 },
            { "category_name": "Instruments", "total_sold": 4 },
            { "category_name": "Clothing", "total_sold": 12 },
            { "category_name": "asad", "total_sold": 50 },
        ];

        // Extracting labels and dataset from API response
        const labels = apiData.map(item => item.category_name);
        const dataValues = apiData.map(item => item.total_sold);

        // Creating chart data object
        const chartData = {
            labels: labels,
            datasets: [
                {
                    label: 'Total Sold',
                    data: dataValues,
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.6)', // Light teal
                        'rgba(255, 99, 132, 0.6)', // Light red
                        'rgba(54, 162, 235, 0.6)' // Light blue
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)', // Teal
                        'rgba(255, 99, 132, 1)', // Red
                        'rgba(54, 162, 235, 1)' // Blue
                    ],
                    borderWidth: 1
                }
            ]
        };

        setChartData(chartData);
    }, []); // Run this effect only once on component mount

    return (
        <>
            {chartData && <Bar data={chartData} />}
        </ >
    );
};

export default BarChart;
