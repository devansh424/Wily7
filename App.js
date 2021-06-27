import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import TransactionScreen from './screens/transaction';
import SearchScreen from './screens/search';
import { createAppContainer } from 'react-navigation';
import { createMaterialTopTabNavigator, createBottomTabNavigator } from 'react-navigation-tabs';

export default class App extends React.Component{
  render(){
   return(
    <AppContainer/>
   );
  }
}

var tabNavigator = createBottomTabNavigator({
  TransactionScreen:TransactionScreen,
  SearchScreen:SearchScreen
});
var AppContainer = createAppContainer(tabNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

