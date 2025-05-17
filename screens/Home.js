import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, ImageBackground } from 'react-native';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const categories = [
  { name: 'Business Cards', icon: <FontAwesome name="id-card" size={28} color="#fff" />, color: '#232B55' },
  { name: 'Flyers', icon: <MaterialIcons name="insert-drive-file" size={28} color="#fff" />, color: '#D32F2F' },
  { name: 'Posters', icon: <FontAwesome name="picture-o" size={28} color="#fff" />, color: '#1877F3' },
  { name: 'Brochures', icon: <MaterialIcons name="menu-book" size={28} color="#fff" />, color: '#FBC02D' },
  { name: 'Stickers', icon: <FontAwesome name="sticky-note" size={28} color="#fff" />, color: '#388E3C' },
  { name: 'More', icon: <MaterialIcons name="more-horiz" size={28} color="#fff" />, color: '#888' },
];

export default function Home() {
  const navigation = useNavigation();
  const handleLogout = async () => {
    await fetch('http://192.168.1.43:8000/api/logout/', {
      method: 'POST',
      credentials: 'include',
    });
    navigation.replace('Login');
  };

  return (
    <ImageBackground
      source={require('../assets/Dashboard.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* Custom Header */}
        <View style={styles.header}>
          <Text style={styles.headerLine}>
            <Text style={styles.italicBoldUnderline}>Fast Picks</Text>
          </Text>
          <Text style={styles.headerLine}>
            <Text style={styles.italicBoldUnderline}>for Fast Prints.</Text>
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.gridContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.grid}>
            {categories.map((cat, idx) => (
              <TouchableOpacity key={cat.name} style={[styles.gridItem, { backgroundColor: cat.color }]}>
                {cat.icon}
                <Text style={styles.gridText}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Wavy Divider */}
        <View style={styles.waveContainer}>
          <View style={styles.wave} />
        </View>
        {/* Logout Button */}
        {/* <TouchableOpacity style={{position:'absolute',top:40,right:24}} onPress={handleLogout}>
          <Text style={{color:'#D32F2F',fontWeight:'bold'}}>Logout</Text>
        </TouchableOpacity> */}
      </View>
    </ImageBackground>
  );
}

const { width } = Dimensions.get('window');
const gridItemSize = (width - 64) / 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    paddingTop: 30,
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  headerLine: {
    fontSize: 28,
    marginBottom: 2,
  },
  italicBoldUnderline: {
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: '#3A4286',
    textDecorationColor: '#2196F3',
    textDecorationStyle: 'solid',
  },
  gridContainer: {
    marginTop: 120,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: gridItemSize,
    height: gridItemSize,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  gridText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
    marginTop: 8,
  },
  waveContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 60,
    overflow: 'hidden',
  },
  wave: {
    width: '200%',
    height: 80,
    backgroundColor: '#232B55',
    borderTopLeftRadius: 120,
    borderTopRightRadius: 120,
    alignSelf: 'center',
    position: 'absolute',
    bottom: -20,
  },
});
