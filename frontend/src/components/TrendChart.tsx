import React from 'react';
import { useStudentContext } from '../context/StudentContext';

const TrendChart: React.FC = () => {
  const { students } = useStudentContext();

  // Generate trend data for the last 8 weeks
  const weeks = Array.from({ length: 8 }, (_, i) => `Week ${i + 1}`);
  const highRiskTrend = [12, 15, 18, 14, 16, 13, 11, 9];
  const mediumRiskTrend = [25, 28, 24, 26, 23, 21, 24, 22];
  
  const maxValue = Math.max(...highRiskTrend, ...mediumRiskTrend);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Risk Level Trends</h3>
          <p className="text-sm text-gray-600">Weekly progression of at-risk students</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-600">High Risk</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Medium Risk</span>
          </div>
        </div>
      </div>

      <div className="relative h-64">
        <svg className="w-full h-full" viewBox="0 0 800 250">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1="60"
              y1={50 + i * 40}
              x2="750"
              y2={50 + i * 40}
              stroke="#f3f4f6"
              strokeWidth="1"
            />
          ))}
          
          {/* Y-axis labels */}
          {[0, 1, 2, 3, 4].map((i) => (
            <text
              key={i}
              x="45"
              y={55 + i * 40}
              textAnchor="end"
              className="text-xs fill-gray-500"
            >
              {maxValue - (i * maxValue / 4)}
            </text>
          ))}

          {/* High risk line */}
          <polyline
            points={highRiskTrend.map((value, i) => 
              `${100 + i * 85},${210 - (value / maxValue) * 160}`
            ).join(' ')}
            fill="none"
            stroke="#ef4444"
            strokeWidth="3"
          />
          
          {/* Medium risk line */}
          <polyline
            points={mediumRiskTrend.map((value, i) => 
              `${100 + i * 85},${210 - (value / maxValue) * 160}`
            ).join(' ')}
            fill="none"
            stroke="#eab308"
            strokeWidth="3"
          />

          {/* Data points */}
          {highRiskTrend.map((value, i) => (
            <circle
              key={`high-${i}`}
              cx={100 + i * 85}
              cy={210 - (value / maxValue) * 160}
              r="4"
              fill="#ef4444"
            />
          ))}
          
          {mediumRiskTrend.map((value, i) => (
            <circle
              key={`medium-${i}`}
              cx={100 + i * 85}
              cy={210 - (value / maxValue) * 160}
              r="4"
              fill="#eab308"
            />
          ))}

          {/* X-axis labels */}
          {weeks.map((week, i) => (
            <text
              key={week}
              x={100 + i * 85}
              y={235}
              textAnchor="middle"
              className="text-xs fill-gray-500"
            >
              {week}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default TrendChart;