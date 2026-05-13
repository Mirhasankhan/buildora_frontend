"use client";

import Image from "next/image";
import Container from "@/utils/Container";
import {
  useAcceptRejectWithdrawMutation,
  useAllRequestsQuery,
} from "@/redux/features/withdraw/withdraw.api";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

type WithdrawRequest = {
  id: string;
  amount: number;
  createdAt: string;
  status: string;
  worker?: {
    profileImage?: string;
    userName?: string;
    workerProfile?: {
      workerCategory?: string;
    };
  };
};

const statusOptions = ["Pending", "Accepted", "Rejected"] as const;

const WithdrawRequestPage = () => {
  const [status, setStatus] = useState("");
  const selectedStatusLabel = status || "All";
  const { data: allRequests, isFetching } = useAllRequestsQuery(status);
  const [acceptRejectFunction, { isLoading }] =
    useAcceptRejectWithdrawMutation();
  const [activeWithdrawId, setActiveWithdrawId] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<"accept" | "reject" | null>(
    null,
  );

  const requests: WithdrawRequest[] = allRequests?.result?.withdraws ?? [];
  const withdrawableEarnings = allRequests?.result?.withdrawableEarnings ?? 0;
  const totalAcceptedAmount = allRequests?.result?.totalAcceptedAmount ?? 0;
  const totalPendingAmount = allRequests?.result?.totalPendingAmount ?? 0;
  const totalRejectedAmount = allRequests?.result?.totalRejectedAmount ?? 0;

  const handleAcceptReject = async (
    withdrawId: string,
    isAccepted: boolean,
  ) => {
    setActiveWithdrawId(withdrawId);
    setActiveAction(isAccepted ? "accept" : "reject");

    try {
      await acceptRejectFunction({ withdrawId, isAccepted }).unwrap();
    } finally {
      setActiveWithdrawId(null);
      setActiveAction(null);
    }
  };

  return (
    <Container className="py-8">
      <div className="mb-6 flex flex-col gap-4 rounded-[20px] border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-4 shadow-sm md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Withdraw requests
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">
            Review and manage requests
          </h1>
        </div>

        <div className="w-full md:max-w-[240px]">
          <p className="mb-2 text-sm font-medium text-slate-600">
            Filter by status
          </p>
          <Select
            value={status || "all"}
            onValueChange={(value) => setStatus(value === "all" ? "" : value)}
          >
            <SelectTrigger className="h-12 rounded-[14px] border-slate-200 bg-white text-[15px] shadow-sm focus:ring-2 focus:ring-primary/20">
              <SelectValue>{selectedStatusLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent className="z-[80] rounded-[14px] border border-slate-200 bg-white text-slate-900 shadow-xl">
              <SelectItem
                value="all"
                className="text-slate-800 focus:bg-primary/10 focus:text-primary"
              >
                All
              </SelectItem>
              {statusOptions.map((option) => (
                <SelectItem
                  key={option}
                  value={option}
                  className="text-slate-800 focus:bg-primary/10 focus:text-primary"
                >
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[16px] border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Withdrawable earnings
          </p>
          {isFetching ? (
            <Skeleton className="mt-3 h-8 w-24" />
          ) : (
            <p className="mt-3 text-2xl font-bold text-slate-900">
              ${withdrawableEarnings}
            </p>
          )}
        </div>

        <div className="rounded-[16px] border border-emerald-200 bg-emerald-50/40 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
            Total accepted
          </p>
          {isFetching ? (
            <Skeleton className="mt-3 h-8 w-24" />
          ) : (
            <p className="mt-3 text-2xl font-bold text-emerald-700">
              ${totalAcceptedAmount}
            </p>
          )}
        </div>

        <div className="rounded-[16px] border border-amber-200 bg-amber-50/50 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">
            Total pending
          </p>
          {isFetching ? (
            <Skeleton className="mt-3 h-8 w-24" />
          ) : (
            <p className="mt-3 text-2xl font-bold text-amber-700">
              ${totalPendingAmount}
            </p>
          )}
        </div>

        <div className="rounded-[16px] border border-rose-200 bg-rose-50/50 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-700">
            Total rejected
          </p>
          {isFetching ? (
            <Skeleton className="mt-3 h-8 w-24" />
          ) : (
            <p className="mt-3 text-2xl font-bold text-rose-700">
              ${totalRejectedAmount}
            </p>
          )}
        </div>
      </div>

      {isFetching ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="w-full space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-5 w-40" />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                </div>
                <div className="flex gap-3">
                  <Skeleton className="h-11 flex-1" />
                  <Skeleton className="h-11 flex-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : requests.length < 1 ? (
        <div className="rounded-[14px] border border-dashed border-slate-300 bg-white py-16 text-center text-slate-600">
          No withdraw requests found for this status.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {requests.map((request) => {
            const isPending = request.status === "Pending";
            const isMutating = isLoading && activeWithdrawId === request.id;
            const isAccepting = isMutating && activeAction === "accept";
            const isRejecting = isMutating && activeAction === "reject";
            const workerName = request.worker?.userName || "Unknown worker";
            const workerCategory =
              request.worker?.workerProfile?.workerCategory || "N/A";
            const profileImage = request.worker?.profileImage;

            const statusStyles =
              request.status === "Accepted"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : request.status === "Rejected"
                  ? "border-rose-200 bg-rose-50 text-rose-700"
                  : "border-amber-200 bg-amber-50 text-amber-700";

            return (
              <article
                key={request.id}
                className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex flex-col gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      {profileImage ? (
                        <Image
                          src={profileImage}
                          alt={workerName}
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-full border border-slate-200 object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-sm font-semibold text-slate-600">
                          {workerName.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                          {workerName}
                        </h2>
                      </div>
                    </div>

                    <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                      <div>
                        <p className="font-medium text-slate-500">Amount</p>
                        <p className="text-base font-semibold text-slate-900">
                          ${request.amount}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-slate-500">Status</p>
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${statusStyles}`}
                        >
                          {request.status}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-500">Category</p>
                        <p className="text-base text-slate-700">
                          {workerCategory}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-slate-500">Created</p>
                        <p className="text-base text-slate-700">
                          {new Date(request.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {isPending && (
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => handleAcceptReject(request.id, true)}
                        disabled={isMutating}
                        className="inline-flex h-11 flex-1 items-center justify-center rounded-[12px] bg-emerald-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isAccepting ? "Accepting..." : "Accept"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAcceptReject(request.id, false)}
                        disabled={isMutating}
                        className="inline-flex h-11 flex-1 items-center justify-center rounded-[12px] border border-rose-200 bg-rose-50 px-5 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isRejecting ? "Rejecting..." : "Reject"}
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </Container>
  );
};

export default WithdrawRequestPage;
