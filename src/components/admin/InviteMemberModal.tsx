"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSendInviteMutation } from "@/redux/features/auth/authApi";
import { Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type InviteFormData = {
  email: string;
  role: "SITE_MANAGER" | "WORKER";
  workerType?: string;
};

const InviteMemberModal = () => {
  const [sendInvite, { isLoading }] = useSendInviteMutation();
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<InviteFormData>();

  const role = watch("role");

  const onSubmit = async (data: InviteFormData) => {
    const payload = {
      email: data.email,
      role: data.role,
      workerType: data.role === "WORKER" ? data.workerType : undefined,
    };

    try {
      const response = await sendInvite(payload).unwrap();
      toast.success(response.message || "Invitation sent successfully");
      reset();
      setOpen(false);
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to send invitation");
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-gray-200 text-gray-600 flex items-center justify-center px-6 gap-2 w-full font-medium py-2 rounded-[4px] ">
          <Send size={18}></Send> Invite Member
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white !rounded-[16px]">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Send an invitation to a new worker or manager.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter email address"
              {...register("email", { required: "Email is required" })}
              className={`input-design ${
                errors.email && "border-red-500 focus:ring-red-400"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Role</label>
            <select
              {...register("role", { required: "Role is required" })}
              className={`input-design ${
                errors.role && "border-red-500 focus:ring-red-400"
              }`}
              defaultValue=""
            >
              <option value="" disabled>
                Select role
              </option>
              <option value="SITE_MANAGER">Site Manager</option>
              <option value="WORKER">Worker</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
            )}
          </div>

          {role === "WORKER" && (
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Worker Type
              </label>
              <select
                {...register("workerType", {
                  validate: (value) =>
                    role !== "WORKER" || value
                      ? true
                      : "Worker type is required",
                })}
                className={`input-design ${
                  errors.workerType && "border-red-500 focus:ring-red-400"
                }`}
                defaultValue=""
              >
                <option value="" disabled>
                  Select worker type
                </option>
                <option value="Plumber">Plumber</option>
                <option value="Electrician">Electrician</option>
                <option value="Carpenter">Carpenter</option>
                <option value="Painter">Painter</option>
                <option value="Cleaner">Cleaner</option>
                <option value="Mechanic">Mechanic</option>
                <option value="HVAC_Technician">HVAC Technician</option>
                <option value="Mason">Mason</option>
                <option value="Welder">Welder</option>
              </select>
              {errors.workerType && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.workerType.message}
                </p>
              )}
            </div>
          )}

          <div className="flex gap-8">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="border border-primary text-secondary py-2 w-full font-medium rounded-[6px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="border border-primary text-white bg-primary py-2 w-full font-medium rounded-[6px] disabled:opacity-60"
            >
              {isLoading ? "Sending..." : "Send Invitation"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMemberModal;
