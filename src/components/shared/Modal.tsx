import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const UpdateExpenseModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-primary w-full font-medium p-1 rounded-[4px] text-white">
          Connect
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Setup Payment</DialogTitle>
          <DialogDescription>
            Setup your payment to get paid. If you don&apos;t connect your
            account with stripe user won&apos;t be able to book you
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-8">
          <button className="border border-primary text-secondary py-2 w-full font-medium rounded-[6px]">
            Skip Now
          </button>
          <button className="border border-primary text-white bg-primary py-2 w-full font-medium rounded-[6px]">
            Connect Stripe
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateExpenseModal;
