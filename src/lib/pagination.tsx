"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  totalPage: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const Pagination = ({
  totalPage,
  setCurrentPage,
  currentPage,
}: PaginationProps) => {
  return (
    <div className="flex justify-end items-center">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="h-8 w-8 bg-[#E353141A] text-bprimary cursor-pointer"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {Array.from({ length: totalPage }, (_, i) => i + 1)
          .filter(
            (page) =>
              page === 1 ||
              page === totalPage ||
              (page >= currentPage - 1 && page <= currentPage + 1),
          )
          .map((page, index, array) => (
            <React.Fragment key={index}>
              {index > 0 && array[index - 1] !== page - 1 && (
                <span key={`ellipsis-${page}`} className="px-2">
                  ...
                </span>
              )}
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`h-8 w-8 rounded-md hover:bg-[#E353141A] hover:text-bprimary cursor-pointer ${
                  currentPage === page ? "bg-bprimary text-white" : ""
                }`}
              >
                {page}
              </button>
            </React.Fragment>
          ))}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPage))
          }
          disabled={currentPage === totalPage}
          className="h-8 w-8 bg-[#E353141A] text-bprimary cursor-pointer"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
