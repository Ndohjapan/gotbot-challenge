import { useAppSelector } from "../../redux/hooks";
import { useNavigate } from "react-router-dom";
import { ICloudinaryFile } from "../../types/auth";
import QRCode from "react-qr-code";
import Modal from "../Modals/Modal";
import ModalHeader from "../Modals/ModalHeader";
import Button from "../Button";
import CheckSvg from "../../assets/check.svg";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface QRModalProps {
  visible: boolean;
  setModalVisible: (value: boolean) => void;
}

export default function QRModal({ visible, setModalVisible }: QRModalProps) {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { selectedMenu } = useAppSelector((state) => state.menu);

  const handleMenuPreview = () => {
    navigate(`/restaurants?business=${user?._id}&menu=${selectedMenu}`);
  };

  const downloadPdf = async () => {
    const doc: jsPDF = new jsPDF();
    const content = document.getElementById("pdf-content");

    if (content) {
      const pdfWidth = content.offsetWidth;
      const pdfHeight = content.offsetHeight;

      html2canvas(content).then((canvas) => {
        const imgData = canvas.toDataURL("image/jpeg");
        doc.addImage(imgData, "JPEG", 0, 0, pdfWidth / 3.79, pdfHeight / 3.79);
        doc.save("menu.pdf");
      });
    }
  };

  return (
    <>
      <div id="pdf-content" className="fixed -top-[5000px] p-4">
        <div className="flex flex-col items-center border-[1px] border-black w-full h-full">
          <div className="w-[100px] h-[100px]">
            <img
              src={(user?.logo as ICloudinaryFile).secure_url.replace(/(upload\/)/, '$1f_auto,q_auto:good/')}
              alt="restaurant logo"
              className="w-full h-full"
            />
          </div>

          <h1 className="text-[50px] mb-4">Menu</h1>

          <p className="font-nunito font-thin text-base text-center mb-10 w-[309px]">
            Scan the code below to view our menu on your phone
          </p>

          <div className="mb-4">
            <QRCode
              size={256}
              value={`${import.meta.env.VITE_FRONTEND_URL}/restaurants?business=${
                user?._id
              }&menu=${selectedMenu}`}
              style={{ height: "auto", width: "100%", maxWidth: "100%" }}
            />
          </div>

          <p className="font-[20px] mt-auto mb-6">
            Created with <span className="text-[#2B6C57]">Kota</span>
          </p>
        </div>
      </div>

      <Modal visible={visible} setModalVisible={setModalVisible}>
        <div className="w-[482px] max-md:w-screen h-[513px] max-md:min-h-[70vh] bg-white rounded-md max-md:rounded-tl-3xl max-md:rounded-tr-3xl max-md:translate-y-4 shadow-md px-10 pt-10 pb-14 flex flex-col items-center">
          <div className="flex flex-col h-[100%] w-[100%]">
            <ModalHeader title="" onClick={() => setModalVisible(false)} />

            <div className="flex flex-col items-center text-center">
              <div className="w-[112px] h-[112px] mb-6 relative">
                <QRCode
                  size={256}
                  value={`${import.meta.env.VITE_FRONTEND_URL}/restaurants?business=${
                    user?._id
                  }&menu=${selectedMenu}`}
                  style={{ height: "auto", width: "100%", maxWidth: "100%" }}
                />
                <div className="absolute -right-3 -bottom-3">
                  <img src={CheckSvg} alt="check svg" />
                </div>
              </div>
              <h1 className="text-[26px] text-primary">Your QR menu is now ready!</h1>
              <p className="font-nunito text-[#555] text-[16px] w-[271px] mb-6 mt-2">
                Preview to view your menu online or download and print to display
              </p>
              <div className="my-4 w-[100%]">
                <Button width="100%" onClick={downloadPdf}>
                  Download
                </Button>
              </div>
              <div
                className="font-nunito mt-2 cursor-pointer text-primary underline"
                onClick={handleMenuPreview}
              >
                Preview Menu
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
