import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Animated, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import Home from './screens/Home';
import Verification from './screens/Verification';
import { FontAwesome, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // If you want to persist user info

const Stack = createStackNavigator();
const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = Math.min(width * 0.8, 320);

function SplashScreen({ navigation }) {
  const [showSecond, setShowSecond] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // After 2s, fade out the first splash (light), fade in the second (dark)
    setTimeout(() => {
      setShowSecond(true);
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        // After fade, wait 2s then go to Login
        setTimeout(() => navigation.replace('Login'), 2000);
      });
    }, 2000);
  }, []);

  return (
    <View style={styles.splash}>
      {!showSecond ? (
        <Animated.Image
          source={require('./assets/splash-light.png')}
          style={[styles.splash, { opacity: 1 }]}
          resizeMode="cover"
        />
      ) : (
        <Animated.Image
          source={require('./assets/splash-dark.png')}
          style={[styles.splash, { opacity: fadeAnim }]}
          resizeMode="cover"
        />
      )}
    </View>
  );
}

function Sidebar({ visible, onClose, userName }) {
  const navigation = useNavigation();
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -SIDEBAR_WIDTH,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [visible]);

  // Logout handler
  const handleLogout = async () => {
    await fetch('http://192.168.1.43:8000/api/logout/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': '<your-csrf-token>',
      },
      credentials: 'include',
    });
    onClose();
    navigation.replace('Login');
  };

  return (
    <>
      {/* Overlay */}
      {visible && (
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
      )}
      {/* Sidebar */}
      <Animated.View style={[styles.sidebar, { left: slideAnim }]}>
        {/* Profile Section */}
        <View style={styles.sidebarHeader}>
          <View style={styles.profilePic} />
          <View>
            <Text style={styles.profileName}>{userName || 'Guest'}</Text>
            <Text style={styles.profileLink}>View Profile</Text>
          </View>
        </View>
        {/* Menu Items */}
        <View style={styles.sidebarMenu}>
          <SidebarItem icon="lightbulb-o" label="Track Order" />
          <SidebarItem icon="lightbulb-o" label="Password" />
          <SidebarItem icon="lightbulb-o" label="Password" />
          <SidebarItem icon="lightbulb-o" label="Password" />
          <View style={styles.sidebarDivider} />
        </View>
        {/* Bottom Actions */}
        <View style={styles.sidebarBottom}>
          <SidebarItem icon="lightbulb-o" label="Settings" />
          <SidebarItem icon="sign-out" label="Log out" onPress={handleLogout} />
        </View>
      </Animated.View>
    </>
  );
}

function SidebarItem({ icon, label, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <View style={styles.sidebarItem}>
        <FontAwesome name={icon} size={18} color="#888" style={{ marginRight: 16 }} />
        <Text style={styles.sidebarItemText}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

function CustomHeader({ onMenu }) {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.menuButton} onPress={onMenu}>
        <FontAwesome name="bars" size={28} color="#fff" />
      </TouchableOpacity>
      <View style={styles.logoContainer}>
        <Image
          source={require('./assets/nvago-icon.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

function HomeWithHeader(props) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    // Fetch first and last name from AsyncStorage
    Promise.all([
      AsyncStorage.getItem('firstName'),
      AsyncStorage.getItem('lastName')
    ]).then(([first, last]) => {
      if (first || last) setFullName(`${first || ''} ${last || ''}`.trim());
    });
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#232B55' }}>
      <CustomHeader onMenu={() => setSidebarVisible(true)} />
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <Home {...props} />
      </View>
      <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} userName={fullName} />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Home" component={HomeWithHeader} />
        <Stack.Screen name="Verification" component={Verification} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end', // <-- changed from 'space-between' to 'flex-end'
    backgroundColor: '#232B55',
    paddingTop: 36,
    paddingBottom: 12,
    paddingHorizontal: 18,
  },
  menuButton: {
    padding: 4,
    marginRight: 'auto', // <-- push everything else to the right
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoImage: {
    width: 120,
    height: 48,
  },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.18)',
    zIndex: 10,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: '#fff',
    zIndex: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 2, height: 0 },
  },
  sidebarHeader: {
    backgroundColor: '#232B55',
    paddingTop: 36,
    paddingBottom: 18,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#ccc',
    marginRight: 14,
  },
  profileName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
  },
  profileLink: {
    color: '#d1d5e0',
    fontSize: 13,
  },
  sidebarMenu: {
    paddingTop: 18,
    paddingHorizontal: 18,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  sidebarItemText: {
    color: '#232B55',
    fontSize: 15,
    fontWeight: '500',
  },
  sidebarDivider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
    marginRight: -18,
  },
  sidebarBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
});