import { baseApi } from "../../api/baseApi";

const withdrawApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendWithdrawRequest: builder.mutation({
      query: (payload) => ({
        url: `/withdraw/send-request`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["payment", "withdraw"],
    }),
    mywithdrawHistory: builder.query({
      query: () => ({
        url: `/withdraw/my-requests`,
        method: "GET",
      }),
      providesTags: ["payment", "withdraw"],
    }),
  }),
});

export const {useSendWithdrawRequestMutation, useMywithdrawHistoryQuery } = withdrawApi;
