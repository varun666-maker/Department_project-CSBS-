// ===== CSBS Data Layer =====

const SEED = {
  notices: [
    { id: 1, title: "Mid-Semester Examination Schedule Released", content: "The mid-semester examination for all years will commence from March 15, 2026. Students are advised to collect their hall tickets from the department office.", date: "2026-02-18", category: "urgent", author: "Dr. Ramesh Kumar" },
    { id: 2, title: "Workshop on Cloud Computing", content: "A two-day workshop on AWS Cloud Services will be held on Feb 25-26. Register through the department portal. Limited seats available.", date: "2026-02-15", category: "new", author: "Prof. Anitha S" },
    { id: 3, title: "Hackathon Registration Open", content: "National level hackathon 'CodeStorm 2026' registrations are now open. Team size: 2-4 members. Last date to register: March 1, 2026.", date: "2026-02-12", category: "new", author: "Prof. Karthik M" },
    { id: 4, title: "Library Book Return Reminder", content: "All students are reminded to return borrowed books before the semester end. Penalty of Rs.5/day will be charged for overdue books.", date: "2026-02-10", category: "general", author: "Librarian" },
    { id: 5, title: "Guest Lecture on AI Ethics", content: "Distinguished guest lecture on 'Ethics in Artificial Intelligence' by Dr. Sarah Thompson from MIT. Venue: Seminar Hall, Date: March 5.", date: "2026-02-08", category: "new", author: "Dr. Priya N" },
    { id: 6, title: "Internship Drive by Infosys", content: "Infosys will conduct an internship drive for pre-final year students on March 10. Eligible criteria: 7.0 CGPA and above.", date: "2026-02-05", category: "general", author: "Placement Cell" }
  ],
  events: [
    { id: 1, title: "TechFest 2026", description: "Annual technical festival featuring coding competitions, robotics challenges, paper presentations, and project exhibitions. Over 20 events across 3 days.", date: "2026-03-15", time: "9:00 AM", venue: "Main Campus Auditorium", organizer: "CSBS Department", category: "technical", requiresRegistration: true, entranceFee: 200, qrCodeUrl: "", formFields: [{ label: "Year", type: "select", required: true, options: "1,2,3,4" }, { label: "Branch", type: "text", required: true }] },
    { id: 2, title: "Workshop: Full Stack Development", description: "Hands-on workshop covering React, Node.js, and MongoDB. Build a complete web application from scratch in two days.", date: "2026-03-01", time: "10:00 AM", venue: "Computer Lab 3", organizer: "Prof. Karthik M", category: "workshop", requiresRegistration: true, entranceFee: 0, qrCodeUrl: "", formFields: [{ label: "Year", type: "select", required: true, options: "1,2,3,4" }, { label: "Laptop Available", type: "select", required: true, options: "Yes,No" }] },
    { id: 3, title: "Alumni Meet 2026", description: "Annual alumni gathering to connect current students with successful graduates. Networking sessions, panel discussions, and career guidance.", date: "2026-03-20", time: "11:00 AM", venue: "Seminar Hall", organizer: "Alumni Association", category: "general", requiresRegistration: false, entranceFee: 0, qrCodeUrl: "", formFields: [] },
    { id: 4, title: "Data Science Bootcamp", description: "Intensive 3-day bootcamp on Python for Data Science, Machine Learning fundamentals, and real-world project implementation.", date: "2026-04-05", time: "9:30 AM", venue: "Smart Classroom 1", organizer: "Dr. Priya N", category: "workshop", requiresRegistration: true, entranceFee: 150, qrCodeUrl: "", formFields: [{ label: "Year", type: "select", required: true, options: "2,3,4" }, { label: "Programming Experience", type: "select", required: true, options: "Beginner,Intermediate,Advanced" }] },
    { id: 5, title: "Inter-Department Sports Meet", description: "Annual sports competition featuring cricket, football, basketball, badminton, and athletics. Represent CSBS department!", date: "2026-04-12", time: "8:00 AM", venue: "University Ground", organizer: "Sports Committee", category: "cultural", requiresRegistration: false, entranceFee: 0, qrCodeUrl: "", formFields: [] },
    { id: 6, title: "CodeStorm Hackathon 2026", description: "National level 24-hour hackathon. Build innovative solutions for real-world problems. Team size: 2-4 members. Exciting prizes worth ₹50,000!", date: "2026-04-20", time: "9:00 AM", venue: "Innovation Lab", organizer: "Prof. Karthik M", category: "hackathon", requiresRegistration: true, entranceFee: 300, qrCodeUrl: "", formFields: [{ label: "Team Name", type: "text", required: true }, { label: "Team Size", type: "select", required: true, options: "2,3,4" }, { label: "Team Members (comma separated)", type: "textarea", required: true }, { label: "Year", type: "select", required: true, options: "1,2,3,4" }] }
  ],
  faculty: [
    { id: 1, name: "Dr. Ramesh Kumar", designation: "Professor & HOD", qualification: "Ph.D. in Computer Science, IIT Madras", specialization: "Artificial Intelligence, Machine Learning", experience: "18 years", email: "ramesh.kumar@mitm.edu", phone: "9876543210" },
    { id: 2, name: "Dr. Priya Natarajan", designation: "Associate Professor", qualification: "Ph.D. in Data Science, Anna University", specialization: "Data Analytics, Deep Learning", experience: "14 years", email: "priya.n@mitm.edu", phone: "9876543211" },
    { id: 3, name: "Prof. Karthik Murugan", designation: "Assistant Professor", qualification: "M.Tech in Software Engineering, NIT Trichy", specialization: "Web Technologies, Cloud Computing", experience: "8 years", email: "karthik.m@mitm.edu", phone: "9876543212" },
    { id: 4, name: "Prof. Anitha Subramanian", designation: "Assistant Professor", qualification: "M.Tech in Information Security, VIT", specialization: "Cybersecurity, Networking", experience: "10 years", email: "anitha.s@mitm.edu", phone: "9876543213" },
    { id: 5, name: "Dr. Vijay Shankar", designation: "Associate Professor", qualification: "Ph.D. in IoT Systems, IISc Bangalore", specialization: "Internet of Things, Embedded Systems", experience: "12 years", email: "vijay.s@mitm.edu", phone: "9876543214" },
    { id: 6, name: "Prof. Deepa Lakshmi", designation: "Assistant Professor", qualification: "M.Tech in AI, PSG Tech", specialization: "Natural Language Processing, Computer Vision", experience: "6 years", email: "deepa.l@mitm.edu", phone: "9876543215" }
  ],
  students: [
    { id: 1, name: "Arun Prakash", rollNo: "CSBS2301", year: 1, section: "A", email: "arun.p@student.mitm.edu", cgpa: 8.5 },
    { id: 2, name: "Divya Sharma", rollNo: "CSBS2302", year: 1, section: "A", email: "divya.s@student.mitm.edu", cgpa: 9.1 },
    { id: 3, name: "Kiran Kumar", rollNo: "CSBS2303", year: 1, section: "B", email: "kiran.k@student.mitm.edu", cgpa: 7.8 },
    { id: 4, name: "Meera Rajendran", rollNo: "CSBS2201", year: 2, section: "A", email: "meera.r@student.mitm.edu", cgpa: 8.9 },
    { id: 5, name: "Naveen Balaji", rollNo: "CSBS2202", year: 2, section: "A", email: "naveen.b@student.mitm.edu", cgpa: 8.2 },
    { id: 6, name: "Preethi Ganesh", rollNo: "CSBS2203", year: 2, section: "B", email: "preethi.g@student.mitm.edu", cgpa: 9.3 },
    { id: 7, name: "Rahul Dravid S", rollNo: "CSBS2101", year: 3, section: "A", email: "rahul.d@student.mitm.edu", cgpa: 8.7 },
    { id: 8, name: "Sneha Krishnan", rollNo: "CSBS2102", year: 3, section: "A", email: "sneha.k@student.mitm.edu", cgpa: 9.0 },
    { id: 9, name: "Tamil Selvan", rollNo: "CSBS2103", year: 3, section: "B", email: "tamil.s@student.mitm.edu", cgpa: 7.5 },
    { id: 10, name: "Uma Maheshwari", rollNo: "CSBS2001", year: 4, section: "A", email: "uma.m@student.mitm.edu", cgpa: 9.2 },
    { id: 11, name: "Vikram Sundhar", rollNo: "CSBS2002", year: 4, section: "A", email: "vikram.s@student.mitm.edu", cgpa: 8.4 },
    { id: 12, name: "Yamini Priya", rollNo: "CSBS2003", year: 4, section: "B", email: "yamini.p@student.mitm.edu", cgpa: 8.8 }
  ],
  achievements: [
    { id: 1, title: "Smart India Hackathon Winners", description: "Team 'CodeCrafters' from CSBS won first place at SIH 2025 with their innovative healthcare solution.", person: "Rahul D, Sneha K, Tamil S", type: "student", date: "2025-12-15" },
    { id: 2, title: "Best Research Paper Award", description: "Dr. Priya N received the Best Research Paper Award at the International Conference on Data Science held in Singapore.", person: "Dr. Priya Natarajan", type: "faculty", date: "2025-11-20" },
    { id: 3, title: "Google Summer of Code Selection", description: "Divya Sharma selected for GSoC 2025 to work on open-source machine learning project with TensorFlow.", person: "Divya Sharma", type: "student", date: "2025-05-10" },
    { id: 4, title: "Campus Placement - Amazon", description: "5 students from CSBS placed at Amazon with an average package of 28 LPA during the 2025 placement season.", person: "Uma M, Vikram S, and 3 others", type: "placement", date: "2025-09-25" },
    { id: 5, title: "Patent Filed for IoT Innovation", description: "Dr. Vijay Shankar filed a patent for a novel IoT-based smart agriculture monitoring system.", person: "Dr. Vijay Shankar", type: "faculty", date: "2025-08-14" },
    { id: 6, title: "Campus Placement - TCS Digital", description: "12 students from CSBS secured positions at TCS Digital with packages ranging from 7-9 LPA.", person: "Multiple Students", type: "placement", date: "2025-10-30" },
    { id: 7, title: "ACM ICPC Regional Finalists", description: "CSBS team qualified for ACM ICPC Asia Regional Finals, ranking among top 50 teams in India.", person: "Arun P, Kiran K, Meera R", type: "student", date: "2025-11-05" },
    { id: 8, title: "Best Department Award", description: "CSBS department received the Best Department Award for academic excellence and industry collaboration.", person: "CSBS Department", type: "faculty", date: "2025-07-20" }
  ],
  registrations: []
};

// ===== LocalStorage Helpers =====
function getData(key) {
  const d = localStorage.getItem('csbs_' + key);
  return d ? JSON.parse(d) : null;
}

function setData(key, val) {
  localStorage.setItem('csbs_' + key, JSON.stringify(val));
}

function initData() {
  const keys = ['notices', 'events', 'faculty', 'students', 'achievements', 'registrations'];
  keys.forEach(k => {
    if (!getData(k)) setData(k, SEED[k]);
  });
}

function getNextId(key) {
  const items = getData(key) || [];
  return items.length ? Math.max(...items.map(i => i.id)) + 1 : 1;
}

function addItem(key, item) {
  const items = getData(key) || [];
  item.id = getNextId(key);
  items.unshift(item);
  setData(key, items);
  return item;
}

function updateItem(key, id, updates) {
  let items = getData(key) || [];
  items = items.map(i => i.id === id ? { ...i, ...updates } : i);
  setData(key, items);
}

function deleteItem(key, id) {
  let items = getData(key) || [];
  items = items.filter(i => i.id !== id);
  setData(key, items);
}

function getItemById(key, id) {
  const items = getData(key) || [];
  return items.find(i => i.id === id);
}

// Init on load
initData();
