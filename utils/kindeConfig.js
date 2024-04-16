import constant from "./constant";

export const client = new KindeSDK(
  constant.KINDE_ISSUER_URL,
  constant.KINDE_POST_CALLBACK_URL,
  constant.KINDE_CLIENT_ID,
  constant.KINDE_POST_LOGOUT_REDIRECT_URL
);
