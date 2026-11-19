import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Filter,
  Briefcase,
  HelpCircle,
  Sliders,
  Bell,
  FileText,
  Mail,
  ShieldCheck,
  Clock,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  LogOut,
  User,
  GraduationCap,
  ExternalLink,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Fetch admin notifications
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const res = await api.getAdminNotifications();
        if (res.success && res.notifications) {
          setNotifications(res.notifications);
        }
      } catch (err) {
        console.error('Failed to load notifications:', err);
      }
    };
    loadNotifications();
  }, []);

  // Quick student search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await api.getAdminStudents({ search: searchQuery, limit: 5 });
        if (res.success && res.students) {
          setSearchResults(res.students);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setSearching(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Students', path: '/admin/students', icon: Users },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Shortlisting', path: '/admin/shortlisting', icon: Filter },
    { label: 'Drives', path: '/admin/drives', icon: Briefcase },
    { label: 'Question Bank', path: '/admin/questions', icon: HelpCircle },
    { label: 'Scoring Weights', path: '/admin/weights', icon: Sliders },
    { label: 'Notifications', path: '/admin/notifications', icon: Bell },
    { label: 'Reports', path: '/admin/reports', icon: FileText },
    { label: 'Messages', path: '/admin/messages', icon: Mail },
    { label: 'Users & Roles', path: '/admin/users', icon: ShieldCheck },
    { label: 'Audit Log', path: '/admin/audit', icon: Clock },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  // Breadcrumbs calculation
  const pathParts = location.pathname.split('/').filter(Boolean);
  const currentNav = navItems.find(item => item.path === location.pathname);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', color: '#0f172a' }}>
      {/* Dark Sidebar */}
      <aside style={{
        width: collapsed ? '80px' : '260px',
        background: '#0f172a',
        color: '#f8fafc',
        transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 50,
        boxShadow: '4px 0 15px rgba(0, 0, 0, 0.1)',
        borderRight: '1px solid #1e293b'
      }}>
        {/* Brand / Logo */}
        <div style={{
          padding: collapsed ? '1.5rem 0.5rem' : '1.5rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          borderBottom: '1px solid #1e293b',
          justifyContent: collapsed ? 'center' : 'flex-start'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
            color: 'white',
            borderRadius: '10px',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <GraduationCap size={24} />
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                GECA TPO Portal
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Placement Cell 2026
              </div>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto' }}>
          <div style={{
            fontSize: '0.68rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#64748b',
            marginBottom: '0.75rem',
            paddingLeft: collapsed ? '0' : '0.5rem',
            textAlign: collapsed ? 'center' : 'left'
          }}>
            {collapsed ? '•••' : 'Management'}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  title={collapsed ? item.label : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: collapsed ? '0.75rem 0' : '0.7rem 0.85rem',
                    borderRadius: '8px',
                    color: isActive ? '#ffffff' : '#94a3b8',
                    background: isActive ? '#3b82f6' : 'transparent',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.88rem',
                    textDecoration: 'none',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={19} style={{ flexShrink: 0 }} />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Collapse Toggle Footer */}
        <div style={{
          padding: '0.75rem',
          borderTop: '1px solid #1e293b',
          display: 'flex',
          justifyContent: collapsed ? 'center' : 'space-between',
          alignItems: 'center'
        }}>
          {!collapsed && (
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              v2.4 Enterprise TPO
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{
              background: '#1e293b',
              border: 'none',
              color: '#94a3b8',
              borderRadius: '6px',
              padding: '0.4rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </aside>

      {/* Main Body */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header Bar */}
        <header style={{
          height: '64px',
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 40
        }}>
          {/* Breadcrumbs & Global Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b' }}>
              <span>TPO Portal</span>
              <span>/</span>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>
                {currentNav ? currentNav.label : (pathParts[1] ? pathParts[1].toUpperCase() : 'Dashboard')}
              </span>
            </div>

            {/* Quick Student Search */}
            <div style={{ position: 'relative', width: '320px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#f1f5f9',
                borderRadius: '8px',
                padding: '0.45rem 0.75rem',
                border: '1px solid #e2e8f0'
              }}>
                <Search size={16} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Quick search student by name, roll..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.85rem',
                    width: '100%',
                    color: '#0f172a'
                  }}
                />
              </div>

              {/* Search Dropdown */}
              {searchResults.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '110%',
                  left: 0,
                  right: 0,
                  background: '#ffffff',
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  border: '1px solid #e2e8f0',
                  padding: '0.5rem',
                  zIndex: 60
                }}>
                  {searchResults.map((stu) => (
                    <div
                      key={stu.id}
                      onClick={() => {
                        setSearchQuery('');
                        setSearchResults([]);
                        navigate(`/admin/students/${stu.id}`);
                      }}
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{stu.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{stu.rollNo || stu.email} • {stu.branch}</div>
                      </div>
                      <div style={{
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        color: (stu.readinessScore || 0) >= 75 ? '#10b981' : (stu.readinessScore || 0) >= 60 ? '#f59e0b' : '#ef4444'
                      }}>
                        {stu.readinessScore || 0}%
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Top Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {/* TPO Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#fef3c7',
              color: '#92400e',
              padding: '0.3rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 700,
              border: '1px solid #fde68a'
            }}>
              <ShieldCheck size={14} color="#b45309" />
              <span>TPO Officer</span>
            </div>

            {/* Notifications Bell */}
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
                  width: '340px',
                  background: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                  border: '1px solid #e2e8f0',
                  padding: '1rem',
                  zIndex: 60
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>System Notifications</h4>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{notifications.length} updates</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '280px', overflowY: 'auto' }}>
                    {notifications.slice(0, 5).map((n) => (
                      <div key={n.id} style={{
                        padding: '0.6rem',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        borderLeft: '3px solid #3b82f6',
                        fontSize: '0.8rem'
                      }}>
                        <div style={{ fontWeight: 600 }}>{n.title}</div>
                        <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.2rem' }}>{n.message}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div style={{ position: 'relative' }}>
              <div
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  padding: '0.35rem 0.65rem',
                  borderRadius: '8px'
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1e293b, #3b82f6)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.9rem'
                }}>
                  {user?.name ? user.name[0] : 'T'}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                    {user?.name || 'Dr. R. K. Sharma'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    {user?.email || 'tpo@geca.demo'}
                  </div>
                </div>
              </div>

              {showProfileMenu && (
                <div style={{
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  width: '200px',
                  background: '#ffffff',
                  borderRadius: '10px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  border: '1px solid #e2e8f0',
                  padding: '0.5rem',
                  zIndex: 60
                }}>
                  <div
                    onClick={() => { setShowProfileMenu(false); navigate('/admin/settings'); }}
                    style={{
                      padding: '0.5rem 0.75rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: '#334155'
                    }}
                  >
                    <Settings size={16} /> Settings
                  </div>
                  <div
                    onClick={handleLogout}
                    style={{
                      padding: '0.5rem 0.75rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: '#ef4444',
                      borderTop: '1px solid #f1f5f9',
                      marginTop: '0.25rem'
                    }}
                  >
                    <LogOut size={16} /> Sign Out
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main style={{ flex: 1, padding: '2rem', background: '#f8fafc', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
