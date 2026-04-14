"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAllWorkersQuery } from "@/redux/features/auth/authApi";
import Container from "@/utils/Container";
import {
  BadgeDollarSign,
  BriefcaseBusiness,
  Mail,
  MapPin,
  Phone,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const formatCurrency = (value: number = 0) => `$${value.toLocaleString()}`;

const formatDate = (dateString: string) => {
  const parsedDate = new Date(dateString);

  if (Number.isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const workerCategoryOptions = [
  "Plumber",
  "Electrician",
  "Carpenter",
  "Painter",
  "Cleaner",
  "Mechanic",
  "HVAC_Technician",
  "Mason",
  "Welder",
] as const;

const formatWorkerCategory = (value: string) => value.replaceAll("_", " ");

const AllWorkers = () => {
  const [search, setSearch] = useState("");
  const [workerCategory, setWorkerCategory] = useState("all");

  const { data, isLoading, isError } = useAllWorkersQuery({
    page: 1,
    search,
    workerCategory: workerCategory === "all" ? "" : workerCategory,
  });

  const workers = data?.result?.workers || [];

  if (isLoading) {
    return (
      <Container>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-3 text-sm text-gray-600">Loading workers...</p>
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
            Unable to load workers
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
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Workers</h1>
            <p className="mt-1 text-gray-600">
              Browse all team members and their current assignment status.
            </p>
          </div>
        </div>

        <div className="mb-8 rounded-[20px] border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <SlidersHorizontal size={16} className="text-primary" />
            Search and filter workers
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(240px,0.9fr)]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, email, phone, or project..."
                className="h-12 rounded-[14px] border-slate-200 bg-white pl-11 text-[15px] shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20"
              />
            </div>

            <Select
              value={workerCategory}
              onValueChange={(value) => setWorkerCategory(value)}
            >
              <SelectTrigger className="h-12 rounded-[14px] border-slate-200 bg-white text-[15px] shadow-sm focus:ring-2 focus:ring-primary/20">
                <SelectValue placeholder="All worker categories" />
              </SelectTrigger>
              <SelectContent className="z-[80] rounded-[14px] border border-slate-200 bg-white text-slate-900 shadow-xl">
                <SelectItem
                  value="all"
                  className="text-slate-800 focus:bg-primary/10 focus:text-primary"
                >
                  All worker categories
                </SelectItem>
                {workerCategoryOptions.map((category) => (
                  <SelectItem
                    key={category}
                    value={category}
                    className="text-slate-800 focus:bg-primary/10 focus:text-primary"
                  >
                    {formatWorkerCategory(category)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {workers.length < 1 ? (
          <div className="rounded-[12px] border border-dashed border-gray-300 py-16 text-center text-gray-600">
            No workers found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {workers.map((worker: any) => {
              const profile = worker.workerProfile;
              const projectName = profile?.project?.projectName || "Unassigned";
              const workerUserId =
                worker?.id || worker?.userId || profile?.workerId;

              return (
                <article
                  key={worker.id}
                  className="rounded-[14px] border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      {worker.profileImage ? (
                        <Image
                          src={worker.profileImage}
                          alt={worker.userName || "Worker profile"}
                          width={52}
                          height={52}
                          className="h-[52px] w-[52px] rounded-full border border-gray-200 object-cover"
                        />
                      ) : (
                        <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-gray-200 bg-gray-100 font-semibold text-gray-600">
                          {(worker.userName || "W").charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-semibold text-gray-900">
                          {worker.userName || "Unnamed Worker"}
                        </h3>
                        <p className="mt-1 text-xs text-gray-500">
                          Joined: {formatDate(worker.createdAt)}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                      {profile?.workerCategory || "General"}
                    </span>
                  </div>

                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-500" />
                      <span className="truncate">{worker.email || "N/A"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-500" />
                      <span>{profile?.phoneNumber || "No phone added"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <BriefcaseBusiness size={16} className="text-gray-500" />
                      <span className="truncate">Project: {projectName}</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="mt-0.5 text-gray-500" />
                      <span className="line-clamp-2">
                        {profile?.presentAddress ||
                          profile?.permanentAddress ||
                          "No address available"}
                      </span>
                    </div>
                  </div>

                  <div className="my-4 border-t border-gray-200" />

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-[10px] bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">Daily Rate</p>
                      <p className="mt-1 font-semibold text-gray-900">
                        {formatCurrency(profile?.dailyRate ?? 0)}
                      </p>
                    </div>
                    <div className="rounded-[10px] bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">Current Earnings</p>
                      <p className="mt-1 font-semibold text-gray-900">
                        {formatCurrency(profile?.currentEarnings ?? 0)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2 rounded-[10px] bg-emerald-50 p-3 text-sm text-emerald-800">
                    <BadgeDollarSign size={16} />
                    <span>
                      All-time earnings:{" "}
                      <span className="font-semibold">
                        {formatCurrency(profile?.allTimeEarnings ?? 0)}
                      </span>
                    </span>
                  </div>

                  {workerUserId ? (
                    <Link
                      href={`/messages?tab=member&receiverId=${workerUserId}`}
                      className="mt-3 inline-flex w-full items-center justify-center rounded-[10px] border border-primary/30 bg-white px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary/5"
                    >
                      Message Worker
                    </Link>
                  ) : (
                    <span className="mt-3 inline-flex w-full items-center justify-center rounded-[10px] border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-400">
                      Message Worker
                    </span>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </Container>
  );
};

export default AllWorkers;
