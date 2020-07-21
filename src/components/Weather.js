import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, StatusBar, Image, ScrollView, ProgressBarAndroid, Modal, Alert, SafeAreaView, FlatList, TouchableOpacity } from 'react-native'
import { Entypo, AntDesign } from '@expo/vector-icons'
import AsyncStorage from '@react-native-community/async-storage'

import RandomCities from './RandomCities.json'

export default function App() {

    const [data, setData] = useState(null)
    const [modal, setModal] = useState(false)
    const [city, setCity] = useState("")
    const [cities, setCities] = useState([])

    const images = [
        { "img": require('../../assets/imgs/night.gif') },
        { "img": require('../../assets/imgs/day.gif') },
        { "img": require('../../assets/imgs/moon.gif') },
        { "img": require('../../assets/imgs/sun.gif') }
    ]

    const colors = [
        { "color": "#42a2fc" },
        { "color": "#f5a97d" },
    ]

    const randomCities = RandomCities

    async function loadCities() {
        try {
            const citiesStorage = await AsyncStorage.getItem("@cities")
            const selectedCity = await AsyncStorage.getItem("@selectedCity")
            if (citiesStorage) {
                setCities(JSON.parse(citiesStorage))
            }
            if (selectedCity) {
                setCity(selectedCity)
            } else {
                var randomCityPosition = Math.floor(Math.random() * 100)
                setCity(randomCities[randomCityPosition].city)
            }
        } catch (error) {
            Alert.alert("Error", error)
        }
    }

    const loadWeather = () => {

        if (city !== "") {
            fetch("http://api.weatherapi.com/v1/forecast.json?key=7980ad9e8f314369a1c192434200607&q=" + city + "&days=1")

                .then(response => response.json())
                .then(response => {
                    setData(response)
                })

                .catch(err => {
                    alert("Erro: " + err)
                });
        }

    }

    function modalOpen() {
        loadCities()
        setModal(true)
    }

    async function saveSelectedCity(city) {
        try {
            await AsyncStorage.setItem('@selectedCity', city)
        } catch (error) {
            Alert.alert("Error: " + error)
        }
    }

    function selectCity(city) {
        setCity(city)
        saveSelectedCity(city)
    }

    useEffect(() => {
        loadCities()
        loadWeather()
    }, [])

    useEffect(() => {
        loadWeather()
    }, [city])


    if (data === null || city === "") {

        return (
            <View style={styles.loadingContainer}>
                <StatusBar barStyle="light-content" backgroundColor="#2a94f7" />
                <View style={styles.header}>
                    <Text style={styles.headerText}>Weather</Text>
                </View>
                <View style={styles.loading}>
                    <Text style={styles.loadingText}>Carregando dados...</Text>
                    <ProgressBarAndroid styleAttr="Horizontal" color="#2a94f7" style={{ width: "90%" }} />
                </View>
            </View>
        )

    } else {

        var imgPosition = 0
        var imgAstroPosition = 0
        var colorPosition = 0

        if ((data.current.is_day) === 0) {
            imgPosition = 0
            imgAstroPosition = 2
            colorPosition = 0
        } else {
            imgPosition = 1
            imgAstroPosition = 3
            colorPosition = 1
        }

        const textStyle = () => {
            return {
                color: colors[colorPosition].color,
                fontWeight: "700",
                position: "absolute",
                alignSelf: "center",
                right: 15,
            }
        }

        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="#2a94f7" />

                <View style={styles.header}>
                    <Text style={styles.headerText}>{(data.location.name)}</Text>
                    <Entypo
                        name="info-with-circle"
                        size={24}
                        color={"white"}
                        style={{
                            position: "absolute",
                            right: 15
                        }}
                        onPress={() => modalOpen()}
                    />
                </View>

                <Modal animationType="slide" transparent={true} visible={modal}>
                    <View style={{ flex: 1, backgroundColor: "white", width: "100%" }}>
                        <View style={styles.header}>
                            <Text style={styles.headerText}>Choose a city</Text>
                            <AntDesign
                                name="closecircle"
                                size={24}
                                color={"white"}
                                style={{
                                    position: "absolute",
                                    right: 15
                                }}
                                onPress={() => setModal(false)}
                            />
                        </View>

                        <SafeAreaView style={{ flex: 1, marginTop: 20 }}>
                            <FlatList
                                data={cities}
                                keyExtractor={(item) => String(item.key)}
                                renderItem={({ item }) => <TouchableOpacity
                                    style={styles.modalItem}
                                    onPress={() => selectCity(item.city)}
                                >
                                    <Text style={styles.modalItemText}>{item.city}</Text>
                                </TouchableOpacity>}
                            />
                        </SafeAreaView>
                    </View>
                </Modal>

                <View style={styles.body}>
                    <Image source={(images[imgPosition].img)} style={styles.cityImage} />
                    <Text style={styles.temp}>{(data.current.temp_c)}ºC</Text>
                    <Image source={(images[imgAstroPosition].img)} style={styles.astroGif} />
                    <ScrollView style={styles.info} alwaysBounceVertical={true}>

                        <View style={styles.infoContainer}>
                            <Text style={styles.infoText}>Last update</Text>
                            <Text style={textStyle()}>{(data.current.last_updated)}</Text>
                        </View>

                        <View style={styles.infoContainer}>
                            <Text style={styles.infoText}>Local time</Text>
                            <Text style={textStyle()}>{(data.location.localtime)}</Text>
                        </View>

                        <View style={styles.infoContainer}>
                            <Text style={styles.infoText}>Thermal sensation</Text>
                            <Text style={textStyle()}>{(data.current.feelslike_c)}ºC</Text>
                        </View>

                        <View style={styles.infoContainer}>
                            <Text style={styles.infoText}>Maximum temperature</Text>
                            <Text style={textStyle()}>{(data.forecast.forecastday[0].day.maxtemp_c)}ºC</Text>
                        </View>

                        <View style={styles.infoContainer}>
                            <Text style={styles.infoText}>Minimum temperature</Text>
                            <Text style={textStyle()}>{(data.forecast.forecastday[0].day.mintemp_c)}ºC</Text>
                        </View>

                        <View style={styles.infoContainer}>
                            <Text style={styles.infoText}>Air humidity</Text>
                            <Text style={textStyle()}>{(data.current.humidity)}%</Text>
                        </View>

                        <View style={styles.infoContainer}>
                            <Text style={styles.infoText}>Precipitation</Text>
                            <Text style={textStyle()}>{(data.current.precip_mm)} mm</Text>
                        </View>

                        <View style={styles.infoContainer}>
                            <Text style={styles.infoText}>Wind speed</Text>
                            <Text style={textStyle()}>{(data.current.wind_kph)} km/h</Text>
                        </View>

                        <View style={styles.infoContainer}>
                            <Text style={styles.infoText}>Wind direction</Text>
                            <Text style={textStyle()}>{(data.current.wind_degree)}º</Text>
                        </View>

                        <View style={styles.infoContainer}>
                            <Text style={styles.infoText}>Atmospheric pressure</Text>
                            <Text style={textStyle()}>{(data.current.pressure_mb)} hPa</Text>
                        </View>

                        <View style={styles.infoContainer}>
                            <Text style={styles.infoText}>Visibility</Text>
                            <Text style={textStyle()}>{(data.current.vis_km)} km</Text>
                        </View>

                        <View style={styles.infoContainer}>
                            <Text style={styles.infoText}>UV Index</Text>
                            <Text style={textStyle()}>{(data.current.uv)}</Text>
                        </View>

                        <View style={styles.infoContainer}>
                            <Text style={styles.infoText}>Region</Text>
                            <Text style={textStyle()}>{(data.location.region)}</Text>
                        </View>

                        <View style={styles.infoContainer}>
                            <Text style={styles.infoText}>Country</Text>
                            <Text style={textStyle()}>{(data.location.country)}</Text>
                        </View>

                        <View style={styles.infoContainer}>
                            <Text style={styles.infoText}>Latitude</Text>
                            <Text style={textStyle()}>{(data.location.lat)}º</Text>
                        </View>

                        <View style={styles.infoContainer}>
                            <Text style={styles.infoText}>Longitude</Text>
                            <Text style={textStyle()}>{(data.location.lon)}º</Text>
                        </View>

                        <View style={styles.infoContainer}>
                            <Text style={styles.infoText}>Sunrise</Text>
                            <Text style={textStyle()}>{(data.forecast.forecastday[0].astro.sunrise)}</Text>
                        </View>

                        <View style={styles.infoContainer}>
                            <Text style={styles.infoText}>Sunset</Text>
                            <Text style={textStyle()}>{(data.forecast.forecastday[0].astro.sunset)}</Text>
                        </View>

                        <View style={styles.infoContainer}>
                            <Text style={styles.infoText}>Moonrise</Text>
                            <Text style={textStyle()}>{(data.forecast.forecastday[0].astro.moonrise)}</Text>
                        </View>

                        <View style={styles.infoContainer}>
                            <Text style={styles.infoText}>Moonset</Text>
                            <Text style={textStyle()}>{(data.forecast.forecastday[0].astro.moonset)}</Text>
                        </View>

                    </ScrollView>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1
    },

    loading: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center"
    },

    loadingText: {
        color: "black",
        fontSize: 18,
        marginTop: 15
    },

    container: {
        flex: 1,
        width: "100%",
        backgroundColor: '#fff',
        alignItems: 'center',
    },

    header: {
        width: "100%",
        height: 60,
        backgroundColor: "#42a2fc",
        alignItems: "center",
        flexDirection: "row"
    },

    headerText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
        marginLeft: 15
    },

    body: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },

    cityImage: {
        resizeMode: "contain",
        flex: 1
    },

    astroGif: {
        position: "absolute",
        width: 120,
        height: 120,
        top: 200,
        resizeMode: "contain"
    },

    temp: {
        position: "absolute",
        top: 120,
        fontSize: 48,
        fontWeight: "bold",
        color: "white"
    },

    info: {
        width: "100%",
        maxHeight: 300,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        position: "absolute",
        bottom: 0,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },

    infoContainer: {
        width: "90%",
        padding: 10,
        borderBottomWidth: 0,
        alignSelf: "center",
        flexDirection: "row"
    },

    infoText: {
        marginLeft: 5,
        color: "white",
        fontWeight: "700"
    },

    infoTextRight: {
        color: "#f5a97d",
        fontWeight: "700",
        position: "absolute",
        alignSelf: "center",
        right: 15,
    },

    modalItem: {
        flex: 1,
        alignSelf: "center",
        width: "90%",
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

    modalItemText: {
        color: "white",
        marginLeft: 10,
        marginRight: 60,
        fontSize: 18
    }
});
