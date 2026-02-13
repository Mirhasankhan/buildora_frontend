import { baseApi } from "../../api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendInvite: builder.mutation({
      query: (payload) => ({
        url: "/users/send-invite",
        method: "POST",
        body: payload,
      }),
    }),
    registerRequest: builder.mutation({
      query: (payload) => ({
        url: "/users/register-via-invite",
        method: "POST",
        body: payload,
      }),
    }),

    resendOtp: builder.mutation({
      query: (email) => ({
        url: "/user/resend-otp",
        method: "POST",
        body: email,
      }),
    }),
    login: builder.mutation({
      query: (payload) => ({
        url: "/auth/login",
        method: "POST",
        body: payload,
      }),
    }),

    profile: builder.query({
      query: () => ({
        url: "/user/profile",
        method: "GET",
      }),
      providesTags: ["users", "availability"],
    }),
    sendOtp: builder.mutation({
      query: (email) => ({
        url: "/auth/send-otp",
        method: "POST",
        body: email,
      }),
    }),
    verifyOtp: builder.mutation({
      query: ({ email, otp }) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: { email, otp },
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "PATCH",
        body: data,
        headers: {
          Authorization: data.token,
        },
      }),
    }),
    changePassword: builder.mutation({
      query: (newPassword) => ({
        url: "/auth/reset-password",
        method: "PATCH",
        body: newPassword,
      }),
    }),
    updateImage: builder.mutation({
      query: (image) => ({
        url: "/users/update/profileImage",
        method: "PUT",
        body: image,
      }),
      invalidatesTags: ["users"],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/auth/update",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["users"],
    }),
    updateprofileImage: builder.mutation({
      query: (file) => ({
        url: "/auth/upload/profileImage",
        method: "PUT",
        body: file,
      }),
      invalidatesTags: ["users"],
    }),

    allUsers: builder.query({
      query: ({ searchQuery, selectedRole, page, limit }) => ({
        url: `/analysis/all-users?search=${searchQuery}&role=${selectedRole}&page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["users"],
    }),
    siteManagers: builder.query({
      query: () => ({
        url: `/users/site-managers`,
        method: "GET",
      }),
      providesTags: ["users"],
    }),
  }),
});

export const {
  useSendInviteMutation,
  useSendOtpMutation,
  useRegisterRequestMutation,
  useResendOtpMutation,
  useProfileQuery,
  useUpdateImageMutation,
  useUpdateprofileImageMutation,
  useLoginMutation,
  useAllUsersQuery,
  useUpdateProfileMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useSiteManagersQuery
} = authApi;
