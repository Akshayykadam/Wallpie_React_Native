import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, ActivityIndicator, Animated } from 'react-native'
import React, { useCallback } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Feather, FontAwesome6, Ionicons } from '@expo/vector-icons'
import { theme } from '../../constants/theme'
import { hp, wp } from '../../helpers/common'
import { useState, useRef, useEffect } from 'react'
import Categories from '../../components/categories'
import ImageGrid from '../../components/imageGrid'
import { apiCall } from '../../api'
import { debounce } from 'lodash'
import FiltersModel from '../../components/filtersModel'
import { useRouter } from 'expo-router'

var page = 1;

const HomeScreen = () => {
    const { top } = useSafeAreaInsets();
    const paddingTop = top > 0 ? top + 10 : 30;

    const [search, setSearch] = useState('');
    const [images, setImages] = useState([]);
    const [filters, setFilters] = useState(null);
    const [activeCategory, setActiveCategory] = useState(null);
    const [isEndReached, setIsEndReached] = useState(false);

    const searchInputRef = useRef(null);
    const modelRef = useRef(null);
    const scrollRef = useRef(null)

    const router = useRouter();


    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async (param = { page: 1 }, append = false) => {
        let res = await apiCall(param)
        if (res.success && res?.data?.hits) {
            if (append)
                setImages([...images, ...res.data.hits])
            else
                setImages([...res.data.hits])
        }
    };

    const handleChangeCategory = (cat) => {
        setActiveCategory(cat);
        clearSearch();
        setImages([]);
        page = 1;
        let param = {
            page,
            ...filters
        }

        if (cat) param.category = cat;
        console.log('param:', param.category);
        fetchImages(param, false);
    }

    const handleSearch = (text) => {
        setSearch(text);
        if (text.length > 2) { //search for this text
            page = 1;
            setImages([]);
            setActiveCategory(null); //clear category when user is searching
            fetchImages({ page, q: text, ...filters }, false)
        }

        if (text == "") { //reset results
            page = 1;
            searchInputRef?.current?.clear();
            setImages([]);
            setActiveCategory(null); //clear category when user is searching
            fetchImages({ page, ...filters }, false)
        }
    }

    const clearSearch = () => { //clear searchbox
        setSearch("")
        searchInputRef?.current?.clear();
    }

    const openFilterModel = () => {
        modelRef?.current?.present();
    }

    const closeFilterModel = () => {
        modelRef?.current?.close();
    }

    const applyFilters = () => {
        if (filters) {
            page = 1;
            setImages([]);
            let param = {
                page,
                ...filters
            }
            if (activeCategory) param.category = activeCategory;
            if (search) param.q = search;
            fetchImages(param, false);
        }
        closeFilterModel();
    }

    const resetFilters = () => {
        if (filters) {
            page = 1;
            setFilters(null);
            setImages([]);
            let param = {
                page,
            }
            if (activeCategory) param.category = activeCategory;
            if (search) param.q = search;
            fetchImages(param, false);
        }
        closeFilterModel();
    }

    const clearThisFilter = (filterName) => {
        let filterz = { ...filters };
        delete filterz[filterName];
        setFilters({ ...filterz });
        page = 1;
        setImages([]);
        let param = {
            page,
            ...filterz
        }
        if (activeCategory) param.category = activeCategory;
        if (search) param.q = search;
        fetchImages(param, false);
    }

    const handleScroll = (event) => {
        const contentHeight = event.nativeEvent.contentSize.height;
        const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
        const scrollOffset = event.nativeEvent.contentOffset.y;
        const bottomPosition = contentHeight - scrollViewHeight;
    
        if (scrollOffset >= bottomPosition - 1) {
            if(!isEndReached){
                setIsEndReached(true);
                ++page;
                let param = {
                    page,
                }
                if (activeCategory) param.category = activeCategory;
                if (search) param.q = search;
                fetchImages(param, true);
            }
        } else if (isEndReached){
            setIsEndReached(false);
        }
    }

    const handleScrollUp = () => {
        scrollRef?.current?.scrollTo({
            y: 0,
            Animated: true
        })
    }


    const handleTextDebounce = useCallback(debounce(handleSearch, 400, []))

    return (
        <View style={[styles.container, { paddingTop }]}>

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={handleScrollUp}>
                    <Text style={styles.title}>
                        WallPie
                    </Text>
                </Pressable>
                <Pressable onPress={openFilterModel}>
                    <FontAwesome6 name="bars-staggered" size={22} color={theme.colors.neutral(0.7)} />
                </Pressable>
            </View>
            <View>
                {/* categories */}
                <View style={styles.categories}>
                    <Categories
                        activeCategory={activeCategory}
                        handleChangeCategory={handleChangeCategory}
                    />
                </View>
                {/* Search bar */}
                <View style={styles.searchBar}>
                    <View style={styles.searchIcon}>
                        <Feather name="search" size={24} color={theme.colors.neutral(0.4)} />
                    </View>
                    <TextInput
                        placeholder='Seach for wallpaper'
                        ref={searchInputRef}
                        onChangeText={handleTextDebounce} //added delay time for search
                        style={styles.searchInput}
                    />
                    {
                        search && (
                            <Pressable onPress={() => { handleSearch("") }} style={styles.closeIcon}>
                                <Ionicons name="close" size={24} color={theme.colors.neutral(0.4)} />
                            </Pressable>
                        )
                    }
                </View>
                
            </View>

            {/* Main Home */}
            <ScrollView
                onScroll={handleScroll}
                scrollEventThrottle={5}
                ref={scrollRef}
            >

                {/* filters */}
                {
                    filters && (
                        <View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
                                {
                                    Object.keys(filters).map((key, index) => {
                                        return (
                                            <View key={key} style={styles.filterItem}>
                                                {
                                                    key == 'colors' ? (
                                                        <View style={{
                                                            height: 30,
                                                            width: 30,
                                                            borderRadius: 7,
                                                            backgroundColor: filters[key]
                                                        }} />
                                                    ) : (
                                                        <Text style={styles.filterItemText}>
                                                            {filters[key]}
                                                        </Text>
                                                    )
                                                }
                                                <Pressable style={styles.filterCloseIcon} onPress={() => clearThisFilter(key)}>
                                                    <Ionicons name="close" size={14} color={'white'} />
                                                </Pressable>
                                            </View>
                                        )
                                    })
                                }
                            </ScrollView>
                        </View>
                    )
                }
                {/* images grid */}
                <View>
                    {
                        images.length > 0 && <ImageGrid images={images} router={router} />
                    }
                </View>

                {/* loading */}
                <View
                    style={
                        { marginBottom: 70, marginTop: images.length > 0 ? 10 : 70 }
                    }>
                    <ActivityIndicator size="large" />
                </View>
            </ScrollView>

            {/* Filters model */}
            <FiltersModel
                modelRef={modelRef}
                filters={filters}
                setFilters={setFilters}
                onClose={closeFilterModel}
                onApply={applyFilters}
                onReset={resetFilters}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 15,
    },
    header: {
        marginHorizontal: wp(4),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: hp(4),
        fontWeight: theme.fontWeights.semibold,
        color: theme.colors.neutral(0.9),
        tintColor: theme.colors.primary,
    },
    searchBar: {
        marginHorizontal: wp(4),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.colors.white,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: theme.radius.xl,
        shadowColor: theme.colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },

    searchIcon: {
        padding: 8,
    },
    searchInput: {
        flex: 1,
        borderRadius: theme.radius.sm,
        paddingVertical: 10,
        fontSize: hp(1.8)
    },
    closeIcon: {
        padding: 8,
        backgroundColor: theme.colors.neutral(0.1),
        borderRadius: 50
    },
    categories: {
        //marginBottom: -20,
        //marginTop: -15
    },
    headerIcon: {
        width: 24,
        height: 24,
        tintColor: theme.colors.neutral(0.1),
        marginHorizontal: 8,
        resizeMode: 'contain',
    },
    filters: {
        paddingHorizontal: wp(4),
        gap: 10,
        marginBottom: 15
    },
    filterItem: {
        backgroundColor: theme.colors.white,
        padding: 3,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: theme.radius.md,
        padding: 8,
        gap: 10,
        paddingHorizontal: 10,
        shadowColor: theme.colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,

    },
    filterItemText: {
        fontSize: hp(1.9)
    },
    filterCloseIcon: {
        backgroundColor: '#1877F2',
        padding: 4,
        borderRadius: theme.radius.xs,
    }

});

export default HomeScreen 