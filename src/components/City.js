import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import * as Animatable from 'react-native-animatable'

export default function City({ data, deleteCity }) {

    return (
        <Animatable.View
            style={styles.container}
            animation="bounceIn"
            useNativeDriver={true}
        >
            <View>
                <Text style={styles.text}>{data.city}</Text>
            </View>
            <TouchableOpacity style={{ position: "absolute", right: 10 }} onPress={() => deleteCity(data)}>
                <AntDesign name="close" size={30} color="white" />
            </TouchableOpacity>
        </Animatable.View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 5,
        padding: 10,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#42a2fc",
        borderRadius: 10,
        elevation: 2,
        shadowColor: "black",
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 1,
            height: 3
        }
    },

    text: {
        color: "white",
        marginLeft: 10,
        marginRight: 60,
        fontSize: 18
    }
})