import Link from "next/link";
import React from "react";
import CookieConsent from "react-cookie-consent";

const InefficientCookieBanner: React.FC = () => {
  return (
    <CookieConsent
      debug={true}
      location="bottom"
      buttonText="Akceptuję cookies"
      cookieName="myWebsiteCookieConsent"
      style={{ background: "#2B373B", zIndex: 9999 }}
      buttonStyle={{
        color: "#4e503b",
        fontSize: "13px",
        background: "#f0df44",
      }}
      expires={150}
      enableDeclineButton
      declineButtonText="Odrzuć"
      declineButtonStyle={{
        color: "#f0df44",
        fontSize: "13px",
        background: "#2B373B",
        border: "1px solid #f0df44",
      }}
      onAccept={() => {
        console.log("Cookies accepted!");
        // Tutaj można dodać logikę inicjalizacji analityki itp.
      }}
      onDecline={() => {
        console.log("Cookies declined!");
        // Tutaj można zablokować trackery itp.
      }}
    >
      Ta strona używa cookies w celu poprawy komfortu użytkowania.
      <span style={{ fontSize: "10px" }}>
        {" "}
        Więcej informacji znajdziesz w naszej{" "}
        <Link href="#" style={{ color: "lightblue" }}>
          polityce prywatności
        </Link>
        .
      </span>
    </CookieConsent>
  );
};

export default InefficientCookieBanner;
