"use client";
import {
  useProjectDetailsQuery,
  useReplaceManagerMutation,
} from "@/redux/features/project/project.api";
import { useSiteManagersQuery } from "@/redux/features/auth/authApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Container from "@/utils/Container";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  BadgeDollarSign,
  Calendar,
  CheckCircle2,
  HardHat,
  MapPin,
  Users,
  Wrench,
  RefreshCw,
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
  return new Date(date).toLocaleDateString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const AdminProjectDetails = () => {
  const params = useParams<{ project: string | string[] }>();
  const rawProjectId = params?.project;
  const projectId = Array.isArray(rawProjectId)
    ? rawProjectId[0]
    : rawProjectId;

  const [selectedManagerId, setSelectedManagerId] = useState("");
  const [isReplacing, setIsReplacing] = useState(false);

  const { data, isLoading, isError } = useProjectDetailsQuery(projectId, {
    skip: !projectId,
  });

  const { data: managersData } = useSiteManagersQuery({});
  const [replaceManager] = useReplaceManagerMutation();

  const project = data?.result;
  const managers = managersData?.result || [];
  const managerUserId =
    project?.manager?.id || project?.managerId || project?.manager?.userId;

  const handleReplaceManager = async () => {
    if (!selectedManagerId) {
      toast.warning("Please select a manager to replace");
      return;
    }

    if (selectedManagerId === project.manager.id) {
      toast.info("Selected manager is already the current manager");
      return;
    }

    const payload = {
      projectId: projectId!,
      newManagerId: selectedManagerId,
    };

    try {
      setIsReplacing(true);
      const response = await replaceManager(payload).unwrap();
      toast.success(response?.message || "Manager replaced successfully");
      setSelectedManagerId("");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to replace manager");
    } finally {
      setIsReplacing(false);
    }
  };

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
                    {project._count.workerProfiles} Active Worker
                    {project._count.workerProfiles === 1 ? "" : "s"}
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

              <div className="rounded-[12px] border border-slate-200 bg-white p-4 sm:p-5">
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
            <div className="bg-white rounded-[16px] border border-slate-200/80 shadow-[0_16px_35px_-24px_rgba(15,23,42,0.3)] p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Manager
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-[12px] border border-slate-200 bg-slate-50/70 p-3">
                  <Image
                    src={project.manager.profileImage || fallbackAvatar}
                    alt={project.manager.userName}
                    width={52}
                    height={52}
                    className="rounded-full h-12 w-12 object-cover border border-white shadow-sm"
                  />
                  <div>
                    <p className="text-sm text-gray-500">
                      Current Site Manager
                    </p>
                    <p className="font-semibold text-gray-900">
                      {project.manager.userName}
                    </p>
                  </div>
                </div>

                {managerUserId ? (
                  <Link
                    href={`/messages?tab=member&receiverId=${managerUserId}&receiverName=${encodeURIComponent(project.manager.userName || "Manager")}`}
                    className="inline-flex w-full items-center justify-center rounded-[10px] border border-primary/30 bg-white px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary/5"
                  >
                    Message Manager
                  </Link>
                ) : (
                  <span className="inline-flex w-full items-center justify-center rounded-[10px] border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-400">
                    Message Manager
                  </span>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Replace Manager
                  </label>
                  <Select
                    value={selectedManagerId}
                    onValueChange={setSelectedManagerId}
                  >
                    <SelectTrigger className="h-10 rounded-[10px] border-slate-200 bg-white text-sm shadow-sm focus:ring-2 focus:ring-primary/20">
                      <SelectValue placeholder="Select a new manager..." />
                    </SelectTrigger>
                    <SelectContent className="z-[80] rounded-[10px] border border-slate-200 bg-white text-gray-900 shadow-xl">
                      {managers.length === 0 ? (
                        <div className="p-2 text-sm text-gray-500">
                          No managers available
                        </div>
                      ) : (
                        managers
                          .filter(
                            (manager: any) => manager.id !== project.manager.id,
                          )
                          .map((manager: any) => (
                            <SelectItem
                              key={manager.id}
                              value={manager.id}
                              className="text-gray-800 focus:bg-primary/10 focus:text-primary"
                            >
                              {manager.userName}
                            </SelectItem>
                          ))
                      )}
                    </SelectContent>
                  </Select>

                  <button
                    onClick={handleReplaceManager}
                    disabled={!selectedManagerId || isReplacing}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-[10px] bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-primary"
                  >
                    <RefreshCw
                      size={16}
                      className={isReplacing ? "animate-spin" : ""}
                    />
                    {isReplacing ? "Replacing..." : "Replace Manager"}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[16px] border border-slate-200/80 shadow-[0_16px_35px_-24px_rgba(15,23,42,0.3)] p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Worker Team
              </h2>

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
                              className="rounded-full h-12 w-12 object-cover border border-white shadow-sm"
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
                        </div>
                      );
                    })(),
                  )}
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

export default AdminProjectDetails;
