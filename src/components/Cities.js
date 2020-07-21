import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, FlatList, Vibration, SafeAreaView } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-community/async-storage';

import City from './City'

export default function Cities() {

    const [cities, setCities] = useState([])
    const [input, setInput] = useState("")

    useEffect(() => {
        async function loadCities() {
            try {
                const citiesStorage = await AsyncStorage.getItem('@cities')

                if (citiesStorage) {
                    setCities(JSON.parse(citiesStorage))
                }
            } catch (error) {
                Alert.alert("Error", error)
            }
        }

        loadCities()
    }, [])

    useEffect(() => {
        async function saveCities() {
            try {
                const jsonCities = JSON.stringify(cities)
                await AsyncStorage.setItem('@cities', jsonCities)
            } catch (error) {
                Alert.alert("Error", error)
            }
        }

        saveCities()
    }, [cities])

    const addCities = (input) => {
        if (input === "") return

        const data = {
            key: Math.random(),
            city: input
        }

        setCities([...cities, data])
        setInput("")
    }

    const deleteCity = useCallback((data) => {
        const find = cities.filter(r => r.key !== data.key)
        setCities(find)
        Vibration.vibrate()
    })

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Cities</Text>
            </View>
            <View style={styles.body}>
                <View style={styles.textInputView}>
                    <TextInput
                        style={styles.TextInput}
                        placeholder="Add a city by typing the name here..."
                        value={input}
                        onChangeText={(text) => setInput(text)}
                    />
                    <TouchableOpacity style={styles.btnAdd} onPress={() => addCities(input)}>
                        <MaterialIcons name="add" size={18} color="white" />
                    </TouchableOpacity>
                </View>

                <SafeAreaView style={styles.cities}>
                    <FlatList
                        marginHorizontal={10}
                        showsHorizontalScrollIndicator={false}
                        data={cities}
                        keyExtractor={(item) => String(item.key)}
                        renderItem={({ item }) => <City data={item} deleteCity={deleteCity}/>}
                    />
                </SafeAreaView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },

    header: {
        width: "100%",
        height: 60,
        backgroundColor: "#42a2fc",
        justifyContent: "center"
    },

    headerText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
        marginLeft: 15
    },

    body: {
        flex: 1,
        alignItems: "center"
    },

    textInputView: {
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        flexDirection: "row"
    },

    TextInput: {
        borderColor: "blue",
        marginTop: 10,
        borderRadius: 10,
        backgroundColor: "#f2f2f2",
        width: "90%",
        height: 40,
        padding: 5,
        paddingLeft: 10
    },

    btnAdd: {
        backgroundColor: "#42a2fc",
        width: 30,
        height: 30,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        right: 25,
        top: 15
    },

    cities: {
        flex: 1,
        width: "100%",
        marginTop: 20
    }
})