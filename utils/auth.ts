import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

export const startAuth = async () => {
  const redirectUri = makeRedirectUri({
    scheme: 'gym-app',
  });

  const result = await WebBrowser.openAuthSessionAsync(
    `https://home.bitrey.it/login?redirect_uri=${encodeURIComponent(
      redirectUri,
    )}`,
    redirectUri,
  );

  if (result.type === 'success') {
    console.log(result);
    const token = result.url.split('token=')[1];
    return token;
  }

  return null;
};
