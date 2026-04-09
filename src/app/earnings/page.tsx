"use client";

import { useProfileQuery } from "@/redux/features/auth/authApi";
import Container from "@/utils/Container";
import { format } from "date-fns";
import Link from "next/link";

const EarningsPage = () => {
  const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

  const formatDate = (value?: string) => {
    if (!value) return "--";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "--";

    return format(date, "dd MMM yyyy");
  };
  const formatMoney = (value?: number) => currencyFormatter.format(value ?? 0);
  const { data, isLoading } = useProfileQuery("");

  const payments = Array.isArray(data?.result?.payments)
    ? data?.result?.payments
    : [];
  const project = data?.result?.workerProfile?.project ?? {};
  const totalEarnings = payments.reduce(
    (sum: number, payment: any) => sum + Number(payment?.amount ?? 0),
    0,
  );
  const latestPaymentDate =
    payments.length > 0
      ? formatDate(
          [...payments].sort(
            (a: any, b: any) =>
              new Date(b?.createdAt ?? 0).getTime() -
              new Date(a?.createdAt ?? 0).getTime(),
          )?.[0]?.createdAt,
        )
      : "--";

  return (
    <Container className="py-4 sm:py-6">
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary  to-primary/50 p-5 text-white shadow-xl sm:p-8">
          <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/15 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 left-10 h-40 w-40 rounded-full bg-black/10 blur-2xl" />

          <div className="relative">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-white/80">
                  Earnings Overview
                </p>
                <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
                  Your payouts at a glance
                </h1>
              </div>

              <Link
                href="/withdraw"
                className="inline-flex w-full items-center justify-center rounded-xl border border-white/25 bg-white px-4 py-2 text-sm font-semibold text-primary shadow-md transition hover:bg-white/90 sm:w-auto"
              >
                Withnow Earnings
              </Link>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
                <p className="text-xs uppercase tracking-[0.16em] text-white/80">
                  Total Earned
                </p>
                <p className="mt-2 text-2xl font-semibold">
                  {formatMoney(totalEarnings)}
                </p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
                <p className="text-xs uppercase tracking-[0.16em] text-white/80">
                  Total Payments
                </p>
                <p className="mt-2 text-2xl font-semibold">{payments.length}</p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
                <p className="text-xs uppercase tracking-[0.16em] text-white/80">
                  Last Payment
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {latestPaymentDate}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-100 px-5 py-4 sm:px-6">
            <h2 className="text-lg font-semibold text-stone-900">
              Transactions
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              A detailed list of your completed earnings.
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-3 p-5 sm:p-6">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="h-20 animate-pulse rounded-2xl bg-stone-100"
                />
              ))}
            </div>
          ) : payments.length > 0 ? (
            <div className="space-y-3 grid grid-cols-1 md:grid-cols-2 gap-8 p-4 sm:p-5">
              {payments.map((payment: any, index: number) => (
                <div
                  key={`${payment.createdAt ?? "payment"}-${index}`}
                  className="group rounded-2xl border border-stone-200 bg-stone-50 p-4 transition hover:border-teal-200 hover:bg-teal-50/40"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-stone-900">
                        {payment.project?.projectName ||
                          project?.projectName ||
                          "Project payment"}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-stone-500">
                        <span>{formatDate(payment.createdAt)}</span>
                        <span className="hidden sm:inline">|</span>
                        <span>Credited to wallet</span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-xl font-semibold text-stone-900">
                        {formatMoney(Number(payment.amount ?? 0))}
                      </p>
                      <span className="mt-1 inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        Completed
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-5 py-12 text-center sm:px-6">
              <p className="text-lg font-medium text-stone-800">
                No earnings recorded yet
              </p>
              <p className="mt-2 text-sm text-stone-500">
                Your completed project payouts will appear here automatically.
              </p>
            </div>
          )}
        </section>
      </div>
    </Container>
  );
};

export default EarningsPage;
