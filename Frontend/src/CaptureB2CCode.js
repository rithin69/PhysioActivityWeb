import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserInfo } from "./redux/userslice";
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

function CaptureB2CCode() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDelayDone, setIsDelayDone] = useState(false);
  const [isApiDone, setIsApiDone] = useState(false);

  useEffect(() => {
    // ⏳ Start 5-second timer immediately
    const timer = setTimeout(() => {
      setIsDelayDone(true);
    }, 5000);

    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("code");

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    const appStoreUrl = "https://apps.apple.com/app/id1234567890";
    const playStoreUrl = "https://play.google.com/store/apps/details?id=com.example.app";

    if (authCode) {
      console.log("hey")
      axios
        .post("https://physioactivitybackend2.azurewebsites.net/api/b2c/token", {
          code: authCode,
          codeVerifier: "BsGiENfL-w8hIbFR50oUPZJaqux2ULmmEnUcYJzOdqqokA6GXZH_A3tr7-oO5G_t-f0pxAimCph2s0AcaLcyv2ZQuZCKdWd9bxxKMQXo~~dKCKIfvTq6BJN5vAX4Djon",
        })
        .then((res) => {
          const claims = res.data?.claims;
          const extensions = res.data?.extensions || {};

          if (claims) {
            dispatch(
              setUserInfo({
                name: claims.name,
                email: claims.emails?.[0],
                country: claims.country,
                isAdmin: extensions.extension_5b5b1daacc654a30ab7b333376c40e30_isAdmin,
                navpanel: extensions.extension_5b5b1daacc654a30ab7b333376c40e30_navpanel,
                user_role:extensions.extension_5b5b1daacc654a30ab7b333376c40e30_user_role,
                mypatients:extensions.extension_5b5b1daacc654a30ab7b333376c40e30_mypatients,
                newpatients:extensions.extension_5b5b1daacc654a30ab7b333376c40e30_newpatients,
                web_user_id:extensions.extension_5b5b1daacc654a30ab7b333376c40e30_web_user_id
              })
            );
          }

          window.history.replaceState({}, document.title, "/");

          setIsApiDone(true); // ✅ Mark API call as done
        })
        .catch((err) => {
          console.error("❌ Auth error:", err);
          navigate("/"); // error -> go back home
        });
    } else {
      navigate("/");
    }

    // Clean up timer
    return () => clearTimeout(timer);
  }, [dispatch, navigate]);

  useEffect(() => {
    // 🎯 Only redirect when BOTH 5s delay and API are done
    if (isDelayDone && isApiDone) {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

      const appStoreUrl = "https://apps.apple.com/app/id1234567890";
      const playStoreUrl = "https://play.google.com/store/apps/details?id=com.example.app";

      if (isMobile) {
        const storeUrl = isIOS ? appStoreUrl : playStoreUrl;
        window.location.href = storeUrl;
      } else {
        navigate("/");
      }
    }
  }, [isDelayDone, isApiDone, navigate]);

  // 💬 Show healing animation while loading
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="w-72 h-72 flex flex-col items-center">
        <DotLottieReact
          src="https://lottie.host/00980ede-c6af-4e53-a34b-4e210d057579/0eLjbf9yhc.lottie"
          autoplay
          loop
          style={{ width: "250px", height: "250px" }}
        />
        <p className="text-center text-gray-600 mt-4 text-lg">Healing in progress...😊</p>
      </div>
    </div>
  );
}

export default CaptureB2CCode;
