import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { Platform, Button, View } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

const CLIENT_ID = 'JaYsxceKwumuaqH2E0cPp7XjDfy6ljlA';
const DOMAIN = 'myjobplanner.eu.auth0.com';
const authorizationEndpoint = `https://${DOMAIN}/authorize`;
const useProxy = Platform.select({ default: false });
const redirectUri = AuthSession.makeRedirectUri({ useProxy });

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const [request, result, promptAsync] = AuthSession.useAuthRequest(
    {
      redirectUri,
      clientId: CLIENT_ID,
      responseType: 'id_token',
      scopes: [
        'openid',
        'profile',
        'create:business',
        'update:business',
        'read:business'
      ],
      extraParams: {
        nonce: 'nonce'
      }
    },
    { authorizationEndpoint }
  )

  // console.log(`Redirect URL: ${redirectUri}`);

  useEffect(() => {
    if (result) {
      if (result.type === 'success') {
        const jwtToken = result.params.id_token;
        setToken(jwtToken);
        const decoded = jwtDecode(jwtToken);
        console.log(decoded);
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
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
