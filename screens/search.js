import * as React from "react";
import { View, Text, TouchableOpacity, FlatList, StatusBar } from "react-native";
import db from '../Config';

export default class SearchScreen extends React.Component{
    constructor(){
        super();
        this.state={
            allTransction:[]
        }
    }

    getTransactions = async ()=>{
        db.collection("transactions").limit(10).get().then((query)=>{
            query.docs.map((response)=>{
                this.setState({
                    allTransction:[...this.state.allTransction,response.data()]
                });
            });
        });
    }

    componentDidMount(){
        this.getTransactions();
    }

    render(){
        console.log(this.state.allTransction);
        
        if(this .state.allTransction.length===0){
            return(
                        <View>
                            <Text>
                                Loading...
                            </Text>
                        </View>)
        }else{
            return(
                <View>
                <FlatList data={this.state.allTransction} keyExtractor={(item,index)=>index.toString()} 
                    renderItem={({item})=>(
                        <View style={{borderWidth:1,alignItems:"center",padding:10}}>
                            <Text style={{fontSize:20,fontWeight:"bold"}}>
                                {"StudentID : "+item.studentID}
                            </Text>
                            <Text style={{fontSize:20,fontWeight:"bold"}}>
                                {"BookID : "+item.bookID}
                            </Text>
                            <Text style={{fontSize:20,fontWeight:"bold"}}>
                                {"transaction type : "+item.transactionType}
                            </Text>
                        </View>
                        
                       
                    )}
                /> 
                
            </View>
        )}
    }
}