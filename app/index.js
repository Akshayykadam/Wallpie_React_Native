import { StyleSheet, Text, View, Image,Pressable } from "react-native";
import React from "react";
import { StatusBar } from "react-native";
import {hp,wp} from '../helpers/common'
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {FadeInDown} from 'react-native-reanimated';
import {theme} from '../constants/theme'
import { useRouter } from 'expo-router'

const WelcomeScreen = () => {
  const router= useRouter();

  return (
    <View style={styles.container}>
        <StatusBar style="light" />
        <Image 
          source={require('../assets/images/welcome.png')}
          style={styles.bgImage}
          resizeMode='cover'
        />
        {/*linear gardient background */}
        <Animated.View entering={FadeInDown.duration(600)} style={{flex: 1}}>
          <LinearGradient 
            colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.5)', 'white', 'white']}
            style={styles.gradient}
            start={{x:0.5, y:0}}
            end={{x:0.5, y:0.8}}
          />

          {/*content */}
          <View style={styles.contentContainer}>

            <Animated.Text 
              entering={FadeInDown.delay(400).springify()}
              style={styles.title}>
                WallPie
            </Animated.Text>

            <Animated.Text 
              entering={FadeInDown.delay(500).springify()}
              style={styles.subtitle}>
                Find Your Perfect Wallpaper
            </Animated.Text>

            <Animated.View entering={FadeInDown.delay(600).springify()}>
              <Pressable onPress={ ()=> router.push('home')} style={styles.startButton}>
                <Text style={styles.startText}>Start Explore</Text>
              </Pressable>
            </Animated.View>

          </View>
        </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
  bgImage:{
    width: wp(100),
    height: hp(100),
    position: 'absolute'
  },
  gradient:{
    width: wp(100),
    height: hp(65),
    bottom: 0,
    position: 'absolute'
  },
  contentContainer:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 14,
  },
  title:{
    fontSize: hp(7),
    letterSpacing: 1,
    color: theme.colors.neutral(0.9),
    fontWeight: theme.fontWeights.bold,
  },
  subtitle:{
    fontSize: hp(2),
    letterSpacing: 2,
    marginBottom: 10,
    fontWeight: theme.fontWeights.medium
  },
  startButton:{
    marginBottom: 50,
    backgroundColor:'#1877F2',
    padding: 15,
    paddingHorizontal: 90,
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous'
  },
  startText:{
    color: theme.colors.white,
    fontSize: hp(2),
    fontWeight: theme.fontWeights.medium,
    letterSpacing: 1,
  },
});

export default WelcomeScreen
