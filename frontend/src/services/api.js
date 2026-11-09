import axios from 'axios';
import { initialProjects, initialTeams, initialTasks, initialDevelopers, initialServers, optimizerComparisonData, initialAlerts } from './mockData';
import { supabase } from '../lib/supabaseClient';

const API_BASE = 'http://localhost:8081/api';

export const apiService = {
  // Auth (MySQL + Spring Boot REST API)
  login: async (username, password) => {
    const res = await axios.post(`${API_BASE}/auth/login`, { username, password });
    return res.data;
  },

  register: async (username, password, fullName, role) => {
    const res = await axios.post(`${API_BASE}/auth/register`, { username, password, fullName, role });
    return res.data;
  },

  // Profiles (Legacy / Supabase Fallback)
  getUserProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) return null;
      return data;
    } catch (e) {
      console.warn('Profiles table query note:', e.message);
      return null;
    }
  },

  upsertUserProfile: async (profileData) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert(profileData)
        .select();

      if (error) throw error;
      return data;
    } catch (e) {
      console.warn('Profiles upsert note:', e.message);
      return null;
    }
  },

  // Teams (Enterprise Team Model)
  getTeams: async () => {
    let teamsList = initialTeams;
    try {
      const res = await axios.get(`${API_BASE}/teams`);
      if (res.data && res.data.length > 0) {
        teamsList = res.data;
      }
    } catch (e) {
      console.warn('Backend REST endpoint getTeams fallback to local cache');
    }

    const cachedTeams = localStorage.getItem('software_scheduler_teams');
    if (cachedTeams) {
      try {
        const parsed = JSON.parse(cachedTeams);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return teamsList.map(apiTeam => {
            const cached = parsed.find(c => c.id === apiTeam.id || c.name === apiTeam.name);
            return cached ? { ...apiTeam, ...cached } : apiTeam;
          });
        }
      } catch (err) {}
    }
    return teamsList;
  },

  createTeam: async (teamData) => {
    const cachedTeamsStr = localStorage.getItem('software_scheduler_teams');
    let currentTeams = cachedTeamsStr ? JSON.parse(cachedTeamsStr) : initialTeams;
    const newTeam = { id: Date.now(), ...teamData };
    currentTeams.push(newTeam);
    localStorage.setItem('software_scheduler_teams', JSON.stringify(currentTeams));

    try {
      const res = await axios.post(`${API_BASE}/teams`, teamData);
      return res.data;
    } catch (e) {
      return newTeam;
    }
  },

  updateTeam: async (id, teamData) => {
    const cachedTeamsStr = localStorage.getItem('software_scheduler_teams');
    let currentTeams = cachedTeamsStr ? JSON.parse(cachedTeamsStr) : initialTeams;
    const updatedTeamsList = currentTeams.map(t => (t.id === id || t.name === teamData.name) ? { ...t, ...teamData } : t);
    localStorage.setItem('software_scheduler_teams', JSON.stringify(updatedTeamsList));

    try {
      const res = await axios.put(`${API_BASE}/teams/${id}`, teamData);
      return res.data;
    } catch (e) {
      return { id, ...teamData };
    }
  },

  deleteTeam: async (id) => {
    const cachedTeamsStr = localStorage.getItem('software_scheduler_teams');
    if (cachedTeamsStr) {
      const currentTeams = JSON.parse(cachedTeamsStr);
      const filtered = currentTeams.filter(t => t.id !== id);
      localStorage.setItem('software_scheduler_teams', JSON.stringify(filtered));
    }
    try {
      await axios.delete(`${API_BASE}/teams/${id}`);
    } catch (e) {}
  },

  // Projects
  getProjects: async () => {
    try {
      const res = await axios.get(`${API_BASE}/projects`);
      return res.data.length ? res.data : initialProjects;
    } catch (e) {
      return initialProjects;
    }
  },

  createProject: async (projectData) => {
    const res = await axios.post(`${API_BASE}/projects`, projectData);
    return res.data;
  },

  updateProject: async (id, projectData) => {
    const res = await axios.put(`${API_BASE}/projects/${id}`, projectData);
    return res.data;
  },

  deleteProject: async (id) => {
    await axios.delete(`${API_BASE}/projects/${id}`);
  },

  // Tasks (Persisted to API & localStorage Cache)
  getTasks: async () => {
    let tasksList = initialTasks;
    try {
      const res = await axios.get(`${API_BASE}/tasks`);
      if (res.data && res.data.length > 0) {
        tasksList = res.data;
      }
    } catch (e) {
      console.warn('Backend REST endpoint getTasks fallback to local cache');
    }

    const cachedTasks = localStorage.getItem('software_scheduler_tasks');
    if (cachedTasks) {
      try {
        const parsed = JSON.parse(cachedTasks);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return tasksList.map(apiTask => {
            const cached = parsed.find(c => c.id === apiTask.id || (c.name && c.name === apiTask.name));
            return cached ? { ...apiTask, ...cached } : apiTask;
          });
        }
      } catch (err) {}
    }
    return tasksList;
  },

  createTask: async (taskData) => {
    try {
      const res = await axios.post(`${API_BASE}/tasks`, taskData);
      return res.data;
    } catch (e) {
      return { id: Date.now(), ...taskData };
    }
  },

  updateTask: async (id, taskData) => {
    const cachedTasksStr = localStorage.getItem('software_scheduler_tasks');
    let currentTasks = cachedTasksStr ? JSON.parse(cachedTasksStr) : initialTasks;
    const updatedTasksList = currentTasks.map(t => (t.id === id || t.name === taskData.name) ? { ...t, ...taskData } : t);
    if (!currentTasks.some(t => t.id === id || t.name === taskData.name)) {
      updatedTasksList.push({ id, ...taskData });
    }
    localStorage.setItem('software_scheduler_tasks', JSON.stringify(updatedTasksList));

    try {
      const res = await axios.put(`${API_BASE}/tasks/${id}`, taskData);
      return res.data;
    } catch (e) {
      return { id, ...taskData };
    }
  },

  deleteTask: async (id) => {
    const cachedTasksStr = localStorage.getItem('software_scheduler_tasks');
    if (cachedTasksStr) {
      const currentTasks = JSON.parse(cachedTasksStr);
      const filtered = currentTasks.filter(t => t.id !== id);
      localStorage.setItem('software_scheduler_tasks', JSON.stringify(filtered));
    }
    try {
      await axios.delete(`${API_BASE}/tasks/${id}`);
    } catch (e) {}
  },

  // Developers (Persisted to API & localStorage Cache)
  getDevelopers: async () => {
    let devList = initialDevelopers;
    try {
      const res = await axios.get(`${API_BASE}/developers`);
      if (res.data && res.data.length > 0) {
        devList = res.data;
      }
    } catch (e) {}

    const cachedDevs = localStorage.getItem('software_scheduler_developers');
    if (cachedDevs) {
      try {
        const parsed = JSON.parse(cachedDevs);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return devList.map(apiDev => {
            const cached = parsed.find(c => c.id === apiDev.id || c.name === apiDev.name);
            return cached ? { ...apiDev, ...cached } : apiDev;
          });
        }
      } catch (err) {}
    }
    return devList;
  },

  createDeveloper: async (devData) => {
    try {
      const res = await axios.post(`${API_BASE}/developers`, devData);
      return res.data;
    } catch (e) {
      return { id: Date.now(), ...devData };
    }
  },

  updateDeveloper: async (id, devData) => {
    const cachedDevsStr = localStorage.getItem('software_scheduler_developers');
    let currentDevs = cachedDevsStr ? JSON.parse(cachedDevsStr) : initialDevelopers;
    const updatedDevsList = currentDevs.map(d => (d.id === id || d.name === devData.name) ? { ...d, ...devData } : d);
    localStorage.setItem('software_scheduler_developers', JSON.stringify(updatedDevsList));

    try {
      const res = await axios.put(`${API_BASE}/developers/${id}`, devData);
      return res.data;
    } catch (e) {
      return { id, ...devData };
    }
  },

  deleteDeveloper: async (id) => {
    const cachedDevsStr = localStorage.getItem('software_scheduler_developers');
    if (cachedDevsStr) {
      const currentDevs = JSON.parse(cachedDevsStr);
      const filtered = currentDevs.filter(d => d.id !== id);
      localStorage.setItem('software_scheduler_developers', JSON.stringify(filtered));
    }
    try {
      await axios.delete(`${API_BASE}/developers/${id}`);
    } catch (e) {}
  },

  // Servers
  getServers: async () => {
    try {
      const res = await axios.get(`${API_BASE}/infrastructure/servers`);
      return res.data.length ? res.data : initialServers;
    } catch (e) {
      return initialServers;
    }
  },

  // Optimizer Comparison
  getOptimizerComparison: async () => {
    try {
      const res = await axios.get(`${API_BASE}/optimization/compare-all`);
      return res.data;
    } catch (e) {
      return {
        tableData: optimizerComparisonData,
        bestWinner: 'Q-Learning Algorithm (37 Days, 91% Balance, 240ms Latency)'
      };
    }
  },

  getAlerts: () => initialAlerts
};
