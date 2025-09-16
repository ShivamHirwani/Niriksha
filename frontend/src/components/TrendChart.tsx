import React, { useState, useEffect, useRef } from 'react';
import { useStudentContext } from '../context/StudentContext';
import { useTheme } from '../context/ThemeContext';
import { TrendingUp, TrendingDown, Activity, Calendar } from 'lucide-react';

type TimePeriod = '8weeks' | '6months' | '1year';

interface TrendData {
  labels: string[];
  highRisk: number[];
  mediumRisk: number[];
}

interface ChartPoint {
  x: number;
  y: number;
  value: number;
  index: number;
}

const TrendChart: React.FC = () => {
  const { students } = useStudentContext();
  const { theme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('8weeks');
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number>();

  // Animation effect when period changes
  useEffect(() => {
    setIsAnimating(true);
    setAnimationProgress(0);
    
    const startTime = Date.now();
    const duration = 2000; // 2 seconds animation
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setAnimationProgress(easedProgress);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [selectedPeriod]);

  // Period selector options
  const periods = [
    { id: '8weeks' as TimePeriod, label: '8 Weeks', icon: Calendar },
    { id: '6months' as TimePeriod, label: '6 Months', icon: Activity },
    { id: '1year' as TimePeriod, label: '1 Year', icon: TrendingUp }
  ];

  // Generate trend data based on selected period
  const getTrendData = (period: TimePeriod): TrendData => {
    switch (period) {
      case '8weeks':
        return {
          labels: Array.from({ length: 8 }, (_, i) => `Week ${i + 1}`),
          highRisk: [12, 15, 18, 14, 16, 13, 11, 9],
          mediumRisk: [25, 28, 24, 26, 23, 21, 24, 22]
        };
      case '6months':
        return {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          highRisk: [15, 18, 22, 19, 16, 14],
          mediumRisk: [28, 32, 29, 31, 27, 25]
        };
      case '1year':
        return {
          labels: ['Q1', 'Q2', 'Q3', 'Q4'],
          highRisk: [18, 22, 16, 14],
          mediumRisk: [30, 28, 26, 24]
        };
      default:
        return getTrendData('8weeks');
    }
  };

  const trendData = getTrendData(selectedPeriod);
  const maxValue = Math.max(...trendData.highRisk, ...trendData.mediumRisk) + 5;
  const dataLength = trendData.labels.length;
  
  // Calculate trend direction
  const highRiskTrend = trendData.highRisk[trendData.highRisk.length - 1] - trendData.highRisk[0];
  const mediumRiskTrend = trendData.mediumRisk[trendData.mediumRisk.length - 1] - trendData.mediumRisk[0];

  // Chart dimensions and positioning
  const chartConfig = {
    width: 580,
    height: 200,
    marginLeft: 120,
    marginTop: 60,
    marginRight: 100,
    marginBottom: 60
  };

  // Generate chart points with perfect alignment
  const generateChartPoints = (data: number[]): ChartPoint[] => {
    return data.map((value, index) => {
      const x = chartConfig.marginLeft + (index / (dataLength - 1)) * chartConfig.width;
      const y = chartConfig.marginTop + chartConfig.height - (value / maxValue) * chartConfig.height;
      return { x, y, value, index };
    });
  };

  // Generate SVG path from points
  const generatePath = (points: ChartPoint[], type: 'line' | 'area' = 'line'): string => {
    if (points.length === 0) return '';
    
    const pathCommands = points.map((point, index) => 
      index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`
    ).join(' ');
    
    if (type === 'area') {
      const firstPoint = points[0];
      const lastPoint = points[points.length - 1];
      const bottomY = chartConfig.marginTop + chartConfig.height;
      return `${pathCommands} L ${lastPoint.x} ${bottomY} L ${firstPoint.x} ${bottomY} Z`;
    }
    
    return pathCommands;
  };

  // Generate animated path that draws progressively
  const generateAnimatedPath = (points: ChartPoint[], progress: number, type: 'line' | 'area' = 'line'): string => {
    if (points.length === 0 || progress === 0) return '';
    
    // Calculate how many points to include based on progress
    const totalLength = points.length - 1;
    const currentLength = totalLength * progress;
    const wholePoints = Math.floor(currentLength);
    const fraction = currentLength - wholePoints;
    
    // Include complete points
    const animatedPoints = points.slice(0, wholePoints + 1);
    
    // Add partial point if there's a fraction
    if (fraction > 0 && wholePoints + 1 < points.length) {
      const currentPoint = points[wholePoints];
      const nextPoint = points[wholePoints + 1];
      
      const interpolatedX = currentPoint.x + (nextPoint.x - currentPoint.x) * fraction;
      const interpolatedY = currentPoint.y + (nextPoint.y - currentPoint.y) * fraction;
      
      animatedPoints.push({
        x: interpolatedX,
        y: interpolatedY,
        value: currentPoint.value + (nextPoint.value - currentPoint.value) * fraction,
        index: wholePoints + fraction
      });
    }
    
    const pathCommands = animatedPoints.map((point, index) => 
      index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`
    ).join(' ');
    
    if (type === 'area' && animatedPoints.length > 1) {
      const firstPoint = animatedPoints[0];
      const lastPoint = animatedPoints[animatedPoints.length - 1];
      const bottomY = chartConfig.marginTop + chartConfig.height;
      return `${pathCommands} L ${lastPoint.x} ${bottomY} L ${firstPoint.x} ${bottomY} Z`;
    }
    
    return pathCommands;
  };

  // Generate chart data
  const highRiskPoints = generateChartPoints(trendData.highRisk);
  const mediumRiskPoints = generateChartPoints(trendData.mediumRisk);
  
  // Generate paths with animation
  const highRiskPath = isAnimating ? generateAnimatedPath(highRiskPoints, animationProgress) : generatePath(highRiskPoints);
  const mediumRiskPath = isAnimating ? generateAnimatedPath(mediumRiskPoints, animationProgress) : generatePath(mediumRiskPoints);
  const highRiskAreaPath = isAnimating ? generateAnimatedPath(highRiskPoints, animationProgress, 'area') : generatePath(highRiskPoints, 'area');
  const mediumRiskAreaPath = isAnimating ? generateAnimatedPath(mediumRiskPoints, animationProgress, 'area') : generatePath(mediumRiskPoints, 'area');

  // Calculate visible points for animation
  const getVisiblePoints = (points: ChartPoint[], progress: number): ChartPoint[] => {
    if (!isAnimating) return points;
    
    const totalLength = points.length - 1;
    const currentLength = totalLength * progress;
    const wholePoints = Math.floor(currentLength);
    
    return points.slice(0, wholePoints + 1);
  };

  const visibleHighRiskPoints = getVisiblePoints(highRiskPoints, animationProgress);
  const visibleMediumRiskPoints = getVisiblePoints(mediumRiskPoints, animationProgress);

  return (
    <div className="glass-morphism p-6 rounded-2xl shadow-glass animate-fade-in">
      {/* Header Section with Period Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
        <div>
          <h3 className="text-heading-3 font-semibold transition-smooth" style={{ color: 'var(--text-primary)' }}>
            Risk Level Trends
          </h3>
          <p className="text-body-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {selectedPeriod === '8weeks' ? 'Weekly progression' : 
             selectedPeriod === '6months' ? 'Monthly progression' : 'Quarterly progression'} of at-risk students
          </p>
        </div>
        
        {/* Interactive Period Selector */}
        <div className="flex items-center space-x-2 p-1 rounded-xl" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
          {periods.map((period) => {
            const Icon = period.icon;
            const isActive = selectedPeriod === period.id;
            return (
              <button
                key={period.id}
                onClick={() => setSelectedPeriod(period.id)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg transition-smooth
                  transform hover:scale-105 active:scale-95
                  ${
                    isActive 
                      ? 'shadow-glass font-medium' 
                      : 'hover:shadow-md opacity-70 hover:opacity-100'
                  }
                `}
                style={{
                  backgroundColor: isActive ? 'var(--color-primary-100)' : 'transparent',
                  color: isActive ? 'var(--color-primary-600)' : 'var(--text-muted)'
                }}
              >
                <Icon className="w-4 h-4" />
                <span className="text-body-sm">{period.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend and Trend Indicators */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full" style={{ background: 'var(--gradient-secondary)' }}></div>
            <span className="text-body-sm" style={{ color: 'var(--text-secondary)' }}>High Risk</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full" style={{ background: 'var(--gradient-success)' }}></div>
            <span className="text-body-sm" style={{ color: 'var(--text-secondary)' }}>Medium Risk</span>
          </div>
        </div>
        
        {/* Real-time Trend Indicators */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {highRiskTrend > 0 ? 
              <TrendingUp className="w-4 h-4" style={{ color: 'var(--color-danger-dark, #ef4444)' }} /> : 
              <TrendingDown className="w-4 h-4" style={{ color: 'var(--color-success-dark, #10b981)' }} />
            }
            <span className={`text-body-sm font-medium`}
                  style={{ color: highRiskTrend > 0 ? 'var(--color-danger-dark, #dc2626)' : 'var(--color-success-dark, #059669)' }}>
              {Math.abs(highRiskTrend)} {highRiskTrend > 0 ? '↑' : '↓'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {mediumRiskTrend > 0 ? 
              <TrendingUp className="w-4 h-4" style={{ color: 'var(--color-warning-dark, #f59e0b)' }} /> : 
              <TrendingDown className="w-4 h-4" style={{ color: 'var(--color-success-dark, #10b981)' }} />
            }
            <span className={`text-body-sm font-medium`}
                  style={{ color: mediumRiskTrend > 0 ? 'var(--color-warning-dark, #d97706)' : 'var(--color-success-dark, #059669)' }}>
              {Math.abs(mediumRiskTrend)} {mediumRiskTrend > 0 ? '↑' : '↓'}
            </span>
          </div>
        </div>
      </div>

      {/* Animated SVG Chart */}
      <div className="relative h-80">
        <svg className="w-full h-full" viewBox="0 0 800 340">
          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="highRiskGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="mediumRiskGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.1"/>
            </filter>
          </defs>
          
          {/* Grid lines */}
          {Array.from({ length: 5 }).map((_, i) => {
            const y = chartConfig.marginTop + (i * chartConfig.height / 4);
            return (
              <line
                key={i}
                x1={chartConfig.marginLeft}
                y1={y}
                x2={chartConfig.marginLeft + chartConfig.width}
                y2={y}
                stroke="var(--border-primary)"
                strokeWidth="1"
                opacity="0.2"
                strokeDasharray="2,4"
              />
            );
          })}
          
          {/* Y-axis */}
          <line
            x1={chartConfig.marginLeft}
            y1={chartConfig.marginTop}
            x2={chartConfig.marginLeft}
            y2={chartConfig.marginTop + chartConfig.height}
            stroke="var(--border-primary)"
            strokeWidth="2"
            opacity="0.3"
          />
          
          {/* X-axis */}
          <line
            x1={chartConfig.marginLeft}
            y1={chartConfig.marginTop + chartConfig.height}
            x2={chartConfig.marginLeft + chartConfig.width}
            y2={chartConfig.marginTop + chartConfig.height}
            stroke="var(--border-primary)"
            strokeWidth="2"
            opacity="0.3"
          />
          
          {/* Y-axis labels */}
          {Array.from({ length: 5 }).map((_, i) => {
            const value = Math.round(maxValue - (i * maxValue / 4));
            const y = chartConfig.marginTop + (i * chartConfig.height / 4);
            return (
              <text
                key={i}
                x={chartConfig.marginLeft - 10}
                y={y + 4}
                textAnchor="end"
                className="text-xs font-medium"
                style={{ fill: 'var(--text-muted)' }}
              >
                {value}
              </text>
            );
          })}

          {/* Animated Area fills */}
          {mediumRiskAreaPath && (
            <path
              d={mediumRiskAreaPath}
              fill="url(#mediumRiskGradient)"
              opacity="0.8"
            />
          )}
          {highRiskAreaPath && (
            <path
              d={highRiskAreaPath}
              fill="url(#highRiskGradient)"
              opacity="0.8"
            />
          )}

          {/* Animated Lines */}
          {mediumRiskPath && (
            <path
              d={mediumRiskPath}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#shadow)"
            />
          )}
          
          {highRiskPath && (
            <path
              d={highRiskPath}
              fill="none"
              stroke="#ef4444"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#shadow)"
            />
          )}

          {/* Animated Data Points - Medium Risk */}
          {visibleMediumRiskPoints.map((point, i) => (
            <g key={`medium-${i}`}>
              <circle
                cx={point.x}
                cy={point.y}
                r="8"
                fill="#f59e0b"
                stroke="var(--bg-primary)"
                strokeWidth="3"
                filter="url(#shadow)"
                className="cursor-pointer transition-all duration-200 hover:r-10"
              />
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#fff"
                opacity="0.9"
              />
              <title>{`${trendData.labels[i]}: ${point.value} medium risk students`}</title>
            </g>
          ))}
          
          {/* Animated Data Points - High Risk */}
          {visibleHighRiskPoints.map((point, i) => (
            <g key={`high-${i}`}>
              <circle
                cx={point.x}
                cy={point.y}
                r="8"
                fill="#ef4444"
                stroke="var(--bg-primary)"
                strokeWidth="3"
                filter="url(#shadow)"
                className="cursor-pointer transition-all duration-200 hover:r-10"
              />
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#fff"
                opacity="0.9"
              />
              <title>{`${trendData.labels[i]}: ${point.value} high risk students`}</title>
            </g>
          ))}

          {/* X-axis labels */}
          {trendData.labels.map((label, i) => {
            const point = highRiskPoints[i];
            return (
              <text
                key={label}
                x={point.x}
                y={chartConfig.marginTop + chartConfig.height + 25}
                textAnchor="middle"
                className="text-xs font-medium"
                style={{ fill: 'var(--text-muted)' }}
              >
                {label}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default TrendChart;