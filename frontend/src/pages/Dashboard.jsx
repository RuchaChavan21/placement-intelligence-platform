import React, { useState, useEffect } from 'react';
import { Users, Award, TrendingUp, Building } from 'lucide-react';
import { motion } from 'framer-motion';
import DashboardHeader from '../components/DashboardHeader';
import MetricCard from '../components/MetricCard';
import AnalyticsChart from '../components/AnalyticsChart';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPlacements: "0",
    highestPackage: "0 LPA",
    averagePackage: "0 LPA",
    companiesVisited: "0"
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        const [summaryRes, companiesRes] = await Promise.all([
          fetch(`${API_BASE}/api/analytics/summary`),
          fetch(`${API_BASE}/api/analytics/company-wise`)
        ]);
        const summary = await summaryRes.json();
        const companies = await companiesRes.json();
        
        setStats({
          totalPlacements: `${summary.total_offers}+`,
          highestPackage: `${summary.highest_package_lpa} LPA`,
          averagePackage: `${summary.average_package_lpa} LPA`,
          companiesVisited: `${companies.length}+`
        });
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="p-10 max-w-[1400px] mx-auto min-h-screen"
    >
      {/* Header / Welcome Card */}
      <DashboardHeader />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-7 mb-10">
        <MetricCard 
          title="Total Placements" 
          value={stats.totalPlacements} 
          icon={<Users size={26} />} 
          trend="+12%" 
          trendLabel="vs last year"
          isLoading={isLoading}
          delay={0.1}
        />
        <MetricCard 
          title="Highest Package" 
          value={stats.highestPackage} 
          icon={<Award size={26} />} 
          trend="+5%" 
          trendLabel="bracket growth"
          isLoading={isLoading}
          delay={0.2}
        />
        <MetricCard 
          title="Average Package" 
          value={stats.averagePackage} 
          icon={<TrendingUp size={26} />} 
          trend="+0.5 LPA" 
          trendLabel="growth"
          isLoading={isLoading}
          delay={0.3}
        />
        <MetricCard 
          title="Companies Visited" 
          value={stats.companiesVisited} 
          icon={<Building size={26} />} 
          trend="+25" 
          trendLabel="new recruiters"
          isLoading={isLoading}
          delay={0.4}
        />
      </div>

      {/* Analytics Main Section */}
      <AnalyticsChart isLoading={isLoading} />
    </motion.div>
  );
};

export default Dashboard;
