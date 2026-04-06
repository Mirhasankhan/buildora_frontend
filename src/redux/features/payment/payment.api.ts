import { baseApi } from "../../api/baseApi";

const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    nonPaidDays: builder.query({
      query: (id) => ({
        url: `/payment/non-paid/${id}`,
        method: "GET",
      }),
      providesTags: ["payment"],
    }),
    dailyPayment: builder.mutation({
      query: (id) => ({
        url: `/payment/daily/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["projects", "payment"],
    }),
  }),
});

export const { useNonPaidDaysQuery, useDailyPaymentMutation } = paymentApi;
