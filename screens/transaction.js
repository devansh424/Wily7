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
            scannedBookID:"",
            scannedStudentID:"",
        }
    }

    getCameraPermission = async (id)=>{
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hasCameraPermission: status ==="granted",
            buttonState:id,
            scanned:false,
        });
    }

    handleBarCodeScanner = async ({type,data})=>{
        if(this.state.buttonState==="BookID"){
            this.setState({
                scanned:true,
                scannedBookID:data,
                buttonState:"normal",
            });
        }else if(this.state.buttonState==="StudentID"){
            this.setState({
                scanned:true,
                scannedStudentID:data,
                buttonState:"normal",
            });
        }
        
    }

    render(){

        if(this.state.hasCameraPermission && this.state.buttonState!=="normal"){

            return(
                <BarCodeScanner onBarCodeScanned={this.state.scanned ? undefined : this.handleBarCodeScanner} 
                style={StyleSheet.absoluteFillObject}/>
            );

        }else if(this.state.buttonState==="normal"){
            return(
                <View style={styles.container}>
                    <View style={styles.inputcontainer}>
                        <TextInput placeholder="studentID" style={styles.inputbox} value={this.state.scannedStudentID}></TextInput>

                        <TouchableOpacity onPress={()=>{
                            this.getCameraPermission("StudentID");
                        }} 
                        style={styles.button}>
                            <Text>Scan</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputcontainer}>
                        <TextInput placeholder="BookID" style={styles.inputbox} value={this.state.scannedBookID}></TextInput>
                        <TouchableOpacity onPress={()=>{
                            this.getCameraPermission("BookID");
                        }} 
                        style={styles.button}>
                            <Text>Scan</Text>
                        </TouchableOpacity>
                    </View>
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

    inputbox:{
        padding:10,
        margin:10,
        fontSize:12,
        borderWidth:1,
        backgroundColor:'white'
    },

    inputcontainer:{
        flexDirection:"row",
    }
})