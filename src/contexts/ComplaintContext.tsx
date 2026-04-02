import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ComplaintCategory = "Maintenance" | "Electrical" | "Plumbing" | "Sanitation" | "Roads" | "Noise" | "Others";

export const CATEGORIES: ComplaintCategory[] = ["Maintenance", "Electrical", "Plumbing", "Sanitation", "Roads", "Noise", "Others"];

export interface Complaint {
  id: string;
  title: string;
  description: string;
  location: string;
  category: ComplaintCategory;
  status: "Pending" | "In Progress" | "Resolved" | "Rejected";
  priority: "Low" | "Medium" | "High";
  userEmail: string;
  createdAt: string;
  updatedAt: string;
  image?: string;
  statusHistory?: { status: string; timestamp: string }[];
}

interface ComplaintContextType {
  complaints: Complaint[];
  addComplaint: (c: Omit<Complaint, "id" | "status" | "priority" | "createdAt" | "updatedAt">) => string;
  updateStatus: (id: string, status: Complaint["status"]) => void;
  isLoading: boolean;
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

export const useComplaints = () => {
  const ctx = useContext(ComplaintContext);
  if (!ctx) throw new Error("useComplaints must be used within ComplaintProvider");
  return ctx;
};

const STORAGE_KEY = "resolve-x-complaints-v2";

const seedComplaints: Complaint[] = [
  {
    id: "RX-1001", title: "Street light not working",
    description: "The street light near park entrance has been out for 2 weeks.",
    location: "Main Street, Block A", category: "Electrical",
    status: "Pending", priority: "High", userEmail: "john@example.com",
    createdAt: "2026-03-10T10:00:00Z", updatedAt: "2026-03-10T10:00:00Z",
  },
  {
    id: "RX-1002", title: "Water supply disruption",
    description: "No water supply since morning in our building.",
    location: "Green Avenue, Sector 5", category: "Plumbing",
    status: "In Progress", priority: "High", userEmail: "jane@example.com",
    createdAt: "2026-03-12T08:30:00Z", updatedAt: "2026-03-14T14:00:00Z",
  },
  {
    id: "RX-1003", title: "Garbage not collected",
    description: "Garbage has not been collected for 3 days in our area.",
    location: "Oak Road, Zone 2", category: "Sanitation",
    status: "Resolved", priority: "Medium", userEmail: "alice@example.com",
    createdAt: "2026-03-08T09:00:00Z", updatedAt: "2026-03-15T16:00:00Z",
  },
  {
    id: "RX-1004", title: "Pothole on highway",
    description: "Large pothole causing accidents near the junction.",
    location: "Highway 7, KM 12", category: "Roads",
    status: "Pending", priority: "High", userEmail: "bob@example.com",
    createdAt: "2026-03-18T11:00:00Z", updatedAt: "2026-03-18T11:00:00Z",
  },
  {
    id: "RX-1005", title: "Noisy construction at night",
    description: "Construction work continues past 10 PM disturbing residents.",
    location: "Elm Street, Block C", category: "Noise",
    status: "Pending", priority: "Low", userEmail: "user@example.com",
    createdAt: "2026-03-20T22:00:00Z", updatedAt: "2026-03-20T22:00:00Z",
  },
  {
    id: "RX-1006", title: "Broken elevator",
    description: "Elevator in building B has been non-functional for a week.",
    location: "Tower B, Floor 1", category: "Maintenance",
    status: "In Progress", priority: "High", userEmail: "john@example.com",
    createdAt: "2026-03-14T07:00:00Z", updatedAt: "2026-03-16T09:00:00Z",
  },
  {
    id: "RX-1007", title: "Leaking roof in community hall",
    description: "Water leaking through ceiling during rain.",
    location: "Community Hall, Sector 3", category: "Maintenance",
    status: "Resolved", priority: "Medium", userEmail: "alice@example.com",
    createdAt: "2026-03-05T14:00:00Z", updatedAt: "2026-03-12T11:00:00Z",
  },
  {
    id: "RX-1008", title: "Power outage in Block D",
    description: "Frequent power cuts in the evening hours affecting residents.",
    location: "Block D, Phase 2", category: "Electrical",
    status: "Pending", priority: "High", userEmail: "jane@example.com",
    createdAt: "2026-03-22T18:00:00Z", updatedAt: "2026-03-22T18:00:00Z",
  },
  {
    id: "RX-1009", title: "Overflowing drain",
    description: "Storm drain overflowing onto the sidewalk causing hazard.",
    location: "Pine Avenue, Gate 2", category: "Plumbing",
    status: "Resolved", priority: "Medium", userEmail: "bob@example.com",
    createdAt: "2026-03-03T10:00:00Z", updatedAt: "2026-03-09T15:00:00Z",
  },
  {
    id: "RX-1010", title: "Park bench vandalized",
    description: "Multiple benches in central park have been damaged.",
    location: "Central Park, Zone 1", category: "Others",
    status: "Pending", priority: "Low", userEmail: "user@example.com",
    createdAt: "2026-03-24T09:00:00Z", updatedAt: "2026-03-24T09:00:00Z",
  },
  {
    id: "RX-1011", title: "Clogged sewer line",
    description: "Sewer backup in residential area causing foul smell.",
    location: "Maple Street, Block F", category: "Sanitation",
    status: "In Progress", priority: "High", userEmail: "alice@example.com",
    createdAt: "2026-03-16T06:30:00Z", updatedAt: "2026-03-19T10:00:00Z",
  },
  {
    id: "RX-1012", title: "Speed breaker too high",
    description: "New speed breaker on Ring Road is damaging vehicles.",
    location: "Ring Road, KM 5", category: "Roads",
    status: "Pending", priority: "Medium", userEmail: "john@example.com",
    createdAt: "2026-03-25T12:00:00Z", updatedAt: "2026-03-25T12:00:00Z",
  },
];

export const ComplaintProvider = ({ children }: { children: ReactNode }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setComplaints(JSON.parse(stored));
      } else {
        setComplaints(seedComplaints);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seedComplaints));
      }
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const save = (data: Complaint[]) => {
    setComplaints(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const addComplaint = (c: Omit<Complaint, "id" | "status" | "priority" | "createdAt" | "updatedAt">) => {
    const id = `RX-${1000 + complaints.length + 1}`;
    const now = new Date().toISOString();
    const newComplaint: Complaint = {
      ...c,
      id,
      status: "Pending",
      priority: "Medium",
      createdAt: now,
      updatedAt: now,
    };
    save([newComplaint, ...complaints]);
    return id;
  };

  const updateStatus = (id: string, status: Complaint["status"]) => {
    const updated = complaints.map((c) =>
      c.id === id ? { ...c, status, updatedAt: new Date().toISOString() } : c
    );
    save(updated);
  };

  return (
    <ComplaintContext.Provider value={{ complaints, addComplaint, updateStatus, isLoading }}>
      {children}
    </ComplaintContext.Provider>
  );
};
