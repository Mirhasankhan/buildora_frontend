"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useSendWithdrawRequestMutation } from "@/redux/features/withdraw/withdraw.api";
import { useState } from "react";
import { toast } from "react-toastify";

const SendWithdrawRequestModal = () => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [connectLink, setConnectLink] = useState("");
  const [withdrawRequest, { isLoading }] = useSendWithdrawRequestMutation();

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setConnectLink("");
    }
  };

  const handleConnectNow = () => {
    if (!connectLink) return;
    window.open(connectLink, "_blank", "noopener,noreferrer");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsedAmount = Number(amount);
    if (!amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Please enter a valid withdraw amount.");
      return;
    }

    const payload = {
      amount: parsedAmount,
    };

    try {
      const res = await withdrawRequest(payload).unwrap();
      const onboardingLink = res?.result?.link;

      if (res?.success === false && onboardingLink) {
        setConnectLink(onboardingLink);
        toast.warning(res?.message || "Account not connected.");
        return;
      }

      toast.success(res?.message || "Withdraw request sent successfully.");
      setAmount("");
      setOpen(false);
    } catch (error: any) {
      const onboardingLink = error?.data?.result?.link;
      if (onboardingLink) {
        setConnectLink(onboardingLink);
      }
      toast.error(error?.data?.message || "Failed to send withdraw request.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button className="rounded-full bg-primary px-5 py-2 font-medium text-white shadow-sm transition hover:brightness-95">
          Withnow Earnings
        </button>
      </DialogTrigger>

      <DialogContent className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-0 shadow-[0_24px_80px_-24px_rgba(15,23,42,0.35)] sm:max-w-[480px]">
        <div className="bg-gradient-to-r from-slate-50 via-white to-emerald-50/60 px-6 pb-5 pt-6">
          <DialogHeader className="space-y-2 text-left">
            <DialogTitle className="text-2xl font-semibold tracking-tight text-slate-900">
              Send Withdraw Request
            </DialogTitle>
            <DialogDescription className="text-sm leading-6 text-slate-500">
              Enter the amount you want to withdraw.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 pb-6">
          <div className="space-y-2">
            <label
              htmlFor="withdraw-amount"
              className="label-design text-sm text-slate-700"
            >
              Amount
            </label>
            <Input
              id="withdraw-amount"
              type="number"
              min={1}
              step="0.01"
              placeholder="Enter amount"
              className="h-12 rounded-2xl border-slate-200 bg-slate-50 px-4 text-base text-slate-900 shadow-sm transition placeholder:text-slate-400 focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {connectLink ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4">
              <p className="text-sm leading-6 text-amber-900">
                Your Stripe account is not connected yet.
              </p>
              <button
                type="button"
                onClick={handleConnectNow}
                className="mt-3 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
              >
                Connect Now
              </button>
            </div>
          ) : null}

          <DialogFooter className="gap-3 pt-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 sm:w-auto"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full rounded-xl bg-primary px-4 py-2.5 font-semibold text-white shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Request"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SendWithdrawRequestModal;
