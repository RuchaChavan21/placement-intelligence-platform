import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import LoadingSkeleton from './ui/LoadingSkeleton';

const COLORS = ['#111111', '#4b5563', '#9ca3af', '#d1d5db', '#f3f4f6']; 

const ChartCard = ({ title, children }) => (
  <div className="bg-white p-7 rounded-lg border border-gray-200 flex flex-col h-full">
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-lg font-semibold text-gray-900 tracking-tight">{title}</h2>
    </div>
    <div className="flex-1 w-full relative">
      {children}
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white text-gray-900 p-3 rounded-lg shadow-sm border border-gray-200 text-sm font-medium">
        {label && <p className="text-gray-500 mb-1 text-xs uppercase tracking-wider">{label}</p>}
        <p>{`${payload[0].name || payload[0].dataKey}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const AnalyticsChart = ({ isLoading = false }) => {
  const [chartsData, setChartsData] = useState({
    pie: [],
    bar: [],
    line: []
  });
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    const fetchCharts = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        
        const [branchRes, companiesRes, trendsRes] = await Promise.all([
          fetch(`${API_BASE}/api/analytics/charts/branch-distribution`),
          fetch(`${API_BASE}/api/analytics/charts/top-companies?n=5`),
          fetch(`${API_BASE}/api/analytics/charts/yearly-trends`)
        ]);
        
        const branchData = await branchRes.json();
        const companiesData = await companiesRes.json();
        const trendsData = await trendsRes.json();

        // Format data for Recharts
        const pie = branchData.labels.map((label, i) => ({
          name: label,
          value: branchData.values[i]
        }));
        
        const bar = companiesData.labels.map((label, i) => ({
          name: label,
          hires: companiesData.values[i]
        }));
        
        setChartsData({ pie, bar, line: trendsData });
      } catch (err) {
        console.error("Failed to fetch chart data", err);
      } finally {
        setIsDataLoading(false);
      }
    };
    
    fetchCharts();
  }, []);

  if (isLoading || isDataLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="h-[380px]"><LoadingSkeleton type="chart" /></div>
        <div className="h-[380px]"><LoadingSkeleton type="chart" /></div>
        <div className="h-[400px] lg:col-span-2"><LoadingSkeleton type="chart" /></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
      {/* Donut Chart: Branch-wise */}
      <ChartCard title="Branch-wise Distribution">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartsData.pie}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {chartsData.pie.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-5 flex-wrap mt-4">
          {chartsData.pie.map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-2 text-sm text-gray-600 font-medium">
              <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
              {entry.name}
            </div>
          ))}
        </div>
      </ChartCard>

      {/* Bar Chart: Top Recruiters */}
      <ChartCard title="Top Recruiting Companies">
        <div className="h-72 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartsData.bar} margin={{ top: 0, right: 20, left: -10, bottom: 0 }} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 13, fontWeight: 500 }} width={90} />
              <Tooltip cursor={{ fill: '#f9fafb' }} content={<CustomTooltip />} />
              <Bar dataKey="hires" fill="#111111" radius={[0, 4, 4, 0]} barSize={24}>
                {chartsData.bar.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#111111' : '#4b5563'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Line Chart: Year-wise Trend */}
      <div className="lg:col-span-2">
        <ChartCard title="Placement Trends (Year-over-Year)">
          <div className="h-80 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartsData.line} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 13 }} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 13 }} dx={-10} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="placements" 
                  stroke="#111111" 
                  strokeWidth={3} 
                  dot={{ fill: '#ffffff', stroke: '#111111', strokeWidth: 2, r: 4 }} 
                  activeDot={{ r: 6, fill: '#111111', stroke: '#111111', strokeWidth: 0 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default AnalyticsChart;
