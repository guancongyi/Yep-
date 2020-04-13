import 'jquery'
// This import loads the firebase namespace.
import firebase from 'firebase/app';

// These imports load individual services into the firebase namespace.
import 'firebase/auth';
import 'firebase/database';


/*
    country: Country, Code,Population,Continent	GDP	Life Expectancy
    city: Name, country code, district, population
    language: country code, isOfficial, Language, Percentage
*/
class Database {
    constructor() {
        localStorage.clear();

        const firebaseConfig = {
            apiKey: "AIzaSyBxAY8l3CubPoeLoRNaNnYC5zYfgX2aDp0",
            authDomain: "inf551-d972f.firebaseapp.com",
            databaseURL: "https://inf551-d972f.firebaseio.com",
            projectId: "inf551-d972f",
            storageBucket: "inf551-d972f.appspot.com",
            messagingSenderId: "1023654183370",
            appId: "1:1023654183370:web:df412475f62dce4e560f33"
        };
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        this.currDB = "world"
    }

    getData(collectionName, filter = null, num = 800) {
        let dbRef = firebase.database().ref();
        // console.log(dbRef.child("yelp_index").remove())

        // default return 
        if (filter == null) {
            return new Promise((resolve, _) => {
                let data = dbRef.child(collectionName).limitToFirst(100);
                data.on('value', function (snapshot) {
                    resolve(Object.values(snapshot.val()));
                })
            })
           
        }
        // with filter
        if (collectionName == "world") {
            let data = dbRef.child("world_index").orderByKey().equalTo(filter['keyword']).limitToFirst(num);
            return new Promise(function (resolve, reject) {
                data.on('value', function (snapshot) {
                    console.log(snapshot.val())
                    let arrData = Object.values(snapshot.val())[0];
                    // console.log(arrData)
                    let res = { 'country2': [], 'city': [], 'countrylanguage': [] };
                    for (let i = 0; i < arrData.length; i++) {
                        // console.log(arrData[i])
                        let category = arrData[i][0];
                        res[category].push(arrData[i][2])
                    }
                    
                    resolve(res);
                })
            });

        } else if (collectionName == "us_restaurant") {

            let data = dbRef.child("yelp_index").orderByKey().equalTo(filter['keyword']).limitToFirst(num);
            return new Promise(function (resolve, reject) {
                data.on('value', function (snapshot) {
                    let arrData = Object.values(snapshot.val())[0];
                    let res = { 'yelp_business': [], 'yelp_user': [] };
                    for (let i = 0; i < arrData.length; i++) {
                        // console.log(arrData[i])
                        let category = arrData[i][0];
                        res[category].push(arrData[i][2])
                    }
                    // console.log(res); 
                    resolve(res);
                })
            });
        } else {

        }
    }

    getDataByKey(collectionName, key) {

    }
}


export default Database;