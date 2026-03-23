"use client";

import { useProjectDetailsQuery } from "@/redux/features/project/project.api";
import Container from "@/utils/Container";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  BadgeDollarSign,
  Calendar,
  CheckCircle2,
  HardHat,
  MapPin,
  Users,
  Wrench,
} from "lucide-react";

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

const getEffectivePayDate = () => {
  const now = new Date();
  const effectiveDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  if (now.getHours() < 18) {
    effectiveDate.setDate(effectiveDate.getDate() - 1);
  }

  return effectiveDate;
};

const getUnpaidDates = (lastPayDate: string) => {
  const lastDateRaw = new Date(lastPayDate);
  if (Number.isNaN(lastDateRaw.getTime())) return [];

  const lastDate = new Date(
    lastDateRaw.getFullYear(),
    lastDateRaw.getMonth(),
    lastDateRaw.getDate(),
  );
  const effectiveDate = getEffectivePayDate();

  const msPerDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.floor(
    (effectiveDate.getTime() - lastDate.getTime()) / msPerDay,
  );
  const safeDiff = Math.max(diffDays, 0);

  return Array.from({ length: safeDiff }, (_, index) => {
    const date = new Date(lastDate);
    date.setDate(lastDate.getDate() + index + 1);
    return date;
  });
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

  const project = data?.result;
  const [paidCount, setPaidCount] = useState(0);

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
    if (!project?.last_Pay_Date) return [];
    return getUnpaidDates(project.last_Pay_Date);
  }, [project?.last_Pay_Date]);

  const totalWorkers =
    project?._count?.workerProfiles || project?.workerProfiles?.length || 0;

  const handlePaySalary = (index: number) => {
    if (index !== paidCount) return;
    setPaidCount((prev) => prev + 1);
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
      <div className="space-y-6">
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
          <section className="lg:col-span-2 bg-white rounded-[12px] border border-gray-100 overflow-hidden">
            <div className="relative h-56 sm:h-72 md:h-80 w-full bg-gray-200">
              <Image
                src={project.projectImage}
                alt={project.projectName}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="p-4 sm:p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-gray-500" />
                  <p>{project.address}</p>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="h-4 w-4 mt-0.5 text-gray-500" />
                  <p>
                    {totalWorkers} Active Worker
                    {totalWorkers === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 mt-0.5 text-gray-500" />
                  <p>Created: {formatDate(project.createdAt)}</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-gray-500" />
                  <p>Updated: {formatDate(project.updatedAt)}</p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Description
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="bg-white rounded-[6px] border border-gray-100 p-5">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Worker Team
                </h2>
                <button
                  type="button"
                  className="rounded-[8px] border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Add Worker
                </button>
              </div>

              {project.workerProfiles.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No workers assigned yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {project.workerProfiles.map((workerProfile: any) => (
                    <div
                      key={workerProfile.id}
                      className="flex items-center justify-between gap-2 rounded-[6px] border border-gray-100 p-3"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Image
                          src={
                            workerProfile.worker.profileImage || fallbackAvatar
                          }
                          alt={workerProfile.worker.userName}
                          width={36}
                          height={36}
                          className="rounded-full"
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
                      <button
                        type="button"
                        className="rounded-[8px] border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        Remove Worker
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-[12px] border border-gray-100 p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Pay Salary
              </h2>

              {totalWorkers === 0 ? (
                <p className="text-sm text-gray-600">
                  No worker to pay. Add worker first.
                </p>
              ) : unpaidDates.length === 0 ? (
                <p className="text-sm text-emerald-700">No unpaid dates.</p>
              ) : (
                <div className="space-y-2">
                  {unpaidDates.map((date, index) => {
                    const isAlreadyPaid = index < paidCount;
                    const isPayable = index === paidCount;

                    return (
                      <button
                        key={date.toISOString()}
                        type="button"
                        onClick={() => handlePaySalary(index)}
                        disabled={!isPayable}
                        className={`w-full rounded-[8px] px-3 py-2 text-sm font-medium border text-left ${
                          isAlreadyPaid
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                            : isPayable
                              ? "bg-primary/10 border-primary/30 text-primary"
                              : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {isAlreadyPaid ? "Paid" : "Pay Salary"} -{" "}
                        {formatDate(date.toISOString())}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>
        </div>

        <section className="bg-white rounded-[12px] border border-gray-100 p-4 sm:p-6">
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
                className="rounded-[6px] border border-gray-100 p-4 flex items-center justify-between"
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
