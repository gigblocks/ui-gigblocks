"use client"

import React, { useState } from 'react';
import { MapPin, Clock, FileText, Pencil, Trash, Users, MessageSquare, Check, RefreshCw, Edit, Trash2, ChevronLeft, ChevronRight, UserCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const tabs = [
  "Open Projects",
  "Ongoing Projects",
  "Completed Projects",
  "Approved Projects"
];

const projectData = {
  "Open Projects": [
    {
      title: "Food Delivery Mobile App",
      company: "TechCorp",
      applications: "3+ Applied",
      createdExpired: "June 15, 2023 / August 30, 2023",
      status: "Active",
      color: "bg-green-500",
    },
    {
      title: "E-commerce Website Redesign",
      company: "WebSolutions",
      applications: "5+ Applied",
      createdExpired: "July 1, 2023 / September 15, 2023",
      status: "Active",
      color: "bg-blue-500",
    }
  ],
  "Ongoing Projects": [
    {
      title: "Mobile Game Development",
      location: "Tokyo, Japan",
      time: "1 week ago",
      receivedOffers: 2,
      category: "Game Development",
      cost: "$5000.00/Fixed"
    }
  ],
  "Completed Projects": [
    {
      title: "Logo Design",
      location: "Berlin, Germany",
      time: "2 months ago",
      receivedOffers: 7,
      category: "Graphic Design",
      cost: "$300.00/Fixed"
    }
  ],
  "Approved Projects": [
    {
      title: "AI Chatbot Integration",
      location: "San Francisco, USA",
      time: "4 weeks ago",
      receivedOffers: 0,
      category: "Artificial Intelligence",
      cost: "$100.00/Hour"
    }
  ]
};

const getStatusStyle = (status: string): string => {
  const baseStyle = "px-2 py-1 text-xs font-medium rounded-full inline-block text-center";
  return `${baseStyle} bg-blue-100 text-blue-600`;
};

const getApplicationsStyle = (count: string): string => {
  const baseStyle = "px-2 py-1 text-xs font-medium rounded-full inline-block text-center";
  return `${baseStyle} bg-gray-100 text-gray-600`;
};

const IconPlaceholder: React.FC<{ color: string }> = ({ color }) => (
  <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-white font-bold text-xl`}>
    {color.charAt(0).toUpperCase()}
  </div>
);

const ApplicantsModal = ({ projectTitle }: { projectTitle: string }) => {
  const applicants = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com" },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="mr-2">
          <Users className="mr-2 h-4 w-4" />
          Applicants
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Applicants for {projectTitle}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {applicants.map((applicant) => (
            <div key={applicant.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{applicant.name}</p>
                <p className="text-sm text-gray-500">{applicant.email}</p>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  <UserCheck className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function ManageProjectSection() {
  const [activeTab, setActiveTab] = useState("Open Projects");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const renderActionButtons = (tab: string, project: any) => {
    switch (tab) {
      case "Open Projects":
        return (
          <div className="flex space-x-2">
            <ApplicantsModal projectTitle={project.title} />
            <button className="text-blue-600 hover:text-blue-900">
              <Edit size={18} />
            </button>
            <button className="text-red-600 hover:text-red-900">
              <Trash2 size={18} />
            </button>
          </div>
        );
      case "Ongoing Projects":
        return (
          <Button variant="outline" size="sm">
            <MessageSquare size={14} className="text-blue-600" />
          </Button>
        );
      case "Completed Projects":
        return (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Check size={14} className="text-green-600" />
              Approve
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw size={14} className="text-orange-600" />
              Revision
            </Button>
          </div>
        );
      case "Approved Projects":
        return null;
      default:
        return null;
    }
  };

  const paginatedProjects = projectData[activeTab as keyof typeof projectData].slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(projectData[activeTab as keyof typeof projectData].length / itemsPerPage);

  const Pagination = () => (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, projectData[activeTab as keyof typeof projectData].length)} of {projectData[activeTab as keyof typeof projectData].length} results
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                  page === currentPage
                    ? "z-10 bg-green-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                    : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );

  return (
    <section className="p-3">
      <div className="mb-6">
        <nav className="flex space-x-1 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-3 bg-gray-50">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {activeTab === "Open Projects" ? "Applications" : "Location"}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {activeTab === "Open Projects" ? "Created & Expired" : "Time"}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {activeTab === "Open Projects" ? "Status" : "Category"}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedProjects.map((project, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <IconPlaceholder color={('color' in project ? project.color : "bg-gray-500")} />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{project.title}</div>
                      <div className="text-sm text-gray-500">
                        {'company' in project ? project.company : project.cost}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {activeTab === "Open Projects" ? (
                    <span className={getApplicationsStyle('applications' in project ? project.applications : '')}>
                      {'applications' in project ? project.applications : ''}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500">
                      {'location' in project ? project.location : ''}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {'createdExpired' in project ? project.createdExpired : project.time}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {activeTab === "Open Projects" ? (
                    <span className={getStatusStyle('status' in project ? project.status : '')}>
                      {'status' in project ? project.status : ''}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500">
                      {'category' in project ? project.category : ''}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {renderActionButtons(activeTab, project)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination />
      </div>
    </section>
  );
}