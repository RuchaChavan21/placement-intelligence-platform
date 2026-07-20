import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BarChart3, Users, FileText, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { name: 'Analytics', icon: <BarChart3 size={20} />, path: '/analytics' },
    { name: 'Interview Experiences', icon: <Users size={20} />, path: '/interviews' },
    { name: 'Reports', icon: <FileText size={20} />, path: '/reports' },
    { name: 'Activity', icon: <Activity size={20} />, path: '/activity' },
  ];

  return (
    <motion.aside 
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-[260px] bg-premium-sidebar text-white h-screen flex flex-col fixed left-0 top-0 z-20 border-r border-dark-border"
    >
      <div className="p-8 pb-6">
        <h1 className="text-xl font-bold flex items-center gap-3">
          <div className="w-9 h-9 bg-gold-500 rounded-xl flex items-center justify-center text-dark text-xl shadow-glow">
            ✦
          </div>
          <span className="leading-tight tracking-tight">Campus Placement AI</span>
        </h1>
      </div>
      
      <nav className="flex-1 py-4 px-5 space-y-1.5">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-gold-500/10 text-gold-500 font-semibold' 
                  : 'text-dark-muted hover:text-white hover:bg-white/5 font-medium'
              }`
            }
          >
            <span className="shrink-0">{item.icon}</span>
            <span className="text-sm tracking-wide">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-6 border-t border-dark-border">
        <div className="flex items-center gap-3 hover:bg-white/5 p-3 -mx-3 rounded-2xl transition-all cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-dark font-bold shadow-md group-hover:shadow-glow transition-all">
            AD
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">Admin User</p>
            <p className="text-xs text-dark-muted font-medium">Placement Cell</p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
