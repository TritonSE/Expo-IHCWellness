import { Alert, AsyncStorage } from 'react-native';

const CheckinBackend = {
  saveData: async (checkinData: object) => {
    const date = CheckinBackend.getCurrentDate();
    // check if person has already checked in today
    const data = await CheckinBackend.retrieveData(date);
    if (data === 'error' || data != null) {
      Alert.alert('You have already checked in today');
      return;
    }
    // add new information to storage
    try {
      await AsyncStorage.setItem(date, JSON.stringify(checkinData));
      CheckinBackend.updateDates(date);
    } catch (error) {
      console.log(error);
    }
  },

  retrieveData: async (date: string) => {
    try {
      const asyncValue = await AsyncStorage.getItem(date);
      return asyncValue;
    } catch (error) {
      // throw error; // TODO change to throw error
      console.log(error);
      return 'error';
    }
  },

  parseData: (dataString: string | null) => {
    if (dataString == null) return 'You did not check in that day';
    const parsed = JSON.parse(dataString);
    let text = '';
    Object.keys(parsed).forEach((key) => {
      text += `${key} : ${parsed[key]}\n`;
    });
    return text;
  },

  displayAllData: async () => {
    AsyncStorage.getAllKeys().then((keyArray) => {
      AsyncStorage.multiGet(keyArray).then((keyValArray) => {
        let myStorage: any = {};
        for (const keyVal of keyValArray) {
          myStorage[keyVal[0]] = keyVal[1];
        }
        console.log('CURRENT STORAGE: ', myStorage);
      });
    });
  },

  clearAllData: async () => {
    await AsyncStorage.clear();
  },

  getCurrentDate: () => {
    return CheckinBackend.parseDate();
  },

  parseDate: (dateInMilliseconds: number = new Date().getTime()) => {
    // gets the current date or the date from time in milliseconds
    const date = new Date(dateInMilliseconds);
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    const condensedDate = `${year}-${month}-${day}`;
    return condensedDate;
  },

  updateDates: async (date: string) => {
    // check if at least one date has already been recorded
    const checkinStr = await AsyncStorage.getItem('checkins');
    let allDates = checkinStr ? JSON.parse(checkinStr) : null;
    // create an array with the first date or append to the existing array
    if (allDates == null) {
      allDates = [date];
    } else {
      allDates.push(date);
    }
    await AsyncStorage.setItem('checkins', JSON.stringify(allDates));
  },

  getPlaceholder: (dateToCheck: string) => {
    console.log(dateToCheck);
    if (dateToCheck === '') return 'select date';
    return dateToCheck;
  },
};

export default CheckinBackend;