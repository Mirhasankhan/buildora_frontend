"use client";
import { useAllProjectsQuery } from "@/redux/features/project/project.api";
import Container from "@/utils/Container";
import React from "react";
import Image from "next/image";
import { MapPin, Users, Briefcase } from "lucide-react";
import Link from "next/link";

const ProjectsPage = () => {
  const { data: projects, isLoading } = useAllProjectsQuery("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ongoing":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Loading projects...</p>
          </div>
        </div>
      </Container>
    );
  }

  const projectList = projects?.result || [];

  return (
    <Container>
      <div className="py-8">
        <div className="flex justify-between items-center mb-8">
          <header>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-2">
              Manage and view all your construction projects
            </p>
          </header>
          <Link href="/create-project"><button className="bg-primary px-6 py-2 rounded-[6px] text-white font-medium">Create New Project</button></Link>
        </div>

        {projectList.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No projects found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectList.map((project: any) => (
              <div
                key={project.id}
                className="bg-white rounded-[12px] overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100"
              >
                {/* Project Image */}
                <div className="relative h-80 w-full overflow-hidden bg-gray-200">
                  <Image
                    src={project.projectImage}
                    alt={project.projectName}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Project Content */}
                <div className="p-5">
                  {/* Header with Status */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 flex-1 pr-2">
                      {project.projectName}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(project.status)}`}
                    >
                      {project.status}
                    </span>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-2 mb-4">
                    <MapPin
                      size={18}
                      className="text-gray-500 flex-shrink-0 mt-0.5"
                    />
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {project.address}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200 my-4"></div>

                  {/* Footer: Manager and Workers */}
                  <div className="space-y-3">
                    {/* Manager */}
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary text-white text-[10px] font-semibold flex items-center justify-center flex-shrink-0">
                        {project.manager.userName
                          ?.split(" ")
                          .map((part: string) => part[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500">Manager</p>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {project.manager.userName}
                        </p>
                      </div>
                    </div>

                    {/* Workers */}
                    <div className="flex items-center gap-2">
                      <Users
                        size={18}
                        className="text-gray-500 flex-shrink-0"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {project._count.workerProfiles} Worker
                          {project._count.workerProfiles !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="w-full mt-4 px-4 py-2 bg-primary text-white rounded-[6px] font-medium text-sm hover:opacity-90 transition-opacity">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default ProjectsPage;
