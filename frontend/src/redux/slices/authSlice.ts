import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient } from "../../api/apiClient";
import {
  IBusiness,
  ICloudinaryFile,
  IUser,
  LoginData,
  ProfileData,
  RegisterData,
  AuthState,
  IProfile,
} from "../../types/auth";
import { base64ToFile } from "../../utils/files";
import { Country, ICountry } from "country-state-city";
import { AxiosResponse } from "axios";

const initialState: AuthState = {
  loading: false,
  updating: false,
  error: "",
  user: null,
  token: "",
  profileComplete: false,
  profileData: {
    name: "",
    country: {} as ICountry,
    state: "",
    businessPhoneNumber: "",
    logo: null,
    backgroundImage: null,
    contactEmail: "",
    contactName: "",
    contactRole: "",
    instagram: "",
    tiktok: "",
    whatsapp: "",
    facebook: "",
    contactNumber: "",
    details: "This is a good restaurant",
  },
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateProfileData: (state, action: PayloadAction<object>) => {
      state.profileData = {
        ...state.profileData,
        ...action.payload,
      };
    },
    updateLogoData: (state, action: PayloadAction<string | Blob | null>) => {
      state.profileData!.logo = action.payload;
    },
    authenticateUser: (state) => {
      state.isAuthenticated = true;
    },
    logout: (state) => {
      localStorage.clear();
      state.isAuthenticated = false;
      state.user = null;
      state.token = "";
      state.loading = false;
      state.profileComplete = false;
      state.profileData = { ...initialState.profileData };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(registerUser.rejected, (state) => {
        state.loading = false;
        state.error = "failed";
      })
      .addCase(createProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProfile.fulfilled, (state, action: PayloadAction<{ business: IBusiness }>) => {
        state.loading = false;
        state.profileComplete = true;
        state.isAuthenticated = true;

        state.user!._id = action.payload.business._id;
        state.user!.logo = action.payload.business.logo as ICloudinaryFile;
      })
      .addCase(createProfile.rejected, (state) => {
        state.loading = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        loginUser.fulfilled,
        (
          _state,
          action: PayloadAction<{
            accessToken: string;
            data: IUser;
            profileComplete: boolean;
          }>
        ) => {
          localStorage.clear();

          const newState: AuthState = {
            loading: false,
            updating: false,
            user: action.payload.data,
            token: action.payload.accessToken,
            profileComplete: action.payload.data.profileComplete!,
            isAuthenticated: action.payload.data.profileComplete!,
            error: "",
            profileData: {} as ProfileData,
          };

          localStorage.setItem("authToken", action.payload.accessToken);

          return newState;
        }
      )
      .addCase(loginUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfile.fulfilled, (state, action: PayloadAction<IProfile>) => {
        const country: ICountry | undefined = Country.getAllCountries().find(
          (country) => country.name === action.payload.business?.country
        );
        if (country) action.payload.business.country = country;

        state.profileData = { ...action.payload.business };
        state.profileData.contactName = action.payload.contact[0]?.name;
        state.profileData.contactEmail = action.payload.contact[0]?.email;
        state.profileData.contactNumber = action.payload.contact[0]?.number;
        state.profileData.contactRole = action.payload.contact[0]?.role;

        state.loading = false;
      })
      .addCase(getProfile.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateProfile.pending, (state) => {
        state.updating = true;
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.updating = false;
      })
      .addCase(updateProfile.rejected, (state) => {
        state.updating = false;
      })
      .addCase(updateProfileImage.pending, (state) => {
        state.updating = true;
      })
      .addCase(updateProfileImage.fulfilled, (state, action) => {
        if (action.payload?.logo) {
          state.profileData.logo = action.payload.logo;
          state.user!.logo = action.payload.logo;
        }

        if (action.payload?.backgroundImage) {
          state.profileData.backgroundImage = action.payload.backgroundImage;
        }

        state.updating = false;
      })
      .addCase(updateProfileImage.rejected, (state) => {
        state.updating = false;
      });
  },
});

export const createProfile = createAsyncThunk(
  "auth/createProfile",
  async ({ formData }: { formData: object }) => {
    const fileData = new FormData();
    const logoFile = base64ToFile((formData as { logo: string }).logo);
    const backgroundImage = base64ToFile((formData as { backgroundImage: string }).backgroundImage);

    const formToSubmit: ProfileData = { ...(formData as ProfileData) };

    if (logoFile) {
      fileData.append("file", logoFile);
      const fileResponse = await apiClient.post<ICloudinaryFile>("/file", fileData);
      formToSubmit.logo = fileResponse.data;
    }

    if (backgroundImage) {
      fileData.append("file", backgroundImage);
      const fileResponse = await apiClient.post<ICloudinaryFile>("/file", fileData);
      formToSubmit.backgroundImage = fileResponse.data;
    }

    formToSubmit.contactRole = 'owner';
    formToSubmit.businessPhoneNumber =
      '+234' + formToSubmit.businessPhoneNumber;
    formToSubmit.country = 'Nigeria';

    const response = await apiClient.put("/auth/profile", formToSubmit);
    return response.data;
  }
);

export const updateProfileImage = createAsyncThunk(
  "auth/updateProfileLogo",
  async ({
    formData,
    businessId,
  }: {
    formData: { [key: string]: string | ArrayBuffer | null | undefined };
    businessId: string;
  }) => {
    const fileData = new FormData();

    let fileResponse: AxiosResponse<ICloudinaryFile> | null = null;

    if (formData["logo"]) {
      const logoFile = base64ToFile(formData["logo"] as string) as File;
      fileData.append("file", logoFile);
      fileResponse = await apiClient.post<ICloudinaryFile>("/file", fileData);

      if (fileResponse) {
        await apiClient.put(`/profile/${businessId}`, { logo: fileResponse.data });
      }

      return { logo: fileResponse.data };
    }

    if (formData["backgroundImage"]) {
      const backgroundImage = base64ToFile(formData["backgroundImage"] as string) as File;
      fileData.append("file", backgroundImage);
      fileResponse = await apiClient.post<ICloudinaryFile>("/file", fileData);

      if (fileResponse) {
        await apiClient.put(`/profile/${businessId}`, { backgroundImage: fileResponse.data });
      }
      return { backgroundImage: fileResponse.data };
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async ({ formData, businessId }: { formData: object; businessId: string }) => {
    const formToSubmit: ProfileData = { ...(formData as ProfileData) };

    if (formToSubmit.contactRole) {
      formToSubmit.contactRole = formToSubmit.contactRole.toLowerCase();
    }

    if (formToSubmit.businessPhoneNumber) {
      formToSubmit.businessPhoneNumber =
        (formToSubmit.country as ICountry).phonecode + formToSubmit.businessPhoneNumber;
    }

    if (formToSubmit.country) {
      formToSubmit.country = (formToSubmit.country as ICountry).name;
    }

    const response = await apiClient.put(`/profile/${businessId}`, formToSubmit);
    console.log("PROFILE UPDATED:", response.data);
    return response.data;
  }
);

export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async ({ businessId }: { businessId: string }) => {
    const response = await apiClient.get(`/profile/${businessId}`);
    return response.data;
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ formData }: { formData: RegisterData }) => {
    const response = await apiClient.post("/auth/signup", formData);
    return response.data;
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ formData }: { formData: LoginData }) => {
    const response = await apiClient.post("/auth/login", formData);
    return response.data;
  }
);

export const verifyToken = createAsyncThunk(
  "auth/verifyToken",
  async ({ token }: { token: string }) => {
    const response = await apiClient.post("/auth/verify", { token });
    return response.data;
  }
);

export const authActions = {
  ...authSlice.actions,
  registerUser,
  loginUser,
  verifyToken,
  createProfile,
  getProfile,
  updateProfile,
  updateProfileImage,
};

export default authSlice;
