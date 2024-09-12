import { VoiceForm } from "@sugar-ai/core";
import { type FC } from "react";
import { useLinkedIn } from "react-linkedin-login-oauth2";
import linkedin from "react-linkedin-login-oauth2/assets/linkedin.png";

export const LinkedInVerify: FC<{
  voiceForm: VoiceForm | null;
}> = ({ voiceForm }) => {
  const { linkedInLogin } = useLinkedIn({
    clientId: (process.env.LINKEDIN_CLIENT_ID as string) || "86z9d7nz03phum",
    redirectUri: `${window.location.origin}/linkedin`, // Adjust as per your app setup
    onSuccess: (code) => {
      console.log("Authorization Code:", code); // Handle success (e.g., send code to your backend for token exchange)
    },
    onError: (error) => {
      console.log("Login Error:", error); // Handle error
    },
  });

  return (
    <img
      onClick={linkedInLogin}
      src={linkedin}
      alt="Verify with LinkedIn"
      style={{ maxWidth: "180px", cursor: "pointer" }}
    />
  );
};

export default LinkedInVerify;
