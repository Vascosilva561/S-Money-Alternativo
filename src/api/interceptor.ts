import { api } from "@/api";


// REQUEST interceptor 
api.interceptors.request.use((config) => {

  const token = localStorage.getItem("tokenSomoney");


  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// RESPONSE interceptor 
api.interceptors.response.use(

  (response) => {
    return response
  },


  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("front/sessions/manager-refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem(
          "refreshToken-somoney-backoffice"
        );

        if (!refreshToken) {
          throw new Error("Refresh token não encontrado");
        }

        const response = await api.post(
          "front/sessions/manager-refresh-token",
          {
            refresh_token: refreshToken,
          }
        );

        // const { accessToken, refreshToken: newRefreshToken } =
        //   response.data;
        
        const { token, refresh_token: newRefreshToken } =
          response.data;

        localStorage.setItem("tokenSomoney", token);

        if (newRefreshToken) {
          localStorage.setItem(
            "refreshToken-somoney-backoffice",
            newRefreshToken
          );
        }

        originalRequest.headers.Authorization =
          `Bearer ${token}`;

        return api(originalRequest);
      } catch (err) {
        window.dispatchEvent(new Event("auth:toast-logout"));
        window.dispatchEvent(new Event("auth:logout"));
      }
    }

    return Promise.reject(error);
  }
);

export default api;