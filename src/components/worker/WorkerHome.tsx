"use client";

import { format } from "date-fns";
import Image from "next/image";
import {
  BadgeDollarSign,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Landmark,
  MapPin,
  ReceiptText,
  UserRound,
} from "lucide-react";
import { useProfileQuery } from "@/redux/features/auth/authApi";
import Link from "next/link";

type PaymentRecord = {
  amount?: number;
  createdAt?: string;
  project?: {
    projectName?: string;
  };
};

type WithdrawRecord = {
  amount?: number;
  createdAt?: string;
  status?: string;
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const formatMoney = (value?: number) => currencyFormatter.format(value ?? 0);

const formatDate = (value?: string) => {
  if (!value) return "--";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";

  return format(date, "dd MMM yyyy");
};

const formatStatus = (status?: string) => {
  if (!status) return "Recorded";
  return status.replace(/_/g, " ");
};

const getStatusStyles = (status?: string) => {
  const normalized = (status ?? "").toLowerCase();

  if (normalized === "approved" || normalized === "paid") {
    return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
  }

  if (normalized === "pending") {
    return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
  }

  if (normalized === "rejected" || normalized === "cancelled") {
    return "bg-rose-50 text-rose-700 ring-1 ring-rose-200";
  }

  return "bg-stone-100 text-stone-600 ring-1 ring-stone-200";
};

const WorkerHome = () => {
  const { data, isLoading, error } = useProfileQuery("");

  const worker = data?.result;
  const profile = worker?.workerProfile ?? {};
  const project = profile.project ?? {};

  const payments = ((worker?.payments as PaymentRecord[]) ?? []).filter(
    Boolean,
  );
  const withdraws = ((worker?.withdraws as WithdrawRecord[]) ?? []).filter(
    Boolean,
  );

  const currentEarnings = Number(profile.currentEarnings ?? 0);
  const allTimeEarnings = Number(profile.allTimeEarnings ?? currentEarnings);
  const totalWithdrawn = withdraws.reduce(
    (sum, item) => sum + Number(item.amount ?? 0),
    0,
  );
  const availableBalance = Math.max(currentEarnings - totalWithdrawn, 0);
  const projectImage = project?.projectImage || worker?.profileImage || null;
  const hasCurrentProject = Boolean(
    project?.projectName || project?.address || projectImage,
  );

  const paymentDates = payments
    .map((item) => item.createdAt)
    .filter((value): value is string => Boolean(value))
    .sort(
      (left, right) => new Date(left).getTime() - new Date(right).getTime(),
    );

  const withdrawalDates = withdraws
    .map((item) => item.createdAt)
    .filter((value): value is string => Boolean(value))
    .sort(
      (left, right) => new Date(left).getTime() - new Date(right).getTime(),
    );

  const startedOn = paymentDates[0] ?? withdrawalDates[0] ?? undefined;
  const dailyRate = Number(profile.dailyRate ?? 0);

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-6xl items-center justify-center px-4 py-8 text-stone-500">
        Loading worker dashboard...
      </div>
    );
  }

  if (error || !worker) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-3xl border border-stone-200 bg-white p-6 text-stone-600 shadow-sm">
          Unable to load the worker profile right now.
        </div>
      </div>
    );
  }

  const summaryCards = [
    {
      label: "Role",
      value: profile.workerCategory || "Worker",
      icon: <UserRound className="h-4 w-4" />,
    },
    {
      label: "Daily Rate",
      value: formatMoney(dailyRate),
      icon: <ReceiptText className="h-4 w-4" />,
    },
    {
      label: "Supervisor",
      value: project?.manager?.userName || "Unassigned",
      icon: <BadgeDollarSign className="h-4 w-4" />,
    },
    {
      label: "Since",
      value: formatDate(startedOn),
      icon: <CalendarDays className="h-4 w-4" />,
    },
  ];

  const metricCards = [
    {
      label: "Current Balance",
      value: formatMoney(availableBalance),
      helper: `After ${withdraws.length} withdrawals`,
      icon: <Landmark className="h-5 w-5" />,
    },
    {
      label: "All-Time Earnings",
      value: formatMoney(allTimeEarnings),
      helper: `${payments.length} payment records`,
      icon: <Clock3 className="h-5 w-5" />,
    },
    {
      label: "Withdrawn",
      value: formatMoney(totalWithdrawn),
      helper: `${withdraws.length} withdrawal records`,
      icon: <CheckCircle2 className="h-5 w-5" />,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:space-y-6 sm:py-8">
      <section className="relative overflow-hidden rounded-[28px] border border-orange-100 bg-white p-5 shadow-[0_10px_30px_rgba(120,81,28,0.08)] sm:p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,107,0,0.08),_transparent_34%),radial-gradient(circle_at_bottom_left,_rgba(120,113,108,0.06),_transparent_28%)]" />
        <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-stone-700">
              <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
              Current Assignment
            </div>
            <div className="space-y-2">
              <h1 className="max-w-2xl text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
                {project?.projectName || worker.userName}
              </h1>
              <div className="flex items-start gap-2 text-sm text-stone-500">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="max-w-2xl leading-6">
                  {project?.address ||
                    profile.presentAddress ||
                    "No project address available"}
                </span>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {hasCurrentProject ? "Active" : "Awaiting Assignment"}
            </div>
          </div>

          <div className="overflow-hidden rounded-[24px] border border-stone-200 bg-stone-100 shadow-[0_10px_30px_rgba(15,23,42,0.08)] lg:justify-self-end lg:w-[340px]">
            {hasCurrentProject ? (
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-200 sm:aspect-[4/3]">
                {projectImage ? (
                  <Image
                    src={projectImage}
                    alt={project?.projectName || "Current project"}
                    fill
                    className="object-cover"
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-stone-200 via-stone-100 to-stone-50">
                    <div className="flex flex-col items-center gap-3 text-stone-500">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-stone-400 shadow-sm ring-1 ring-stone-200">
                        <MapPin className="h-7 w-7" />
                      </div>
                      <div className="text-sm font-medium">
                        Project image unavailable
                      </div>
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/12 to-transparent" />

                <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3">
                  <div className="rounded-full bg-white/12 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/90 backdrop-blur-md ring-1 ring-white/20">
                    Current Project
                  </div>
                  <div className="rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                    On Site
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <div className="text-base font-semibold leading-tight">
                    {project?.projectName || "Project"}
                  </div>
                  <div className="mt-1 flex items-start gap-2 text-sm text-white/80">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                    <span className="line-clamp-2">
                      {project?.address ||
                        profile.presentAddress ||
                        "No address available"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[260px] flex-col justify-between bg-gradient-to-br from-stone-100 via-stone-50 to-white p-4 sm:p-5">
                <div className="space-y-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-stone-400 ring-1 ring-stone-200 shadow-sm">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-medium uppercase tracking-[0.24em] text-stone-400">
                      Current Project
                    </div>
                    <div className="text-xl font-semibold tracking-tight text-stone-900">
                      No active assignment yet
                    </div>
                    <p className="max-w-sm text-sm leading-6 text-stone-500">
                      Your project card will appear here once a manager assigns
                      you to a site.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-dashed border-stone-300 bg-white/70 p-3 text-sm text-stone-500">
                  We’ll show the project image, location, and live assignment
                  status here when available.
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="relative mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-stone-200 bg-stone-50/80 p-4 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset]"
            >
              <div className="mb-2 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-stone-500">
                <span className="text-orange-500">{card.icon}</span>
                {card.label}
              </div>
              <div className="text-lg font-semibold text-stone-900">
                {card.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {metricCards.map((card) => (
          <div
            key={card.label}
            className="rounded-[24px] border border-stone-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]"
          >
            <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
              {card.icon}
            </div>
            <div className="text-2xl font-semibold tracking-tight text-stone-900">
              {card.value}
            </div>
            <div className="mt-1 text-sm text-stone-500">{card.label}</div>
            <div className="mt-2 text-xs text-stone-400">{card.helper}</div>
          </div>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
          <div className="border-b flex justify-between items-center border-stone-200 px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-xl font-semibold text-stone-900">
                Earnings History
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                Recent payment entries for this assignment.
              </p>
            </div>
            <Link href="/earnings" className="text-blue-500 hover:text-blue-700">
              View All
            </Link>
          </div>

          <div className="divide-y divide-stone-100">
            {payments.length > 0 ? (
              payments?.slice(0, 5).map((payment, index) => (
                <div
                  key={`${payment.createdAt ?? "payment"}-${index}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6"
                >
                  <div className="min-w-0">
                    <div className="truncate text-base font-medium text-stone-900">
                      {payment.project?.projectName ||
                        project?.projectName ||
                        "Project payment"}
                    </div>
                    <div className="mt-1 text-sm text-stone-500">
                      {formatDate(payment.createdAt)}
                      <span className="mx-2">•</span>
                      Credited
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <div className="text-base font-semibold text-stone-900">
                      {formatMoney(Number(payment.amount ?? 0))}
                    </div>
                    <div className="mt-1 inline-flex rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600">
                      Paid
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-5 py-10 text-center text-sm text-stone-500 sm:px-6">
                No earnings have been recorded yet.
              </div>
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
          <div className="border-b border-stone-200 px-5 py-4 sm:px-6">
            <h2 className="text-xl font-semibold text-stone-900">
              Withdrawal History
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              Withdrawal requests and their current status.
            </p>
          </div>

          <div className="divide-y divide-stone-100">
            {withdraws.length > 0 ? (
              withdraws.map((withdraw, index) => (
                <div
                  key={`${withdraw.createdAt ?? "withdraw"}-${index}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6"
                >
                  <div className="min-w-0">
                    <div className="truncate text-base font-medium text-stone-900">
                      Withdrawal request
                    </div>
                    <div className="mt-1 text-sm text-stone-500">
                      {formatDate(withdraw.createdAt)}
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <div className="text-base font-semibold text-stone-900">
                      {formatMoney(Number(withdraw.amount ?? 0))}
                    </div>
                    <div
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyles(withdraw.status)}`}
                    >
                      {formatStatus(withdraw.status)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-5 py-10 text-center text-sm text-stone-500 sm:px-6">
                No withdrawals have been made yet.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default WorkerHome;
