import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { apiClient } from "../../api/apiClient";
import { ICategoryFood, IFood } from "../../types/menu";
import { ICloudinaryFile, IProfile } from "../../types/auth";
import Loader from "../../components/Loader";
import RestaurantSvg from "../../assets/foods/pasta.svg";
import BusinessPage from "./BusinessPage";

const STICKY_POSITION = 250;

function FoodItem({ foodItem }: { foodItem: IFood }) {
  const image = foodItem.images![0] as ICloudinaryFile;

  return (
    <div className="flex gap-3 p-4 bg-white border-b-[1px] border-gray-200 min-h-[120px]">
      <div className="min-w-[102px] max-w-[102px] h-[102px] rounded-md overflow-hidden">
        <img src={image.secure_url.replace(/(upload\/)/, '$1f_auto,q_auto:good/')} alt="food image" className="object-cover w-full h-full" />
      </div>
      <div className="flex flex-col justify-evenly">
        <h1 className="text-[22px]">{foodItem.name}</h1>
        <p className="font-nunito text-primary">₦{foodItem.price}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const location = useLocation();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<IProfile | null>(null);
  const [businessPage, setBusinessPage] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [foods, setFoods] = useState<ICategoryFood[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [tabsPosition, setTabsPosition] = useState<"fixed" | "relative">("relative");

  useEffect(() => {
    (async () => {
      try {
        const [businessResponse, foodItemResponse] = await Promise.all([
          apiClient.get<IProfile>(`/profile/${params.get("business")}`),
          apiClient.get<ICategoryFood[]>(`/item/all${location.search}`),
        ]);

        console.log("\nBUSINESS RESPONSE:", businessResponse);
        console.log("FOOD RESPONSE:", foodItemResponse);

        if (businessResponse.data && foodItemResponse.data) {
          setBusiness(businessResponse.data);

          const categories = foodItemResponse.data.map((item) => item.category);
          setCategories(categories);
          setFoods(foodItemResponse.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [location.search, params]);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);

    const categoryElement = document.getElementById(category);
    if (categoryElement) {
      categoryElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    const handleVerticalScroll = () => {
      // Calculate the currently visible category based on the scroll position.
      const scrollPosition = window.scrollY;

      const categoryElements = categories.map((category) => ({
        id: category,
        top: document.getElementById(category)!.offsetTop,
      }));

      let visibleCategory = null;

      for (const { id, top } of categoryElements) {
        if (scrollPosition >= top) {
          visibleCategory = id;
        } else {
          break;
        }
      }

      if (visibleCategory) {
        setActiveCategory(visibleCategory);
      }

      // Handle Horizontal Tabs Positioning
      if (scrollPosition >= STICKY_POSITION) {
        setTabsPosition("fixed");
      } else {
        setTabsPosition("relative");
      }
    };

    window.addEventListener("scroll", handleVerticalScroll);
    return () => {
      window.removeEventListener("scroll", handleVerticalScroll);
    };
  }, [categories]);

  if (loading) return <Loader loading={loading} />;

  if (businessPage && business)
    return <BusinessPage goToNextScreen={() => setBusinessPage(false)} business={business} />;

  return (
    <div className="w-screen overflow-x-hidden">
      <div className="px-4 py-4">
        <div
          className="w-[40px] h-[40px] rounded-md shadow-lg bg-white flex items-center justify-center cursor-pointer"
          onClick={() => setBusinessPage(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M13.8297 19.0003C13.6803 19.0008 13.5327 18.9678 13.3977 18.9038C13.2627 18.8398 13.1438 18.7463 13.0497 18.6303L8.21968 12.6303C8.07259 12.4513 7.99219 12.2269 7.99219 11.9953C7.99219 11.7637 8.07259 11.5392 8.21968 11.3603L13.2197 5.36028C13.3894 5.15606 13.6333 5.02763 13.8978 5.00325C14.1622 4.97888 14.4255 5.06054 14.6297 5.23028C14.8339 5.40001 14.9623 5.64393 14.9867 5.90835C15.0111 6.17278 14.9294 6.43606 14.7597 6.64028L10.2897 12.0003L14.6097 17.3603C14.732 17.5071 14.8096 17.6858 14.8335 17.8753C14.8574 18.0649 14.8265 18.2573 14.7444 18.4299C14.6624 18.6024 14.5326 18.7478 14.3705 18.8489C14.2084 18.95 14.0207 19.0025 13.8297 19.0003Z"
              fill="#2B2B2B"
            />
          </svg>
        </div>
      </div>

      <div className="h-[186px] w-screen overflow-hidden">
        <img
          src={
            business?.business.backgroundImage
              ? (business.business.backgroundImage as ICloudinaryFile).secure_url.replace(/(upload\/)/, '$1f_auto,q_auto:good/')
              : RestaurantSvg
          }
          alt="menu image"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Horizontal scroll menu */}
      <div
        className={`${
          tabsPosition === "fixed" ? "fixed top-0" : "relative"
        } left-0 bg-white flex py-4 w-screen overflow-x-auto no-scrollbar`}
        id="horizontal-tabs"
      >
        {categories.map((category, index) => (
          <div
            className={`min-w-fit px-[10px] py-[6px] font-nunito text-center rounded-full mx-2 ${
              activeCategory === category && "bg-green-100 text-green-900"
            }`}
            key={`category-${index}`}
            id={`tab-${category}`}
            onClick={() => handleCategoryClick(category)}
          >
            <p className="w-full whitespace-nowrap">{category}</p>
          </div>
        ))}
      </div>

      {/* Vertical scroll menu */}
      {foods.map((foodItem, index) => (
        <div key={`food-section-${index}`} id={foodItem.category}>
          <h1 className="p-4 bg-gray-100">{foodItem.category}</h1>
          {foodItem.items.map((food, index) => (
            <FoodItem foodItem={food} key={`food-${index}`} />
          ))}
        </div>
      ))}

      <div className="h-10"></div>
    </div>
  );
}
