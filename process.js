/*
    country: Country, Code,Population,Continent	GDP	Life Expectancy
    city: Name, country code, district, population
    language: country code, isOfficial, Language, Percentage
*/


class database{
    constructor(){
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
        this.currDB = 'world';
    }
    // process returned search data, and return well-formatted data
    processData(rawData){
       
    }
    getData(db, filter=null){
        let dbRef = firebase.database().ref();
        
        if (filter == null){
            let data = dbRef.child(db);
            return new Promise((resolve, _ )=>{
                data.on('value',function(snapshot){
                    resolve(Object.values(snapshot.val()));
                })
            });
        }else{
            let data;
            if(db == "world"){
                data = dbRef.child("index").orderByKey().equalTo(filter['keyword']);
                return new Promise(function(resolve, reject){
                    data.on('value',function(snapshot){
                        let arrData = Object.values(snapshot.val())[0];
                        // console.log(arrData)
                        let res = {'country':[], 'city':[], 'countrylanguage':[]};
                        for(let i = 0; i<arrData.length; i++){
                            console.log(arrData[i][0])
                            let category = arrData[i][0];
                            for (let j = 0; j<arrData[i].length; j++){
                                if (j==0){continue;}
                                if (j==2){res[category].push(arrData[i][j])}
                            }    
                        }
                        //console.log(res); 
                        resolve(res);
                    })
                });
                
            }else if(db == "world_restaurant"){
        
            }else{
        
            }
            
        }


        // return new Promise(function(resolve, reject){
        //     data.on('value',function(snapshot){
        //         resolve(Object.values(snapshot.val()))  ;
        //     })
        // });
    }
}


export default database;