import { TExprt } from "@/types/common";
import Image from "next/image";
import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const Expert = ({ experts }: { experts: TExprt[] }) => {
  return (
    <>
      {experts?.map((expert: TExprt) => (
        <div
          className="bg-white rounded-[4px] p-2 shadow-lg flex flex-col items-center"
          key={expert.id}
        >
          <Image
            alt="expert"
            className="object-cover rounded-[4px] h-[280px] w-full"
            height={300}
            width={500}
            src={expert.imageUrl}
          />

          <div className="bg-white text-center py-6">
            <h1 className="text-xl">{expert.name}</h1>
            <p className="pt-2">{expert.category.categoryName} Expert</p>
          </div>
          <div className="flex gap-4 text-xl">
            <div className="bg-white text-secondary hover:bg-primary hover:text-white border border-primary p-1">
              <FaFacebookF size={13} />
            </div>
            <div className="bg-white text-secondary hover:bg-primary hover:text-white border border-primary p-1">
              <FaInstagram size={13} />
            </div>
            <div className="bg-white text-secondary hover:bg-primary hover:text-white border border-primary p-1">
              <FaTwitter size={13} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Expert;
