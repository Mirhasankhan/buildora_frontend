"use client";

import Container from "@/utils/Container";
import { useAllWorkersQuery } from "@/redux/features/auth/authApi";
import {
  BadgeDollarSign,
  BriefcaseBusiness,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import Image from "next/image";

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

const AllWorkers = () => {
  const { data, isLoading, isError } = useAllWorkersQuery(1);
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
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Workers</h1>
            <p className="text-gray-600 mt-1">
              Browse all team members and their current assignment status.
            </p>
          </div>
        </div>

        {workers.length < 1 ? (
          <div className="rounded-[12px] border border-dashed border-gray-300 py-16 text-center text-gray-600">
            No workers found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {workers.map((worker: any) => {
              const profile = worker.workerProfile;
              const projectName = profile?.project?.projectName || "Unassigned";

              return (
                <article
                  key={worker.id}
                  className="rounded-[14px] border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {worker.profileImage ? (
                        <Image
                          src={worker.profileImage}
                          alt={worker.userName || "Worker profile"}
                          width={52}
                          height={52}
                          className="h-[52px] w-[52px] rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="h-[52px] w-[52px] rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                          {(worker.userName || "W").charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {worker.userName || "Unnamed Worker"}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
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
                      <MapPin size={16} className="text-gray-500 mt-0.5" />
                      <span className="line-clamp-2">
                        {profile?.presentAddress ||
                          profile?.permanentAddress ||
                          "No address available"}
                      </span>
                    </div>
                  </div>

                  <div className="my-4 border-t border-gray-200"></div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-[10px] bg-gray-50 p-3">
                      <p className="text-gray-500 text-xs">Daily Rate</p>
                      <p className="mt-1 font-semibold text-gray-900">
                        {formatCurrency(profile?.dailyRate ?? 0)}
                      </p>
                    </div>
                    <div className="rounded-[10px] bg-gray-50 p-3">
                      <p className="text-gray-500 text-xs">Current Earnings</p>
                      <p className="mt-1 font-semibold text-gray-900">
                        {formatCurrency(profile?.currentEarnings ?? 0)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 rounded-[10px] bg-emerald-50 p-3 text-sm text-emerald-800 flex items-center gap-2">
                    <BadgeDollarSign size={16} />
                    <span>
                      All-time earnings:{" "}
                      <span className="font-semibold">
                        {formatCurrency(profile?.allTimeEarnings ?? 0)}
                      </span>
                    </span>
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

export default AllWorkers;
