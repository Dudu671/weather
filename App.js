import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import Weather from './src/components/Weather'
import Cities from './src/components/Cities'

export default function App() {

  const Tab = createBottomTabNavigator()

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName

            if (route.name === 'Weather') {
              iconName = focused ? 'weather-partly-cloudy' : 'weather-partly-cloudy'
            } else if (route.name === 'Cities') {
              iconName = focused ? 'city-variant-outline' : 'city-variant-outline'
            }

            return <MaterialCommunityIcons name={iconName} size={size} color={color} />
          }
        })}

        tabBarOptions={{
          activeTintColor: "white",
          inactiveTintColor: "#292929",
          activeBackgroundColor: "#2a94f7",
          inactiveBackgroundColor: "#2a94f7",
          style: {
            borderTopWidth: 0
          }
        }}
      >
        <Tab.Screen name="Weather" component={Weather} />
        <Tab.Screen name="Cities" component={Cities} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}