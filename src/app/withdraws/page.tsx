"use client";

import MyWithdrawHistory from "@/components/worker/MyWithdrawHistory";
import SendWithdrawRequestModal from "@/components/worker/SendWithdrawRequestModal";
import { useMywithdrawHistoryQuery } from "@/redux/features/withdraw/withdraw.api";
import Container from "@/utils/Container";

type WithdrawRecord = {
  amount?: number;
  createdAt?: string;
  status?: string;
  id?: string;
};

const WithdrawPage = () => {
  const { data, isLoading } = useMywithdrawHistoryQuery("");
  const records = (
    Array.isArray(data?.result) ? data.result : []
  ) as WithdrawRecord[];

  return (
    <Container className="py-4 sm:py-6">
      <div className="space-y-5">
        <div className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h1 className="text-2xl font-semibold text-stone-900">
              Withdrawals
            </h1>
            <p className="mt-1 text-sm text-stone-500">
              View your withdrawal requests and create a new one.
            </p>
          </div>
          <div className="sm:shrink-0">
            <SendWithdrawRequestModal />
          </div>
        </div>

        <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-100 px-4 py-4 sm:px-5">
            <h2 className="text-lg font-semibold text-stone-900">
              Withdrawal history
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              Your submitted requests appear below.
            </p>
          </div>

          <MyWithdrawHistory records={records} isLoading={isLoading} />
        </section>
      </div>
    </Container>
  );
};

export default WithdrawPage;
