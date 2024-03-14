import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { IFood } from "../../types/menu";
import { apiClient } from "../../api/apiClient";
import { base64ToFile } from "../../utils/files";
import { ICloudinaryFile } from "../../types/auth";

interface FoodState {
  foods: IFood[];
  submitting: boolean;
  loading: boolean;
}

const initialState: FoodState = {
  foods: [],
  submitting: false,
  loading: false,
};

let deleteItemId: string = ''

const createFood = createAsyncThunk(
  "foods/createFood",
  async ({
    name,
    image,
    price,
    menuId,
    categoryId,
  }: {
    name: string;
    image: string;
    price: number;
    menuId: string;
    categoryId: string;
  }) => {
    const fileData = new FormData();
    const foodFile = base64ToFile(image);

    let fileResponse: ICloudinaryFile | null = null;
    if (foodFile) {
      fileData.append("file", foodFile);
      fileResponse = (await apiClient.post<ICloudinaryFile>("/file", fileData)).data;
    }

    const response = await apiClient.post("/item", {
      name,
      price,
      category: categoryId,
      menu: menuId,
      images: [fileResponse],
      quantity: "Per Spoon",
      currency: "NGN",
    });
    return response.data;
  }
);


const updateFood = createAsyncThunk(
  "foods/updateFood",
  async ({
    name,
    image,
    price,
    menuId,
    categoryId,
    item
  }: {
    name: string;
    image?: string;
    price: number;
    menuId: string;
    categoryId: string;
    item: string;
  }) => {
    const fileData = new FormData();
    if(image){      
      const foodFile = base64ToFile(image);
  
      let fileResponse: ICloudinaryFile | null = null;
      if (foodFile) {
        fileData.append("file", foodFile);
        fileResponse = (await apiClient.post<ICloudinaryFile>("/file", fileData)).data;
        const response = await apiClient.put(`/item/${item}?menu=${menuId}`, {
          name,
          price,
          category: categoryId,
          menu: menuId,
          images: [fileResponse],
          quantity: "Per Spoon",
          currency: "NGN",
        });
        return response.data;
      }
    }
    else{
      const response = await apiClient.put(`/item/${item}?menu=${menuId}`, {
        name,
        price,
        category: categoryId,
        menu: menuId,
        quantity: "Per Spoon",
        currency: "NGN",
      });
      return response.data;
    }

  }
);

const fetchFoods = createAsyncThunk(
  "foods/fetchFoods",
  async ({ categoryId, menuId }: { categoryId: string; menuId: string }) => {
    const response = await apiClient.get(`/item?menu=${menuId}&category=${categoryId}`);
    return response.data;
  }
);

const deleteFood = createAsyncThunk(
  "foods/deleteFood",
  async ({ itemId }: { itemId: string; }) => {
    deleteItemId = itemId;
    const response = await apiClient.delete(`/item/${itemId}`);
    return response.data;
  }
);

const foodItemSlice = createSlice({
  name: "foods",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(createFood.pending, (state) => {
        state.submitting = true;
      })
      .addCase(createFood.fulfilled, (state, action: PayloadAction<IFood>) => {
        state.submitting = false;
        state.foods.push(action.payload);
      })
      .addCase(createFood.rejected, (state) => {
        state.submitting = false;
      })
      .addCase(updateFood.pending, (state) => {
        state.submitting = true;
      })
      .addCase(updateFood.fulfilled, (state, action: PayloadAction<IFood>) => {
        state.submitting = false;
        const update = state.foods.map(obj => obj._id === action.payload._id ? action.payload : obj)
        state.foods = update;
      })
      .addCase(updateFood.rejected, (state) => {
        state.submitting = false;
      })
      .addCase(deleteFood.pending, (state) => {
        state.submitting = true;
      })
      .addCase(deleteFood.fulfilled, (state) => {
        state.submitting = false;
        const update = state.foods.filter(obj => obj._id !== deleteItemId);
        deleteItemId = ''
        state.foods = update;
      })
      .addCase(deleteFood.rejected, (state) => {
        state.submitting = false;
      })
      .addCase(fetchFoods.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFoods.fulfilled, (state, action: PayloadAction<IFood[]>) => {
        state.loading = false;
        state.foods = action.payload;
      })
      .addCase(fetchFoods.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const foodActions = {
  ...foodItemSlice.actions,
  createFood,
  updateFood,
  deleteFood,
  fetchFoods,
};

export default foodItemSlice;
