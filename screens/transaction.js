import * as React from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from "react-native";
import { Header } from "react-native-elements";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";
import db from '../Config';
import firebase from 'firebase';

export default class TransactionScreen extends React.Component{
    constructor(){
        super();
        this.state={
            hasCameraPermission:null,
            buttonState:"normal",
            scanned:false,
            scannedBookID:"",
            scannedStudentID:"",
            transactionMessage:null,
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

  /*  getBook = async ()=>{
        db.collection("books").doc("bsc001").get().then((document)=>{
            console.log(document.data());
        });
    }

    componentDidMount(){
        this.getBook();
    } */

    handleTransaction = async ()=>{
        var transactionMessage
        
        db.collection("books").doc(this.state.scannedBookID).get().then((doc)=>{
            var book = doc.data();
            if(book.bookAvailable){
                this.initiateBookIssue();
                transactionMessage="bookIssued";
            }else{
                this.initiateBookReturn();
                transactionMessage="bookRetuned";
            }
        });
        this.setState({
            transactionMessage:transactionMessage,
        });
        
    }

        initiateBookIssue = async ()=>{
            db.collection("transactions").add({
                bookID:this.state.scannedBookID,
                studentID:this.state.scannedStudentID,
                transactionType:"issued",
                date:firebase.firestore.Timestamp.now().toDate(),
            });

            db.collection("books").doc(this.state.scannedBookID).update({
                bookAvailable:false
            });

            db.collection("students").doc(this.state.scannedStudentID).update({
                bookIssued:firebase.firestore.FieldValue.increment(1)
            });

            Alert.alert("book Issued");

            this.setState({
                scannedBookID:"",
                scannedStudentID:""
            });
        }

        
        initiateBookReturn = async ()=>{
            db.collection("transactions").add({
                bookID:this.state.scannedBookID,
                studentID:this.state.scannedStudentID,
                transactionType:"return",
                date:firebase.firestore.Timestamp.now().toDate(),
            });

            db.collection("books").doc(this.state.scannedBookID).update({
                bookAvailable:true
            });

            db.collection("students").doc(this.state.scannedStudentID).update({
                bookIssued:firebase.firestore.FieldValue.increment(-1)
            });

            Alert.alert("book Returned");

            this.setState({
                scannedBookID:"",
                scannedStudentID:""
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

                    
                    <TouchableOpacity onPress={()=>{
                            this.handleTransaction();
                        }} 
                        style={styles.button}>
                            <Text>Submit</Text>
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