import { View, Text, StyleSheet, Button, Platform, ActivityIndicator, Pressable, Alert } from 'react-native'
import React, { useState } from 'react'
import { hp, wp } from '../../helpers/common'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Image } from 'expo-image'
import { theme } from '../../constants/theme'
import { Entypo, Octicons } from '@expo/vector-icons'
import Animated, { FadeInDown } from 'react-native-reanimated'
import * as FileSystem from 'expo-file-system'; import * as Sharing from 'expo-sharing';
import Toast from 'react-native-toast-message';


const ImageScreen = () => {
    const [status, setStatus] = useState('loading');

    const router = useRouter();
    const item = useLocalSearchParams();

    let uri = item?.webformatURL;

    const fileName = item?.previewURL?.split('/').pop();
    const imageUrl = uri;
    const filePath = `${FileSystem.documentDirectory}${fileName}`

    const getSize = () => {

        const aspectRatio = item?.imageWidth / item?.imageHeight;
        const maxWidth = Platform.OS == 'web' ? wp(50) : wp(92);
        let calculatedHeight = maxWidth / aspectRatio;
        let calculatedWidth = maxWidth;

        if (aspectRatio < 1) {
            calculatedWidth = calculatedHeight * aspectRatio;
        }

        // 
        return {
            width: calculatedWidth,
            height: calculatedHeight
        };
    }

    const onLoad = () => {
        setStatus('');
    }

    const handleDownloadImage = async () => {
        if (Platform.OS === 'web') {
            const anchor = document.createElement('a');
            anchor.href = imageUrl;
            anchor.target = '_blank';
            anchor.download = fileName || 'download';
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
        } else {
            setStatus('downloading');
            let uri = await downloadFile();
            if (uri) showToast('Image downloaded');
        }
    };
    

    const handleShareImage = async () => {
        if (Platform.OS == 'web') {
            showToast('Link copied');
        } else {
            setStatus('sharing');
            let uri = await downloadFile();
            if (uri) {
                // share image
                await Sharing.shareAsync(uri);
            }
        }
    }

    const downloadFile = async () => {
        try {
            const { uri } = await FileSystem.downloadAsync(imageUrl, filePath)
            setStatus('');
            console.log('uri:', uri);
            return (uri);
        } catch (error) {
            console.log('Something went wrong');
            setStatus('');
            Alert.alert('image', error.message);
            return null;
        }
    }

    const showToast = (message) => {
        Toast.show({
            type: 'success',
            text1: message,
            position: 'bottom'
        });
    }

    const toastConfig = {
        success: ({ text1, props, ...rest }) => {
            return (
                <View style={styles.toast}>
                    <Text style={styles.toastText}>
                        {text1}
                    </Text>
                </View>
            );
        }
    };


    return (
        <View
            style={styles.container}
            tint='dark'
            intensity={60}
        >
            <View style={[getSize()]}>
                <View style={styles.loading}>
                    {
                        status == 'loading' && <ActivityIndicator size="large" color="black" />
                    }
                </View>

                <Image
                    transition={100}
                    style={[styles.image, getSize()]}
                    source={uri}
                    onLoad={onLoad}
                />
            </View>

            <View style={styles.buttons}>
                <Animated.View entering={FadeInDown.springify()}>
                    <Pressable onPress={() => router.back()} style={styles.button}>
                        <Octicons name="x" size={24} color="black" />
                    </Pressable>
                </Animated.View>

                <Animated.View entering={FadeInDown.springify().delay(100)}>
                    {
                        status === 'downloading' ? (
                            <View style={styles.button}>
                                <ActivityIndicator size='small' color='black' />
                            </View>
                        ) : (
                            <Pressable style={styles.button} onPress={handleDownloadImage}>
                                <Octicons name="download" size={24} color="black" />
                            </Pressable>
                        )
                    }
                </Animated.View>

                <Animated.View entering={FadeInDown.springify().delay(200)}>
                    {
                        status === 'sharing' ? (
                            <View style={styles.button}>
                                <ActivityIndicator size='small' color='black' />
                            </View>
                        ) : (
                            <Pressable style={styles.button} onPress={handleShareImage}>
                                <Entypo name="share" size={22} color="black" />
                            </Pressable>
                        )
                    }
                </Animated.View>
            </View>
            <Toast config={toastConfig} visibilityTime={2500} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp(4),
        backgroundColor: 'white'
    },
    image: {
        borderRadius: theme.radius.xl,
    },
    loading: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttons: {
        gap: 30,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 40,
    },
    button: {
        height: hp(6),
        width: hp(10),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.neutral(0.1),
        borderRadius: 50,
        borderCurve: 'circular'
    },
    toast: {
        backgroundColor: theme.colors.neutral(0.1),
        padding: 15,
        borderRadius: 20,
        marginBottom: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    toastText: {
        color: '#333',
        fontSize: 15,
        textAlign: 'center',
    },
})

export default ImageScreen