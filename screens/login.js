import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
  TextInput,
  StyleSheet,
  Alert
} from "react-native";
import db from "../Config";
import firebase from "firebase";

export default class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
    };
  }

  login = async ()=>{
    try{
        const response = await firebase.auth().signInWithEmailAndPassword(this.state.email,this.state.password);
        if(response){
            this.props.navigation.navigate("TransactionScreen");
        }
    }catch(error){
        Alert.alert(error.message);
    }
  }

  render() {
    return (
      <View>

        <TextInput
          placeholder={"email"}
          style={styles.inputbox}
          onChangeText={(text) => {
            this.setState({
              email: text,
            });
          }}
          value={this.state.email}
        ></TextInput>

        <TextInput
          secureTextEntry={true}
          placeholder={"password"}
          style={styles.inputbox}
          onChangeText={(text) => {
            this.setState({
              password: text,
            });
          }}
          value={this.state.password}
        ></TextInput>

        <TouchableOpacity style={styles.button} onPress={this.login}>
          <Text>
              Login
          </Text>
        </TouchableOpacity>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "yellow",
    alignItems: "center",
  },

  button: {
    backgroundColor: "aqua",
    padding: 10,
    margin: 10,
  },

  inputbox: {
    padding: 10,
    margin: 10,
    fontSize: 12,
    borderWidth: 1,
    backgroundColor: "white",
  },

  inputcontainer: {
    flexDirection: "row",
  },

  imagestyle: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
});
