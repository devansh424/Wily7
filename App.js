import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image} from 'react-native';
import TransactionScreen from './screens/transaction';
import SearchScreen from './screens/search';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createMaterialTopTabNavigator, createBottomTabNavigator } from 'react-navigation-tabs';
import Login from './screens/login';

export default class App extends React.Component{
  render(){
   return(
    <AppContainer/>
   );
  }
}

var tabNavigator = createBottomTabNavigator({
  TransactionScreen:{screen:TransactionScreen,
    navigationOptions:{
      tabBarIcon:<Image source={require("./assets/book.png")} style={{width:20,height:20}}/>
    }
  },
  SearchScreen:{screen:SearchScreen,
    navigationOptions:{
      tabBarIcon:<Image source={require("./assets/searchingbook.png")} style={{width:20,height:20}}/>
    }
  }
});

var SwitchNav = createSwitchNavigator({
  Login:Login,
  home:tabNavigator
})

var AppContainer = createAppContainer(SwitchNav);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

