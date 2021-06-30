import * as React from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { Header } from "react-native-elements";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";

export default class TransactionScreen extends React.Component{
    constructor(){
        super();
        this.state={
            hasCameraPermission:null,
            buttonState:"normal",
            scanned:false,
            scanData:"",
        }
    }

    getCameraPermission = async ()=>{
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hasCameraPermission: status ==="granted",
            buttonState:"clicked",
            scanned:false,
        });
    }

    handleBarCodeScanner = async ({type,data})=>{
        this.setState({
            scanned:true,
            scanData:data,
            buttonState:"normal",
        })
    }

    render(){

        if(this.state.hasCameraPermission && this.state.buttonState==="clicked"){

            return(
                <BarCodeScanner onBarCodeScanned={this.state.scanned ? undefined : this.handleBarCodeScanner} 
                style={StyleSheet.absoluteFillObject}/>
            );

        }else if(this.state.buttonState==="normal"){
            return(
                <View style={styles.container}>
                    <Text>
                        TransactionScreen
                    </Text>
    
                    <Text>{this.state.hasCameraPermission ? this.state.scanData : "RequestCameraPermission"}</Text>
    
                    <TouchableOpacity onPress={this.getCameraPermission} style={styles.button}>
                        <Text>
                            Scan QR Code
                        </Text>
                    </TouchableOpacity>
    
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        backgroundColor:'yellow',
        alignItems:'center',
    },

    button:{
        backgroundColor:'aqua',
        padding:10,
        margin:10,
    },
})