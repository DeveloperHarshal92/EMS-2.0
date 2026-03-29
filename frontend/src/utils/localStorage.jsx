const employees = [
  {
    id: 1,
    fname: "Aarav Sharma",
    email: "employee1@example.com",
    password: "123",
    taskCount: {
      active: 1,
      newTask: 1,
      completed: 1,
      failed: 0,
    },
    tasks: [
      {
        title: "Prepare monthly report",
        description:
          "Compile sales and productivity data for the monthly review.",
        date: "2025-01-10",
        category: "Reporting",
        active: true,
        newTask: false,
        completed: false,
        failed: false,
      },
      {
        title: "Client follow-up",
        description: "Call and update clients regarding project timelines.",
        date: "2025-01-12",
        category: "Communication",
        active: false,
        newTask: true,
        completed: false,
        failed: false,
      },
      {
        title: "Fix login bug",
        description: "Resolve the login timeout issue in the dashboard.",
        date: "2025-01-15",
        category: "Development",
        active: false,
        newTask: false,
        completed: true,
        failed: false,
      },
    ],
  },

  {
    id: 2,
    fname: "Riya Verma",
    email: "employee2@example.com",
    password: "123",
    taskCount: {
      active: 1,
      newTask: 1,
      completed: 1,
      failed: 1,
    },
    tasks: [
      {
        title: "Update documentation",
        description: "Add API changes and update the instruction manual.",
        date: "2025-01-09",
        category: "Documentation",
        active: true,
        newTask: false,
        completed: false,
        failed: false,
      },
      {
        title: "Team presentation",
        description: "Prepare slides for weekly department meeting.",
        date: "2025-01-11",
        category: "Presentation",
        active: false,
        newTask: true,
        completed: false,
        failed: false,
      },
      {
        title: "Bug testing",
        description: "Test payment gateway issues and report findings.",
        date: "2025-01-16",
        category: "Testing",
        active: false,
        newTask: false,
        completed: true,
        failed: false,
      },
      {
        title: "Backend optimization",
        description: "Refactor code to improve API performance.",
        date: "2025-01-17",
        category: "Development",
        active: false,
        newTask: false,
        completed: false,
        failed: true,
      },
    ],
  },

  {
    id: 3,
    fname: "Kabir Mehta",
    email: "employee3@example.com",
    password: "123",
    taskCount: {
      active: 1,
      newTask: 1,
      completed: 1,
      failed: 0,
    },
    tasks: [
      {
        title: "Design wireframes",
        description: "Create UI/UX wireframes for the new dashboard.",
        date: "2025-01-10",
        category: "Design",
        active: true,
        newTask: false,
        completed: false,
        failed: false,
      },
      {
        title: "Logo redesign",
        description: "Propose 3 variants of new logo design.",
        date: "2025-01-14",
        category: "Branding",
        active: false,
        newTask: true,
        completed: false,
        failed: false,
      },
      {
        title: "Prototype testing",
        description: "Run usability tests with 5 internal users.",
        date: "2025-01-18",
        category: "Testing",
        active: false,
        newTask: false,
        completed: true,
        failed: false,
      },
    ],
  },

  {
    id: 4,
    fname: "Neha Kulkarni",
    email: "employee4@example.com",
    password: "123",
    taskCount: {
      active: 1,
      newTask: 1,
      completed: 1,
      failed: 1,
    },
    tasks: [
      {
        title: "Server monitoring",
        description: "Check server logs and ensure uptime stability.",
        date: "2025-01-09",
        category: "DevOps",
        active: true,
        newTask: false,
        completed: false,
        failed: false,
      },
      {
        title: "Security audit",
        description: "Run vulnerability scan and generate report.",
        date: "2025-01-13",
        category: "Security",
        active: false,
        newTask: false,
        completed: true,
        failed: false,
      },
      {
        title: "Patch deployment",
        description: "Deploy latest patches to production servers.",
        date: "2025-01-15",
        category: "Maintenance",
        active: false,
        newTask: true,
        completed: false,
        failed: false,
      },
      {
        title: "Backup testing",
        description: "Test recovery speed for weekly backups.",
        date: "2025-01-18",
        category: "Backup",
        active: false,
        newTask: false,
        completed: false,
        failed: true,
      },
    ],
  },

  {
    id: 5,
    fname: "Arjun Singh",
    email: "employee5@example.com",
    password: "123",
    taskCount: {
      active: 1,
      newTask: 1,
      completed: 1,
      failed: 1,
    },
    tasks: [
      {
        title: "Market research",
        description: "Analyze competitor pricing models.",
        date: "2025-01-10",
        category: "Research",
        active: true,
        newTask: false,
        completed: false,
        failed: false,
      },
      {
        title: "Create marketing plan",
        description: "Develop Q1 promotional strategy.",
        date: "2025-01-14",
        category: "Marketing",
        active: false,
        newTask: false,
        completed: true,
               failed: false,
      },
      {
        title: "Social media audit",
        description: "Review engagement insights for all platforms.",
        date: "2025-01-16",
        category: "Analytics",
        active: false,
        newTask: true,
        completed: false,
        failed: false,
      },
      {
        title: "Campaign execution",
        description: "Launch paid campaigns for product awareness.",
        date: "2025-01-19",
        category: "Advertising",
        active: false,
        newTask: false,
        completed: false,
        failed: true,
      },
    ],
  },
];

const admin = [
  {
    id: 1,
    fname: "Admin Raj",
    email: "admin@example.com",
    password: "123",
  },
];

export const setLocalStorage = () => {
  localStorage.setItem("employees", JSON.stringify(employees));
  localStorage.setItem("admin", JSON.stringify(admin));
};

export const getLocalStorage = () => {
  const employees = JSON.parse(localStorage.getItem("employees"));
  const admin = JSON.parse(localStorage.getItem("admin"));

  return { employees, admin };
};
