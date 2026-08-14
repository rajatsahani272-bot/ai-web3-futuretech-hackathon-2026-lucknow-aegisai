export const complaintsData = [
  { id: "CMP-1024", title: "Pothole on Main Street", category: "Roads & Footpaths", location: "Hazratganj", status: "Resolved", date: "16 May 2025", severity: "High" },
  { id: "CMP-1023", title: "Garbage not collected", category: "Waste Management", location: "Gomti Nagar", status: "In Progress", date: "16 May 2025", severity: "Medium" },
  { id: "CMP-1022", title: "Water leakage in Sector 5", category: "Water Supply", location: "Indira Nagar", status: "Pending", date: "15 May 2025", severity: "High" },
  { id: "CMP-1021", title: "Broken street light", category: "Street Lighting", location: "Aliganj", status: "Resolved", date: "15 May 2025", severity: "Low" },
  { id: "CMP-1020", title: "Traffic signal not working", category: "Traffic", location: "Lucknow University", status: "In Progress", date: "14 May 2025", severity: "High" },
  { id: "CMP-1019", title: "Open drain near market", category: "Sanitation", location: "Alambagh", status: "Pending", date: "14 May 2025", severity: "Medium" }
];

export const navItems = [
  { name: "Dashboard", icon: "▦" },
  { 
    name: "Complaints", 
    icon: "⚙", 
    subItems: [
      { name: "All Complaints", page: "Complaints" },
      { name: "Complaint Details", page: "Complaint Details" }
    ]
  },
  { name: "City Map", icon: "⌖" },
  { name: "Profile", icon: "◯" },
];