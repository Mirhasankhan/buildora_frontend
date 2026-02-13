"use client";

import React from "react";
import { useForm } from "react-hook-form";

const specializations = [
  "Criminal Defense",
  "Business Law",
  "Family Law",
  "Real Estate Law",
  "Personal Injury",
  "Estate Planning",
  "Employment Law",
  "Immigration Law",
  "Intellectual Property",
  "Tax Law",
  "Environmental Law",
  "Medical Malpractice",
];

const barAssociations = [
  "Dhaka Bar Association",
  "Chittagong Bar Association",
  "Khulna Bar Association",
  "Rajshahi Bar Association",
  "Sylhet Bar Association",
  "Barisal Bar Association",
];

type FormValues = {
  specialization: string[];
  experienceOfYears: number;
  licenceNumber: string;
  barAssociation: string;
  type: string;
  fee: number;
  lawDegree: FileList;
};

const LawyerForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    console.log(data);
    // const formData = new FormData();
    // formData.append("experienceOfYears", data.experienceOfYears.toString());
    // formData.append("licenceNumber", data.licenceNumber);
    // formData.append("barAssociation", data.barAssociation);
    // formData.append("fee", data.fee.toString());

    // data.specialization.forEach((spec) => {
    //   formData.append("specialization", spec);
    // });

    // if (data.lawDegree && data.lawDegree[0]) {
    //   formData.append("files", data.lawDegree[0]);
    // }

    // fetch("/api/lawyer/register", {
    //   method: "POST",
    //   body: formData,
    // }).then((res) => {
    //   if (res.ok) alert("Submitted!");
    //   else alert("Submission failed!");
    // });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 p-2 via-blue-50 to-indigo-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-12 flex flex-col items-center w-full bg-white md:w-3/4 xl:w-1/2 2xl:w-1/3 shadow-md mx-auto p-6 space-y-2  rounded-[4px]"
      >
        <div className="w-full">
          <label className="font-semibold block mb-2">
            Areas of Specialization <span className="text-red-500">*</span>
          </label>
          <p className="text-sm text-gray-500 mb-2">Select all that apply</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {specializations.map((spec) => (
              <label key={spec} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={spec}
                     className="accent-[orange-600] w-5 h-5"
                  {...register("specialization", { required: true })}
                />
                <span>{spec}</span>
              </label>
            ))}
          </div>
          {errors.specialization && (
            <p className="text-red-500 text-sm mt-1">
              Please select at least one specialization.
            </p>
          )}
        </div>
        <div className="w-full">
          <label className="block font-semibold">Years of Experience</label>
          <input
            type="number"
            {...register("experienceOfYears", { required: true, min: 0 })}
            className="w-full p-2 border rounded-[4px]"
          />
          {errors.experienceOfYears && (
            <p className="text-red-500 text-sm">
              Enter a valid number of years.
            </p>
          )}
        </div>
        <div className="w-full">
          <label className="block font-semibold">License Number</label>
          <input
            type="text"
            {...register("licenceNumber", { required: true })}
            className="w-full p-2 border rounded-[4px]"
          />
          {errors.licenceNumber && (
            <p className="text-red-500 text-sm">License number is required.</p>
          )}
        </div>
        <div className="w-full">
          <label className="block font-semibold">Bar Association</label>
          <select
            {...register("barAssociation", { required: true })}
            className="w-full p-2 border rounded-[4px]"
          >
            <option value="">Select one</option>
            {barAssociations.map((bar) => (
              <option key={bar} value={bar}>
                {bar}
              </option>
            ))}
          </select>
          {errors.barAssociation && (
            <p className="text-red-500 text-sm">
              Please select a bar association.
            </p>
          )}
        </div>
        <div className="w-full">
          <label className="label-design">Service Type</label>
          <select
            {...register("type")}
            className="w-full border px-3 py-2 rounded mt-1"
          >
            <option value="">Select Service Type</option>
            <option value="online">Online Consultation</option>
            <option value="inPerson">In-Persion</option>
            <option value="both">Online & In-Persion</option>
          </select>
        </div>
        <div className="w-full">
          <label className="block font-semibold">Fee (BDT)</label>
          <input
            type="number"
            {...register("fee", { required: true, min: 0 })}
            className="w-full p-2 border rounded-[4px]"
          />
          {errors.fee && (
            <p className="text-red-500 text-sm">Please enter a valid fee.</p>
          )}
        </div>
        <div className="w-full">
          <label className="block font-semibold">Law Degree Image</label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            {...register("lawDegree", { required: true })}
            className="w-full p-2 border rounded-[4px]"
          />
          {errors.lawDegree && (
            <p className="text-red-500 text-sm">Law degree file is required.</p>
          )}
        </div>
        <div className="flex gap-4 w-full">
          <button className="w-full py-2 round-[4px] border">Skip Now</button>
          <button
            type="submit"
            className="bg-primary text-white py-2 rounded-[4px] w-full"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default LawyerForm;
