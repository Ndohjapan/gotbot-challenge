import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ICategory } from "../../types/menu";
import { apiClient } from "../../api/apiClient";
import { base64ToFile } from "../../utils/files";
import { ICloudinaryFile } from "../../types/auth";

interface CategoryState {
  categories: ICategory[];
  submitting: boolean;
  loading: boolean;
}

const initialState: CategoryState = {
  categories: [],
  submitting: false,
  loading: false,
};

let deleteItemId: string = ''

const createCategory = createAsyncThunk(
  "/category/createCategory",
  async ({ name, image, menuId }: { name: string; image: string; menuId: string }) => {
    const fileData = new FormData();
    const categoryFile = base64ToFile(image);

    let fileResponse: ICloudinaryFile | null = null;
    if (categoryFile) {
      fileData.append("file", categoryFile);
      fileResponse = (await apiClient.post<ICloudinaryFile>("/file", fileData)).data;
    }

    const response = await apiClient.post("/category", {
      name,
      menu: menuId,
      image: fileResponse,
    });
    return response.data;
  }
);

const deleteCategory = createAsyncThunk(
  "/category/deleteCategory",
  async ({ menuId, categoryId }: { menuId: string; categoryId: string }) => {
    deleteItemId = categoryId;
    const response = await apiClient.delete(`/category/${menuId}/${categoryId}`);
    return response.data;
  }
);
const updateCategory = createAsyncThunk(
  "/category/updateCategory",
  async ({ name, image, menuId, category }: { name: string; image: string; menuId: string, category: string }) => {
    const fileData = new FormData();
    const categoryFile = base64ToFile(image);

    let fileResponse: ICloudinaryFile | null = null;
    if (categoryFile) {
      fileData.append("file", categoryFile);
      fileResponse = (await apiClient.post<ICloudinaryFile>("/file", fileData)).data;
      const response = await apiClient.put(`/category/${category}?menu=${menuId}`, {
        name,
        image: fileResponse,
      });
      return response.data;
    }

    else{
      const response = await apiClient.put(`/category/${category}?menu=${menuId}`, {
        name,
      });
      return response.data;
    }

  }
);

const fetchCategories = createAsyncThunk("category/fetchCategories", async (menuId: string) => {
  const response = await apiClient.get(`/category?menu=${menuId}`);
  return response.data;
});

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(createCategory.pending, (state) => {
        state.submitting = true;
      })
      .addCase(createCategory.fulfilled, (state, action: PayloadAction<ICategory>) => {
        state.submitting = false;
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state) => {
        state.submitting = false;
      })
      .addCase(updateCategory.pending, (state) => {
        state.submitting = true;
      })
      .addCase(updateCategory.fulfilled, (state, action: PayloadAction<ICategory>) => {
        state.submitting = false;
        const update = state.categories.map(obj => obj._id === action.payload._id ? action.payload : obj)
        state.categories = update;
      })
      .addCase(updateCategory.rejected, (state) => {
        state.submitting = false;
      })
      .addCase(deleteCategory.pending, (state) => {
        state.submitting = true;
      })
      .addCase(deleteCategory.fulfilled, (state) => {
        state.submitting = false;
        const update = state.categories.filter(obj => obj._id !== deleteItemId);
        deleteItemId = ''
        state.categories = update;
      })
      .addCase(deleteCategory.rejected, (state) => {
        state.submitting = false;
      })
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<ICategory[]>) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const categoryActions = {
  ...categorySlice.actions,
  createCategory,
  updateCategory,
  deleteCategory,
  fetchCategories,
};

export default categorySlice;
