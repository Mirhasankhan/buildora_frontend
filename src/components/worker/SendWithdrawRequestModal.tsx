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
        <button className="rounded-[6px] bg-primary px-5 py-2 font-medium text-white">
          Withnow Earnings
        </button>
      </DialogTrigger>

      <DialogContent className="bg-white sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>Send Withdraw Request</DialogTitle>
          <DialogDescription>
            Enter the amount you want to withdraw.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="withdraw-amount" className="label-design">
              Amount
            </label>
            <Input
              id="withdraw-amount"
              type="number"
              min={1}
              step="0.01"
              placeholder="Enter amount"
              className="rounded-[7px]"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {connectLink ? (
            <div className="rounded-[8px] border border-amber-200 bg-amber-50 p-3">
              <p className="text-sm text-amber-800">
                Your Stripe account is not connected yet.
              </p>
              <button
                type="button"
                onClick={handleConnectNow}
                className="mt-2 rounded-[6px] bg-amber-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-amber-600"
              >
                Connect Now
              </button>
            </div>
          ) : null}

          <DialogFooter>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full rounded-[6px] border border-primary px-4 py-2 font-medium text-secondary sm:w-auto"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full rounded-[6px] bg-primary px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
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
