"use client";
import { useSiteManagersQuery } from "@/redux/features/auth/authApi";
import { useCreateProjectMutation } from "@/redux/features/project/project.api";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type ProjectFormData = {
  projectName: string;
  address: string;
  description: string;
  plumberFees: number;
  electricianFees: number;
  carpenterFees: number;
  painterFees: number;
  cleanerFees: number;
  mechanicFees: number;
  hvacTechnicianFees: number;
  masonFees: number;
  welderFees: number;
  managerId: string;
  fileUrl: FileList;
};

const CreateProjectForm = () => {
  const [createProject, { isLoading }] = useCreateProjectMutation();
  const { data: siteManagers } = useSiteManagersQuery("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetImage = () => {
    setImagePreview(null);
  };

  const onSubmit = async (data: ProjectFormData) => {
    const bodyData = {
      projectName: data.projectName,
      address: data.address,
      description: data.description,
      plumberFees: data.plumberFees,
      electricianFees: data.electricianFees,
      carpenterFees: data.carpenterFees,
      painterFees: data.painterFees,
      cleanerFees: data.cleanerFees,
      mechanicFees: data.mechanicFees,
      hvacTechnicianFees: data.hvacTechnicianFees,
      masonFees: data.masonFees,
      welderFees: data.welderFees,
      managerId: data.managerId,
    };

    const formData = new FormData();
    formData.append("bodyData", JSON.stringify(bodyData));
    if (data.fileUrl?.[0]) {
      formData.append("fileUrl", data.fileUrl[0]);
    }

    try {
      const response = await createProject(formData).unwrap();
      toast.success(response.message || "Project created successfully");
      reset();
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to create project");
      console.log(error);
    }
  };

  return (
    <section className="w-full max-w-4xl mx-2 md:mx-auto my-6 bg-white rounded-[16px] border p-6 shadow-sm">
      <header className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Create Project</h2>
        <p className="text-sm text-gray-500">
          Fill in the details to create a new project.
        </p>
      </header>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="md:flex gap-4">
          <div className="w-full">
            <label className="block mb-1 font-medium text-gray-700">
              Project Name
            </label>
            <input
              type="text"
              placeholder="Enter project name"
              {...register("projectName", {
                required: "Project name is required",
              })}
              className={`input-design ${
                errors.projectName && "border-red-500 focus:ring-red-400"
              }`}
            />
            {errors.projectName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.projectName.message}
              </p>
            )}
          </div>

          <div className="w-full">
            <label className="block mb-1 font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              placeholder="Enter project address"
              {...register("address", { required: "Address is required" })}
              className={`input-design ${
                errors.address && "border-red-500 focus:ring-red-400"
              }`}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">
                {errors.address.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Description
          </label>
          <textarea
            placeholder="Enter project description"
            {...register("description", {
              required: "Description is required",
            })}
            className={`input-design min-h-[96px] ${
              errors.description && "border-red-500 focus:ring-red-400"
            }`}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="md:flex gap-4">
          <div className="w-full">
            <label className="block mb-1 font-medium text-gray-700">
              Site Manager
            </label>
            <select
              {...register("managerId", {
                required: "Site manager is required",
              })}
              className={`input-design ${
                errors.managerId && "border-red-500 focus:ring-red-400"
              }`}
              defaultValue=""
            >
              <option value="" disabled>
                Select site manager
              </option>
              {siteManagers?.result?.map(
                (manager: {
                  id: string;
                  userName: string;
                  profileImage: string | null;
                }) => (
                  <option key={manager.id} value={manager.id}>
                    {manager.userName}
                  </option>
                ),
              )}
            </select>
            {errors.managerId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.managerId.message}
              </p>
            )}
          </div>
           <div className="w-full">
            <label className="block mb-1 font-medium text-gray-700">
              Welder Fees
            </label>
            <input
              type="number"
              placeholder="Enter welder fees"
              {...register("welderFees", {
                required: "Welder fees is required",
                valueAsNumber: true,
              })}
              className={`input-design ${
                errors.welderFees && "border-red-500 focus:ring-red-400"
              }`}
            />
            {errors.welderFees && (
              <p className="text-red-500 text-sm mt-1">
                {errors.welderFees.message}
              </p>
            )}
          </div>

         
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Plumber Fees
            </label>
            <input
              type="number"
              placeholder="Enter plumber fees"
              {...register("plumberFees", {
                required: "Plumber fees is required",
                valueAsNumber: true,
              })}
              className={`input-design ${
                errors.plumberFees && "border-red-500 focus:ring-red-400"
              }`}
            />
            {errors.plumberFees && (
              <p className="text-red-500 text-sm mt-1">
                {errors.plumberFees.message}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Electrician Fees
            </label>
            <input
              type="number"
              placeholder="Enter electrician fees"
              {...register("electricianFees", {
                required: "Electrician fees is required",
                valueAsNumber: true,
              })}
              className={`input-design ${
                errors.electricianFees && "border-red-500 focus:ring-red-400"
              }`}
            />
            {errors.electricianFees && (
              <p className="text-red-500 text-sm mt-1">
                {errors.electricianFees.message}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Carpenter Fees
            </label>
            <input
              type="number"
              placeholder="Enter carpenter fees"
              {...register("carpenterFees", {
                required: "Carpenter fees is required",
                valueAsNumber: true,
              })}
              className={`input-design ${
                errors.carpenterFees && "border-red-500 focus:ring-red-400"
              }`}
            />
            {errors.carpenterFees && (
              <p className="text-red-500 text-sm mt-1">
                {errors.carpenterFees.message}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Painter Fees
            </label>
            <input
              type="number"
              placeholder="Enter painter fees"
              {...register("painterFees", {
                required: "Painter fees is required",
                valueAsNumber: true,
              })}
              className={`input-design ${
                errors.painterFees && "border-red-500 focus:ring-red-400"
              }`}
            />
            {errors.painterFees && (
              <p className="text-red-500 text-sm mt-1">
                {errors.painterFees.message}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Cleaner Fees
            </label>
            <input
              type="number"
              placeholder="Enter cleaner fees"
              {...register("cleanerFees", {
                required: "Cleaner fees is required",
                valueAsNumber: true,
              })}
              className={`input-design ${
                errors.cleanerFees && "border-red-500 focus:ring-red-400"
              }`}
            />
            {errors.cleanerFees && (
              <p className="text-red-500 text-sm mt-1">
                {errors.cleanerFees.message}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Mechanic Fees
            </label>
            <input
              type="number"
              placeholder="Enter mechanic fees"
              {...register("mechanicFees", {
                required: "Mechanic fees is required",
                valueAsNumber: true,
              })}
              className={`input-design ${
                errors.mechanicFees && "border-red-500 focus:ring-red-400"
              }`}
            />
            {errors.mechanicFees && (
              <p className="text-red-500 text-sm mt-1">
                {errors.mechanicFees.message}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              HVAC Technician Fees
            </label>
            <input
              type="number"
              placeholder="Enter HVAC technician fees"
              {...register("hvacTechnicianFees", {
                required: "HVAC technician fees is required",
                valueAsNumber: true,
              })}
              className={`input-design ${
                errors.hvacTechnicianFees && "border-red-500 focus:ring-red-400"
              }`}
            />
            {errors.hvacTechnicianFees && (
              <p className="text-red-500 text-sm mt-1">
                {errors.hvacTechnicianFees.message}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Mason Fees
            </label>
            <input
              type="number"
              placeholder="Enter mason fees"
              {...register("masonFees", {
                required: "Mason fees is required",
                valueAsNumber: true,
              })}
              className={`input-design ${
                errors.masonFees && "border-red-500 focus:ring-red-400"
              }`}
            />
            {errors.masonFees && (
              <p className="text-red-500 text-sm mt-1">
                {errors.masonFees.message}
              </p>
            )}
          </div>
         
        </div>
         <div className="w-full">
            <label className="block mb-1 font-medium text-gray-700">
              Project Image
            </label>
            <div
              className={`relative border-2 border-dashed rounded-[6px] p-8 text-center transition-colors ${
                errors.fileUrl
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 bg-gray-50 hover:border-primary hover:bg-blue-50"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                {...register("fileUrl", { required: "Image is required" })}
                onChange={(e) => {
                  register("fileUrl").onChange(e);
                  handleImageChange(e);
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {imagePreview ? (
                <div className="space-y-3">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={200}
                    height={200}
                    className="mx-auto rounded-lg max-w-xs max-h-48 object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleResetImage();
                    }}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Remove image
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-3xl">🖼️</div>
                  <p className="text-gray-700 font-medium">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-gray-500 text-sm">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              )}
            </div>
            {errors.fileUrl && (
              <p className="text-red-500 text-sm mt-1">
                {errors.fileUrl.message}
              </p>
            )}
          </div>

        <div className="flex gap-8">         
          <button
            type="submit"
            disabled={isLoading}
            className="border border-primary text-white bg-primary py-2 w-full font-medium rounded-[6px] disabled:opacity-60"
          >
            {isLoading ? "Creating..." : "Create Project"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreateProjectForm;
