import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiClient } from "../api/apiClient";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

export default function Verify() {
  const navigate = useNavigate();
  const params = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        await apiClient.post("/auth/verify", { token: params.token! });
        toast.success("Account Verifcation Successful, Redirecting to Login", {
          position: "top-right",
        });
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } catch (err) {
        toast.error("Could not verify token", { position: "top-right" });
        navigate("/register");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate, params.token]);

  return (
    <div className="flex w-screen h-screen items-center justify-center">
      <Loader loading={loading} />
    </div>
  );
}
