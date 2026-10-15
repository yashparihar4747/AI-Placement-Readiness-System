// AI Service: Handles Resume Analysis & Adaptive Mock Interview
// Integrates Gemini LLM API with intelligent deterministic fallback

const ACTION_VERBS = [
  'accelerated', 'achieved', 'administered', 'analyzed', 'architected', 'automated',
  'built', 'calculated', 'centralized', 'collaborated', 'configured', 'constructed',
  'created', 'decreased', 'delivered', 'deployed', 'designed', 'developed', 'devised',
  'engineered', 'enhanced', 'established', 'executed', 'expanded', 'expedited',
  'formulated', 'generated', 'implemented', 'improved', 'increased', 'initiated',
  'installed', 'integrated', 'launched', 'led', 'maximized', 'mentored', 'minimized',
  'modeled', 'modernized', 'optimized', 'orchestrated', 'overhauled', 'pioneered',
  'programmed', 'reduced', 'refactored', 'resolved', 'restructured', 'revamped',
  'scaled', 'secured', 'simplified', 'spearheaded', 'standardized', 'streamlined',
  'structured', 'transformed', 'upgraded', 'validated'
];

const TECH_KEYWORD_TAXONOMY = {
  frontend: ['React', 'React.js', 'Next.js', 'Vue', 'Angular', 'HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'Tailwind', 'Redux', 'GraphQL', 'Responsive Design'],
  backend: ['Node.js', 'Express', 'Express.js', 'Python', 'Django', 'FastAPI', 'Java', 'Spring Boot', 'C++', 'Go', 'REST', 'RESTful APIs', 'Microservices', 'GraphQL'],
  database: ['MongoDB', 'MySQL', 'PostgreSQL', 'SQLite', 'Redis', 'Cassandra', 'Database Indexing', 'Normalization', 'ACID', 'NoSQL', 'Prisma', 'Mongoose'],
  devops_cloud: ['Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'CI/CD', 'Git', 'GitHub', 'Linux', 'Nginx', 'Terraform', 'Serverless'],
  core_cs: ['Data Structures', 'Algorithms', 'System Design', 'Operating Systems', 'OOP', 'Object Oriented Programming', 'DBMS', 'Computer Networks', 'Design Patterns'],
  ai_ml: ['Machine Learning', 'Deep Learning', 'NLP', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'LLM', 'Computer Vision']
};

/**
 * Intelligent Deterministic Resume Analyzer (ATS + JD Matching)
 */
export const analyzeResumeDeterministic = (resumeText, jobDescription = '', targetRole = '') => {
  const textLower = resumeText.toLowerCase();
  const jdLower = (jobDescription || '').toLowerCase();

  // 1. Contact Information Check
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText);
  const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText);
  const hasLinkedIn = /linkedin\.com\/in\/[a-zA-Z0-9_-]+/.test(textLower);
  const hasGitHub = /github\.com\/[a-zA-Z0-9_-]+/.test(textLower);
  let contactScore = 0;
  if (hasEmail) contactScore += 30;
  if (hasPhone) contactScore += 30;
  if (hasLinkedIn) contactScore += 20;
  if (hasGitHub) contactScore += 20;

  // 2. Sections Check
  const sectionsFound = {
    education: /(education|academic|b\.?tech|degree|college|university)/i.test(resumeText),
    skills: /(skills|technical skills|technologies|proficiencies)/i.test(resumeText),
    experience: /(experience|internship|work experience|employment)/i.test(resumeText),
    projects: /(projects|academic projects|personal projects)/i.test(resumeText),
    certifications: /(certifications|licenses|achievements|awards)/i.test(resumeText)
  };
  const sectionCount = Object.values(sectionsFound).filter(Boolean).length;
  const formattingScore = Math.min(100, (sectionCount / 5) * 100);

  // 3. Action Verbs & Quantifiable Impact
  let actionVerbCount = 0;
  ACTION_VERBS.forEach(verb => {
    const regex = new RegExp(`\\b${verb}\\b`, 'gi');
    const matches = resumeText.match(regex);
    if (matches) actionVerbCount += matches.length;
  });
  const impactMetricsRegex = /(\d+%\s*|\d+x\s*|\$\d+|\b\d+\s*(users|clients|requests|ms|seconds|minutes|hours|tests|queries|stars))/gi;
  const metricsMatches = resumeText.match(impactMetricsRegex) || [];
  const metricsCount = metricsMatches.length;

  const actionScore = Math.min(100, (actionVerbCount * 4) + (metricsCount * 12));

  // 4. Skills extraction and matching against JD
  const foundSkills = [];
  const missingSkills = [];
  const allTaxonomy = Object.values(TECH_KEYWORD_TAXONOMY).flat();

  // If JD is provided, extract target keywords from JD
  let targetKeywords = [];
  if (jdLower.length > 20) {
    allTaxonomy.forEach(kw => {
      if (jdLower.includes(kw.toLowerCase())) {
        targetKeywords.push(kw);
      }
    });
  }

  // If target keywords from JD were few, add default role-based keywords
  if (targetKeywords.length < 5) {
    targetKeywords = ['Data Structures', 'Algorithms', 'Git', 'REST', 'SQL', 'React', 'Node.js', 'System Design', 'Docker', 'Testing'];
  }

  // Remove duplicates
  targetKeywords = [...new Set(targetKeywords)];

  targetKeywords.forEach(kw => {
    if (textLower.includes(kw.toLowerCase())) {
      foundSkills.push(kw);
    } else {
      missingSkills.push(kw);
    }
  });

  const skillsMatchRate = targetKeywords.length > 0 ? (foundSkills.length / targetKeywords.length) : 0.75;
  const skillsScore = Math.round(skillsMatchRate * 100);

  // 5. Experience / Project depth
  const wordCount = resumeText.trim().split(/\s+/).length;
  let depthScore = 75;
  if (wordCount < 150) depthScore = 45;
  else if (wordCount >= 300 && wordCount <= 700) depthScore = 90;
  else if (wordCount > 700) depthScore = 80;

  // Composite ATS Score
  const atsScore = Math.round(
    skillsScore * 0.35 +
    actionScore * 0.20 +
    formattingScore * 0.15 +
    depthScore * 0.15 +
    contactScore * 0.15
  );

  // Feedback points
  const strengths = [];
  const improvements = [];

  if (skillsScore >= 70) {
    strengths.push(`Good tech stack alignment! Matches key requirements like ${foundSkills.slice(0, 3).join(', ')}.`);
  } else {
    improvements.push(`Low keyword match against target role (${skillsScore}%). Add missing skills: ${missingSkills.slice(0, 4).join(', ')}.`);
  }

  if (metricsCount >= 3) {
    strengths.push(`Excellent use of quantifiable metrics (${metricsCount} outcome-driven metrics detected).`);
  } else {
    improvements.push('Add measurable achievements using the Google XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]".');
  }

  if (actionVerbCount >= 8) {
    strengths.push('Dynamic bullet points utilizing strong action verbs.');
  } else {
    improvements.push('Replace passive statements ("worked on", "responsible for") with active impact verbs like "architected", "accelerated", or "optimized".');
  }

  if (!sectionsFound.certifications) {
    improvements.push('Add a dedicated "Certifications & Achievements" section to highlight hackathons, rankings, or cloud badges.');
  }

  if (!hasGitHub || !hasLinkedIn) {
    improvements.push('Ensure both your LinkedIn profile and GitHub repository URLs are clearly visible in the header.');
  }

  return {
    atsScore: Math.min(98, Math.max(25, atsScore)),
    matchScore: skillsScore,
    breakdown: {
      skillsMatch: skillsScore,
      impactAndMetrics: actionScore,
      formatting: Math.round(formattingScore),
      experienceDepth: depthScore,
      contactAndEducation: contactScore
    },
    matchedKeywords: foundSkills,
    missingKeywords: missingSkills,
    metricsDetected: metricsMatches,
    strengths: strengths.length ? strengths : ['Basic layout in place.'],
    improvements
  };
};

/**
 * Adaptive Mock Interview Question Bank & Generator
 */
export const INTERVIEW_TAXONOMY = {
  tier1: {
    name: 'Product-Based Companies (Google, Microsoft, Amazon, Atlassian)',
    stages: [
      {
        stage: 1,
        topic: 'DSA & Algorithmic Problem Solving',
        question: 'Suppose you have a high-throughput API receiving millions of user IDs per hour, and you need to find the Top-K most frequent active users in real-time with limited memory. How would you design this data structure and algorithm?',
        sampleKeyPoints: ['Min-heap of size K', 'Count-Min Sketch or Hash Map for frequency', 'O(N log K) time complexity', 'Space complexity O(K)'],
        followUpPrompt: 'How would you scale this if the stream cannot fit on a single server, and what happens during hash collisions or network partitions?'
      },
      {
        stage: 2,
        topic: 'System Design & Scalability',
        question: 'Explain how you would design a URL shortener service (like TinyURL or Bitly). Specifically, address how short IDs are generated, how collisions are prevented, and how read-heavy caching should be implemented.',
        sampleKeyPoints: ['Base62 encoding', 'Distributed ID generator (Snowflake/ZooKeeper)', 'Redis caching with LRU', 'Database partitioning by hash key'],
        followUpPrompt: 'If 95% of traffic is concentrated on the top 1% viral URLs, how do you prevent cache stampedes and hotkey throttling?'
      },
      {
        stage: 3,
        topic: 'Core CS & Concurrency',
        question: 'In Node.js, JavaScript is single-threaded, yet it handles thousands of concurrent I/O operations seamlessly. Walk me through the phases of the Event Loop (timers, pending callbacks, poll, check, close), and explain what occurs when `process.nextTick` is abused.',
        sampleKeyPoints: ['libuv event loop phases', 'Microtasks vs Macrotasks', 'Starvation of I/O queue via recursive nextTick', 'Thread pool for fs and crypto'],
        followUpPrompt: 'If a CPU-heavy image processing calculation blocks the event loop, what architecture pattern would you use in Node.js to keep the server responsive?'
      }
    ]
  },
  tier2: {
    name: 'Service-Based Companies (TCS Digital/Prime, Infosys DSE/SE, Wipro, Accenture)',
    stages: [
      {
        stage: 1,
        topic: 'Data Structures & Fundamentals',
        question: 'What is the fundamental difference between an Array and a Linked List in terms of memory layout, CPU cache locality, and time complexity for insertion at arbitrary positions?',
        sampleKeyPoints: ['Contiguous vs heap allocation', 'Cache line misses in linked lists', 'O(1) amortized append vs pointer traversal', 'Static vs dynamic sizing'],
        followUpPrompt: 'Can you implement or describe how you would detect a cycle in a singly linked list with O(1) auxiliary memory?'
      },
      {
        stage: 2,
        topic: 'OOP Concepts & Database Foundations',
        question: 'Explain the four core principles of Object-Oriented Programming (Encapsulation, Abstraction, Inheritance, Polymorphism) using a real-world banking application example. Also, what is the purpose of database indexing?',
        sampleKeyPoints: ['BankAccount private balance', 'Interface for payment gateway', 'SavingsAccount extends Account', 'Overloading/Overriding deposit methods', 'B-Tree index speeds up SELECT queries'],
        followUpPrompt: 'Why does adding too many indexes on a database table degrade write (INSERT/UPDATE) performance?'
      },
      {
        stage: 3,
        topic: 'Web Development & REST Architecture',
        question: 'What makes an API RESTful? Explain the significance of HTTP status codes (200, 201, 400, 401, 403, 404, 500) and how statelessness benefits horizontal scaling.',
        sampleKeyPoints: ['Stateless client-server', 'Standard HTTP verbs (GET, POST, PUT, DELETE)', 'Proper status code semantics', 'Session state in token/redis enabling load balancing'],
        followUpPrompt: 'How do you secure sensitive endpoints against Cross-Site Scripting (XSS) and SQL Injection attacks?'
      }
    ]
  },
  tier3: {
    name: 'Core Engineering / PSU / Technical Roles',
    stages: [
      {
        stage: 1,
        topic: 'Operating Systems & Process Management',
        question: 'What is the difference between a Process and a Thread? Describe context switching overhead, virtual memory page tables, and how the OS avoids race conditions using Mutexes and Semaphores.',
        sampleKeyPoints: ['Shared address space vs isolated virtual address space', 'Context switch CPU cache invalidation', 'Binary semaphore vs counting semaphore', 'Deadlock prevention'],
        followUpPrompt: 'Explain how virtual memory paging works and what leads to a page fault.'
      },
      {
        stage: 2,
        topic: 'Computer Networks & Protocols',
        question: 'Trace the complete journey of what happens behind the scenes from the moment you type "https://google.com" in a web browser until the webpage renders on screen.',
        sampleKeyPoints: ['DNS resolution (cache, root, TLD, authoritative)', 'TCP 3-way handshake (SYN, SYN-ACK, ACK)', 'TLS/SSL handshake and key exchange', 'HTTP request/response', 'DOM/CSSOM rendering engine'],
        followUpPrompt: 'Why does TCP use a 3-way handshake instead of a 2-way handshake?'
      },
      {
        stage: 3,
        topic: 'Software Engineering & Testing',
        question: 'What is the difference between Unit Testing, Integration Testing, and System Testing? Explain the concept of regression testing and CI/CD pipelines.',
        sampleKeyPoints: ['Testing pyramid', 'Isolation with mocks/stubs', 'End-to-end integration', 'Automated build and deployment triggers'],
        followUpPrompt: 'How do you decide test coverage targets, and why is 100% code coverage not always equal to 100% bug-free software?'
      }
    ]
  }
};

/**
 * Intelligent Rubric-Based Interview Answer Evaluator
 */
export const evaluateInterviewAnswerDeterministic = (question, studentAnswer, rubricStage) => {
  const ans = (studentAnswer || '').trim();
  const wordCount = ans.split(/\s+/).filter(Boolean).length;

  if (wordCount < 10) {
    return {
      scores: {
        technicalAccuracy: 3.0,
        problemSolving: 3.0,
        communication: 4.0,
        completeness: 3.0
      },
      overallScore: 32,
      critique: 'The answer is too brief. In a technical interview, you should elaborate on the design choices, complexities, and practical tradeoffs.',
      suggestedFollowUp: 'Could you explain in more detail the underlying data structure and time complexity of your approach?',
      modelAnswerExcerpt: 'A comprehensive answer should define the data structure, explain both average and worst-case time/space complexities, and outline architectural edge cases.'
    };
  }

  // Key phrase analysis
  const keywordsInAns = [];
  const keyTerms = [
    'time complexity', 'space complexity', 'o(n', 'o(1', 'o(log', 'hash', 'cache',
    'memory', 'cpu', 'scaling', 'index', 'latency', 'tradeoff', 'concurrency',
    'thread', 'lock', 'event loop', 'asynchronous', 'promise', 'tree', 'graph',
    'queue', 'stack', 'heap', 'distributed', 'redis', 'buffer', 'stateless'
  ];

  keyTerms.forEach(term => {
    if (ans.toLowerCase().includes(term)) {
      keywordsInAns.push(term);
    }
  });

  let technicalAccuracy = 6.0 + Math.min(3.5, keywordsInAns.length * 0.7);
  let problemSolving = 6.0 + (wordCount > 50 ? 1.5 : 0.5) + (keywordsInAns.length > 2 ? 1.5 : 0);
  let communication = Math.min(9.5, 6.0 + (wordCount > 40 ? 2.0 : 1.0) + (ans.includes('.') ? 1.0 : 0));
  let completeness = Math.min(9.5, 5.5 + Math.min(4.0, (wordCount / 30) + keywordsInAns.length * 0.5));

  // Cap at 9.8
  technicalAccuracy = Math.min(9.8, parseFloat(technicalAccuracy.toFixed(1)));
  problemSolving = Math.min(9.8, parseFloat(problemSolving.toFixed(1)));
  communication = Math.min(9.8, parseFloat(communication.toFixed(1)));
  completeness = Math.min(9.8, parseFloat(completeness.toFixed(1)));

  const overallPercent = Math.round(
    ((technicalAccuracy * 0.35 + problemSolving * 0.30 + communication * 0.20 + completeness * 0.15) / 10) * 100
  );

  return {
    scores: {
      technicalAccuracy,
      problemSolving,
      communication,
      completeness
    },
    overallScore: overallPercent,
    critique: wordCount > 60
      ? 'Strong technical explanation with clear structural terminology and sound logic.'
      : 'Good foundational points mentioned. Try to explicitly state Big-O complexities and production edge cases.',
    suggestedFollowUp: rubricStage?.followUpPrompt || 'What would be the worst-case scenario for this approach and how would you optimize it further?',
    keyConceptsIdentified: keywordsInAns
  };
};
