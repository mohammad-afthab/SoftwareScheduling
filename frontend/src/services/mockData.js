export const initialProjects = [
  { id: 1, name: 'Enterprise E-Commerce Platform V2', deadline: '2026-09-16', progress: 68, status: 'In Progress', budget: 1520000, teamName: 'E-Commerce Squad', projectManager: 'Rahul Kumar' },
  { id: 2, name: 'Cloud Native Migration Project', deadline: '2026-11-30', progress: 35, status: 'In Progress', budget: 1680000, teamName: 'Cloud Migration Squad', projectManager: 'Vikram Singh' },
  { id: 3, name: 'Student Portal System', deadline: '2026-11-23', progress: 75, status: 'In Progress', budget: 1350000, teamName: 'Mobile Platform Team', projectManager: 'Devendra Prasad' },
  { id: 4, name: 'HR Management Suite', deadline: '2026-10-24', progress: 90, status: 'Testing', budget: 1410000, teamName: 'QA & Infrastructure Team', projectManager: 'Developer A' }
];

export const initialTeams = [
  {
    id: 1,
    name: 'E-Commerce Squad',
    projectName: 'Enterprise E-Commerce Platform V2',
    teamLead: 'Rahul Kumar',
    capacity: 82,
    status: 'Active',
    description: 'Core product development squad responsible for storefront, checkout, and payment microservices.',
    members: [
      { id: 101, name: 'Rahul Kumar', role: 'Team Lead', workload: 72, status: 'Available', email: 'rahul@company.com', skills: ['System Architecture', 'Java', 'Project Lead'] },
      { id: 102, name: 'Priyanshu Sharma', role: 'Backend Developer', workload: 84, status: 'Busy', email: 'priyanshu@company.com', skills: ['Java', 'Spring Boot', 'API Security', 'MySQL'] },
      { id: 103, name: 'Arjun Kumar', role: 'Frontend Developer', workload: 65, status: 'Available', email: 'arjun@company.com', skills: ['React', 'TypeScript', 'CSS', 'Redux'] },
      { id: 104, name: 'Sana Khan', role: 'QA Engineer', workload: 58, status: 'Available', email: 'sana@company.com', skills: ['Software Testing', 'Selenium', 'Automation'] },
      { id: 105, name: 'Ahmed Ali', role: 'DevOps Engineer', workload: 76, status: 'Busy', email: 'ahmed@company.com', skills: ['Docker', 'Kubernetes', 'CI/CD'] },
      { id: 106, name: 'Neha Sharma', role: 'UI/UX Designer', workload: 43, status: 'Available', email: 'neha@company.com', skills: ['Figma', 'UI/UX Design', 'Wireframing'] }
    ],
    tasks: [
      { id: 12, name: 'Payment Gateway API', role: 'Backend Developer', assignedMember: 'Priyanshu Sharma', status: 'IN_PROGRESS' },
      { id: 21, name: 'Checkout UI Flow', role: 'Frontend Developer', assignedMember: 'Arjun Kumar', status: 'NOT_STARTED' },
      { id: 22, name: 'Payment Testing', role: 'QA Engineer', assignedMember: 'Sana Khan', status: 'NOT_STARTED' }
    ]
  },
  {
    id: 2,
    name: 'Cloud Migration Squad',
    projectName: 'Cloud Native Migration Project',
    teamLead: 'Vikram Singh',
    capacity: 67,
    status: 'Active',
    description: 'Infrastructure and cloud architecture squad responsible for serverless transition and database clustering.',
    members: [
      { id: 201, name: 'Vikram Singh', role: 'Team Lead', workload: 60, status: 'Available', email: 'vikram@company.com', skills: ['AWS', 'Cloud Architecture', 'Team Lead'] },
      { id: 202, name: 'Ananya Roy', role: 'Backend Developer', workload: 70, status: 'Available', email: 'ananya@company.com', skills: ['Java', 'Node.js', 'PostgreSQL'] },
      { id: 203, name: 'Rohan Verma', role: 'DevOps Engineer', workload: 80, status: 'Busy', email: 'rohan@company.com', skills: ['Terraform', 'Docker', 'AWS'] },
      { id: 204, name: 'Maya Patel', role: 'QA Engineer', workload: 52, status: 'Available', email: 'maya@company.com', skills: ['Performance Testing', 'JMeter'] },
      { id: 205, name: 'Developer C', role: 'Cloud Security Specialist', workload: 45, status: 'Available', email: 'devc@company.com', skills: ['API Security', 'OAuth2', 'Spring Boot'] }
    ],
    tasks: [
      { id: 5, name: 'Docker & Kubernetes Deployment', role: 'DevOps Engineer', assignedMember: 'Rohan Verma', status: 'IN_PROGRESS' },
      { id: 15, name: 'Database Migration Pipeline', role: 'Backend Developer', assignedMember: 'Ananya Roy', status: 'TESTING' }
    ]
  },
  {
    id: 3,
    name: 'Mobile Platform Team',
    projectName: 'Student Portal System',
    teamLead: 'Devendra Prasad',
    capacity: 74,
    status: 'Active',
    description: 'Mobile iOS & Android development team creating student portal companion applications.',
    members: [
      { id: 301, name: 'Devendra Prasad', role: 'Team Lead', workload: 68, status: 'Available', email: 'devendra@company.com', skills: ['Mobile Lead', 'React Native'] },
      { id: 302, name: 'Karan Mehta', role: 'Mobile Developer (iOS)', workload: 78, status: 'Busy', email: 'karan@company.com', skills: ['Swift', 'iOS SDK'] },
      { id: 303, name: 'Pooja Nair', role: 'Mobile Developer (Android)', workload: 72, status: 'Available', email: 'pooja@company.com', skills: ['Kotlin', 'Android Studio'] },
      { id: 304, name: 'Developer B', role: 'UI/UX Designer', workload: 50, status: 'Available', email: 'devb@company.com', skills: ['React', 'CSS', 'UI Design'] },
      { id: 305, name: 'Developer D', role: 'QA Engineer', workload: 65, status: 'Available', email: 'devd@company.com', skills: ['Software Testing', 'Appium'] }
    ],
    tasks: [
      { id: 2, name: 'User Interface & Dashboard', role: 'UI/UX Designer', assignedMember: 'Developer B', status: 'IN_PROGRESS' }
    ]
  },
  {
    id: 4,
    name: 'QA & Infrastructure Team',
    projectName: 'HR Management Suite',
    teamLead: 'Developer A',
    capacity: 58,
    status: 'Active',
    description: 'Enterprise quality assurance, automated test suite maintenance, and SRE monitoring.',
    members: [
      { id: 401, name: 'Developer A', role: 'Engineering Manager', workload: 88, status: 'Overloaded', email: 'deva@company.com', skills: ['Java', 'MySQL', 'System Architecture'] },
      { id: 402, name: 'Rakesh Gupta', role: 'Automation Engineer', workload: 45, status: 'Available', email: 'rakesh@company.com', skills: ['Cypress', 'Playwright'] },
      { id: 403, name: 'Simran Kaur', role: 'SRE / Cloud Engineer', workload: 55, status: 'Available', email: 'simran@company.com', skills: ['Prometheus', 'Grafana'] }
    ],
    tasks: [
      { id: 4, name: 'Automated Testing Suite', role: 'Automation Engineer', assignedMember: 'Rakesh Gupta', status: 'NOT_STARTED' }
    ]
  }
];

export const initialTasks = [
  { id: 1, name: 'Login Module & OAuth', priority: 'High', complexity: 6, duration: 3, deadline: '15 Aug 2026', status: 'In Progress', requiredSkills: ['Java', 'MySQL', 'Security'], assignedDev: 'Rahul Kumar', teamName: 'E-Commerce Squad', startDay: 1, endDay: 4, dependencies: [] },
  { id: 2, name: 'User Interface & Dashboard', priority: 'High', complexity: 5, duration: 5, deadline: '20 Aug 2026', status: 'In Progress', requiredSkills: ['React', 'CSS'], assignedDev: 'Developer B', teamName: 'Mobile Platform Team', startDay: 1, endDay: 6, dependencies: [] },
  { id: 3, name: 'Payment Gateway API', priority: 'Critical', complexity: 8, duration: 6, deadline: '25 Aug 2026', status: 'In Progress', requiredSkills: ['Java', 'Spring Boot', 'API Security'], assignedDev: 'Priyanshu Sharma', teamName: 'E-Commerce Squad', startDay: 4, endDay: 10, dependencies: [1] },
  { id: 4, name: 'Automated Testing Suite', priority: 'Medium', complexity: 4, duration: 4, deadline: '28 Aug 2026', status: 'Not Started', requiredSkills: ['Software Testing'], assignedDev: 'Sana Khan', teamName: 'E-Commerce Squad', startDay: 10, endDay: 14, dependencies: [3] },
  { id: 5, name: 'Docker & CI/CD Deployment', priority: 'Critical', complexity: 7, duration: 3, deadline: '30 Aug 2026', status: 'In Progress', requiredSkills: ['Docker', 'Spring Boot'], assignedDev: 'Ahmed Ali', teamName: 'E-Commerce Squad', startDay: 14, endDay: 17, dependencies: [4] }
];

export const initialDevelopers = [
  {
    id: 101,
    name: 'Rahul Kumar',
    email: 'rahul@company.com',
    skills: ['System Architecture', 'Java', 'Project Lead'],
    yearsExperience: 7,
    workload: 72,
    status: 'Available',
    hourlyRate: 65,
    role: 'Team Lead',
    teamName: 'E-Commerce Squad'
  },
  {
    id: 102,
    name: 'Priyanshu Sharma',
    email: 'priyanshu@company.com',
    skills: ['Java', 'Spring Boot', 'API Security', 'MySQL'],
    yearsExperience: 5,
    workload: 84,
    status: 'Busy',
    hourlyRate: 55,
    role: 'Backend Developer',
    teamName: 'E-Commerce Squad'
  },
  {
    id: 103,
    name: 'Arjun Kumar',
    email: 'arjun@company.com',
    skills: ['React', 'TypeScript', 'CSS', 'Redux'],
    yearsExperience: 4,
    workload: 65,
    status: 'Available',
    hourlyRate: 45,
    role: 'Frontend Developer',
    teamName: 'E-Commerce Squad'
  },
  {
    id: 104,
    name: 'Sana Khan',
    email: 'sana@company.com',
    skills: ['Software Testing', 'Selenium', 'Automation'],
    yearsExperience: 3,
    workload: 58,
    status: 'Available',
    hourlyRate: 40,
    role: 'QA Engineer',
    teamName: 'E-Commerce Squad'
  },
  {
    id: 105,
    name: 'Ahmed Ali',
    email: 'ahmed@company.com',
    skills: ['Docker', 'Kubernetes', 'CI/CD'],
    yearsExperience: 5,
    workload: 76,
    status: 'Busy',
    hourlyRate: 60,
    role: 'DevOps Engineer',
    teamName: 'E-Commerce Squad'
  },
  {
    id: 106,
    name: 'Neha Sharma',
    email: 'neha@company.com',
    skills: ['Figma', 'UI/UX Design', 'Wireframing'],
    yearsExperience: 4,
    workload: 43,
    status: 'Available',
    hourlyRate: 42,
    role: 'UI/UX Designer',
    teamName: 'E-Commerce Squad'
  }
];

export const initialServers = [
  { id: 1, serverName: 'Server 1 (US-East)', status: 'Healthy', cpu: 62, memory: 70, latency: 180, activeRequests: 320, cores: 16, memoryGb: 64 },
  { id: 2, serverName: 'Server 2 (US-West)', status: 'High Load', cpu: 91, memory: 88, latency: 620, activeRequests: 680, cores: 8, memoryGb: 32 },
  { id: 3, serverName: 'Server 3 (EU-Central)', status: 'Healthy', cpu: 34, memory: 45, latency: 140, activeRequests: 190, cores: 16, memoryGb: 64 },
  { id: 4, serverName: 'Server 4 (AP-South)', status: 'Healthy', cpu: 55, memory: 60, latency: 210, activeRequests: 410, cores: 8, memoryGb: 16 }
];

export const optimizerComparisonData = [
  { metric: 'Project Duration', heuristic: '45 days', genetic: '39 days', qlearning: '37 days' },
  { metric: 'Estimated Cost', heuristic: '₹6.0L', genetic: '₹5.5L', qlearning: '₹5.3L' },
  { metric: 'Workload Balance', heuristic: '72%', genetic: '87%', qlearning: '91%' },
  { metric: 'Application Latency', heuristic: '320 ms', genetic: '270 ms', qlearning: '240 ms' }
];

export const initialAlerts = [
  { id: 1, type: 'warning', text: 'E-Commerce Squad workload is 82% (High Capacity Risk)' },
  { id: 2, type: 'warning', text: 'Priyanshu Sharma within E-Commerce Squad is at 84% workload' },
  { id: 3, type: 'danger', text: 'Server 2 CPU usage is 91% (Action Recommended)' }
];
