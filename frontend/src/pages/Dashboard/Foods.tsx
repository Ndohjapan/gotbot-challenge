/* eslint-disable react-hooks/exhaustive-deps */
import { useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useValidator } from "../../hooks/useValidator";
import { IFood } from "../../types/menu";
import { fileTest } from "../../utils/files";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { foodActions } from "../../redux/slices/foodItemSlice";
import { ICloudinaryFile } from "../../types/auth";
import TopBar from "../../components/Menu/TopBar";
import AddButton from "../../components/Menu/AddButton";
import MenuItem from "../../components/Menu/MenuItem";
import Modal from "../../components/Modals/Modal";
import ModalHeader from "../../components/Modals/ModalHeader";
import Field from "../../components/Form/Field";
import TextInput from "../../components/Form/TextInput";
import Button from "../../components/Button";
import DropZone from "../../components/Form/DropZone";
import Loader from "../../components/Loader";
import QRModal from "../../components/Menu/QRModal";
import * as yup from "yup";

const foodSchema = yup.object({
  name: yup
    .string()
    .min(2, "Food Name must be greater than 1 character")
    .required("Food Name is a required field"),
  price: yup
    .string()
    .required("Price is a required field")
    .test("priceType", "Price must be a number", (value) => {
      if (!value) return true;
      return [...value].every((n) => Number.parseInt(n) || n === "." || n === "0");
    }),
  image: fileTest(yup.string().required("Please select an image"), 5),
});

export default function Foods() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const { submitting, loading, foods } = useAppSelector((state) => state.food);

  const location = useLocation();

  useEffect(() => {
    dispatch(
      foodActions.fetchFoods({ categoryId: params.categoryId!, menuId: location.state.menuId })
    );
  }, [params.categoryId!]);

  const [formData, setFormData] = useState<IFood>({
    name: "",
    price: "",
    image: "",
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [publishModalVisible, setPublishModalVisible] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [updateState, setUpdateState] = useState(false);
  const [selectedFood, setSelectedFood] = useState("");
  const { errors, validate, clearErrOnFocus } = useValidator(formData, foodSchema);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMenuItemClick = (selectedFood: string) => {
    console.log(selectedFood);
  };

  const handleAddFood = async () => {
    if (await validate()) {
      await dispatch(
        foodActions.createFood({
          name: formData.name,
          image: formData.image as string,
          price: parseFloat(formData.price),
          menuId: location.state.menuId,
          categoryId: params.categoryId!,
        })
      );
      setFormData({ name: "", image: "", price: "" });
      setModalVisible(false);
    }
  };

  const handleDeleteFoodItem = async () => {
    await dispatch(
      foodActions.deleteFood({
        itemId: selectedFood,
      })
    );
    setFormData({ name: "", image: "", price: "" });
    setConfirmationModalVisible(false);
  };

  const handleUpdateFood = async () => {
    if (formData.image) {
      await dispatch(
        foodActions.updateFood({
          name: formData.name,
          image: formData.image as string,
          price: parseFloat(formData.price),
          menuId: location.state.menuId,
          categoryId: params.categoryId!,
          item: selectedFood
        })
      );
    }else{
      await dispatch(
        foodActions.updateFood({
          name: formData.name,
          price: parseFloat(formData.price),
          menuId: location.state.menuId,
          categoryId: params.categoryId!,
          item: selectedFood
        })
      );
    }
    setFormData({ name: "", image: "", price: "" });
    setModalVisible(false);
    setUpdateState(false)
  };

  if (loading) return <Loader loading={loading} />;

  return (
    <>
      <QRModal visible={publishModalVisible} setModalVisible={setPublishModalVisible} />

      <Modal visible={modalVisible} setModalVisible={setModalVisible}>
        <div className="w-[522px] max-md:w-screen min-h-[595px] max-md:min-h-[85vh] max-md:overflow-y-auto bg-white rounded-md max-md:rounded-tl-3xl max-md:rounded-tr-3xl max-md:translate-y-4 shadow-md px-10 pt-10 pb-14 flex flex-col items-center">
          <div className="flex flex-col h-[100%] max-md:w-full">
            <ModalHeader title="Add a food item" onClick={() => setModalVisible(false)} />

            <div className="h-[100%] w-[100%]">
              <Field error={errors.image as string}>
                <DropZone
                  file={formData.image as string}
                  onFileChange={(value) => {
                    setFormData({ ...formData, image: value });
                  }}
                  onFocus={() => {
                    clearErrOnFocus({
                      target: { name: "image" },
                    } as unknown as React.FocusEvent<HTMLInputElement>);
                  }}
                />
              </Field>

              <div className="mt-4">
                <Field label="Name" error={errors.name}>
                  <TextInput
                    placeholder="ex. Spaghetti Bolognese"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    onFocus={clearErrOnFocus}
                  />
                </Field>
              </div>

              <div className="mt-4">
                <Field label="Price" error={errors.price}>
                  <TextInput
                    placeholder="ex. ₦1500.00"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    onFocus={clearErrOnFocus}
                  />
                </Field>
              </div>

              <div className="mt-8">
                <Button onClick={ () => { if(updateState){handleUpdateFood()} else {handleAddFood()}}}loading={submitting}>
                  {updateState ? 'Update Food' : 'Add Food'}
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

              <h2>Are you sure you want to delete this food item</h2>

              <div className="mt-8">
                <Button onClick={ () => {handleDeleteFoodItem()}} loading={submitting}>
                  Delete Food
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <div className="flex flex-col w-full h-full max-h-full overflow-hidden">
        <TopBar onPublishClick={() => setPublishModalVisible(true)} />

        <div className="flex flex-col w-[100%] h-full px-16 max-md:px-6 py-6 max-md:overflow-y-auto max-md:pb-28">
          <div className="flex flex-row h-[45px] w-[100%] items-center justify-between">
            <h1 className="text-primary text-[32px] max-md:text-[26px] font-bold">
              {location.state.category}
            </h1>

            <AddButton
              text="Add Food Item"
              onClick={() => {
                setFormData({ name: "", price: "", images: [], image: "" });
                setModalVisible(true);
              }}
            />
          </div>

          <div className="flex flex-wrap mt-10 gap-6 max-md:flex-col">
            {!!foods.length &&
              foods.map((food, index) => {
                const menu = {
                  _id: food._id,
                  name: food.name,
                  image: (food.images![0] as ICloudinaryFile).secure_url.replace(/(upload\/)/, '$1f_auto,q_auto:good/')!,
                  subtitle: `₦${food.price}`,
                };

                return (
                  <MenuItem
                    key={`menu-item-${index}`}
                    menuItem={menu}
                    onClick={() => handleMenuItemClick(food.name)}
                    onEditClick={() => {
                      setFormData({
                        _id: menu._id,
                        name: menu.name,
                        image: menu.image,
                        price: food.price,
                        images: food.images,
                      });
                      setModalVisible(true);
                      setUpdateState(true);
                      setSelectedFood(menu._id || "");
                    }}
                    onDeleteClick={() => {
                      setConfirmationModalVisible(true);
                      setSelectedFood(menu._id || "");
                    }}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}
