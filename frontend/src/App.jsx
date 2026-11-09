import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';

import TopNavbar from './components/TopNavbar';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Teams from './pages/Teams';
import Tasks from './pages/Tasks';
import Developers from './pages/Developers';
import TaskAssignment from './pages/TaskAssignment';
import Optimizer from './pages/Optimizer';
import Schedule from './pages/Schedule';
import Monitoring from './pages/Monitoring';
import Simulator from './pages/Simulator';
import Settings from './pages/Settings';
import SupabaseTest from './pages/SupabaseTest';

import { apiService } from './services/api';
import { supabase } from './lib/supabaseClient';

// ProtectedRoute component enforces route-level role authorization
function ProtectedRoute({ user, allowedRoles, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role ? user.role.toUpperCase() : '';
  const isAllowed = allowedRoles.some(r => r.toUpperCase() === userRole);

  if (!isAllowed) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        background: 'rgba(244, 63, 94, 0.05)',
        border: '1px solid rgba(244, 63, 94, 0.2)',
        borderRadius: '12px',
        margin: '20px'
      }}>
        <h2 style={{ color: '#f43f5e', fontSize: '1.4rem', fontWeight: '700', marginBottom: '8px' }}>
          🚫 Access Denied
        </h2>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
          Your role (<strong>{user.role}</strong>) does not have authorization to access this page.
        </p>
      </div>
    );
  }

  return children;
}

function AppContent() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [servers, setServers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSystemOnline, setIsSystemOnline] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(() =>
    new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  );

  const location = useLocation();

  // Helper function to build user profile strictly from public.profiles table
  const buildUserProfile = async (supabaseUser) => {
    const dbProfile = await apiService.getUserProfile(supabaseUser.id);

    if (!dbProfile) {
      console.error('No profile found for user in public.profiles:', supabaseUser.id);
      return null;
    }

    return {
      id: supabaseUser.id,
      name:
        dbProfile.name ||
        supabaseUser.user_metadata?.name ||
        supabaseUser.email?.split('@')[0],
      email: supabaseUser.email,

      // IMPORTANT: Role comes ONLY from public.profiles database table
      role: dbProfile.role,

      experience: dbProfile.experience || 0,
      skills: dbProfile.skills || [],
      workload: dbProfile.workload || 0
    };
  };

  // ----------------------------------------
  // REFRESH & LOAD APPLICATION DATA
  // ----------------------------------------
  const handleRefreshAllData = async () => {
    setIsRefreshing(true);
    try {
      const [
        projData,
        taskData,
        devData,
        serverData,
        teamsData
      ] = await Promise.all([
        apiService.getProjects(),
        apiService.getTasks(),
        apiService.getDevelopers(),
        apiService.getServers(),
        apiService.getTeams()
      ]);

      setProjects(projData);
      setTasks(taskData);
      setDevelopers(devData);
      setServers(serverData);
      setTeams(teamsData || []);
      setAlerts(apiService.getAlerts());
      setIsSystemOnline(true);
      setLastUpdated(
        new Date().toLocaleString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      );
    } catch (error) {
      console.error('Failed to load application data:', error);
      setIsSystemOnline(false);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  useEffect(() => {
    handleRefreshAllData();
  }, []);

  // ----------------------------------------
  // MYSQL & SUPABASE AUTHENTICATION CHECK
  // ----------------------------------------
  useEffect(() => {
    const checkSession = async () => {
      try {
        // 1. Check local MySQL user session first
        const localSessionStr = localStorage.getItem('user_session');
        if (localSessionStr) {
          const localUser = JSON.parse(localSessionStr);
          setUser({
            id: localUser.id,
            name: localUser.fullName || localUser.username,
            email: `${localUser.username}@company.com`,
            role: localUser.role
          });
          setAuthLoading(false);
          return;
        }

        // 2. Fallback check for Supabase session
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          const loggedUser = await buildUserProfile(data.session.user);
          if (loggedUser) setUser(loggedUser);
        }
      } catch (err) {
        console.warn('Session check note:', err.message);
      } finally {
        setAuthLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleLogin = (loggedUser) => {
    if (loggedUser) {
      setUser({
        id: loggedUser.id,
        name: loggedUser.fullName || loggedUser.username,
        email: `${loggedUser.username}@company.com`,
        role: loggedUser.role
      });
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('user_session');
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // Ignored
    }
    setUser(null);
  };

  // ----------------------------------------
  // PROJECT
  // ----------------------------------------
  // PROJECT
  // ----------------------------------------
  const handleAddProject = async (newProj) => {
    try {
      const savedProj = await apiService.createProject(newProj);
      setProjects(prev => [...prev, savedProj]);
      console.log('Project saved successfully to MySQL:', savedProj);
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('Failed to save project. Please make sure the backend is running.');
    }
  };

  // ----------------------------------------
  // TEAMS
  // ----------------------------------------
  const handleAddTeam = async (newTeam) => {
    try {
      const savedTeam = await apiService.createTeam(newTeam);
      setTeams(prev => [...prev, savedTeam]);
      console.log('Team saved successfully:', savedTeam);
    } catch (error) {
      console.error('Failed to save team:', error);
    }
  };

  const handleUpdateTeam = async (id, updatedTeam) => {
    setTeams(prev => prev.map(t => t.id === id ? updatedTeam : t));
    try {
      await apiService.updateTeam(id, updatedTeam);
    } catch (e) {
      console.error('Failed to update team:', e);
    }
  };

  const handleDeleteTeam = async (id) => {
    setTeams(prev => prev.filter(t => t.id !== id));
    try {
      await apiService.deleteTeam(id);
    } catch (e) {
      console.error('Failed to delete team:', e);
    }
  };

  // ----------------------------------------
  // TASK
  // ----------------------------------------
  const handleAddTask = async (newTask) => {
    try {
      const savedTask = await apiService.createTask(newTask);

      setTasks(prev => [
        ...prev,
        savedTask
      ]);

      console.log('Task saved successfully:', savedTask);
    } catch (error) {
      console.error('Failed to save task:', error);
      alert('Failed to save task. Please make sure the backend is running.');
    }
  };

  // ----------------------------------------
  // DEVELOPER
  // ----------------------------------------
  const handleAddDeveloper = async (newDev) => {
    try {
      const savedDev = await apiService.createDeveloper(newDev);
      setDevelopers(prev => [...prev, savedDev]);
      console.log('Developer saved successfully to MySQL:', savedDev);
    } catch (error) {
      console.error('Failed to save developer:', error);
      alert('Failed to save developer. Please make sure the backend is running.');
    }
  };

  const handleUpdateProject = async (id, updatedProj) => {
    setProjects(prev => prev.map(p => p.id === id ? updatedProj : p));
    try {
      await apiService.updateProject(id, updatedProj);
      console.log('Project update saved to MySQL:', id, updatedProj);
    } catch (e) {
      console.error('Failed to update project in MySQL:', e);
    }
  };

  const handleDeleteProject = async (id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    try {
      await apiService.deleteProject(id);
      console.log('Project deleted from MySQL:', id);
    } catch (e) {
      console.error('Failed to delete project in MySQL:', e);
    }
  };

  // Helper function to sync developer workload capacity dynamically
  const syncDeveloperWorkloads = async (updatedTasksList, currentDevsList) => {
    const tasksToUse = updatedTasksList || tasks;
    const devsToUse = currentDevsList || developers;

    const updatedDevs = devsToUse.map(dev => {
      const activeTasks = tasksToUse.filter(t => {
        const devName = t.assignedDeveloper?.name || t.assignedDev;
        const devId = t.assignedDeveloper?.id;
        const isAssigned = (devId && devId === dev.id) || (devName && devName.trim().toLowerCase() === dev.name.trim().toLowerCase());
        const isNotCompleted = t.status !== 'COMPLETED';
        return isAssigned && isNotCompleted;
      });

      if (activeTasks.length === 0) {
        return { ...dev, currentWorkload: 0, workload: 0, status: 'Available', availability: 'Available' };
      }

      let totalWorkload = 0;
      activeTasks.forEach(task => {
        const comp = task.complexity || 5;
        const dur = task.estimatedDurationDays || task.duration || 3;
        totalWorkload += (comp * 5) + (dur * 3);
      });

      const finalWorkload = Math.min(100, Math.max(0, Math.round(totalWorkload)));
      let statusStr = 'Available';
      if (finalWorkload >= 75) statusStr = 'Overloaded';
      else if (finalWorkload >= 50) statusStr = 'Busy';

      return {
        ...dev,
        currentWorkload: finalWorkload,
        workload: finalWorkload,
        status: statusStr,
        availability: statusStr === 'Overloaded' ? 'Busy' : statusStr
      };
    });

    setDevelopers(updatedDevs);
    return updatedDevs;
  };

  // ----------------------------------------
  // TASK ASSIGNMENT
  // ----------------------------------------
  const handleAssignTask = async (taskId, devName) => {
    const taskToUpdate = tasks.find(t => t.id === taskId);
    const devToAssign = developers.find(d => d.name === devName) || (devName ? { name: devName } : null);

    const updatedTaskData = {
      ...(taskToUpdate || {}),
      status: devName ? 'IN_PROGRESS' : (taskToUpdate?.status || 'NOT_STARTED'),
      assignedDeveloper: devToAssign
    };

    const nextTasks = tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            assignedDev: devName,
            assignedDeveloper: devToAssign,
            status: devName ? 'IN_PROGRESS' : task.status
          }
        : task
    );

    setTasks(nextTasks);
    syncDeveloperWorkloads(nextTasks, developers);

    try {
      await apiService.updateTask(taskId, updatedTaskData);
      console.log('Task assignment saved to MySQL:', taskId, devName);
      const freshDevs = await apiService.getDevelopers();
      if (freshDevs && freshDevs.length) {
        setDevelopers(freshDevs.map(d => ({
          ...d,
          workload: d.currentWorkload,
          status: d.currentWorkload >= 75 ? 'Overloaded' : (d.currentWorkload >= 50 ? 'Busy' : 'Available')
        })));
      }
    } catch (e) {
      console.error('Failed to save task assignment to MySQL:', e);
    }
  };

  const handleUpdateTask = async (id, updatedTask) => {
    const nextTasks = tasks.map(t => t.id === id ? { ...t, ...updatedTask } : t);
    setTasks(nextTasks);
    syncDeveloperWorkloads(nextTasks, developers);

    try {
      const saved = await apiService.updateTask(id, updatedTask);
      setTasks(prev => prev.map(t => t.id === id ? saved : t));
      const freshDevs = await apiService.getDevelopers();
      if (freshDevs && freshDevs.length) {
        setDevelopers(freshDevs.map(d => ({
          ...d,
          workload: d.currentWorkload,
          status: d.currentWorkload >= 75 ? 'Overloaded' : (d.currentWorkload >= 50 ? 'Busy' : 'Available')
        })));
      }
    } catch (e) {
      console.warn('Update task note:', e.message);
    }
  };

  const handleDeleteTask = async (id) => {
    const nextTasks = tasks.filter(t => t.id !== id);
    setTasks(nextTasks);
    syncDeveloperWorkloads(nextTasks, developers);

    try {
      await apiService.deleteTask(id);
      const freshDevs = await apiService.getDevelopers();
      if (freshDevs && freshDevs.length) {
        setDevelopers(freshDevs.map(d => ({
          ...d,
          workload: d.currentWorkload,
          status: d.currentWorkload >= 75 ? 'Overloaded' : (d.currentWorkload >= 50 ? 'Busy' : 'Available')
        })));
      }
    } catch (e) {
      console.warn('Delete task note:', e.message);
    }
  };

  const handleUpdateDeveloper = async (id, updatedDev) => {
    try {
      const saved = await apiService.updateDeveloper(id, updatedDev);
      setDevelopers(prev => prev.map(d => d.id === id ? saved : d));
    } catch (e) {
      console.warn('Update developer note:', e.message);
    }
  };

  const handleDeleteDeveloper = async (id) => {
    try {
      await apiService.deleteDeveloper(id);
      setDevelopers(prev => prev.filter(d => d.id !== id));
    } catch (e) {
      console.warn('Delete developer note:', e.message);
    }
  };

  // ----------------------------------------
  // PAGE TITLES & ROUTE METADATA
  // ----------------------------------------
  const getPageTitle = (path) => {
    switch (path) {
      case '/dashboard':
        return 'Project Dashboard';
      case '/projects':
        return 'Project Management';
      case '/teams':
        return 'Enterprise Team & Role Management';
      case '/tasks':
        return 'Task Management';
      case '/developers':
        return 'Developer Management';
      case '/assignment':
        return 'Intelligent AI Task Assignment';
      case '/optimizer':
      case '/optimization':
        return 'Optimization Results & AI Benchmarks';
      case '/schedule':
        return 'Project Schedule Timeline (Gantt View)';
      case '/monitoring':
        return 'Infrastructure & Server Telemetry';
      case '/simulator':
      case '/simulation':
        return 'Dynamic Rescheduling Simulator';
      case '/settings':
        return 'Settings & System Audit Logs';
      case '/test-supabase':
        return 'Supabase Connection Test';
      default:
        return 'Project Dashboard';
    }
  };

  const isPublicPage =
    location.pathname === '/login' ||
    location.pathname === '/test-supabase';

  const ALL_ROLES = ['ADMIN', 'PROJECT_MANAGER', 'Project Manager', 'DEVELOPER', 'Developer'];
  const MANAGERS_ONLY = ['ADMIN', 'PROJECT_MANAGER', 'Project Manager'];

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-primary)'
      }}
    >
      {user && !isPublicPage && (
        <TopNavbar
          user={user}
          onLogout={handleLogout}
          lastUpdated={lastUpdated}
          isRefreshing={isRefreshing}
          isSystemOnline={isSystemOnline}
          onRefreshData={handleRefreshAllData}
        />
      )}

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          width: '100%'
        }}
      >
        <main
          style={{
            padding: user && !isPublicPage ? '20px 24px' : '0',
            marginLeft: 0,
            flex: 1,
            width: '100%',
            maxWidth: '1800px',
            margin: '0 auto'
          }}
        >
          <Routes>
            <Route path="/analytics" element={<Navigate to="/dashboard" replace />} />
            <Route path="/portfolio" element={<Navigate to="/projects" replace />} />
            <Route path="/milestones" element={<Navigate to="/schedule" replace />} />
            <Route
              path="/login"
              element={
                <Login
                  onLogin={handleLogin}
                />
              }
            />

            <Route
              path="/test-supabase"
              element={<SupabaseTest />}
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute user={user} allowedRoles={ALL_ROLES}>
                  <Dashboard
                    projects={projects}
                    teams={teams}
                    tasks={tasks}
                    developers={developers}
                    alerts={alerts}
                    lastUpdated={lastUpdated}
                    isRefreshing={isRefreshing}
                    isSystemOnline={isSystemOnline}
                    onRefreshData={handleRefreshAllData}
                  />
                </ProtectedRoute>
              }
            />

            <Route
              path="/projects"
              element={
                <ProtectedRoute user={user} allowedRoles={ALL_ROLES}>
                  <Projects
                    user={user}
                    projects={projects}
                    teams={teams}
                    tasks={tasks}
                    developers={developers}
                    onAddProject={handleAddProject}
                    onUpdateProject={handleUpdateProject}
                    onDeleteProject={handleDeleteProject}
                  />
                </ProtectedRoute>
              }
            />

            <Route
              path="/teams"
              element={
                <ProtectedRoute user={user} allowedRoles={ALL_ROLES}>
                  <Teams
                    user={user}
                    teams={teams}
                    projects={projects}
                    tasks={tasks}
                    developers={developers}
                    onAddTeam={handleAddTeam}
                    onUpdateTeam={handleUpdateTeam}
                    onDeleteTeam={handleDeleteTeam}
                    onAddTask={handleAddTask}
                    onUpdateTask={handleUpdateTask}
                    onDeleteTask={handleDeleteTask}
                    onAssignTask={handleAssignTask}
                    onUpdateDeveloper={handleUpdateDeveloper}
                  />
                </ProtectedRoute>
              }
            />

            <Route
              path="/tasks"
              element={
                <ProtectedRoute user={user} allowedRoles={ALL_ROLES}>
                  <Tasks
                    user={user}
                    tasks={tasks}
                    developers={developers}
                    onAddTask={handleAddTask}
                    onUpdateTask={handleUpdateTask}
                    onDeleteTask={handleDeleteTask}
                  />
                </ProtectedRoute>
              }
            />

            <Route
              path="/developers"
              element={
                <ProtectedRoute user={user} allowedRoles={ALL_ROLES}>
                  <Developers
                    user={user}
                    developers={developers}
                    tasks={tasks}
                    onAddDeveloper={handleAddDeveloper}
                    onUpdateDeveloper={handleUpdateDeveloper}
                    onDeleteDeveloper={handleDeleteDeveloper}
                  />
                </ProtectedRoute>
              }
            />

            <Route
              path="/assignment"
              element={
                <ProtectedRoute user={user} allowedRoles={MANAGERS_ONLY}>
                  <TaskAssignment
                    tasks={tasks}
                    teams={teams}
                    developers={developers}
                    onAssignTask={handleAssignTask}
                  />
                </ProtectedRoute>
              }
            />

            <Route
              path="/optimizer"
              element={
                <ProtectedRoute user={user} allowedRoles={MANAGERS_ONLY}>
                  <Optimizer />
                </ProtectedRoute>
              }
            />

            <Route
              path="/optimization"
              element={
                <ProtectedRoute user={user} allowedRoles={MANAGERS_ONLY}>
                  <Optimizer />
                </ProtectedRoute>
              }
            />

            <Route
              path="/schedule"
              element={
                <ProtectedRoute user={user} allowedRoles={ALL_ROLES}>
                  <Schedule
                    user={user}
                    tasks={tasks}
                  />
                </ProtectedRoute>
              }
            />

            <Route
              path="/monitoring"
              element={
                <ProtectedRoute user={user} allowedRoles={MANAGERS_ONLY}>
                  <Monitoring
                    initialServerList={servers}
                    teams={teams}
                    developers={developers}
                  />
                </ProtectedRoute>
              }
            />

            <Route
              path="/simulator"
              element={
                <ProtectedRoute user={user} allowedRoles={MANAGERS_ONLY}>
                  <Simulator />
                </ProtectedRoute>
              }
            />

            <Route
              path="/simulation"
              element={
                <ProtectedRoute user={user} allowedRoles={MANAGERS_ONLY}>
                  <Simulator />
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute user={user} allowedRoles={MANAGERS_ONLY}>
                  <Settings user={user} />
                </ProtectedRoute>
              }
            />

            <Route
              path="*"
              element={
                <Navigate
                  to={user ? '/dashboard' : '/login'}
                  replace
                />
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
