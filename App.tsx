import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { Platform, Button, View } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import BusinessSelect from './screens/BusinessSelect';

const AUTH0_CLIENT_ID = 'JaYsxceKwumuaqH2E0cPp7XjDfy6ljlA';
const AUTH0_DOMAIN = 'myjobplanner.eu.auth0.com';
const AUTH0_IDENTIFIER = 'https://api.myjobplanner.com'
const authorizationEndpoint = `https://${AUTH0_DOMAIN}/authorize`;
const tokenEndpoint = `https://${AUTH0_DOMAIN}/oauth/token`;
const useProxy = Platform.select({ default: false });
const redirectUri = AuthSession.makeRedirectUri({ useProxy });

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const [request, result, promptAsync] = AuthSession.useAuthRequest(
    {
      redirectUri,
      clientId: AUTH0_CLIENT_ID,
      responseType: 'code',
      scopes: [
        'openid',
        'email',
        'profile',
        'create:business',
        'update:business',
        'read:business'
      ],
      extraParams: {
        nonce: 'nonce',
        audience: `${AUTH0_IDENTIFIER}`
      }
    },
    { authorizationEndpoint }
  )

  useEffect(() => {
    const fetchAccessToken = async (code: string) => {
      const tokenResult = await AuthSession.exchangeCodeAsync({
        code,
        clientId: AUTH0_CLIENT_ID,
        redirectUri: redirectUri,
        extraParams: {
          code_verifier: request?.codeVerifier || ""
        }
      }, { tokenEndpoint })
      setToken(tokenResult.accessToken)
    }

    if (result) {
      if (result.type === 'success') {
        fetchAccessToken(result.params.code)
          .catch(console.error)
      }
    }
  }, [result])

  if (!isLoadingComplete) {
    return null;
  } else if (!token) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Button
            onPress={token ? () => setToken(null) : () => promptAsync({ useProxy })}
            title={token ? "Log out" : "Log In"} />
        </View>
      </SafeAreaProvider>
    );
  } else {
    return (
      <SafeAreaProvider>
        <BusinessSelect jwtToken={token} />
        {/* <Navigation colorScheme={colorScheme} />
        <StatusBar /> */}
      </SafeAreaProvider>
    );
  }
}
