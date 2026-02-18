import { useRef, useEffect } from 'react';
import { Chart } from 'chart.js/auto';

const ResourceChart = ({ data, title, type = 'bar', options = {} }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        if (!data) return;

        const ctx = chartRef.current.getContext('2d');
        chartInstance.current = new Chart(ctx, {
            type: type,
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: !!title,
                        text: title,
                    },
                },
                scales: {
                    // Only apply scales to cartesian charts
                    y: (type === 'bar' || type === 'line') ? {
                        beginAtZero: true,
                        grid: {
                            display: true,
                            drawBorder: false,
                            color: "rgba(0,0,0,0.05)"
                        }
                    } : undefined,
                    x: (type === 'bar' || type === 'line') ? {
                        grid: {
                            display: false,
                        }
                    } : undefined,
                },
                ...options,
            },
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data, title, type, options]);

    return <canvas ref={chartRef} />;
};

export default ResourceChart;
