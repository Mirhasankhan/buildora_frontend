import { baseApi } from "../../api/baseApi";

const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProject: builder.mutation({
      query: (formData) => ({
        url: "/project/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["projects"],
    }),
    allProjects: builder.query({
      query: () => ({
        url: "/project/all",
        method: "GET",
      }),
      providesTags: ["projects"],
    }),
    managerProjects: builder.query({
      query: () => ({
        url: "/project/site-manager-wise",
        method: "GET",
      }),
      providesTags: ["projects"],
    }),
    projectDetails: builder.query({
      query: (id) => ({
        url: `/project/details/${id}`,
        method: "GET",
      }),
      providesTags: ["projects"],
    }),
  }),
});

export const {
  useCreateProjectMutation,
  useAllProjectsQuery,
  useProjectDetailsQuery,
  useManagerProjectsQuery,
} = projectApi;
