import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import {
  GraduationCap,
  LayoutDashboard,
  Code2,
  Award,
  FileText,
  Video,
  Building2,
  BookOpen,
  PieChart,
  User,
  Bell,
  LogOut,
  ChevronDown
} from 'lucide-react';

export const StudentLayout = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.getStudentNotifications();
        if (res.success && res.notifications) {
          setNotifications(res.notifications);
        }
      } catch (err) {
        console.error('Failed to load notifications:', err);
      }
    };
    fetchNotifications();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { label: '60+ DSA Sheet', path: '/student/dsa', icon: Code2 },
    { label: 'Tests Hub', path: '/student/tests', icon: Award },
    { label: 'Resume Analyzer', path: '/student/resume', icon: FileText },
    { label: 'AI Mock Interview', path: '/student/interview', icon: Video },
    { label: 'Target Companies', path: '/student/companies', icon: Building2 },
    { label: 'Roadmaps', path: '/student/resources', icon: BookOpen },
    { label: 'Readiness Report', path: '/student/report', icon: PieChart },
  ];

  const score = profile?.readinessScore || user?.readinessScore || 75;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', color: '#0f172a' }}>
      {/* Top Navbar */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          maxWidth: '1380px',
          margin: '0 auto',
          padding: '0 1.5rem',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Logo / Brand */}
          <div
            onClick={() => navigate('/student/dashboard')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
          >
            <div style={{
              background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
              color: 'white',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <GraduationCap size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.02em', color: '#0f172a' }}>
                PlacementReady
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>
                Govt. Engineering College, Ajmer
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.45rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#2563eb' : '#64748b',
                    background: isActive ? '#eff6ff' : 'transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Right Profile & Notifications */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Readiness Index Pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: score >= 75 ? '#ecfdf5' : score >= 60 ? '#fffbeb' : '#fef2f2',
              color: score >= 75 ? '#15803d' : score >= 60 ? '#b45309' : '#b91c1c',
              padding: '0.25rem 0.65rem',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 800,
              border: `1px solid ${score >= 75 ? '#a7f3d0' : '#fde68a'}`
            }}>
              <span>Readiness:</span>
              <span>{score}%</span>
            </div>

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <Bell size={18} color="#475569" />
                {notifications.length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    background: '#ef4444',
                    color: 'white',
                    fontSize: '0.65rem',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700
                  }}>
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div style={{
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  width: '320px',
                  background: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                  border: '1px solid #e2e8f0',
                  padding: '1rem',
                  zIndex: 60
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>TPO Announcements</h4>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{notifications.length} unread</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '280px', overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <p style={{ color: '#94a3b8', fontSize: '0.8rem', textAlign: 'center', padding: '1rem' }}>No new announcements.</p>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div key={n.id} style={{
                          padding: '0.65rem',
                          background: '#f8fafc',
                          borderRadius: '8px',
                          borderLeft: '3px solid #2563eb',
                          fontSize: '0.8rem'
                        }}>
                          <div style={{ fontWeight: 600 }}>{n.title}</div>
                          <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.2rem' }}>{n.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div style={{ position: 'relative' }}>
              <div
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.25rem 0.5rem', borderRadius: '8px' }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2563eb, #6366f1)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.9rem'
                }}>
                  {user?.name ? user.name[0] : 'S'}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>{user?.name || 'Ganpat Singh'}</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{profile?.rollNo || '23IT17'}</div>
                </div>
                <ChevronDown size={14} color="#94a3b8" />
              </div>

              {showProfileMenu && (
                <div style={{
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  width: '180px',
                  background: '#ffffff',
                  borderRadius: '10px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  border: '1px solid #e2e8f0',
                  padding: '0.5rem',
                  zIndex: 60
                }}>
                  <div
                    onClick={() => { setShowProfileMenu(false); navigate('/student/profile'); }}
                    style={{ padding: '0.5rem 0.75rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155' }}
                  >
                    <User size={15} /> My Profile
                  </div>
                  <div
                    onClick={handleLogout}
                    style={{ padding: '0.5rem 0.75rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', borderTop: '1px solid #f1f5f9', marginTop: '0.25rem' }}
                  >
                    <LogOut size={15} /> Sign Out
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ flex: 1, maxWidth: '1380px', width: '100%', margin: '0 auto', padding: '2rem 1.5rem', boxSizing: 'border-box' }}>
        <Outlet />
      </main>
    </div>
  );
};
