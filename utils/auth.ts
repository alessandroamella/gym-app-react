import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { config } from '@/constants/config';

export const startAuth = async () => {
  const redirectUri = makeRedirectUri({
    scheme: config.scheme,
  });

  const loginUrl = new URL('/login', config.serverBaseUrl);
  loginUrl.searchParams.append('redirect_uri', redirectUri);

  const result = await WebBrowser.openAuthSessionAsync(
    loginUrl.toString(),
    redirectUri,
  );

  if (result.type === 'success') {
    console.log(result);
    const token = result.url.split('token=')[1];
    return token;
  }

  return null;
};
