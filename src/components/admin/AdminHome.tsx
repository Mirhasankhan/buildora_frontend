"use client";

import InviteMemberModal from "./InviteMemberModal";
import Container from "@/utils/Container";
import { useAllProjectsQuery } from "@/redux/features/project/project.api";
import { useAllWorkersQuery } from "@/redux/features/auth/authApi";
import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Layers3,
  MessageSquareMore,
  Users,
  Wallet,
} from "lucide-react";

const demoChart = [
  { label: "Projects", value: 72, accent: "bg-primary" },
  { label: "Workers", value: 54, accent: "bg-primary" },
  { label: "Messages", value: 46, accent: "bg-primary" },
  { label: "Withdraws", value: 31, accent: "bg-primary" },
  { label: "Earnings", value: 88, accent: "bg-primary" },
];

const moduleCards = [
  {
    title: "Project pipeline",
    description:
      "Create projects, review project details, assign workers, and keep managers aligned.",
    href: "/projects",
    icon: BriefcaseBusiness,
  },
  {
    title: "Worker network",
    description:
      "Track team members, categories, current assignments, and earnings status.",
    href: "/workers",
    icon: Users,
  },
  {
    title: "Payments and withdrawals",
    description:
      "Monitor worker earnings and the withdrawal flow from one place.",
    href: "/earnings",
    icon: CircleDollarSign,
  },
  {
    title: "Communication",
    description:
      "Use the message center to keep project managers and workers moving in sync.",
    href: "/messages",
    icon: MessageSquareMore,
  },
];

const actionCards = [
  {
    title: "Create a new project",
    description: "Launch a fresh site and start assigning the right team.",
    href: "/create-project",
    icon: Building2,
  },
  {
    title: "Review withdrawals",
    description: "Check earning requests and keep payouts moving on time.",
    href: "/withdraws",
    icon: Wallet,
  },
  {
    title: "Check active work",
    description:
      "See which projects are still in motion and which are complete.",
    href: "/projects",
    icon: Clock3,
  },
];

const AdminHome = () => {
  const { data: projectData, isLoading: projectsLoading } =
    useAllProjectsQuery("");
  const { data: workerData, isLoading: workersLoading } = useAllWorkersQuery({
    page: 1,
    search: "",
    workerCategory: "",
  });

  const projects = Array.isArray(projectData?.result) ? projectData.result : [];
  const workers = Array.isArray(workerData?.result?.workers)
    ? workerData.result.workers
    : [];

  const projectCount = projects.length;
  const workerCount = workers.length;
  const activeProjects = projects.filter(
    (project: any) => String(project?.status ?? "").toLowerCase() === "ongoing",
  ).length;
  const completedProjects = projects.filter(
    (project: any) =>
      String(project?.status ?? "").toLowerCase() === "completed",
  ).length;
  const assignedWorkers = workers.filter((worker: any) =>
    Boolean(worker?.workerProfile?.project),
  ).length;
  const unassignedWorkers = Math.max(workerCount - assignedWorkers, 0);

  const overviewStats = [
    {
      label: "Projects",
      value: projectCount,
      detail: `${activeProjects} active, ${completedProjects} completed`,
      icon: BriefcaseBusiness,
    },
    {
      label: "Workers",
      value: workerCount,
      detail: `${assignedWorkers} assigned, ${unassignedWorkers} available`,
      icon: Users,
    },
    {
      label: "Site Health",
      value: `${Math.max(projectCount - completedProjects, 0)}`,
      detail: "Projects still need active attention",
      icon: CheckCircle2,
    },
  ];

  const maxChartValue = Math.max(...demoChart.map((item) => item.value), 1);

  return (
    <Container className="py-4 sm:py-6">
      <div className="space-y-6">
        <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-slate-700">
                Admin overview
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                  Construction operations at a glance.
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  Projects, workers, payments, withdrawals, and messaging all
                  live in this dashboard. This overview pulls the real project
                  and worker collections, then uses a demo chart to show the
                  site-wide flow at a glance.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {overviewStats.map((stat) => {
                  const Icon = stat.icon;

                  return (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                            {stat.label}
                          </p>
                          <p className="mt-2 text-3xl font-semibold text-slate-900">
                            {projectsLoading || workersLoading
                              ? "--"
                              : stat.value}
                          </p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-slate-600">
                        {stat.detail}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:w-[340px] lg:items-stretch">
              <div className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
                    <Users className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">
                      Invite a member
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      Add managers or workers quickly and keep the team moving.
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-[22px] border border-slate-200 bg-slate-50 p-3">
                  <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                    <CheckCircle2 className="h-4 w-4" />
                    Preferred action
                  </div>
                  <div className="[&>button]:w-full [&>button]:justify-center [&>button]:rounded-2xl [&>button]:border [&>button]:border-primary [&>button]:bg-primary [&>button]:px-4 [&>button]:py-3 [&>button]:text-sm [&>button]:font-semibold [&>button]:text-white [&>button]:shadow-sm [&>button]:transition [&>button:hover]:opacity-95">
                    <InviteMemberModal />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Demo chart
                  </p>
                  <p className="text-xs text-slate-600">
                    A quick visual of the platform mix.
                  </p>
                </div>
              </div>

              <Link
                href="/projects"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
              >
                Open projects
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.35fr_0.95fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  Demo trend chart
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  Platform activity mix
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  This is intentionally demo data, so the chart stays useful
                  even before a dedicated analytics endpoint is added.
                </p>
              </div>
              <div className="hidden rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 sm:block">
                {projectCount} projects · {workerCount} workers
              </div>
            </div>

            <div className="mt-8 grid grid-cols-5 items-end gap-3 sm:gap-4">
              {demoChart.map((item) => {
                const height = Math.max((item.value / maxChartValue) * 220, 72);

                return (
                  <div
                    key={item.label}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className="flex h-[240px] w-full items-end rounded-[22px] bg-slate-50 p-2">
                      <div
                        className={`w-full rounded-[18px] ${item.accent} shadow-lg shadow-primary/15 transition-transform hover:-translate-y-1`}
                        style={{ height }}
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-slate-900">
                        {item.label}
                      </p>
                      <p className="text-xs text-slate-500">{item.value}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Site priorities
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              What the website is built around
            </h2>
            <div className="mt-5 space-y-4">
              {[
                "Project creation and project detail management",
                "Worker onboarding, assignment, and category tracking",
                "Earnings, withdrawal requests, and payout flow",
                "Member-to-member messaging for managers and workers",
                "Auth and profile setup for invited team members",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Layers3 className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-sm leading-6 text-slate-600">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Module overview
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Core sections across the site
              </h2>
            </div>
            <Link
              href="/messages"
              className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:bg-slate-50 sm:inline-flex"
            >
              Go to messages
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {moduleCards.map((card) => {
              const Icon = card.icon;

              return (
                <Link
                  key={card.title}
                  href={card.href}
                  className="group rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-sm ring-1 ring-primary/20 transition group-hover:ring-primary/30">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-slate-900">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {card.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Next moves
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Practical actions for the admin team
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {actionCards.map((card) => {
              const Icon = card.icon;

              return (
                <Link
                  key={card.title}
                  href={card.href}
                  className="group rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-primary transition group-hover:text-slate-900" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-900">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {card.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </Container>
  );
};

export default AdminHome;
