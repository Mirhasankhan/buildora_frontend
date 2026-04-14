"use client";

import {
  useProjectDetailsQuery,
  useRemoveWorkerMutation,
} from "@/redux/features/project/project.api";
import Container from "@/utils/Container";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import {
  AlertTriangle,
  BadgeDollarSign,
  Calendar,
  CheckCircle2,
  HardHat,
  MapPin,
  Users,
  Wrench,
} from "lucide-react";
import AddWorker from "./AddWorker";
import {
  useDailyPaymentMutation,
  useNonPaidDaysQuery,
} from "@/redux/features/payment/payment.api";
import { toast } from "react-toastify";

const fallbackAvatar =
  "https://api.zenexcloud.com/emdadullah/uploads/projects/fileUrl/1770976649169-z62m87n8cqd.png";

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

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date: string) => {
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "N/A";

  return parsedDate.toLocaleDateString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getUnpaidDatesByCount = (lastPayDate: string, count: number) => {
  if (count <= 0) return [];

  const lastDateRaw = new Date(lastPayDate);
  if (Number.isNaN(lastDateRaw.getTime())) {
    return Array.from({ length: count }, () => null);
  }

  const lastDate = new Date(
    lastDateRaw.getFullYear(),
    lastDateRaw.getMonth(),
    lastDateRaw.getDate(),
  );
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(lastDate);
    date.setDate(lastDate.getDate() + index + 1);
    return date;
  });
};

const getTotalDailyRate = (workerProfiles: any[] = []) => {
  return workerProfiles.reduce(
    (sum, profile) => sum + Number(profile?.dailyRate || 0),
    0,
  );
};

const getTotalSpent = (payments: any[] = []) => {
  return payments.reduce(
    (sum, payment) => sum + Number(payment?.amount || 0),
    0,
  );
};

const ManagerProjectDetails = () => {
  const params = useParams<{ project: string | string[] }>();
  const rawProjectId = params?.project;
  const projectId = Array.isArray(rawProjectId)
    ? rawProjectId[0]
    : rawProjectId;

  const { data, isLoading, isError } = useProjectDetailsQuery(projectId, {
    skip: !projectId,
  });

  const { data: nonPaidData } = useNonPaidDaysQuery(projectId, {
    skip: !projectId,
  });
  const [dailyPayment, { isLoading: isPaying }] = useDailyPaymentMutation();

  const [removeWorker] = useRemoveWorkerMutation();

  const nonPaidCount = Number(nonPaidData?.result?.count ?? 0);
  const hasPendingPayments = nonPaidCount > 0;

  const handleRemoveWorker = async (workerId: number) => {
    if (hasPendingPayments) {
      toast.warning(
        "Please clear pending salary payments before removing workers.",
      );
      return;
    }

    const res = await removeWorker(workerId).unwrap();
    console.log(res);
  };

  const project = data?.result;

  const feeItems = project
    ? [
        { label: "Carpenter", amount: project.carpenterFees },
        { label: "Cleaner", amount: project.cleanerFees },
        { label: "Electrician", amount: project.electricianFees },
        { label: "HVAC Technician", amount: project.hvacTechnicianFees },
        { label: "Mason", amount: project.masonFees },
        { label: "Mechanic", amount: project.mechanicFees },
        { label: "Painter", amount: project.painterFees },
        { label: "Plumber", amount: project.plumberFees },
        { label: "Welder", amount: project.welderFees },
      ]
    : [];

  const unpaidDates = useMemo(() => {
    if (!project?.last_Pay_Date || nonPaidCount <= 0) return [];
    return getUnpaidDatesByCount(project.last_Pay_Date, nonPaidCount);
  }, [project?.last_Pay_Date, nonPaidCount]);

  const totalWorkers =
    project?._count?.workerProfiles || project?.workerProfiles?.length || 0;

  const handlePaySalary = async (index: number) => {
    if (index !== 0 || !projectId || isPaying) return;

    try {
      const res = await dailyPayment(projectId).unwrap();
      toast.success(res?.message || "Salary paid successfully.");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to pay salary.");
    }
  };

  if (!projectId) {
    return (
      <Container>
        <div className="min-h-[70vh] flex items-center justify-center">
          <p className="text-gray-600 text-center">Invalid project ID.</p>
        </div>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container>
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            <p className="mt-4 text-gray-600">Loading project details...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (isError || !project) {
    return (
      <Container>
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="text-center space-y-3">
            <p className="text-red-600 font-medium">
              Failed to load project details.
            </p>
            <Link href="/projects" className="text-primary hover:underline">
              Back to projects
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8 md:py-10">
      <div className="space-y-6 rounded-[20px] bg-gradient-to-b from-slate-50/70 via-white to-white p-3 sm:p-4 md:p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">Project Details</p>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
              {project.projectName}
            </h1>
          </div>
          <span
            className={`w-fit px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}
          >
            {project.status}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 bg-white rounded-[16px] border border-slate-200/80 shadow-[0_16px_35px_-22px_rgba(15,23,42,0.35)] overflow-hidden">
            <div className="relative h-56 sm:h-72 md:h-80 w-full bg-gray-200">
              <Image
                src={project.projectImage}
                alt={project.projectName}
                fill
                className="object-cover"
                priority
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
            </div>

            <div className="p-4 sm:p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div className="flex items-start gap-2 rounded-[10px] border border-slate-200 bg-slate-50/70 p-3">
                  <MapPin className="h-4 w-4 mt-0.5 text-gray-500" />
                  <p>{project.address}</p>
                </div>
                <div className="flex items-start gap-2 rounded-[10px] border border-slate-200 bg-slate-50/70 p-3">
                  <Users className="h-4 w-4 mt-0.5 text-gray-500" />
                  <p>
                    {totalWorkers} Active Worker
                    {totalWorkers === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="flex items-start gap-2 rounded-[10px] border border-slate-200 bg-slate-50/70 p-3">
                  <Calendar className="h-4 w-4 mt-0.5 text-gray-500" />
                  <p>Created: {formatDate(project.createdAt)}</p>
                </div>
                <div className="flex items-start gap-2 rounded-[10px] border border-slate-200 bg-slate-50/70 p-3">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-gray-500" />
                  <p>Updated: {formatDate(project.updatedAt)}</p>
                </div>
              </div>

              <div className="rounded-[12px] border border-slate-200 bg-white p-4 sm:p-5 space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Description
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {project.description}
                  </p>
                </div>
                <div className="border-t border-slate-200 pt-4">
                  <p className="text-xs font-medium text-gray-600 mb-2">
                    Total Spent
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatMoney(getTotalSpent(project.payments || []))}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="bg-white rounded-[16px] border border-slate-200/80 shadow-[0_16px_35px_-24px_rgba(15,23,42,0.3)] p-5">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Worker Team
                </h2>
                <AddWorker
                  projectId={projectId}
                  disabled={hasPendingPayments}
                  disabledReason="Clear pending salary payments first."
                ></AddWorker>
              </div>

              {project.workerProfiles.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No workers assigned yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {project.workerProfiles.map((workerProfile: any) =>
                    (() => {
                      const workerUserId =
                        workerProfile?.worker?.id ||
                        workerProfile?.workerId ||
                        workerProfile?.worker?.userId;

                      return (
                        <div
                          key={workerProfile.id}
                          className="flex items-center justify-between gap-2 rounded-[10px] border border-slate-200 bg-slate-50/70 p-3"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Image
                              src={
                                workerProfile.worker.profileImage ||
                                fallbackAvatar
                              }
                              alt={workerProfile.worker.userName}
                              width={36}
                              height={36}
                              className="rounded-full border object-cover h-12 w-12 border-white shadow-sm"
                            />
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {workerProfile.worker.userName}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {workerProfile.workerCategory}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {workerUserId ? (
                              <Link
                                href={`/messages?tab=member&receiverId=${workerUserId}`}
                                className="rounded-[8px] border border-primary/30 bg-white px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/5"
                              >
                                Message
                              </Link>
                            ) : (
                              <span className="rounded-[8px] border border-slate-200 bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-400">
                                Message
                              </span>
                            )}
                            <button
                              onClick={() =>
                                handleRemoveWorker(workerProfile.workerId)
                              }
                              type="button"
                              disabled={hasPendingPayments}
                              title={
                                hasPendingPayments
                                  ? "Clear pending salary payments first."
                                  : undefined
                              }
                              className="rounded-[8px] border border-red-200 bg-white px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      );
                    })(),
                  )}
                </div>
              )}
            </div>

            <div className="rounded-[16px] border border-primary/15 bg-gradient-to-br from-primary/5 via-white to-emerald-50/40 shadow-[0_20px_35px_-26px_rgba(15,23,42,0.35)] p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-gray-900">
                  Pay Salary
                </h2>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                    hasPendingPayments
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  Pending: {nonPaidCount}
                </span>
              </div>

              {hasPendingPayments ? (
                <div className="mb-4 flex items-start gap-2 rounded-[10px] border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>
                    You can&apos;t remove or add worker before paying out the
                    salary. Please clear pending days first.
                  </p>
                </div>
              ) : (
                <div className="mb-4 rounded-[10px] border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                  All salary dues are clear. Worker add/remove actions are
                  enabled.
                </div>
              )}

              {totalWorkers === 0 ? (
                <p className="text-sm text-gray-600">
                  No worker to pay. Add worker first.
                </p>
              ) : unpaidDates.length === 0 ? (
                <p className="text-sm text-emerald-700">No unpaid dates.</p>
              ) : (
                <div className="space-y-2">
                  {unpaidDates.map((date, index) => {
                    const isPayable = index === 0 && !isPaying;

                    return (
                      <button
                        key={date ? date.toISOString() : `unpaid-${index}`}
                        type="button"
                        onClick={() => handlePaySalary(index)}
                        disabled={!isPayable}
                        className={`w-full rounded-[10px] border px-4 py-3 text-left transition-colors ${
                          isPayable
                            ? "border-primary/30 bg-white text-gray-900 hover:bg-primary/5"
                            : "cursor-not-allowed border-slate-200 bg-slate-100 text-gray-400"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {date
                                ? formatDate(date.toISOString())
                                : `Day ${index + 1}`}
                            </p>
                            {isPayable && (
                              <p
                                className={`text-lg font-bold mt-1 ${
                                  isPayable ? "text-primary" : "text-gray-400"
                                }`}
                              >
                                {formatMoney(
                                  getTotalDailyRate(project.workerProfiles),
                                )}
                              </p>
                            )}
                          </div>
                          <span
                            className={`text-xs font-semibold whitespace-nowrap ${
                              isPayable ? "text-primary" : "text-gray-400"
                            }`}
                          >
                            {isPaying && index === 0
                              ? "Paying..."
                              : isPayable
                                ? "Pay Now"
                                : "Locked"}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>
        </div>

        <section className="bg-white rounded-[16px] border border-slate-200/80 shadow-[0_16px_35px_-24px_rgba(15,23,42,0.3)] p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <BadgeDollarSign className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-gray-900">
              Labor Daily Fees
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {feeItems.map((fee) => (
              <div
                key={fee.label}
                className="rounded-[10px] border border-slate-200 bg-slate-50/70 p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {fee.label === "Electrician" ||
                  fee.label === "HVAC Technician" ? (
                    <Wrench className="h-4 w-4 text-gray-500" />
                  ) : (
                    <HardHat className="h-4 w-4 text-gray-500" />
                  )}
                  <p className="text-sm text-gray-700 truncate">{fee.label}</p>
                </div>
                <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                  {formatMoney(fee.amount)}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Container>
  );
};

export default ManagerProjectDetails;
