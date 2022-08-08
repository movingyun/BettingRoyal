import * as React from "react";
import { useEffect } from "react";
import ProductHero from "./modules/views/ProductHero";
import ProductHero2 from "./modules/views/ProductHero2";
import ProductHero3 from "./modules/views/ProductHero3";
import ProductHero4 from "./modules/views/ProductHero4";
import ProductHero5 from "./modules/views/ProductHero5";

import AppFooter from "./modules/views/AppFooter"

import withRoot from "./modules/withRoot";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Home.css"
function Index({ onIsLogin }) {
  // 로그인한 뒤 로그인됐다는 정보를 App.js에 보내주는 작업
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      // setIsLogin(true);
      onIsLogin(true);
    }
  }, [onIsLogin]);

  AOS.init({
    duration: 1000,
  });
  return (
    <React.Fragment>
      <div data-aos="zoom-in"
      data-aos-duration="2000">

      <ProductHero />

      </div>
      <div data-aos="zoom-in"
      data-aos-duration="2000">
 <ProductHero2 />
      </div>
     
      <div data-aos="zoom-in"
      data-aos-duration="2000">
 <ProductHero3 />
      </div>
      <div data-aos="zoom-in"
      data-aos-duration="2000">
 <ProductHero4 />
      </div>
     
      <div data-aos="zoom-in"
      data-aos-duration="2000">
 <ProductHero5 />
      </div>
      <div>
      <ScrollToTopButton height={200} />
      </div>

      {/* <AppFooter /> */}
    </React.Fragment>
  );
}



function ScrollToTopButton({ height }) {
  const [showButton, setShowButton] = React.useState(false);
  const scrollToTop = () => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  };
  const handleScroll = (event) => {
    if (document.documentElement.scrollTop > height) {
      setShowButton(true);
    } else if (!showButton) {
      setShowButton(false);
    }
  };
  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <button
      className={showButton ? "scroll-to-top-btn" : "hidden"}
      onClick={scrollToTop}
    >
      <h4>위로가기</h4>
      <svg width="32" height="32" viewBox="0 0 100 100">
        <path
          fill="#c2c2c2"
          d="m50 0c-13.262 0-25.98 5.2695-35.355 14.645s-14.645 22.094-14.645 35.355 5.2695 25.98 14.645 35.355 22.094 14.645 35.355 14.645 25.98-5.2695 35.355-14.645 14.645-22.094 14.645-35.355-5.2695-25.98-14.645-35.355-22.094-14.645-35.355-14.645zm20.832 62.5-20.832-22.457-20.625 22.457c-1.207 0.74219-2.7656 0.57812-3.7891-0.39844-1.0273-0.98047-1.2695-2.5273-0.58594-3.7695l22.918-25c0.60156-0.61328 1.4297-0.96094 2.2891-0.96094 0.86328 0 1.6914 0.34766 2.293 0.96094l22.918 25c0.88672 1.2891 0.6875 3.0352-0.47266 4.0898-1.1562 1.0508-2.9141 1.0859-4.1133 0.078125z"
        ></path>
      </svg>
    </button>
  );
}

export default withRoot(Index);
