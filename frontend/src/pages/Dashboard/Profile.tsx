import { useEffect, useState } from "react";
import PencilSvg from "../../assets/profile/pencil.svg";
import EmptyPng from "../../assets/dashboard/empty.png";
import Loader from "../../components/Loader";
import { MoonLoader } from "react-spinners";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useNavigate } from "react-router-dom";
import { authActions } from "../../redux/slices/authSlice";
import { ICloudinaryFile } from "../../types/auth";
import { ICountry } from "country-state-city";

function Divider() {
  return <div className="w-full h-[2px] my-12 bg-[#F0F0F0]"></div>;
}

export default function Profile() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, profileData, loading, updating } = useAppSelector((state) => state.auth);
  const [updateType, setUpdateType] = useState<"logo" | "bg">("logo");

  console.log("\nUSER:", user);
  console.log("\nPROFILE DATA:", profileData);

  useEffect(() => {
    // if (!user) {
    dispatch(authActions.getProfile({ businessId: user!._id }));
    // }
  }, [dispatch, user]);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "backgroundImage" | "logo"
  ) => {
    const { name, type, files } = e.target;

    if (name === "backgroundImage") {
      setUpdateType("bg");
    } else {
      setUpdateType("logo");
    }

    if (type === "file" && files) {
      const reader = new FileReader();
      reader.onload = (event) => {
        dispatch(authActions.updateProfileData({ [field]: event.target?.result }));
        dispatch(
          authActions.updateProfileImage({
            formData: { [field]: event.target?.result },
            businessId: user!._id,
          })
        );
      };
      reader.readAsDataURL(files[0]);
    }
  };

  if (loading) return <Loader loading={loading} />;

  return (
    <>
      <div className="h-[100vh] max-h-[100vh] overflow-auto w-[100%] px-16 py-14 max-md:px-12 max-md:py-6 max-md:pb-40 bg-white">
        <div className="flex flex-row w-full h-[45px] items-center justify-between mb-4">
          <h1 className="text-primary text-[32px] max-md:text-[26px] font-bold">Your Profile</h1>
        </div>

        {/* Business Logo */}
        <div className="mt-10">
          <p className="font-nunito text-[#555] mb-4">Business Logo</p>
          <div className="flex items-center gap-12">
            <div className="w-[60px] h-[60px]">
              <img
                src={
                  typeof profileData.logo === "string"
                    ? profileData.logo
                    : (profileData.logo as ICloudinaryFile)?.secure_url.replace(/(upload\/)/, '$1f_auto,q_auto:good/')
                }
                alt="user logo"
                className="h-full w-full object-contain rounded-full"
              />
            </div>
            <div className="flex gap-2">
              <label
                htmlFor="logo"
                className="h-[40px] w-[110px] bg-primary flex items-center justify-center rounded-md cursor-pointer text-white"
              >
                {updating && updateType === "logo" ? (
                  <MoonLoader size={20} color="white" loading={updating} />
                ) : (
                  "Upload new"
                )}
                <input
                  type="file"
                  name="logo"
                  id="logo"
                  accept=".png,.jpg,.jpeg"
                  className="hidden"
                  onChange={(e) => {
                    handleFileUpload(e, "logo");
                  }}
                />
              </label>
              {/* <button className="flex items-center justify-center bg-[#F0F0F0] text-[#999] w-[180px] h-[42px] gap-2 rounded-md">
                <img src={BinSvg} alt="waste-bin" />
                <p>Remove photo</p>
              </button> */}
            </div>
          </div>
        </div>

        {/* Background Image */}
        <div className="mt-10">
          <p className="font-nunito text-[#555] mb-4">Background Image</p>
          <div className="flex items-center gap-12">
            <div className="w-[60px] h-[60px]">
              <img
                src={
                  !profileData?.backgroundImage
                    ? EmptyPng
                    : typeof profileData.backgroundImage === "string"
                    ? profileData.backgroundImage
                    : (profileData.backgroundImage as ICloudinaryFile)?.secure_url.replace(/(upload\/)/, '$1f_auto,q_auto:good/')
                }
                alt="user logo"
                className="h-full w-full object-contain rounded-full"
              />
            </div>
            <div className="flex gap-2">
              <label
                htmlFor="backgroundImage"
                className="h-[40px] w-[110px] bg-primary flex items-center justify-center rounded-md cursor-pointer text-white"
              >
                {updating && updateType === "bg" ? (
                  <MoonLoader color="white" loading={true} size={20} />
                ) : (
                  "Upload new"
                )}
                <input
                  type="file"
                  name="backgroundImage"
                  id="backgroundImage"
                  accept=".png,.jpg,.jpeg"
                  className="hidden"
                  onChange={(e) => {
                    handleFileUpload(e, "backgroundImage");
                  }}
                />
              </label>
              {/* 
              <button className="flex items-center justify-center bg-[#F0F0F0] text-[#999] w-[180px] h-[42px] gap-2 rounded-md">
                <img src={BinSvg} alt="waste-bin" />
                <p>Remove photo</p>
              </button> */}
            </div>
          </div>
        </div>

        {/* Divider */}
        <Divider />

        {/* Business Details */}

        {!!Object.keys(profileData).length && (
          <div>
            <div className="flex flex-row items-center gap-8">
              <h1 className="text-primary text-[28px] max-md:text-[22px] font-bold">
                Business Details
              </h1>
              <button
                onClick={() => navigate("/dashboard/profile/edit/business-details")}
                className="flex w-[98px] h-[40px] border border-[#DBDBDB] rounded-full items-center justify-center gap-3"
              >
                <img src={PencilSvg} alt="" />
                <p className="font-nunito text-[#555]">Edit</p>
              </button>
            </div>

            <div className="flex flex-wrap gap-12 max-w-[700px] mt-6">
              <div className="min-w-[180px] p-2">
                <p className="font-nunito text-[#555] mb-2">Business Name</p>
                <p className="font-nunito">{profileData?.name}</p>
              </div>

              <div className="min-w-[180px] p-2">
                <p className="font-nunito text-[#555] mb-2">Business Email</p>
                <p className="font-nunito">{profileData?.email}</p>
              </div>

              <div className="min-w-[180px] p-2">
                <p className="font-nunito text-[#555] mb-2">Country</p>
                <p className="font-nunito">
                  {typeof profileData.country === "string"
                    ? profileData.country
                    : (profileData.country as ICountry).name}
                </p>
              </div>

              <div className="min-w-[180px] p-2">
                <p className="font-nunito text-[#555] mb-2">State</p>
                <p className="font-nunito">{profileData?.state}</p>
              </div>

              <div className="min-w-[180px] p-2">
                <p className="font-nunito text-[#555] mb-2">Business Phone Number</p>
                <p className="font-nunito">{profileData?.businessPhoneNumber}</p>
              </div>
            </div>
          </div>
        )}
        {/* Divider */}
        <Divider />

        {/* Contact Details */}
        {!!Object.keys(profileData).length && (
          <div>
            <div className="flex flex-row items-center gap-8">
              <h1 className="text-primary text-[28px] max-md:text-[22px] font-bold">
                Contact Details
              </h1>
              <button
                onClick={() => navigate("/dashboard/profile/edit/user-details")}
                className="flex w-[98px] h-[40px] border border-[#DBDBDB] rounded-full items-center justify-center gap-3"
              >
                <img src={PencilSvg} alt="" />
                <p className="font-nunito text-[#555]">Edit</p>
              </button>
            </div>

            <div className="flex flex-wrap gap-12 max-w-[700px] mt-6">
              <div className="min-w-[180px] p-2">
                <p className="font-nunito text-[#555] mb-2">Ownership</p>
                <p className="font-nunito">{profileData?.contactRole}</p>
              </div>

              <div className="min-w-[180px] p-2">
                <p className="font-nunito text-[#555] mb-2">Full Name</p>
                <p className="font-nunito">{profileData?.contactName}</p>
              </div>

              <div className="min-w-[180px] p-2">
                <p className="font-nunito text-[#555] mb-2">Email Address</p>
                <p className="font-nunito">{profileData?.contactEmail}</p>
              </div>

              <div className="min-w-[180px] p-2">
                <p className="font-nunito text-[#555] mb-2">Phone Number</p>
                <p className="font-nunito">
                  {profileData?.contactNumber && `${profileData.contactNumber}`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Divider */}
        <Divider />

        {/* Social Media */}
        {!!Object.keys(profileData).length && (
          <div>
            <div className="flex flex-row items-center gap-8">
              <h1 className="text-primary text-[28px] max-md:text-[22px] font-bold">
                Social Media
              </h1>
              <button
                onClick={() => navigate("/dashboard/profile/edit/socials")}
                className="flex w-[98px] h-[40px] border border-[#DBDBDB] rounded-full items-center justify-center gap-3"
              >
                <img src={PencilSvg} alt="" />
                <p className="font-nunito text-[#555]">Edit</p>
              </button>
            </div>

            <div className="flex flex-wrap gap-10 max-w-[700px] mt-6">
              <div className="min-w-[180px] p-2">
                <p className="font-nunito text-[#555] mb-2">Instagram Handle</p>
                <p className="font-nunito ">{profileData?.instagram}</p>
              </div>

              <div className="min-w-[180px] p-2">
                <p className="font-nunito text-[#555] mb-2">WhatsApp Number</p>
                <p className="font-nunito">{profileData?.whatsapp}</p>
              </div>

              <div className="min-w-[180px] p-2">
                <p className="font-nunito text-[#555] mb-2">TikTok Handle</p>
                <p className="font-nunito">{profileData?.tiktok}</p>
              </div>

              <div className="min-w-[180px] p-2">
                <p className="font-nunito text-[#555] mb-2">Facebook Handle</p>
                <p className="font-nunito">{profileData?.facebook}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
