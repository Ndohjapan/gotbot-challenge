import { Link } from "react-router-dom";
import Logo from "../assets/logo.svg";

export default function Footer() {
  return (
    <footer className="py-16 max-container" id="contact">
      <div className="flex flex-row items-start justify-between py-10 max-md:flex-col max-md:gap-6">
        <div>
          <img src={Logo} alt="Kota logo" />
          <p className="font-nunito mt-4 w-[280px] text-[#2B2B2B]">
            Elevate your restaurant's experience through innovative technology
          </p>
        </div>

        <div>
          <h2 className="footer-title">Quick Links</h2>

          <div className="flex flex-col gap-2 mt-4">
            <p className="footer-link">
              <Link to="/">About Us</Link>
            </p>
            <p className="footer-link">
              <Link to="/">Benefits</Link>
            </p>
            <p className="footer-link">
              <Link to="/">How it works</Link>
            </p>
            <p className="footer-link">
              <Link to="/">Support</Link>
            </p>
          </div>
        </div>

        <div>
          <h2 className="footer-title">Follow us</h2>

          <div className="flex flex-col gap-2 mt-4">
            <p className="footer-link">
              <Link to="/">Instagram</Link>
            </p>
            <p className="footer-link">
              <Link to="/">Twitter</Link>
            </p>
            <p className="footer-link">
              <Link to="/">Facebook</Link>
            </p>
            <p className="footer-link">
              <Link to="/">Linkedin</Link>
            </p>
          </div>
        </div>

        <div>
          <h2 className="footer-title">Get in touch</h2>

          <div className="flex flex-col gap-2 mt-4">
            <p className="footer-link">
              <Link to="/">contact@kota.com</Link>
            </p>
            <p className="footer-link">
              <Link to="/">(234) 907-284-2337</Link>
            </p>
          </div>
        </div>

        <div>
          <h2 className="footer-title">Get started</h2>

          <div className="flex flex-col gap-2 mt-4">
            <p className="footer-link">
              <Link to="/register">Create account</Link>
            </p>
            <p className="footer-link">
              <Link to="/login">Log in</Link>
            </p>
          </div>
        </div>
      </div>

      <p className="font-nunito mt-12 text-[#2B2B2B] text-sm">
        Copyright &copy; {new Date().getFullYear()} Kota. All Rights Reserved
      </p>
    </footer>
  );
}
