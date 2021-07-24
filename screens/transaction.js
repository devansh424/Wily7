import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ToastAndroid,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import { Header } from "react-native-elements";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";
import db from "../Config";
import firebase from "firebase";

export default class TransactionScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      hasCameraPermission: null,
      buttonState: "normal",
      scanned: false,
      scannedBookID: "",
      scannedStudentID: "",
      transactionMessage: null,
    };
  }

  getCameraPermission = async (id) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === "granted",
      buttonState: id,
      scanned: false,
    });
  };

  /*  getBook = async ()=>{
        db.collection("books").doc("bsc001").get().then((document)=>{
            console.log(document.data());
        });
    }

    componentDidMount(){
        this.getBook();
    } */

  handleTransaction = async () => {
    var transactionType = this.checkBookEligibility();
    console.log(transactionType);

    if (transactionType === false) {
      Alert.alert("Book doesnt Exists in library");

      this.setState({
        scannedBookID: "",
        scannedStudentID: "",
      });
    } else if (transactionType === "issue") {
      var ifStudentEligible = this.checkStudentEligibilityForBookIssue();

      if (ifStudentEligible) {
        this.initiateBookIssue();
        Alert.alert("Book Issued");
      }
    } else {
      var ifStudentEligible = this.checkStudentEligibilityForBookReturn();

      if (ifStudentEligible) {
        this.initiateBookReturn();
        Alert.alert("Book Returned");
      }
    }
  };

  initiateBookIssue = async () => {
    db.collection("transactions").add({
      bookID: this.state.scannedBookID,
      studentID: this.state.scannedStudentID,
      transactionType: "issued",
      date: firebase.firestore.Timestamp.now().toDate(),
    });

    db.collection("books").doc(this.state.scannedBookID).update({
      bookAvailable: false,
    });

    db.collection("students")
      .doc(this.state.scannedStudentID)
      .update({
        bookIssued: firebase.firestore.FieldValue.increment(1),
      });

    ToastAndroid.show("Book Issued", ToastAndroid.SHORT);

    this.setState({
      scannedBookID: "",
      scannedStudentID: "",
    });
  };

  initiateBookReturn = async () => {
    db.collection("transactions").add({
      bookID: this.state.scannedBookID,
      studentID: this.state.scannedStudentID,
      transactionType: "return",
      date: firebase.firestore.Timestamp.now().toDate(),
    });

    db.collection("books").doc(this.state.scannedBookID).update({
      bookAvailable: true,
    });

    db.collection("students")
      .doc(this.state.scannedStudentID)
      .update({
        bookIssued: firebase.firestore.FieldValue.increment(-1),
      });

    ToastAndroid.show("Book Reurn", ToastAndroid.SHORT);

    this.setState({
      scannedBookID: "",
      scannedStudentID: "",
    });
  };

  handleBarCodeScanner = async ({ type, data }) => {
    if (this.state.buttonState === "BookID") {
      this.setState({
        scanned: true,
        scannedBookID: data,
        buttonState: "normal",
      });
    } else if (this.state.buttonState === "StudentID") {
      this.setState({
        scanned: true,
        scannedStudentID: data,
        buttonState: "normal",
      });
    }
  };

  checkBookEligibility = async () => {
    const bookRef = await db
      .collection("books")
      .where("bookID", "==", this.state.scannedBookID)
      .get();
    var transactionType = "";

    if (bookRef.docs.length == 0) {
      transactionType = false;
    } else {
      bookRef.docs.map((doc) => {
        var book = doc.data();
        if (book.bookAvailable) {
          transactionType = "issue";
        } else {
          transactionType = "return";
        }
      });
    }
    return transactionType;
  };

  checkStudentEligibilityForBookIssue = async () => {
    var studentRef = await db
      .collection("students")
      .where("studentID", "==", this.state.scannedStudentID)
      .get();
    var StudentEligible = "";

    if (studentRef.docs.length == 0) {
      StudentEligible = false;
      Alert.alert("StudentID does not Exists");
      this.setState({
        scannedStudentID: "",
        scannedBookID: "",
      });
    } else {
      studentRef.docs.map((doc) => {
        var student = doc.data();
        if (student.bookIssued < 2) {
          StudentEligible = true;
        } else {
          StudentEligible = false;
          Alert.alert("The student has one book issued already");
          this.setState({
            scannedBookID: "",
            scannedStudentID: "",
          });
        }
      });
    }
    return StudentEligible;
  };

  checkStudentEligibilityForBookReturn = async () => {
    var transactionRef = await db
      .collection("transactions")
      .where("bookID", "==", this.state.scannedBookID)
      .limit(1)
      .get();
    var studentEligible = "";

    transactionRef.docs.map((doc) => {
      var lastbooktransaction = doc.data();
      if (lastbooktransaction.studentID === this.state.scannedStudentID) {
        studentEligible = true;
      } else {
        studentEligible = false;
        Alert.alert("this book was issued by the student");
        this.setState({
          scannedStudentID: "",
          scannedBookID: "",
        });
      }
    });
  };

  render() {
    if (this.state.hasCameraPermission && this.state.buttonState !== "normal") {
      return (
        <BarCodeScanner
          onBarCodeScanned={
            this.state.scanned ? undefined : this.handleBarCodeScanner
          }
          style={StyleSheet.absoluteFillObject}
        />
      );
    } else if (this.state.buttonState === "normal") {
      return (
        <KeyboardAvoidingView
          style={styles.container}
          behavior={"padding"}
          enabled
        >
          <Header
            backgroundColor="pink"
            centerComponent={{
              text: "Transaction Screen",
              style: { fontSize: 20, color: "red" },
            }}
          />

          <Image
            source={require("../assets/booklogo.jpg")}
            style={styles.imagestyle}
          />

          <View style={styles.inputcontainer}>
            <TextInput
              placeholder="studentID"
              style={styles.inputbox}
              value={this.state.scannedStudentID}
              onChangeText={(student) => {
                this.setState({
                  scannedStudentID: student,
                });
              }}
            ></TextInput>

            <TouchableOpacity
              onPress={() => {
                this.getCameraPermission("StudentID");
              }}
              style={styles.button}
            >
              <Text>Scan</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputcontainer}>
            <TextInput
              placeholder="BookID"
              style={styles.inputbox}
              value={this.state.scannedBookID}
              onChangeText={(book) => {
                this.setState({
                  scannedBookID: book,
                });
              }}
            ></TextInput>
            <TouchableOpacity
              onPress={() => {
                this.getCameraPermission("BookID");
              }}
              style={styles.button}
            >
              <Text>Scan</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => {
              this.handleTransaction();
            }}
            style={styles.button}
          >
            <Text>Submit</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      );
    }
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
