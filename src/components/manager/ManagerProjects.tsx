"use client";

import Container from "@/utils/Container";
import { useManagerProjectsQuery } from "@/redux/features/project/project.api";
import Image from "next/image";
import { BriefcaseBusiness, CalendarDays, MapPin, Users } from "lucide-react";
import Link from "next/link";

const getTotalCost = (payments: any[] = []) => {
  return payments.reduce(
    (sum, payment) => sum + Number(payment?.amount || 0),
    0,
  );
};

const formatCurrency = (amount: number) => {
  return `$${amount.toLocaleString()}`;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getRemainingPaymentDays = (lastPayDate: string) => {
  const lastDate = new Date(lastPayDate);

  if (Number.isNaN(lastDate.getTime())) return 0;

  const now = new Date();

  // Payment day is counted only after today's 6:00 PM.
  const effectiveDate = new Date(now);
  if (now.getHours() < 18) {
    effectiveDate.setDate(effectiveDate.getDate() - 1);
  }

  const lastDay = new Date(
    lastDate.getFullYear(),
    lastDate.getMonth(),
    lastDate.getDate(),
  );
  const effectiveDay = new Date(
    effectiveDate.getFullYear(),
    effectiveDate.getMonth(),
    effectiveDate.getDate(),
  );

  const msPerDay = 24 * 60 * 60 * 1000;
  const diff = Math.floor(
    (effectiveDay.getTime() - lastDay.getTime()) / msPerDay,
  );

  return Math.max(diff, 0);
};

const ManagerProjects = () => {
  const { data, isLoading, isError } = useManagerProjectsQuery("");
  const projects = data?.result || [];

  if (isLoading) {
    return (
      <Container>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-3 text-sm text-gray-600">Loading projects...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container>
        <div className="py-16 text-center">
          <h3 className="text-xl font-semibold text-red-600">
            Unable to load projects
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Please try again in a moment.
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <section className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
          <p className="text-gray-600 mt-1">
            Overview of project status, cost, workers, and pending payment days.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-[12px] border border-dashed border-gray-300 py-16 text-center text-gray-600">
            No projects found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project: any) => {
              const totalCost = getTotalCost(project?.payments || []);
              const totalWorkers = project?._count?.workerProfiles || 0;
              const remainingDays = getRemainingPaymentDays(
                project?.last_Pay_Date,
              );
              const remainingPaymentText =
                totalWorkers === 0
                  ? "No worker to pay. Add worker"
                  : `${remainingDays} day${remainingDays !== 1 ? "s" : ""}`;

              return (
                <article
                  key={project.id}
                  className="rounded-[14px] border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="relative h-52 w-full bg-gray-100">
                    <Image
                      src={project.projectImage}
                      alt={project.projectName || "Project image"}
                      fill
                      className="object-cover"
                    />
                    <span className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-700">
                      {project.status || "Unknown"}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {project.projectName || "Unnamed Project"}
                    </h3>

                    <div className="mt-3 space-y-2 text-sm text-gray-700">
                      <div className="flex items-start gap-2">
                        <MapPin size={16} className="text-gray-500 mt-0.5" />
                        <span className="line-clamp-2">
                          {project.address || "No address available"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarDays size={16} className="text-gray-500" />
                        <span>
                          Last pay date: {formatDate(project.last_Pay_Date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-gray-500" />
                        <span>Total workers: {totalWorkers}</span>
                      </div>
                    </div>

                    <div className="my-4 border-t border-gray-200"></div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-[10px] bg-gray-50 p-3">
                        <p className="text-gray-500 text-xs">Total Cost</p>
                        <p className="mt-1 font-semibold text-gray-900">
                          {formatCurrency(totalCost)}
                        </p>
                      </div>
                      <div className="rounded-[10px] bg-amber-50 p-3">
                        <p className="text-amber-700 text-xs">
                          Remaining Payment
                        </p>
                        <p className="mt-1 font-semibold text-amber-900">
                          {remainingPaymentText}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 rounded-[10px] bg-blue-50 p-3 text-sm text-blue-800 flex items-center gap-2">
                      <BriefcaseBusiness size={16} />
                      <span>
                        Payment entries:{" "}
                        <span className="font-semibold">
                          {project?.payments?.length || 0}
                        </span>
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <Link href={`/projects/${project.id}`}>
                        <button
                          type="button"
                          className="w-full rounded-[8px] border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          View Details
                        </button>
                      </Link>
                      <Link
                        href={`/messages?tab=group&projectId=${project.id}`}
                      >
                        <button
                          type="button"
                          className="w-full rounded-[8px] border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Message
                        </button>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </Container>
  );
};

export default ManagerProjects;
