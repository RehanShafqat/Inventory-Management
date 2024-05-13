import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
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
const LineChart = () => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        // Simulated API response data
        const apiData = [
            { "category_name": "Grocery", "total_sold": 33 },
            { "category_name": "Sports", "total_sold": 3 },
            { "category_name": "Clothing", "total_sold": 3 }
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
                    borderColor: 'rgb(75,192,192)',
                    fill: false,
                    tension: 0.1
                }
            ]
        };

        setChartData(chartData);
    }, []); // Run this effect only once on component mount

    return (
        <>
            {chartData && <Line data={chartData} />}
        </>
    );
};

export default LineChart;
