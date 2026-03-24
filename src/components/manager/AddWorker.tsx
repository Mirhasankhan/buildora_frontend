"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAssignWorkerMutation,
  useFreeWorkersQuery,
} from "@/redux/features/project/project.api";
import { CheckCircle2, Plus, Sparkles, Users } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";

type AddWorkerProps = {
  projectId: string;
};

const workerCategories = [
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

const formatWorkerCategory = (category: string) => {
  return category.replaceAll("_", " ");
};

const AddWorker = ({ projectId }: AddWorkerProps) => {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedWorkerId, setSelectedWorkerId] = useState("");

  const { data: freeWorkers, isFetching: isFetchingWorkers } =
    useFreeWorkersQuery(selectedCategory, {
      skip: !selectedCategory,
    });

  const [assignWorker, { isLoading: isAssigning }] = useAssignWorkerMutation();

  const workers = useMemo(() => {
    return freeWorkers?.result || [];
  }, [freeWorkers]);

  const handleModalChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSelectedCategory("");
      setSelectedWorkerId("");
    }
  };

  const handleAssignWorker = async () => {
    if (!projectId) {
      toast.error("Project id is missing.");
      return;
    }

    if (!selectedCategory) {
      toast.error("Please select a worker category.");
      return;
    }

    if (!selectedWorkerId) {
      toast.error("Please select a worker.");
      return;
    }

    const payload = {
      projectId,
      workerId: selectedWorkerId,
    };

    try {
      const response = await assignWorker(payload).unwrap();
      toast.success(response?.message || "Worker assigned successfully.");
      setOpen(false);
      setSelectedCategory("");
      setSelectedWorkerId("");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to assign worker.");
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={handleModalChange}>
        <DialogTrigger asChild>
          <button className="group inline-flex items-center gap-2 rounded-[10px] border border-primary/20 bg-gradient-to-r from-primary to-primary/80 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <Plus size={16} />
            Add Worker
            <Sparkles
              size={14}
              className="opacity-90 transition-transform duration-200 group-hover:rotate-12"
            />
          </button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[560px] bg-white !rounded-[16px] border-0 p-0 overflow-hidden">
          <DialogHeader>
            <div className="px-6 pt-5">
              <DialogTitle className="text-xl">Assign Worker</DialogTitle>
              <DialogDescription className="mt-1">
                Choose a role first, then select exactly one available worker.
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="space-y-5 px-6 pb-6">
            <div className="rounded-[12px] border border-gray-200/80 bg-gray-50/70 p-4">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Worker Role
              </label>
              <Select
                value={selectedCategory}
                onValueChange={(value) => {
                  setSelectedCategory(value);
                  setSelectedWorkerId("");
                }}
              >
                <SelectTrigger className="w-full rounded-[10px] bg-white">
                  <SelectValue placeholder="Select worker role" />
                </SelectTrigger>
                <SelectContent className="z-[80] rounded-[10px] border border-gray-200 bg-white text-gray-900 shadow-xl">
                  {workerCategories.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="text-gray-800 focus:bg-primary/10 focus:text-primary"
                    >
                      {formatWorkerCategory(category)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-[12px] border border-gray-200/80 bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Available Workers
                </label>
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                  <Users size={12} />
                  {workers.length} available
                </span>
              </div>

              {!selectedCategory && (
                <div className="rounded-[10px] border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500">
                  Select a worker role to load available workers.
                </div>
              )}

              {selectedCategory && isFetchingWorkers && (
                <div className="space-y-2">
                  <div className="h-11 w-full animate-pulse rounded-[10px] bg-gray-100" />
                  <div className="h-11 w-full animate-pulse rounded-[10px] bg-gray-100" />
                  <div className="h-11 w-full animate-pulse rounded-[10px] bg-gray-100" />
                </div>
              )}

              {selectedCategory &&
                !isFetchingWorkers &&
                workers.length === 0 && (
                  <div className="rounded-[10px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                    No free workers found for{" "}
                    {formatWorkerCategory(selectedCategory)}.
                  </div>
                )}

              {selectedCategory && !isFetchingWorkers && workers.length > 0 && (
                <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
                  {workers.map(
                    (worker: {
                      id: string;
                      userName?: string;
                      profileImage?: string;
                    }) => {
                      const isSelected = selectedWorkerId === worker.id;

                      return (
                        <button
                          key={worker.id}
                          type="button"
                          onClick={() => setSelectedWorkerId(worker.id)}
                          className={`w-full rounded-[10px] border px-3 py-2 text-left transition-all ${
                            isSelected
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-gray-200 bg-white hover:border-primary/40 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-primary text-xs font-semibold text-white">
                                <Image
                                  src={worker.profileImage as string}
                                  alt={worker.userName || "Unnamed Worker"}
                                  width={36}
                                  height={36}
                                  className="h-full w-full rounded-full object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-gray-900">
                                  {worker.userName || "Unnamed Worker"}
                                </p>
                                <p className="truncate text-xs text-gray-500">
                                  {formatWorkerCategory(selectedCategory)}
                                </p>
                              </div>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                            )}
                          </div>
                        </button>
                      );
                    },
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-[8px] border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAssignWorker}
                disabled={!selectedWorkerId || isAssigning}
                className="rounded-[8px] border border-primary bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isAssigning ? "Assigning..." : "Assign Worker"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddWorker;
