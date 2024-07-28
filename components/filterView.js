import { View, Text, StyleSheet, Pressable } from "react-native"
import { capitalize, hp } from "../helpers/common"
import { theme } from "../constants/theme"

export const SectionView = ({ title, content }) => {
    return (
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>
                {title}
            </Text>
            <View>
                {content}
            </View>
        </View>
    )
}

export const CommonView = ({ data, filters, filterName, setFilters }) => {
    const onSelect = (item) => {
        setFilters({ ...filters, [filterName]: item })
    }

    return (
        <View style={styles.flexRowWrap}>
            {
                data && data.map((item, index) => {
                    let isActive = filters && filters[filterName] == item;
                    let backgroundColor = isActive ? '#1877F2' : 'white';
                    let color = isActive ? 'white' : theme.colors.neutral(0.7)
                    return (
                        <Pressable
                            onPress={() => onSelect(item)}
                            key={item}
                            style={[styles.outlinedButton, { backgroundColor }]}
                        >
                            <Text style={[styles.outlinedButtonText, { color }]}>
                                {capitalize(item)}
                            </Text>
                        </Pressable>
                    )
                })
            }
        </View>
    )
}

export const ColourFilterView = ({ data, filters, filterName, setFilters }) => {
    const onSelect = (item) => {
        setFilters({ ...filters, [filterName]: item })
    }

    return (
        <View style={styles.flexRowWrap}>
            {
                data && data.map((item, index) => {
                    let isActive = filters && filters[filterName] == item;
                    let borderColor = isActive ? theme.colors.neutral(0.4) : 'white';
                    return (
                        <Pressable onPress={() => onSelect(item)} key={item}>

                            <View style={[styles.colorWrapper, {borderColor}]}>
                                <View style={[styles.color, { backgroundColor: item }]} />
                            </View>
                        </Pressable>
                    )
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    sectionContainer: {
        gap: 8
    },
    sectionTitle: {
        fontSize: hp(2.4),
        fontWeight: theme.fontWeights.medium,
        color: theme.colors.neutral(0.8)

    },
    outlinedButton: {
        padding: 10,
        paddingHorizontal: 16,
        borderRadius: theme.radius.xs,
        borderCurve: 'continuous',
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    outlinedButtonText: {
        fontSize: 14,
        fontWeight: theme.fontWeights.semibold,
        color: theme.colors.neutral(0.8),
        textAlign: 'center',
    },
    flexRowWrap: {
        gap: 10,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    colorWrapper: {
        padding: 3,
        borderRadius: theme.radius.sm,
        borderWidth: 2,
        borderCurve: 'continuous',
    },
    color: {
        height: 40,
        width: 40,
        borderRadius: theme.radius.sm-3,
        borderCurve: 'continuous',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    }

})