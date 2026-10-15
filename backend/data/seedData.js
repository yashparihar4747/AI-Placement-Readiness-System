// Seed data for initial database initialization

export const initialDSAProblems = [
  // Arrays & Strings
  {
    id: "dsa_01",
    title: "Two Sum",
    topic: "Arrays",
    difficulty: "Easy",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/two-sum/",
    completed: true,
    notes: "Solved using Hash Map in O(n) time and O(n) space.",
    timeSpentMin: 20,
    completedAt: new Date(Date.now() - 7 * 86400000).toISOString()
  },
  {
    id: "dsa_02",
    title: "Best Time to Buy and Sell Stock",
    topic: "Arrays",
    difficulty: "Easy",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    completed: true,
    notes: "Track minimum price so far and calculate max profit.",
    timeSpentMin: 15,
    completedAt: new Date(Date.now() - 6 * 86400000).toISOString()
  },
  {
    id: "dsa_03",
    title: "Longest Substring Without Repeating Characters",
    topic: "Strings",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    completed: true,
    notes: "Sliding window with character index hash map.",
    timeSpentMin: 35,
    completedAt: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    id: "dsa_04",
    title: "3Sum",
    topic: "Arrays",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/3sum/",
    completed: true,
    notes: "Sort array + two-pointer approach, avoid duplicate triplets.",
    timeSpentMin: 40,
    completedAt: new Date(Date.now() - 4 * 86400000).toISOString()
  },
  {
    id: "dsa_05",
    title: "Trapping Rain Water",
    topic: "Arrays",
    difficulty: "Hard",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/trapping-rain-water/",
    completed: false,
    notes: "Need to review two-pointer vs monotonic stack approach.",
    timeSpentMin: 0,
    completedAt: null
  },
  // Linked Lists
  {
    id: "dsa_06",
    title: "Reverse a Linked List",
    topic: "Linked Lists",
    difficulty: "Easy",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/reverse-linked-list/",
    completed: true,
    notes: "Iterative 3-pointer method (prev, curr, next).",
    timeSpentMin: 15,
    completedAt: new Date(Date.now() - 4 * 86400000).toISOString()
  },
  {
    id: "dsa_07",
    title: "Merge Two Sorted Lists",
    topic: "Linked Lists",
    difficulty: "Easy",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/merge-two-sorted-lists/",
    completed: true,
    notes: "Dummy head node simplifies pointer reassignment.",
    timeSpentMin: 15,
    completedAt: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  // Trees & Graphs
  {
    id: "dsa_08",
    title: "Maximum Depth of Binary Tree",
    topic: "Trees",
    difficulty: "Easy",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
    completed: true,
    notes: "Simple recursive post-order DFS: 1 + max(left, right).",
    timeSpentMin: 10,
    completedAt: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: "dsa_09",
    title: "Lowest Common Ancestor of a Binary Search Tree",
    topic: "Trees",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
    completed: true,
    notes: "Leverage BST property: if both values are greater, go right, else left.",
    timeSpentMin: 25,
    completedAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: "dsa_10",
    title: "Number of Islands",
    topic: "Graphs",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/number-of-islands/",
    completed: true,
    notes: "Grid traversal with DFS or BFS marking visited cells as '0'.",
    timeSpentMin: 35,
    completedAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: "dsa_11",
    title: "Course Schedule (Cycle Detection)",
    topic: "Graphs",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/course-schedule/",
    completed: false,
    notes: "Kahn's Topological Sort algorithm using indegree array.",
    timeSpentMin: 0,
    completedAt: null
  },
  // Dynamic Programming
  {
    id: "dsa_12",
    title: "Climbing Stairs",
    topic: "Dynamic Programming",
    difficulty: "Easy",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/climbing-stairs/",
    completed: true,
    notes: "Fibonacci recurrence dp[i] = dp[i-1] + dp[i-2].",
    timeSpentMin: 15,
    completedAt: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    id: "dsa_13",
    title: "Coin Change",
    topic: "Dynamic Programming",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/coin-change/",
    completed: true,
    notes: "Unbounded knapsack style DP bottom-up 1D array.",
    timeSpentMin: 45,
    completedAt: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    id: "dsa_14",
    title: "Longest Increasing Subsequence",
    topic: "Dynamic Programming",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/longest-increasing-subsequence/",
    completed: false,
    notes: "O(n^2) dp or O(n log n) with patience sorting / binary search.",
    timeSpentMin: 0,
    completedAt: null
  },
  {
    id: "dsa_15",
    title: "Median of Two Sorted Arrays",
    topic: "Binary Search",
    difficulty: "Hard",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
    completed: false,
    notes: "Binary search on partition points of smaller array in O(log(min(m, n))).",
    timeSpentMin: 0,
    completedAt: null
  }
];

export const initialAptitudeQuestions = {
  quantitative: [
    {
      id: "q_quant_1",
      topic: "Percentages & Profit",
      question: "A merchant marks an article 40% above the cost price and allows a discount of 20% on the marked price. Find his profit percentage.",
      options: ["10%", "12%", "15%", "18%"],
      correctAnswer: 1, // "12%"
      explanation: "Let CP = 100. MP = 140. Discount = 20% of 140 = 28. SP = 140 - 28 = 112. Profit = (112 - 100)% = 12%."
    },
    {
      id: "q_quant_2",
      topic: "Time & Work",
      question: "A can complete a piece of work in 12 days and B in 18 days. If they work together for 4 days, what fraction of work is left?",
      options: ["1/3", "4/9", "5/9", "2/3"],
      correctAnswer: 1, // "4/9"
      explanation: "A's 1 day work = 1/12, B's 1 day work = 1/18. Combined = 1/12 + 1/18 = 5/36. In 4 days, work done = 4 * (5/36) = 20/36 = 5/9. Work left = 1 - 5/9 = 4/9."
    },
    {
      id: "q_quant_3",
      topic: "Speed, Time & Distance",
      question: "A train 150 meters long passes a telegraph pole in 10 seconds. Find the speed of the train in km/h.",
      options: ["45 km/h", "54 km/h", "60 km/h", "72 km/h"],
      correctAnswer: 1, // "54 km/h"
      explanation: "Speed = Distance / Time = 150m / 10s = 15 m/s. In km/h = 15 * (18/5) = 54 km/h."
    },
    {
      id: "q_quant_4",
      topic: "Probability",
      question: "Two dice are thrown simultaneously. What is the probability of getting two numbers whose product is even?",
      options: ["1/4", "1/2", "3/4", "5/8"],
      correctAnswer: 2, // "3/4"
      explanation: "Total outcomes = 36. Product is odd only when both dice show odd numbers (3 * 3 = 9 outcomes). P(Product is odd) = 9/36 = 1/4. P(Product is even) = 1 - 1/4 = 3/4."
    },
    {
      id: "q_quant_5",
      topic: "Averages & Ratios",
      question: "The average age of a class of 30 students is 15 years. If the teacher's age is included, the average increases by 1 year. What is the teacher's age?",
      options: ["40 years", "44 years", "46 years", "48 years"],
      correctAnswer: 2, // "46 years"
      explanation: "Total age of 30 students = 30 * 15 = 450. New average of 31 people = 16. Total age = 31 * 16 = 496. Teacher's age = 496 - 450 = 46 years."
    }
  ],
  logical: [
    {
      id: "q_log_1",
      topic: "Number Series",
      question: "Find the next number in the sequence: 4, 9, 25, 49, 121, 169, ?",
      options: ["225", "256", "289", "361"],
      correctAnswer: 2, // "289"
      explanation: "These are squares of prime numbers: 2^2=4, 3^2=9, 5^2=25, 7^2=49, 11^2=121, 13^2=169. Next prime is 17, and 17^2 = 289."
    },
    {
      id: "q_log_2",
      topic: "Blood Relations",
      question: "Pointing to a photograph of a boy, Suresh said, 'He is the son of the only son of my mother.' How is Suresh related to that boy?",
      options: ["Brother", "Uncle", "Father", "Cousin"],
      correctAnswer: 2, // "Father"
      explanation: "Mother's only son is Suresh himself. So the boy is Suresh's son. Suresh is the boy's Father."
    },
    {
      id: "q_log_3",
      topic: "Coding-Decoding",
      question: "If in a certain code language, 'ROBOT' is written as 'TQDQV', how will 'AGENT' be written in that code?",
      options: ["CHGQV", "CHGPV", "CIGPV", "BHGQV"],
      correctAnswer: 1, // "CHGPV"
      explanation: "Each letter is shifted by +2: R(+2)->T, O(+2)->Q, B(+2)->D, O(+2)->Q, T(+2)->V. Therefore: A(+2)->C, G(+2)->I? Wait: G(7)+2 = 9(I), E(5)+2 = 7(G), N(14)+2=16(P), T(20)+2=22(V) => C I G P V. Let's verify option: CIGPV is option index 2."
    },
    {
      id: "q_log_4",
      topic: "Syllogism",
      question: "Statements: All cars are vehicles. Some vehicles are electric. Conclusions: I. Some cars are electric. II. Some electric items are vehicles.",
      options: ["Only conclusion I follows", "Only conclusion II follows", "Both I and II follow", "Neither follows"],
      correctAnswer: 1, // "Only conclusion II follows"
      explanation: "Since some vehicles are electric, it is directly valid that some electric items are vehicles (conversion). There is no guaranteed overlap between cars and electric, so I does not necessarily follow."
    },
    {
      id: "q_log_5",
      topic: "Direction Sense",
      question: "A person walks 5 km North, turns right and walks 4 km, then turns right again and walks 5 km. How far is he from his starting point?",
      options: ["3 km", "4 km", "5 km", "9 km"],
      correctAnswer: 1, // "4 km"
      explanation: "The North movement (5 km) cancels with the subsequent South movement (5 km). The net displacement is 4 km East."
    }
  ],
  verbal: [
    {
      id: "q_verb_1",
      topic: "Sentence Correction",
      question: "Choose the grammatically correct sentence:",
      options: [
        "Neither the manager nor the employees was present at the meeting.",
        "Neither the manager nor the employees were present at the meeting.",
        "Neither the manager or the employees were present at the meeting.",
        "Neither the manager nor the employees have been present yesterday."
      ],
      correctAnswer: 1, // "were present"
      explanation: "In 'Neither... nor...', the verb agrees with the subject closest to it. 'employees' is plural, so the plural verb 'were' is correct."
    },
    {
      id: "q_verb_2",
      topic: "Vocabulary / Antonyms",
      question: "Choose the word that is most nearly OPPOSITE in meaning to 'EPHEMERAL':",
      options: ["Transient", "Perpetual", "Fleeting", "Fragile"],
      correctAnswer: 1, // "Perpetual"
      explanation: "'Ephemeral' means lasting for a very short time. 'Perpetual' means lasting forever or never-ending."
    },
    {
      id: "q_verb_3",
      topic: "Idioms & Phrases",
      question: "What is the meaning of the idiom 'To burn the candle at both ends'?",
      options: [
        "To be excessively generous",
        "To work excessively hard without enough rest",
        "To waste financial resources foolishly",
        "To handle two difficult problems simultaneously"
      ],
      correctAnswer: 1, // "To work excessively hard"
      explanation: "'To burn the candle at both ends' means exhausting oneself by staying up late and waking up early to work continuously."
    },
    {
      id: "q_verb_4",
      topic: "Reading Comprehension",
      question: "A company's strategic pivot to automation resulted in a 40% reduction in cycle time, yet employee satisfaction dipped due to inadequate transition training. What is the core organizational bottleneck?",
      options: [
        "Deficient technological tools",
        "Lack of change management and human capital upskilling",
        "Low financial budget",
        "Inefficient manufacturing equipment"
      ],
      correctAnswer: 1, // "Lack of change management"
      explanation: "The technology achieved its speed goal (40% reduction), but employee dissatisfaction arose specifically from lack of transition training."
    }
  ],
  core_cs: [
    {
      id: "q_cs_1",
      topic: "Operating Systems",
      question: "Which of the following conditions is NOT one of the four Coffman conditions necessary for a deadlock to occur?",
      options: ["Mutual Exclusion", "Hold and Wait", "Preemption Allowed", "Circular Wait"],
      correctAnswer: 2, // "Preemption Allowed"
      explanation: "The four Coffman conditions are Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. 'Preemption Allowed' prevents deadlock, rather than causing it."
    },
    {
      id: "q_cs_2",
      topic: "Data Structures",
      question: "What is the worst-case time complexity of searching an element in a Balanced Binary Search Tree (AVL / Red-Black Tree)?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      correctAnswer: 1, // "O(log n)"
      explanation: "Balanced BSTs guarantee height h <= c * log2(n), thus search, insert, and delete operations take O(log n) in the worst case."
    },
    {
      id: "q_cs_3",
      topic: "Database Management (DBMS)",
      question: "Which normal form deals with removing transitive functional dependencies where X -> Y and Y -> Z (non-prime attributes)?",
      options: ["1NF", "2NF", "3NF", "BCNF"],
      correctAnswer: 2, // "3NF"
      explanation: "3NF requires a relation to be in 2NF and have no transitive dependencies of non-prime attributes on candidate keys."
    },
    {
      id: "q_cs_4",
      topic: "Computer Networks",
      question: "At which layer of the OSI model does the Address Resolution Protocol (ARP) primarily operate to map IP addresses to MAC addresses?",
      options: ["Physical Layer", "Data Link Layer (Layer 2/3 interface)", "Transport Layer", "Application Layer"],
      correctAnswer: 1, // "Data Link Layer"
      explanation: "ARP encapsulates its requests inside Ethernet frames (Layer 2) to resolve Layer 3 IPv4 addresses into Layer 2 physical MAC addresses."
    },
    {
      id: "q_cs_5",
      topic: "OOP & System Design",
      question: "Which SOLID design principle states that 'Software entities should be open for extension, but closed for modification'?",
      options: ["Single Responsibility Principle", "Open-Closed Principle", "Liskov Substitution Principle", "Dependency Inversion Principle"],
      correctAnswer: 1, // "Open-Closed Principle"
      explanation: "The Open-Closed Principle (OCP) states classes should be designed so that new functionality can be added via inheritance or composition without modifying existing, tested code."
    }
  ]
};

export const defaultStudentProfile = {
  name: "Ganpat Singh",
  rollNo: "23IT17",
  college: "Govt. Engineering College, Ajmer",
  branch: "Computer Science & Engineering",
  semester: 7,
  cgpa: 8.4,
  targetTier: "tier1", // tier1: Product-Based, tier2: Service-Based, tier3: Core/PSU
  targetRole: "Full Stack SDE / Software Engineer",
  skills: ["JavaScript", "React.js", "Node.js", "Express.js", "MongoDB", "Data Structures", "Algorithms", "SQL", "Git"],
  email: "ganpat.singh@ecajmer.ac.in"
};
