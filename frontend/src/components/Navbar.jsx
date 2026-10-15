import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  LayoutDashboard,
  Code2,
  Brain,
  FileCheck2,
  MessagesSquare,
  FileSpreadsheet,
  User,
  LogOut,
  GraduationCap
} from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { user, profile, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'dsa', label: 'DSA Tracker', icon: Code2 },
    { id: 'aptitude', label: 'Aptitude Tests', icon: Brain },
    { id: 'resume', label: 'Resume ATS', icon: FileCheck2 },
    { id: 'interview', label: 'AI Mock Interview', icon: MessagesSquare },
    { id: 'report', label: 'Readiness Dossier', icon: FileSpreadsheet },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <nav className="top-navbar">
      <div className="nav-brand">
        <div className="brand-logo-badge">
          <GraduationCap size={22} />
        </div>
        <div>
          <div className="brand-text-title">AI Placement Readiness</div>
          <div className="brand-text-sub">Govt. Engineering College, Ajmer</div>
        </div>
      </div>

      <div className="nav-links">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-link-btn ${isActive ? 'active' : ''}`}
            >
              <Icon size={17} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="nav-user-meta">
        <div className="student-chip">
          <div className="student-avatar-circle">
            {(profile?.name || user?.name || 'G')[0]}
          </div>
          <div>
            <span className="student-chip-name">{profile?.name || user?.name}</span>{' '}
            <span className="student-chip-roll">({profile?.rollNo || '23IT17'})</span>
          </div>
        </div>

        <button
          onClick={logout}
          title="Sign Out"
          className="logout-icon-btn"
        >
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
};
