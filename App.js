import "react-native-url-polyfill/auto";
import { createNetworkedDatabaseManager } from '@new-mareland/crystal-mirror';
import { getRxStorageReactNative } from '@new-mareland/crystal-mirror-react-native-storage';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DateTime } from 'luxon';

export default function App() {
  useEffect(() => {
    createNetworkedDatabaseManager({
      baseUrl: 'https://crescent-point.sys-test.tokuindustry.com/api/plugin-proxy/illumass-app/',
      networkAvailabilityPollInterval: 1000,
      cacheSize: 100,
      storage: getRxStorageReactNative(),
    }).then(async (manager) => {
      manager.setGrafanaSessionId('49af57f7bb3f2e6065721f3bb82b7f85');
      await manager.start();
      const start1 = DateTime.utc();
      await manager.waitForInitialReplication()
      console.log('time to replicate: ', DateTime.utc().diff(start1).toMillis());
      console.log('manager started');
      const devices = await manager.collections.devices.find().exec();
      console.log('num devices: ', devices.length);
      const start = DateTime.utc();
      const assetStatusMap = await manager.createAssetStatusMap();
      console.log('time to create asset status map: ', DateTime.utc().diff(start).toMillis());
      console.log('asset status map size: ', assetStatusMap.size);
    });
      ;
  }, []);
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
