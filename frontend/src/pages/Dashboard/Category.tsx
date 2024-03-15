/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PastaImg from "../../assets/foods/pasta.svg";
import AddButton from "../../components/Menu/AddButton";
import MenuItem from "../../components/Menu/MenuItem";
import TopBar from "../../components/Menu/TopBar";
import Modal from "../../components/Modals/Modal";
import ModalHeader from "../../components/Modals/ModalHeader";
import Button from "../../components/Button";
import TextInput from "../../components/Form/TextInput";
import Field from "../../components/Form/Field";
import DropZone from "../../components/Form/DropZone";
import Loader from "../../components/Loader";
import { ICategory } from "../../types/menu";
import { useValidator } from "../../hooks/useValidator";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { categoryActions } from "../../redux/slices/categorySlice";
import { fileTest } from "../../utils/files";
import { ICloudinaryFile } from "../../types/auth";
import * as yup from "yup";
import React from "react";

const categorySchema = yup.object({
  name: yup
    .string()
    .min(2, "Category Name must be greater than 1 character")
    .required("Category Name is a required field"),
  image: fileTest(yup.string().required("Please select an image"), 5),
});

export default function Category() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();

  const { loading, submitting, categories } = useAppSelector((state) => state.category);

  useEffect(() => {
    dispatch(categoryActions.fetchCategories(location.state.menuId));
  }, [location.state]);

  const [formData, setFormData] = useState<ICategory>({
    name: "",
    image: "",
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [updateState, setUpdateState] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const { errors, validate, clearErrOnFocus } = useValidator(formData, categorySchema);

  const handleMenuItemClick = (category: string, categoryId: string) => {
    navigate(`/dashboard/categories/${categoryId}`, {
      state: {
        category,
        menuId: location.state.menuId,
      },
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddCategory = async () => {
    if (await validate()) {
      await dispatch(
        categoryActions.createCategory({
          name: formData.name,
          image: formData.image as string,
          menuId: location.state.menuId,
        })
      );
      setFormData({ name: "", image: "" });
      setModalVisible(false);
    }
  };

  const handleDeleteCategory = async () => {
    await dispatch(
      categoryActions.deleteCategory({
        menuId: location.state.menuId,
        categoryId: selectedCategory,
      })
    );
    setFormData({ name: "", image: "" });
    setConfirmationModalVisible(false);
  };

  const handleUpdateCategory = async () => {
    if(formData.image){
      await dispatch(
        categoryActions.updateCategory({
          name: formData.name,
          image: formData.image as string,
          menuId: location.state.menuId,
          category: selectedCategory,
        })
      );
    }else{
      await dispatch(
        categoryActions.updateCategory({
          name: formData.name,
          menuId: location.state.menuId,
          category: selectedCategory,
        })
      );
    }
    setFormData({ name: "", image: "" });
    setModalVisible(false);
    setUpdateState(false)
  };

  if (loading) return <Loader loading={loading} />;

  return (
    <>
      <Modal visible={modalVisible} setModalVisible={setModalVisible}>
        <div className="w-[522px] max-md:w-screen min-h-[513px] max-md:min-h-[70vh] bg-white rounded-md max-md:rounded-tl-3xl max-md:rounded-tr-3xl max-md:translate-y-4 shadow-md px-10 pt-10 pb-14 flex flex-col items-center">
          <div className="flex flex-col h-[100%] max-md:w-full">
            <ModalHeader title="Add a new category" onClick={() => setModalVisible(false)} />

            <div className="h-[100%]">
              <div>
                <Field error={errors.image as string}>
                  <DropZone
                    file={formData.image as string}
                    onFileChange={(value) =>
                      setFormData({
                        ...formData,
                        image: value,
                      })
                    }
                    onFocus={() => {
                      clearErrOnFocus({
                        target: { name: "image" },
                      } as unknown as React.FocusEvent<HTMLInputElement>);
                    }}
                  />
                </Field>
              </div>

              <div className="mt-4">
                <Field label="Category Name" error={errors.name}>
                  <TextInput
                    placeholder="ex. Soups"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    onFocus={clearErrOnFocus}
                  />
                </Field>
              </div>

              <div className="mt-8">
                <Button onClick={ () => { if(updateState){handleUpdateCategory()} else {handleAddCategory()}}} loading={submitting}>
                  {updateState ? 'Update Category' : 'Add Category'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal visible={confirmationModalVisible} setModalVisible={setConfirmationModalVisible}>
        <div className="w-[522px] max-md:w-screen bg-white rounded-md max-md:rounded-tl-3xl max-md:rounded-tr-3xl max-md:translate-y-4 shadow-md px-10 pt-10 pb-14 flex flex-col items-center">
          <div className="flex flex-col h-[100%] max-md:w-full">
            <ModalHeader title="Are you sure" onClick={() => setConfirmationModalVisible(false)} />

            <div className="">

              <h2>Are you sure you want to delete this category</h2>

              <div className="mt-8">
                <Button onClick={ () => {handleDeleteCategory()}} loading={submitting}>
                  Delete Category
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Modal>



      <div className="flex flex-col h-[100vh]">
        <TopBar />

        <div className="flex flex-col w-[100%] h-[100%] px-16 max-md:px-6 py-6">
          <div className="flex flex-row h-[45px] w-[100%] items-center justify-between">
            <h1 className="text-primary text-[32px] max-md:text-[26px] font-bold">Categories</h1>

            <AddButton text="New Category" onClick={() => setModalVisible(true)} />
          </div>

          <div className="flex flex-wrap mt-10 gap-6">
            {!!categories.length &&
              categories.map((category, index) => {
                const menu = {
                  name: category.name,
                  image: (category.image as ICloudinaryFile).secure_url.replace(/(upload\/)/, '$1f_auto,q_auto:good/') || PastaImg,
                  subtitle: `${category.items || 0} items`,
                };
                return (
                  <MenuItem
                    key={`menu-item-${index}`}
                    menuItem={menu}
                    onClick={() => handleMenuItemClick(category.name, category._id!)}
                    onEditClick={() => {
                      setFormData({ _id: category._id, name: menu.name, image: menu.image });
                      setModalVisible(true);
                      setUpdateState(true);
                      setSelectedCategory(category._id || "");
                    }}
                    onDeleteClick={() => {
                      setConfirmationModalVisible(true);
                      setSelectedCategory(category._id || "");
                    }}
                  />
                );
              })}
            <div className="h-[100px]"></div>
          </div>
        </div>
      </div>
    </>
  );
}
