import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import toast from "react-hot-toast";
import { authActions } from "../redux/slices/authSlice";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../redux/hooks";

const parseErrorMessage = (errResponse: AxiosResponse): string => {
  console.log("ERR RESPONSE:", errResponse);
  return errResponse?.data ? errResponse.data.message : "";
};

export const apiClient: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}`,
});

interface AxiosInterceptorProps {
  children: React.ReactNode;
}

function AxiosInterceptor({ children }: AxiosInterceptorProps) {
  const [isSet, setIsSet] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const requestInterceptor = (config: InternalAxiosRequestConfig) => {
      const authToken = localStorage.getItem("authToken");
      const magicToken = localStorage.getItem("magicToken");
      const tempToken = localStorage.getItem("tempToken");

      if (config.headers) {
        if (authToken) config.headers["x-access-token"] = authToken;
        if (magicToken) config.headers["x-access-token"] = magicToken;
        if (tempToken) config.headers["x-temp-token"] = tempToken;
      }

      return config;
    };

    const responseInterceptor = (response: AxiosResponse) => {
      return response;
    };

    const errorInterceptor = (error: AxiosError) => {
      console.log("\nERROR INTERCEPTOR:");
      console.log(error.response);

      const message = parseErrorMessage(error.response as AxiosResponse);
      if (message) {
        error.message = message;
      }

      toast.error(error.message, { position: "top-right" });

      const currentPath = window.location.pathname;
      if (error.response?.status === 401 && !currentPath.includes("login")) {
        toast.error(message, { position: "top-right" });
        dispatch(authActions.logout());
      }

      return Promise.reject(error);
    };

    const interceptorRequest = apiClient.interceptors.request.use(requestInterceptor, (error) => {
      console.log("interceptor request error", error);
    });

    const interceptorResponse = apiClient.interceptors.response.use(
      responseInterceptor,
      errorInterceptor
    );

    setIsSet(true);
    return () => {
      apiClient.interceptors.request.eject(interceptorRequest);
      apiClient.interceptors.response.eject(interceptorResponse);
    };
  }, [dispatch, isSet]);

  return isSet && children;
}

export { AxiosInterceptor };

// apiClient.interceptors.request.use((config) => {
//   const authToken = localStorage.getItem("authToken");
//   const magicToken = localStorage.getItem("magicToken");
//   const tempToken = localStorage.getItem("tempToken");

//   if (authToken) config.headers["x-access-token"] = authToken;
//   if (magicToken) config.headers["x-access-token"] = magicToken;
//   if (tempToken) config.headers["x-temp-token"] = tempToken;

//   return config;
// });

// apiClient.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (isAxiosError(error)) {
//       console.log("AXIOS ERROR:", error);
//       // console.log(error.response?.data);
//       // console.log("ERROR RESPONSE:", error.response);

//       if (error.response?.data?.message === "Vaidation Failure") {
//         toast.error(Object.values(error.response?.data?.validationErrors as object)[0], {
//           position: "top-right",
//         });
//       }

//       console.log("\bERROR CODE:", error.response?.status);

//       if (error.response?.status === 401) {
//         console.log("\nENTERED HERE:");
//         // toast.error(error.response?.data.message, { position: "top-right" });
//         // store.dispatch(authActions.logout());

//         // const dispatch = useDispatch();

//         // const navigate = useNavigate();
//         // console.log("\nLOGGING USER OUT:");
//         // dispatch(authActions.logout());
//         // navigate("/login");
//       }

//       // if (error.response?.status === )
//     }
//     return Promise.reject(error);
//   }
// );
