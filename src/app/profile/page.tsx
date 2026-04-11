"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Image from "next/image";
import { Camera, LogOut } from "lucide-react";
import {
  useProfileQuery,
  useUpdateImageMutation,
  useUpdateProfileMutation,
} from "@/redux/features/auth/authApi";
import Container from "@/utils/Container";
import { setUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

type AppRole = "ADMIN" | "SITE_MANAGER" | "WORKER";

type ProfileFormValues = {
  userName: string;
  phoneNumber?: string;
  presentAddress?: string;
  permanentAddress?: string;
};

const ProfilePage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data, isLoading } = useProfileQuery("");
  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateProfileMutation();
  const [updateImage, { isLoading: isUpdatingImage }] =
    useUpdateImageMutation();

  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);

  const profile = data?.result;
  const role = (profile?.role as AppRole | undefined) ?? "WORKER";
  const isWorker = role === "WORKER";
  const workerProfile = profile?.workerProfile ?? {};

  const imageSrc = localPreviewUrl || profile?.profileImage || "";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      userName: "",
      phoneNumber: "",
      presentAddress: "",
      permanentAddress: "",
    },
  });

  useEffect(() => {
    if (!profile) return;

    reset({
      userName: profile?.userName || "",
      phoneNumber: workerProfile?.phoneNumber || "",
      presentAddress: workerProfile?.presentAddress || "",
      permanentAddress: workerProfile?.permanentAddress || "",
    });
  }, [
    profile,
    workerProfile?.permanentAddress,
    workerProfile?.phoneNumber,
    workerProfile?.presentAddress,
    reset,
  ]);

  useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      const payload: Record<string, string> = {
        userName: values.userName,
      };

      if (isWorker) {
        payload.phoneNumber = values.phoneNumber?.trim() || "";
        payload.presentAddress = values.presentAddress?.trim() || "";
        payload.permanentAddress = values.permanentAddress?.trim() || "";
      }

      const response = await updateProfile(payload).unwrap();
      toast.success(response?.message || "Profile updated successfully.");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update profile.");
    }
  };

  const handleImageSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setLocalPreviewUrl((prevUrl) => {
      if (prevUrl) URL.revokeObjectURL(prevUrl);
      return objectUrl;
    });

    try {
      const formData = new FormData();
      formData.append("profileImage", file);

      const response = await updateImage(formData).unwrap();
      toast.success(response?.message || "Profile image updated successfully.");
    } catch (error: any) {
      setLocalPreviewUrl(null);
      toast.error(error?.data?.message || "Failed to update profile image.");
    } finally {
      event.target.value = "";
    }
  };

  const handleLogout = () => {
    dispatch(
      setUser({
        name: "",
        email: "",
        role: "",
        token: "",
      }),
    );
    Cookies.remove("token");
    router.push("/");
  };

  return (
    <Container className="py-4 sm:py-6">
      <div className="mx-auto max-w-4xl space-y-5">
        <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-stone-900">
                My Profile
              </h1>
              <p className="mt-1 text-sm text-stone-500">
                Update your profile details from one place.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-[6px] border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
          {isLoading ? (
            <p className="text-stone-500">Loading profile...</p>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="pb-2">
                <input
                  id="profile-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  disabled={isUpdatingImage}
                />

                <label
                  htmlFor="profile-image-input"
                  className="group relative mx-auto block h-36 w-36 cursor-pointer overflow-hidden rounded-full border border-stone-200 bg-stone-100"
                >
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt="Profile"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-stone-500">
                      No image
                    </div>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-stone-800">
                      <Camera className="h-5 w-5" />
                    </div>
                  </div>

                  {isUpdatingImage ? (
                    <div className="absolute inset-x-0 bottom-0 bg-black/65 px-2 py-1 text-center text-xs font-medium text-white">
                      Uploading...
                    </div>
                  ) : null}
                </label>
              </div>

              <div>
                <label className="label-design">Name</label>
                <input
                  type="text"
                  {...register("userName", { required: "Name is required" })}
                  className={`input-design ${
                    errors.userName ? "border-red-500 focus:ring-red-400" : ""
                  }`}
                  placeholder="Enter your name"
                />
                {errors.userName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.userName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="label-design">Email</label>
                <input
                  type="email"
                  value={profile?.email || ""}
                  disabled
                  className="input-design cursor-not-allowed bg-stone-100 text-stone-500"
                />
              </div>

              {isWorker && (
                <>
                  <div>
                    <label className="label-design">Phone Number</label>
                    <input
                      type="text"
                      {...register("phoneNumber")}
                      className="input-design"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label className="label-design">Present Address</label>
                    <textarea
                      rows={3}
                      {...register("presentAddress")}
                      className="input-design min-h-[96px]"
                      placeholder="Enter present address"
                    />
                  </div>

                  <div>
                    <label className="label-design">Permanent Address</label>
                    <textarea
                      rows={3}
                      {...register("permanentAddress")}
                      className="input-design min-h-[96px]"
                      placeholder="Enter permanent address"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="w-full rounded-[6px] bg-primary px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUpdatingProfile ? "Saving..." : "Save Changes"}
              </button>
            </form>
          )}
        </section>
      </div>
    </Container>
  );
};

export default ProfilePage;
