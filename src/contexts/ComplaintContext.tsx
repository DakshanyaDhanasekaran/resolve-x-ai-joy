import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Complaint {
  id: string;
  title: string;
  description: string;
  location: string;
  status: "Pending" | "In Progress" | "Resolved" | "Rejected";
  priority: "Low" | "Medium" | "High";
  userEmail: string;
  createdAt: string;
  updatedAt: string;
}

interface ComplaintContextType {
  complaints: Complaint[];
  addComplaint: (c: Omit<Complaint, "id" | "status" | "priority" | "createdAt" | "updatedAt">) => string;
  updateStatus: (id: string, status: Complaint["status"]) => void;
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

export const useComplaints = () => {
  const ctx = useContext(ComplaintContext);
  if (!ctx) throw new Error("useComplaints must be used within ComplaintProvider");
  return ctx;
};

const STORAGE_KEY = "resolve-x-complaints";

const seedComplaints: Complaint[] = [
  {
    id: "RX-1001",
    title: "Street light not working",
    description: "The street light near park entrance has been out for 2 weeks.",
    location: "Main Street, Block A",
    status: "Pending",
    priority: "High",
    userEmail: "john@example.com",
    createdAt: "2026-03-20T10:00:00Z",
    updatedAt: "2026-03-20T10:00:00Z",
  },
  {
    id: "RX-1002",
    title: "Water supply disruption",
    description: "No water supply since morning in our building.",
    location: "Green Avenue, Sector 5",
    status: "In Progress",
    priority: "High",
    userEmail: "jane@example.com",
    createdAt: "2026-03-21T08:30:00Z",
    updatedAt: "2026-03-22T14:00:00Z",
  },
  {
    id: "RX-1003",
    title: "Garbage not collected",
    description: "Garbage has not been collected for 3 days in our area.",
    location: "Oak Road, Zone 2",
    status: "Resolved",
    priority: "Medium",
    userEmail: "alice@example.com",
    createdAt: "2026-03-18T09:00:00Z",
    updatedAt: "2026-03-23T16:00:00Z",
  },
  {
    id: "RX-1004",
    title: "Pothole on highway",
    description: "Large pothole causing accidents near the junction.",
    location: "Highway 7, KM 12",
    status: "Pending",
    priority: "High",
    userEmail: "bob@example.com",
    createdAt: "2026-03-24T11:00:00Z",
    updatedAt: "2026-03-24T11:00:00Z",
  },
  {
    id: "RX-1005",
    title: "Noisy construction at night",
    description: "Construction work continues past 10 PM disturbing residents.",
    location: "Elm Street, Block C",
    status: "Pending",
    priority: "Low",
    userEmail: "user@example.com",
    createdAt: "2026-03-25T22:00:00Z",
    updatedAt: "2026-03-25T22:00:00Z",
  },
];

export const ComplaintProvider = ({ children }: { children: ReactNode }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setComplaints(JSON.parse(stored));
    } else {
      setComplaints(seedComplaints);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedComplaints));
    }
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
    <ComplaintContext.Provider value={{ complaints, addComplaint, updateStatus }}>
      {children}
    </ComplaintContext.Provider>
  );
};
