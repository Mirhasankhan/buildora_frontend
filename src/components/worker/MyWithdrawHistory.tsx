"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type WithdrawRecord = {
  amount?: number;
  createdAt?: string;
  status?: string;
  id?: string;
};

type MyWithdrawHistoryProps = {
  records: WithdrawRecord[];
  isLoading?: boolean;
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

  return format(date, "dd MMM yyyy, hh:mm a");
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

const MyWithdrawHistory = ({
  records,
  isLoading = false,
}: MyWithdrawHistoryProps) => {
  if (isLoading) {
    return (
      <div className="space-y-3 p-5 sm:p-6">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <Skeleton className="h-4 w-32 rounded-full bg-stone-200" />
                <Skeleton className="h-3 w-44 rounded-full bg-stone-200" />
                <Skeleton className="h-3 w-24 rounded-full bg-stone-200" />
              </div>
              <Skeleton className="h-10 w-24 rounded-full bg-stone-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="px-5 py-14 text-center sm:px-6">
        <p className="text-lg font-semibold text-stone-900">
          No withdrawal requests yet
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">
          Your withdrawal history will appear here once you submit a request.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 grid grid-cols-1 md:grid-cols-2 gap-8 p-4 sm:p-6">
      {records.map((record, index) => (
        <div
          key={record.id ?? `${record.createdAt ?? "withdraw"}-${index}`}
          className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition hover:border-primary/20 hover:shadow-md"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 space-y-1.5">
              <p className="text-base font-semibold text-stone-900">
                Withdrawal request
              </p>
              <p className="text-sm text-stone-500">
                {formatDate(record.createdAt)}
              </p>
            </div>

            <div className="flex items-start gap-3 sm:flex-col sm:items-end sm:text-right">
              <div className="text-left sm:text-right">
                <p className="text-xl font-semibold tracking-tight text-stone-900 sm:text-2xl">
                  {formatMoney(Number(record.amount ?? 0))}
                </p>
              </div>
              <span
                className={cn(
                  "inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize",
                  getStatusStyles(record.status),
                )}
              >
                {formatStatus(record.status)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyWithdrawHistory;
