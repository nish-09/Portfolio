"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./LeetCodeDossier.css";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface ProblemSolution {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  description: string;
  language: string;
  code: string;
}

// ─── Featured Solutions Data ───────────────────────────────────────────────────
const SOLUTIONS: ProblemSolution[] = [
  {
    title: "146. LRU Cache",
    difficulty: "Medium",
    topic: "Design, Doubly-Linked List, Hash Map",
    description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implemented using a Map for O(1) lookup and a doubly-linked list for O(1) update of the node order.",
    language: "TypeScript",
    code: `class LRUNode {
  key: number;
  val: number;
  prev: LRUNode | null = null;
  next: LRUNode | null = null;
  constructor(key: number, val: number) {
    this.key = key;
    this.val = val;
  }
}

class LRUCache {
  private capacity: number;
  private cache = new Map<number, LRUNode>();
  private head: LRUNode;
  private tail: LRUNode;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.head = new LRUNode(0, 0);
    this.tail = new LRUNode(0, 0);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key: number): number {
    if (!this.cache.has(key)) return -1;
    const node = this.cache.get(key)!;
    this.moveToHead(node);
    return node.val;
  }

  put(key: number, value: number): void {
    if (this.cache.has(key)) {
      const node = this.cache.get(key)!;
      node.val = value;
      this.moveToHead(node);
    } else {
      if (this.cache.size >= this.capacity) {
        const lru = this.tail.prev!;
        this.removeNode(lru);
        this.cache.delete(lru.key);
      }
      const newNode = new LRUNode(key, value);
      this.cache.set(key, newNode);
      this.addNode(newNode);
    }
  }

  private addNode(node: LRUNode) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next!.prev = node;
    this.head.next = node;
  }

  private removeNode(node: LRUNode) {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
  }

  private moveToHead(node: LRUNode) {
    this.removeNode(node);
    this.addNode(node);
  }
}`
  },
  {
    title: "4. Median of Two Sorted Arrays",
    difficulty: "Hard",
    topic: "Array, Binary Search, Divide and Conquer",
    description: "Find the median of two sorted arrays of size m and n in O(log (m+n)) time complexity. Solved using binary search to partition both arrays such that the left half has the same number of elements as the right half.",
    language: "C++",
    code: `double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
    if (nums1.size() > nums2.size()) {
        return findMedianSortedArrays(nums2, nums1);
    }
    
    int m = nums1.size();
    int n = nums2.size();
    int left = 0, right = m;
    
    while (left <= right) {
        int partitionX = (left + right) / 2;
        int partitionY = (m + n + 1) / 2 - partitionX;
        
        int maxLeftX = (partitionX == 0) ? INT_MIN : nums1[partitionX - 1];
        int minRightX = (partitionX == m) ? INT_MAX : nums1[partitionX];
        
        int maxLeftY = (partitionY == 0) ? INT_MIN : nums2[partitionY - 1];
        int minRightY = (partitionY == n) ? INT_MAX : nums2[partitionY];
        
        if (maxLeftX <= minRightY && maxLeftY <= minRightX) {
            if ((m + n) % 2 == 0) {
                return (double)(max(maxLeftX, maxLeftY) + min(minRightX, minRightY)) / 2;
            } else {
                return (double)max(maxLeftX, maxLeftY);
            }
        } else if (maxLeftX > minRightY) {
            right = partitionX - 1;
        } else {
            left = partitionX + 1;
        }
    }
    return 0.0;
}`
  },
  {
    title: "23. Merge k Sorted Lists",
    difficulty: "Hard",
    topic: "Linked List, Divide & Conquer, Heap (Priority Queue)",
    description: "Merge k sorted linked lists and return it as one sorted list. Implemented efficiently using a Min-Heap (priority queue) to retrieve the smallest node among the heads of all k lists in O(log k) time.",
    language: "TypeScript",
    code: `class ListNode {
  val: number;
  next: ListNode | null = null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = (val===undefined ? 0 : val);
    this.next = (next===undefined ? null : next);
  }
}

class MinHeap {
  private data: ListNode[] = [];
  
  insert(node: ListNode) {
    this.data.push(node);
    this.upHeap(this.data.length - 1);
  }
  
  extractMin(): ListNode | null {
    if (this.data.length === 0) return null;
    const min = this.data[0];
    const end = this.data.pop()!;
    if (this.data.length > 0) {
      this.data[0] = end;
      this.downHeap(0);
    }
    return min;
  }
  
  size() { return this.data.length; }

  private upHeap(i: number) {
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (this.data[i].val >= this.data[p].val) break;
      this.swap(i, p);
      i = p;
    }
  }

  private downHeap(i: number) {
    const len = this.data.length;
    while (2 * i + 1 < len) {
      let child = 2 * i + 1;
      if (child + 1 < len && this.data[child + 1].val < this.data[child].val) {
        child++;
      }
      if (this.data[i].val <= this.data[child].val) break;
      this.swap(i, child);
      i = child;
    }
  }

  private swap(i: number, j: number) {
    const temp = this.data[i];
    this.data[i] = this.data[j];
    this.data[j] = temp;
  }
}

function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
  const heap = new MinHeap();
  for (const list of lists) {
    if (list) heap.insert(list);
  }
  
  const dummy = new ListNode(0);
  let curr = dummy;
  
  while (heap.size() > 0) {
    const node = heap.extractMin()!;
    curr.next = node;
    curr = curr.next;
    if (node.next) {
      heap.insert(node.next);
    }
  }
  
  return dummy.next;
}`
  }
];

export default function LeetCodeDossier() {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  
  const totalSolved = 547;
  const totalProblems = 3200;
  const easySolved = 180;
  const easyTotal = 800;
  const mediumSolved = 312;
  const mediumTotal = 1600;
  const hardSolved = 55;
  const hardTotal = 800;

  const solvePercentage = Math.round((totalSolved / totalProblems) * 100);
  
  // Calculate SVG circles
  const radius = 64;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (solvePercentage / 100) * circumference;

  const handleCopy = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto pt-16 sm:pt-20 md:pt-24 border-t border-white/8">
        
        {/* ── Section Heading ── */}
        <div className="text-center mb-10 sm:mb-14">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs sm:text-sm font-mono tracking-[0.2em] sm:tracking-[0.3em] text-white/30 uppercase mb-3"
          >
            Algorithms & Problem Solving
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-7xl xl:text-8xl font-bold tracking-tight text-white"
          >
            LeetCode <span className="text-amber-500">Dossier</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-white/50 mt-3 sm:mt-4 text-sm sm:text-base md:text-lg max-w-xl mx-auto px-2"
          >
            Interactive archive of metrics, contest status, and featured algorithms
          </motion.p>
        </div>

        {/* ── Grid Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          
          {/* Column 1: Progress Metrics */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4 }}
            className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#0d0d14] flex flex-col items-center hover:border-white/20 transition-all duration-300 shadow-xl glow-pulse-orange"
          >
            <h3 className="text-lg font-mono font-bold tracking-wider text-white mb-6 uppercase flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.483 0a1.39 1.39 0 0 0-.961.411l-9.12 9.119a1.37 1.37 0 0 0-.378.951c.002.375.155.73.43.995l9.12 9.123c.273.273.642.413 1.011.413.37 0 .739-.14 1.017-.419l9.12-9.122a1.37 1.37 0 0 0-.01-1.948L15.52.416A1.36 1.36 0 0 0 14.557 0h-1.074zm-2.429 8.443c.466 0 .845.378.845.845 0 .207-.075.405-.213.559l-2.907 3.228 2.903 3.223a.84.84 0 0 1 .217.56c0 .467-.379.846-.845.846-.245 0-.476-.109-.628-.297l-3.237-3.6a.834.834 0 0 1 0-1.116l3.237-3.6c.152-.187.383-.298.628-.298z" />
              </svg>
              Solve Progress
            </h3>

            {/* Circular Progress SVG */}
            <div className="relative w-40 h-40 flex items-center justify-center mb-8">
              <svg className="w-full h-full transform -rotate-90">
                {/* Background Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="rgba(255, 255, 255, 0.04)"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />
                {/* Solved Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="url(#orangeGradient)"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Central Text */}
              <div className="absolute flex flex-col items-center text-center">
                <span className="text-3xl font-mono font-bold text-white leading-none">
                  {totalSolved}
                </span>
                <span className="text-[10px] font-mono tracking-widest text-white/30 uppercase mt-1">
                  Solved / {totalProblems}
                </span>
              </div>
            </div>

            {/* Breakdown Bars */}
            <div className="w-full flex flex-col gap-4 mt-2">
              {/* Easy */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-green-400 font-bold">Easy</span>
                  <span className="text-white/60">{easySolved} <span className="text-white/20">/ {easyTotal}</span></span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${(easySolved / easyTotal) * 100}%` }}
                  />
                </div>
              </div>

              {/* Medium */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-amber-400 font-bold">Medium</span>
                  <span className="text-white/60">{mediumSolved} <span className="text-white/20">/ {mediumTotal}</span></span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${(mediumSolved / mediumTotal) * 100}%` }}
                  />
                </div>
              </div>

              {/* Hard */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-rose-400 font-bold">Hard</span>
                  <span className="text-white/60">{hardSolved} <span className="text-white/20">/ {hardTotal}</span></span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full"
                    style={{ width: `${(hardSolved / hardTotal) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Column 2: Contest Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4 }}
            className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#0d0d14] flex flex-col hover:border-white/20 transition-all duration-300 shadow-xl glow-pulse-orange h-full"
          >
            <h3 className="text-lg font-mono font-bold tracking-wider text-white mb-6 uppercase flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Contest Metrics
            </h3>

            {/* Knight Badge Image/SVG */}
            <div className="flex flex-col items-center py-6 mb-6 rounded-xl border border-amber-500/10 bg-amber-500/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08)_0%,transparent_70%)] pointer-events-none" />
              {/* Custom Knight Badge Graphics */}
              <div className="w-20 h-20 mb-3 text-amber-400 relative flex items-center justify-center animate-pulse">
                <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.6 15L12 15.6 9.6 18l-1.4-1.4 2.4-2.4L9 12.6l1.4-1.4 1.6 1.6L13.6 11l1.4 1.4-1.6 1.6 2.4 2.4-1.4 1.6zM12 9c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
                </svg>
                {/* Floating Glow Dot */}
                <div className="absolute w-2 h-2 rounded-full bg-amber-500 blur-sm top-4" />
              </div>
              <span className="text-xl font-mono font-extrabold text-amber-400 uppercase tracking-widest">
                Knight
              </span>
              <span className="text-[10px] font-mono text-white/40 tracking-wider mt-0.5">
                Active Competitor
              </span>
            </div>

            {/* Contest Stats List */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center py-2.5 border-b border-white/5">
                <span className="text-xs font-mono text-white/55">Contest Rating</span>
                <span className="text-base font-mono font-bold text-white">1,942</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-white/5">
                <span className="text-xs font-mono text-white/55">Percentile Rank</span>
                <span className="text-base font-mono font-bold text-amber-400">Top 3.5%</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-white/5">
                <span className="text-xs font-mono text-white/55">Global Position</span>
                <span className="text-base font-mono font-bold text-white">#12,450</span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="text-xs font-mono text-white/55">Contests Attended</span>
                <span className="text-base font-mono font-bold text-white">42</span>
              </div>
            </div>
          </motion.div>

          {/* Column 3: Featured Solutions Selector */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4 }}
            className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#0d0d14] flex flex-col hover:border-white/20 transition-all duration-300 shadow-xl glow-pulse-orange h-full lg:col-span-1"
          >
            <h3 className="text-lg font-mono font-bold tracking-wider text-white mb-6 uppercase flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Featured Solutions
            </h3>
            
            <p className="text-xs text-white/45 mb-4 leading-relaxed font-mono">
              Select a solution to review implementation architecture:
            </p>

            <div className="flex flex-col gap-3">
              {SOLUTIONS.map((sol, i) => {
                const diffColor =
                  sol.difficulty === "Easy"
                    ? "text-green-400 border-green-500/20 bg-green-500/5"
                    : sol.difficulty === "Medium"
                    ? "text-amber-400 border-amber-500/20 bg-amber-500/5"
                    : "text-rose-400 border-rose-500/20 bg-rose-500/5";

                return (
                  <button
                    key={i}
                    onClick={() => setSelectedIdx(selectedIdx === i ? null : i)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-300 text-left font-mono ${
                      selectedIdx === i
                        ? "border-amber-500/40 bg-amber-500/5 text-amber-400"
                        : "border-white/10 bg-white/5 text-white/80 hover:bg-white/8 hover:border-white/20"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold truncate mb-1">{sol.title}</div>
                      <div className="text-[10px] text-white/40 truncate">{sol.topic}</div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 border rounded-full font-bold ml-2 ${diffColor}`}>
                      {sol.difficulty}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 text-center">
              <a
                href="https://leetcode.com/nish-09"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-white/30 hover:text-amber-400 transition-colors duration-200 uppercase tracking-wider"
              >
                View LeetCode Profile
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </motion.div>
        </div>

        {/* ── Expanded Code Overlay ── */}
        <AnimatePresence>
          {selectedIdx !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full mt-6 rounded-2xl border border-amber-500/20 bg-[#07070b] overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-[#0d0d14]">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-white">
                    {SOLUTIONS[selectedIdx].title}
                  </span>
                  <span className="text-[10px] font-mono text-white/40">
                    ({SOLUTIONS[selectedIdx].language})
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleCopy(SOLUTIONS[selectedIdx].code, selectedIdx)}
                    className="text-[10px] font-mono px-3 py-1 rounded bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-all"
                  >
                    {copiedIdx === selectedIdx ? "Copied!" : "Copy"}
                  </button>
                  <button
                    onClick={() => setSelectedIdx(null)}
                    className="text-white/40 hover:text-white font-mono text-xs"
                    aria-label="Close code window"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-5 font-mono">
                <p className="text-xs text-white/50 leading-relaxed mb-4">
                  {SOLUTIONS[selectedIdx].description}
                </p>
                <pre className="text-xs overflow-x-auto p-4 rounded-xl bg-black/40 border border-white/5 text-amber-100/90 leading-relaxed max-h-[380px]">
                  <code>{SOLUTIONS[selectedIdx].code}</code>
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

    </div>
  );
}
