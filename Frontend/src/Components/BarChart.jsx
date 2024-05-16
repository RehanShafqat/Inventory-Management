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
    const [apiData, setApiData] = useState(null);

    useEffect(() => {
        const fetchMostSoldCategories = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/version1/inventory/most-sold-categories/', {
                    method: 'GET',
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    setApiData(data);
                } else {
                    console.error('API request failed');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchMostSoldCategories();
    }, []);

    useEffect(() => {
        if (apiData) {
            const labels = apiData.map(item => item.category_name);
            const dataValues = apiData.map(item => item.total_sold);

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
        }
    }, [apiData]);

    return (
        <div>
            {chartData && apiData && (
                <Bar data={chartData} />
            )}
        </div>
    );
};

export default BarChart;
