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
    allRequests: builder.query({
      query: (status) => ({
        url: `/withdraw/all-requests?status=${status}`,
        method: "GET",
      }),
      providesTags: ["payment", "withdraw"],
    }),
    acceptRejectWithdraw: builder.mutation({
      query: (payload) => ({
        url: `/withdraw/accept-reject`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["payment", "withdraw"],
    }),
  }),
});

export const {
  useSendWithdrawRequestMutation,
  useMywithdrawHistoryQuery,
  useAllRequestsQuery,
  useAcceptRejectWithdrawMutation,
} = withdrawApi;
