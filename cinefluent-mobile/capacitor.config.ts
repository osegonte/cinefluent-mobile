
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.59c72a6ba6734910a14c85916556a831',
  appName: 'CineFluent',
  webDir: 'dist',
  server: {
    url: 'https://59c72a6b-a673-4910-a14c-85916556a831.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#3D7BFF',
      showSpinner: false
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#FFFFFF'
    }
  }
};

export default config;
