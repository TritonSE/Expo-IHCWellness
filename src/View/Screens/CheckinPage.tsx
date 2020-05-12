import * as React from 'react';
import { Button, ScrollView, StyleSheet, View, KeyboardAvoidingView, Alert } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';

import CheckinBackend from '../../Business/CheckinBackend';
import AppHeader from '../../components/AppHeader';
import CheckinSlider from '../../components/CheckinSlider';
import CheckinTextInput from '../../components/CheckinTextInput';
import CustomQuestion from '../../components/CustomQuestion'

interface IState {
  health: number;
  hoursOfSleep: number;
  mood: number;
  journal: string;
  questionsActive: any[]
}

class CheckinPage extends React.Component<object, IState> {
  constructor(props: object) {
    super(props);
    this.state = {
      health: 5,
      hoursOfSleep: 8,
      mood: 1,
      journal: '',
      questionsActive: ['health', 'hoursOfSleep', 'mood', 'journal']
    };
  }

  public sendFormInfo = () => {
    const formInfo = Object.assign({}, this.state);
    console.log(JSON.stringify(formInfo));
    CheckinBackend.saveData(formInfo);
  }

  dropDownOnSelect(idx, value) { console.log(idx + '' + value) }

  public render() {
    return (
      <KeyboardAvoidingView 
          behavior="padding" enabled   keyboardVerticalOffset={0} 
          style={styles.keyboard}>
        <View style={styles.pageView}>
          <AppHeader title="Check-in" />

          <ModalDropdown 
                options={this.state.questionsActive}
                onSelect = {(idx, value) => this.dropDownOnSelect(idx, value)}
          />

          <ScrollView style={styles.questions}>
              <CheckinSlider
                title="How healthy are you feeling today?"
                step={0.1}
                minValue={0}
                maxValue={10}
                value={this.state.health}
                onSlidingComplete={(val) => this.setState({ health: val })}
              />

              <CheckinSlider
                title="How many hours of sleep did you get last night?"
                step={0.1}
                minValue={0}
                maxValue={10}
                value={this.state.hoursOfSleep}
                onSlidingComplete={(val) => this.setState({ hoursOfSleep: val })}
              />

              <CheckinSlider
                title="Are you happy?"
                step={0.01}
                minValue={0}
                maxValue={1}
                value={this.state.mood}
                onSlidingComplete={(val) => this.setState({ mood: val })}
              />  
      
              <CheckinTextInput 
                style={styles.textInputs}
                title="Journal Entry"
                titleColor="#000000"
                multiline={true}
                autocapital="none"
                underlineColor="transparent"
                finalText={this.state.journal}
                onChangeText={(val) => this.setState({ journal: val })}
              />

              <CustomQuestion />

              <Button
                title="Add Custom Question"
                onPress={()=>{this.state.questionsActive.push('new custom question')}}
              />

              <Button
                style={styles.submitButton}
                title="Submit"
                onPress={this.sendFormInfo}
              />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  pageView: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
    // borderColor: 'red',
  },
  // Without this the ScrollView is able to scroll past the header for an unknown reason
  questions: {
    marginTop: 88, //was 64 but questions were showing in header
  },
  submitButton: {
    paddingTop: 20,
  },
  textInputs: {
    height: 100, // For dimensions
    borderRadius: 2, // How round is the text box
    borderWidth: 2, // Set border width.
    borderColor: '#000000', // Set border Hex Color Code Here
    color: '#000000', // Setting up Text Font Color.
    backgroundColor : '#FFFFFF', // Setting Up Background Color of Text component.
    padding : 2, // Adding padding on Text component.
    fontSize: 14,
    //textAlign: 'center',
    margin: 10,
  },
  keyboard: {
    flex: 1, 
    flexDirection: 'column',
    justifyContent: 'center',
  },
});

export default CheckinPage;
