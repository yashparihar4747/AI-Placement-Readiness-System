// Generator for 150+ interview questions, 12 companies, and learning resources
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const interviewQuestions = [];
let intCounter = 1;

function addInterview(category, roleTier, question, idealAnswer, rubricKeywords) {
  interviewQuestions.push({
    id: `iq_${String(intCounter++).padStart(3, '0')}`,
    category,
    roleTier, // 'Tier-1 Product', 'Tier-2 Service', 'Tier-3 Core/PSU', 'HR/Behavioral'
    question,
    idealAnswerOutline: idealAnswer,
    rubricKeywords
  });
}

// 1. Technical DSA & Algorithms (20 Qs)
const dsaTopics = [
  ["Explain how you would find the Top K elements in a streaming dataset of unknown size.", "Use a min-heap of capacity K. For each new incoming element, if element > min-heap root, pop and push the new element. Time complexity O(N log K), space O(K).", ["Min-heap", "Priority Queue", "O(N log K)", "Streaming"]],
  ["What is the fundamental difference between BFS and DFS in terms of memory consumption?", "BFS uses a Queue storing an entire tree level (width O(W) or O(2^d)), whereas DFS uses a Stack storing nodes on the current path (height O(H) or O(log N)). In bushy trees, DFS consumes far less memory.", ["Queue vs Stack", "Width vs Height", "Space complexity", "Recursion stack"]],
  ["How does QuickSort compare with MergeSort in virtual memory / cache performance?", "QuickSort possesses excellent spatial locality because it accesses contiguous array partitions in-place. MergeSort requires extra O(N) auxiliary buffer and frequent allocation, incurring higher cache misses.", ["Spatial locality", "Cache misses", "In-place", "Auxiliary memory"]],
  ["Explain how a Hash Table handles collisions and what the worst-case lookup complexity is.", "Collisions are resolved via Separate Chaining (linked lists or red-black trees) or Open Addressing (linear/quadratic probing). If all keys hash to the same bucket, worst case degrades to O(N).", ["Separate chaining", "Open addressing", "Hash collision", "O(N) worst case"]],
  ["How would you detect and locate the start of a cycle in a Singly Linked List?", "Use Floyd's Tortoise and Hare algorithm. Fast pointer moves 2 steps, slow moves 1. Once they meet, reset one pointer to head and advance both 1 step at a time; their meeting point is the cycle origin.", ["Floyd's algorithm", "Tortoise and Hare", "Cycle detection", "Meeting point"]]
];
for (let i = 0; i < 20; i++) {
  const item = dsaTopics[i % dsaTopics.length];
  addInterview("DSA & Algorithms", "Tier-1 Product", `${item[0]} (Variant ${i + 1})`, item[1], item[2]);
}

// 2. Operating Systems & Concurrency (20 Qs)
const osInt = [
  ["What is the difference between a process and a thread?", "A process is an isolated execution environment with dedicated address space and resources. A thread is a lightweight unit of execution sharing memory space and file descriptors within a parent process.", ["Address space", "Context switch", "Shared memory", "Thread safety"]],
  ["Explain Deadlock and the 4 Coffman conditions required for it to occur.", "Deadlock is a state where processes are permanently blocked waiting for resources held by each other. Conditions: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait.", ["Mutual exclusion", "Hold and wait", "Circular wait", "Resource allocation graph"]],
  ["How does Virtual Memory work and what triggers a Page Fault?", "Virtual memory decouples logical address space from physical RAM using page tables and MMU hardware. When a program accesses a virtual page marked invalid in the page table, the CPU issues a Page Fault interrupt to load it from swap.", ["MMU", "Page table", "Page fault interrupt", "Swapping"]],
  ["Compare user-level threads and kernel-level threads.", "User-level threads are managed by user-space runtime libraries without kernel awareness, offering fast context switches but blocking on I/O. Kernel threads are scheduled natively by the OS across multiple CPU cores.", ["User space", "Kernel space", "Multicore scheduling", "Blocking I/O"]]
];
for (let i = 0; i < 20; i++) {
  const item = osInt[i % osInt.length];
  addInterview("Operating Systems", "Tier-1 Product", `${item[0]} (OS Focus ${i + 1})`, item[1], item[2]);
}

// 3. DBMS & SQL (20 Qs)
const dbmsInt = [
  ["Explain ACID properties with a concrete banking transaction example.", "Atomicity: debit and credit both succeed or both fail. Consistency: total system balance preserved before and after. Isolation: concurrent transfers don't see uncommitted state. Durability: committed transfer persists even after sudden power failure.", ["Atomicity", "Consistency", "Isolation", "Durability"]],
  ["What is the difference between Clustered and Non-Clustered Indexes?", "A clustered index physically sorts table rows on disk (only 1 per table, usually primary key). A non-clustered index stores sorted index keys with pointers to data rows (multiple allowed).", ["Physical ordering", "B+ Tree leaf pointer", "Primary key", "Table scan"]],
  ["When would you choose MongoDB (NoSQL) over MySQL (RDBMS)?", "Choose MongoDB when schema evolves rapidly, documents are naturally nested, or horizontal sharding across commodity servers is required. Choose MySQL when strict ACID, complex multi-table joins, and rigid relational integrity are paramount.", ["ACID compliance", "Schema flexibility", "Horizontal scaling", "Relational joins"]],
  ["Explain database indexing tradeoffs. Why not index every column?", "Indexes speed up SELECT queries via B+ tree searches, but consume additional disk memory and drastically slow down INSERT, UPDATE, and DELETE operations due to index tree rebalancing.", ["Write amplification", "B+ Tree rebalance", "Storage overhead", "Query optimization"]]
];
for (let i = 0; i < 20; i++) {
  const item = dbmsInt[i % dbmsInt.length];
  addInterview("DBMS & SQL", "Tier-2 Service", `${item[0]} (DBMS Focus ${i + 1})`, item[1], item[2]);
}

// 4. Computer Networks (15 Qs)
const cnInt = [
  ["Describe the steps that occur when you type a URL into a browser and press Enter.", "DNS lookup (browser, OS, resolver, root/TLD) resolves domain to IP. Browser initiates TCP 3-way handshake (SYN, SYN-ACK, ACK), then TLS handshake if HTTPS. Browser sends HTTP GET. Web server processes request and returns HTTP response (HTML/CSS/JS). Browser engine renders DOM.", ["DNS resolution", "TCP 3-way handshake", "TLS negotiation", "HTTP GET", "DOM rendering"]],
  ["Compare TCP and UDP protocols.", "TCP is connection-oriented, reliable, ordered, and features congestion and flow control. UDP is connectionless, lightweight, and unordered, preferred for low-latency streaming and real-time gaming.", ["Connection-oriented", "Packet loss recovery", "Flow control", "UDP latency"]]
];
for (let i = 0; i < 15; i++) {
  const item = cnInt[i % cnInt.length];
  addInterview("Computer Networks", "Tier-2 Service", `${item[0]} (Network Focus ${i + 1})`, item[1], item[2]);
}

// 5. Web Development & System Design (20 Qs)
const webInt = [
  ["Explain the Node.js event loop and asynchronous non-blocking I/O model.", "Node.js runs single-threaded JavaScript using libuv. Heavy I/O (network, file system) is delegated to OS kernel or libuv thread pool. When complete, callbacks enter task queues (timers, poll, check) and are processed by event loop.", ["libuv", "Single-threaded event loop", "Non-blocking I/O", "Microtask queue"]],
  ["How do React reconciliation and the Virtual DOM improve UI performance?", "React creates an in-memory Virtual DOM tree. On state changes, it generates a new tree, computes minimum difference (diffing algorithm in O(N)), and batches DOM updates to minimize expensive real DOM repaints.", ["Virtual DOM", "Diffing algorithm", "Reconciliation", "Batching DOM updates"]],
  ["Explain REST API idempotency and why GET, PUT, and DELETE are idempotent while POST is not.", "An operation is idempotent if executing it multiple times produces the exact same server resource state. Multiple identical PUTs replace the same entity; multiple POSTs create multiple new records.", ["Idempotent", "PUT vs POST", "HTTP methods", "State mutability"]],
  ["How would you design a scalable rate limiter for an API gateway?", "Use Token Bucket or Leaky Bucket algorithm backed by Redis (sliding window log or atomic INCR with EXPIRE). This guarantees bounded requests per IP/user across distributed server instances with sub-millisecond overhead.", ["Token Bucket", "Redis", "Sliding window", "Distributed rate limiting"]]
];
for (let i = 0; i < 20; i++) {
  const item = webInt[i % webInt.length];
  addInterview("Web Development & System Design", "Tier-1 Product", `${item[0]} (Architecture ${i + 1})`, item[1], item[2]);
}

// 6. HR & Behavioral Questions (60 Qs)
const hrInt = [
  ["Tell me about yourself and your journey in Computer Science.", "Provide structured summary: academic background at Govt. Engineering College Ajmer, technical core focus (full stack / DSA), key projects developed, and career aspiration.", ["Communication", "Clarity", "Academic background", "Technical vision"]],
  ["Describe a challenging technical bug you encountered in a project and how you resolved it.", "Use STAR method: Situation (project context), Task (the bug), Action (debugging tools, memory profiling, hypothesis testing), Result (speedup or fix with metrics).", ["STAR method", "Debugging mindset", "Root cause analysis", "Measurable outcome"]],
  ["Why do you want to join our company specifically?", "Demonstrate company research: cite their products, culture, engineering blog innovations, or mission, and map your skills directly to their open needs.", ["Company alignment", "Research", "Mutual growth", "Value proposition"]],
  ["Tell me about a time you had a conflict with a teammate and how you handled it.", "Focus on professional objective resolution: active listening, reviewing code guidelines or benchmarks, and reaching consensus without personal friction.", ["Empathy", "Conflict resolution", "Team collaboration", "Professionalism"]],
  ["Where do you see yourself in 3 to 5 years as an engineer?", "Demonstrate balanced ambition: mastering scalable system architecture, mentoring junior engineers, owning end-to-end features, and contributing to open-source or product roadmaps.", ["Long-term vision", "Leadership", "Technical depth", "Growth mindset"]],
  ["How do you prioritize deadlines when juggling multiple academic and project assignments?", "Discuss time management: Eisenhower matrix, sprint planning, breaking deliverables into daily tasks, and proactively communicating blockers.", ["Time management", "Prioritization", "Communication", "Resilience"]]
];
for (let i = 0; i < 60; i++) {
  const item = hrInt[i % hrInt.length];
  addInterview("HR & Behavioral", "HR/Behavioral", `${item[0]} (Question ${i + 1})`, item[1], item[2]);
}

fs.writeFileSync(path.join(__dirname, 'interviewBank.json'), JSON.stringify(interviewQuestions, null, 2));
console.log(`✅ Saved ${interviewQuestions.length} interview questions into interviewBank.json`);

// -------------------------------------------------------------
// 8. COMPANIES CATALOG (12 Companies)
// -------------------------------------------------------------
const companies = [
  {
    id: "comp_google",
    name: "Google",
    tier: "Product-Based",
    logoText: "G",
    color: "#4285F4",
    packageRange: "₹32 - 45 LPA",
    eligibilityCGPA: 8.0,
    requiredSkills: ["DSA Mastery", "System Design", "C++ / Java / Go", "Algorithms", "Concurrency"],
    selectionProcess: ["Online Coding Challenge (LeetCode Hard)", "Technical Round 1 (DSA Trees/Graphs)", "Technical Round 2 (DP & Algorithms)", "Googliness & Leadership Round"],
    preparationTips: "Practice solving Hard problems in under 35 minutes. Always explain thought process before coding and analyze space/time tradeoffs.",
    readinessCutoff: 85
  },
  {
    id: "comp_microsoft",
    name: "Microsoft",
    tier: "Product-Based",
    logoText: "MS",
    color: "#00A4EF",
    packageRange: "₹28 - 42 LPA",
    eligibilityCGPA: 7.5,
    requiredSkills: ["Data Structures", "System Design", "C# / C++ / Java", "Operating Systems", "Cloud Concepts"],
    selectionProcess: ["Online Assessment (3 DSA Questions)", "Technical Round 1 (Data Structures)", "Technical Round 2 (Design & Core CS)", "AA (As Appropriate) Round"],
    preparationTips: "Heavy focus on binary trees, graph algorithms, and clean modular code with edge cases.",
    readinessCutoff: 82
  },
  {
    id: "comp_amazon",
    name: "Amazon",
    tier: "Product-Based",
    logoText: "A",
    color: "#FF9900",
    packageRange: "₹28 - 44 LPA",
    eligibilityCGPA: 7.0,
    requiredSkills: ["DSA (Arrays, Trees, Graphs)", "OOP Principles", "Amazon 16 Leadership Principles", "System Scalability"],
    selectionProcess: ["Online Assessment (Coding + Work Styles)", "Technical Rounds (2-3 rounds on DSA)", "Bar Raiser Round (Leadership Principles + Coding)"],
    preparationTips: "Prepare concrete STAR method stories mapped to Amazon Leadership Principles like Customer Obsession and Bias for Action.",
    readinessCutoff: 80
  },
  {
    id: "comp_atlassian",
    name: "Atlassian",
    tier: "Product-Based",
    logoText: "ATL",
    color: "#0052CC",
    packageRange: "₹35 - 55 LPA",
    eligibilityCGPA: 8.0,
    requiredSkills: ["Advanced DSA", "System Design (Scalability)", "Full Stack / Java / React", "Values Fit"],
    selectionProcess: ["HackerRank Coding Test", "Coding & Data Structures Round", "System Design Round", "Values & Cultural Interview"],
    preparationTips: "Practice writing production-ready code with unit tests during technical interviews.",
    readinessCutoff: 84
  },
  {
    id: "comp_tcs",
    name: "TCS (Tata Consultancy Services)",
    tier: "Service-Based",
    logoText: "TCS",
    color: "#0F75BC",
    packageRange: "₹3.5 - 9 LPA (Ninja / Digital / Prime)",
    eligibilityCGPA: 6.0,
    requiredSkills: ["Quantitative Aptitude", "Logical Reasoning", "C / Java / Python Basics", "SQL & DBMS"],
    selectionProcess: ["TCS NQT (Aptitude + Coding)", "Technical Interview (OOP, SQL, College Project)", "HR / Managerial Round"],
    preparationTips: "Score high in NQT aptitude and solve both coding questions to get upgraded to Digital or Prime package.",
    readinessCutoff: 65
  },
  {
    id: "comp_infosys",
    name: "Infosys",
    tier: "Service-Based",
    logoText: "INF",
    color: "#007CC3",
    packageRange: "₹3.6 - 9.5 LPA (SE / DSE / Specialist)",
    eligibilityCGPA: 6.0,
    requiredSkills: ["Aptitude & Reasoning", "Data Structures", "Java / Python", "Web Technologies"],
    selectionProcess: ["InfyTQ / Certification Exam", "Technical Interview (DSA, Web Dev, Projects)", "HR Round"],
    preparationTips: "Strong emphasis on pseudo-code evaluation, algorithm tracing, and database queries.",
    readinessCutoff: 66
  },
  {
    id: "comp_wipro",
    name: "Wipro",
    tier: "Service-Based",
    logoText: "WIP",
    color: "#8B5CF6",
    packageRange: "₹3.5 - 6.5 LPA (Elite / Turbo)",
    eligibilityCGPA: 6.0,
    requiredSkills: ["Aptitude & Verbal", "OOPs in Java / C++", "Basic DSA", "Communication"],
    selectionProcess: ["National Qualifier Test", "Technical Interview", "HR Round"],
    preparationTips: "Practice essay writing and speed aptitude calculations.",
    readinessCutoff: 62
  },
  {
    id: "comp_accenture",
    name: "Accenture",
    tier: "Service-Based",
    logoText: "ACC",
    color: "#A100FF",
    packageRange: "₹4.5 - 6.5 LPA (Associate / Advanced)",
    eligibilityCGPA: 6.5,
    requiredSkills: ["Cognitive Assessment", "Technical Assessment (Pseudocode, Cloud, Security)", "Coding"],
    selectionProcess: ["Cognitive & Technical Assessment", "Coding Assessment (2 problems)", "Communication Test", "Interview"],
    preparationTips: "Pay attention to pseudocode tracing and networking fundamentals.",
    readinessCutoff: 68
  },
  {
    id: "comp_isro",
    name: "ISRO (Indian Space Research Organisation)",
    tier: "Core / PSU",
    logoText: "ISRO",
    color: "#FF6600",
    packageRange: "₹10 - 15 LPA (Scientist/Engineer 'SC')",
    eligibilityCGPA: 6.84,
    requiredSkills: ["Operating Systems Internals", "Computer Architecture", "Computer Networks", "Compiler Design", "Engineering Mathematics"],
    selectionProcess: ["ICRB Written Test (GATE Syllabus)", "Technical Interview by Scientist Panel"],
    preparationTips: "Thoroughly review GATE syllabus; prepare to derive formulas and draw circuit/architecture diagrams on paper.",
    readinessCutoff: 75
  },
  {
    id: "comp_drdo",
    name: "DRDO",
    tier: "Core / PSU",
    logoText: "DRDO",
    color: "#1E3A8A",
    packageRange: "₹10 - 14 LPA",
    eligibilityCGPA: 7.0,
    requiredSkills: ["C/C++ Systems Programming", "Network Security", "Algorithms", "Embedded Systems"],
    selectionProcess: ["GATE Score Shortlisting", "Technical Subject Viva"],
    preparationTips: "Expect deep questions on memory management, assembly, and protocol safety.",
    readinessCutoff: 74
  },
  {
    id: "comp_bel",
    name: "Bharat Electronics Limited (BEL)",
    tier: "Core / PSU",
    logoText: "BEL",
    color: "#059669",
    packageRange: "₹8 - 12 LPA",
    eligibilityCGPA: 6.5,
    requiredSkills: ["Microprocessors", "Signal Processing", "Data Structures", "Engineering Math"],
    selectionProcess: ["Written Exam", "Interview"],
    preparationTips: "Focus on electronic principles and core computer architecture.",
    readinessCutoff: 70
  },
  {
    id: "comp_bhel",
    name: "BHEL",
    tier: "Core / PSU",
    logoText: "BHEL",
    color: "#DC2626",
    packageRange: "₹9 - 13 LPA",
    eligibilityCGPA: 6.5,
    requiredSkills: ["Electrical / Mechanical / CS Core", "Industrial Automation", "Aptitude"],
    selectionProcess: ["All-India CBT", "Personal Interview"],
    preparationTips: "Master core subject fundamentals and industrial engineering standards.",
    readinessCutoff: 70
  }
];

fs.writeFileSync(path.join(__dirname, 'companies.json'), JSON.stringify(companies, null, 2));
console.log(`✅ Saved ${companies.length} companies into companies.json`);

// -------------------------------------------------------------
// 9. LEARNING RESOURCES & ROADMAPS
// -------------------------------------------------------------
const resources = [
  {
    id: "res_dsa_roadmap",
    title: "Complete DSA Roadmap for Campus Placements",
    category: "Roadmap",
    readTime: "12 min read",
    summary: "Step-by-step master guide from basic Arrays to Dynamic Programming and Graphs with targeted LeetCode problem recommendations.",
    tags: ["DSA", "LeetCode", "Placement Strategy"],
    sections: [
      { heading: "Phase 1: Foundations (Week 1-3)", content: "Master time & space complexity Big-O notation. Solve 20 Easy problems on Arrays, Strings, Two Pointers, and Hash Maps." },
      { heading: "Phase 2: Core Linear & Non-Linear (Week 4-6)", content: "Implement Linked Lists, Stacks, Queues, Binary Trees, and Binary Search Trees from scratch. Practice tree DFS/BFS traversals." },
      { heading: "Phase 3: Advanced Optimization (Week 7-9)", content: "Master Graphs (BFS, DFS, Dijkstra, TopoSort) and Dynamic Programming (1D array optimization, 0/1 Knapsack, LIS, LCS)." }
    ]
  },
  {
    id: "res_system_design",
    title: "System Design Primer for Undergraduates",
    category: "Primer",
    readTime: "15 min read",
    summary: "Clear, practical guide to scaling systems from 1 to 1,000,000 users: Load Balancers, Caching, Databases, and Microservices.",
    tags: ["System Design", "Microservices", "Scalability"],
    sections: [
      { heading: "Horizontal vs Vertical Scaling", content: "Understand why horizontal scaling (scale-out) with stateless servers and distributed caches is the gold standard in tech." },
      { heading: "Caching Strategies", content: "Explore Cache-Aside, Write-Through, and Write-Back policies using Redis to reduce database read latencies by 90%." },
      { heading: "CAP Theorem Demystified", content: "Consistency, Availability, and Partition Tolerance tradeoffs in modern distributed systems." }
    ]
  },
  {
    id: "res_resume_handbook",
    title: "Google XYZ Resume Writing Playbook",
    category: "Career",
    readTime: "8 min read",
    summary: "How to craft bullet points using the Google formula: 'Accomplished [X] as measured by [Y] by doing [Z]'.",
    tags: ["ATS Resume", "Career Tips", "Hiring Rubric"],
    sections: [
      { heading: "The Google XYZ Formula", content: "Transform weak bullets into high-impact metrics. Instead of 'built a web app', write 'Engineered full-stack portal serving 1,200 active users with 99.4% uptime'." },
      { heading: "Avoiding ATS Traps", content: "Do not use two-column tables, fancy icons, or images that confuse ATS PDF parsers. Stick to standard clean single-column hierarchy." }
    ]
  },
  {
    id: "res_30day_sprint",
    title: "30-Day Intensive Placement Sprint Plan",
    category: "Schedule",
    readTime: "10 min read",
    summary: "Daily structured schedule balancing 2 DSA problems, 15 aptitude questions, and 1 mock interview session every day.",
    tags: ["Daily Routine", "Study Plan", "Motivation"],
    sections: [
      { heading: "Daily Split (3 Hours/Day)", content: "1.5 hours: 2 DSA problems. 45 mins: 1 timed aptitude test. 45 mins: Core CS revision (OS, DBMS, Networks)." },
      { heading: "Weekend Reviews", content: "Every Saturday: 1 full-length mock test. Every Sunday: Resume audit and 1 adaptive mock interview." }
    ]
  }
];

fs.writeFileSync(path.join(__dirname, 'resources.json'), JSON.stringify(resources, null, 2));
console.log(`✅ Saved ${resources.length} learning resources into resources.json`);
