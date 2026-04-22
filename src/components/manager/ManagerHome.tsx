"use client";

import Container from "@/utils/Container";
import { useManagerProjectsQuery } from "@/redux/features/project/project.api";
import {
  AlertTriangle,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  MessageSquareMore,
  Users,
} from "lucide-react";
import Link from "next/link";

const getRemainingPaymentDays = (lastPayDate: string) => {
  const lastDate = new Date(lastPayDate);

  if (Number.isNaN(lastDate.getTime())) return 0;

  const now = new Date();
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

const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const ManagerHome = () => {
  const { data, isLoading, isError } = useManagerProjectsQuery("");
  const projects = Array.isArray(data?.result) ? data.result : [];

  const totalProjects = projects.length;
  const ongoingProjects = projects.filter(
    (project: any) => String(project?.status ?? "").toLowerCase() === "ongoing",
  ).length;
  const completedProjects = projects.filter(
    (project: any) =>
      String(project?.status ?? "").toLowerCase() === "completed",
  ).length;

  const totalWorkers = projects.reduce(
    (sum: number, project: any) =>
      sum + Number(project?._count?.workerProfiles ?? 0),
    0,
  );

  const projectPaymentStatus = projects.map((project: any) => ({
    id: project?.id,
    name: project?.projectName ?? "Unnamed Project",
    status: project?.status ?? "Unknown",
    lastPayDate: project?.last_Pay_Date,
    workers: Number(project?._count?.workerProfiles ?? 0),
    pendingDays: getRemainingPaymentDays(project?.last_Pay_Date),
  }));

  const paymentAttentionList = [...projectPaymentStatus]
    .filter((project) => project.workers > 0)
    .sort((a, b) => b.pendingDays - a.pendingDays)
    .slice(0, 4);

  const projectsWithPaymentDue = paymentAttentionList.filter(
    (project) => project.pendingDays > 0,
  ).length;

  const quickActions = [
    {
      title: "Open My Projects",
      description: "Review progress, workers, and project-wise workload.",
      href: "/projects",
      icon: BriefcaseBusiness,
    },
    {
      title: "Group Messages",
      description: "Coordinate with teams directly from the message center.",
      href: "/messages?tab=group",
      icon: MessageSquareMore,
    },
    {
      title: "Worker Directory",
      description: "Browse assigned team members and collaboration details.",
      href: "/workers",
      icon: Users,
    },
  ];

  return (
    <Container className="py-6">
      <div className="space-y-6">
        <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Manager overview
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">
                Daily project operations in one place
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Track your active sites, monitor worker coverage, and quickly
                identify projects that may need payment attention.
              </p>
            </div>

            <Link
              href="/projects"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
            >
              View project list
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Total Projects
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {isLoading ? "--" : totalProjects}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Ongoing
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {isLoading ? "--" : ongoingProjects}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Completed
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {isLoading ? "--" : completedProjects}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Workers Across Sites
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {isLoading ? "--" : totalWorkers}
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Payment attention
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  Projects to review today
                </h2>
              </div>
              <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                {isLoading ? "--" : `${projectsWithPaymentDue} need action`}
              </div>
            </div>

            {isError ? (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                Unable to load your manager overview right now. Please try again
                in a moment.
              </div>
            ) : paymentAttentionList.length === 0 && !isLoading ? (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-600">
                No assigned projects found for your account.
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {(isLoading
                  ? Array.from({ length: 3 })
                  : paymentAttentionList
                ).map((project: any, index: number) => {
                  if (isLoading) {
                    return (
                      <div
                        key={`loading-${index}`}
                        className="h-20 animate-pulse rounded-2xl bg-slate-100"
                      />
                    );
                  }

                  return (
                    <Link
                      key={project.id}
                      href={`/projects/${project.id}`}
                      className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-base font-semibold text-slate-900">
                            {project.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            Last pay date: {formatDate(project.lastPayDate)}
                          </p>
                        </div>
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          {project.status}
                        </span>
                      </div>

                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        <p className="text-sm text-slate-600">
                          Workers:{" "}
                          <span className="font-semibold">
                            {project.workers}
                          </span>
                        </p>
                        <p className="text-sm text-slate-600">
                          Pending days:{" "}
                          <span className="font-semibold">
                            {project.pendingDays}
                          </span>
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-2 text-primary">
                <CalendarClock className="h-5 w-5" />
                <h3 className="text-lg font-semibold text-slate-900">
                  Today focus
                </h3>
              </div>
              <ul className="mt-4 space-y-3">
                <li className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                  Review projects with pending payment days above zero.
                </li>
                <li className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                  Confirm worker assignment balance across active projects.
                </li>
                <li className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                  Send group updates for blockers in the message center.
                </li>
              </ul>
            </section>

            <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-2 text-primary">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="text-lg font-semibold text-slate-900">
                  Quick actions
                </h3>
              </div>

              <div className="mt-4 space-y-3">
                {quickActions.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="group block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {item.title}
                            </p>
                            <p className="mt-1 text-xs text-slate-600">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:text-slate-900" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle2 className="h-5 w-5" />
                <h3 className="text-lg font-semibold text-slate-900">
                  Manager note
                </h3>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                This home page is now focused on operational visibility. Use the
                Projects page for full project cards and detailed actions.
              </p>
            </section>
          </div>
        </section>
      </div>
    </Container>
  );
};

export default ManagerHome;
