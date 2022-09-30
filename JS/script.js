let amountTag = document.querySelector("#amount")
let fromCurrencyTag = document.querySelector("#fromCurrency")
let toCurrencyTag = document.querySelector("#toCurrency")
let convertTag = document.querySelector(".convert");
let resultTag = document.querySelector(".result");
let saveTag = document.querySelector(".save");
let recordsTag = document.querySelector(".records tbody");
let rates = DATA["rates"];
let currencies = Object.keys(rates)
currencies.sort()
let localKeys = Object.keys(localStorage);
localKeys.sort((x,y) => x-y)

//Adding option tag in html from api
let addToOption = () => {    
    for (currency in currencies){
        let optionFromTag = document.createElement("option");
        let optionToTag = document.createElement("option");
        let country = currencies[currency];
        optionFromTag.value = country;
        optionFromTag.append(country);
        fromCurrencyTag.append(optionFromTag);
        optionToTag.value = country;
        optionToTag.append(country);
        toCurrencyTag.append(optionToTag);    
    }
}

addToOption()

//calculate currency to MMK from any others
let convertCurrencyM = (from,to) => {
    return from*to
}

//calculate currency to any others from MMK
let convertCurrencyG = (mmk,to) => {
    return mmk/to
}

//This function work to show the table
let saveFunc = (date,from,to,result) => {
    let trTag = document.createElement("tr");
    let dateTdTag = document.createElement("td")
    dateTdTag.append(date);
    let fromTdTag = document.createElement("td")
    fromTdTag.append(from);
    let toTdTag = document.createElement("td")
    toTdTag.append(to);
    let resultTdTag = document.createElement("td")
    resultTdTag.append(result);

    trTag.append(dateTdTag,fromTdTag,toTdTag,resultTdTag);
    recordsTag.append(trTag);
    
}

//when user press convert button 
//this will calculate the currency and give some data
let fromValue;
let amount;
let date;
convertTag.addEventListener("click",() => {
    
     amount = Number(amountTag.value)
    fromValue = Number((rates[fromCurrencyTag.value]).replace(",",""));
    let toValue;    
    if ( toCurrencyTag.value != "MMK"){

        let mmk = convertCurrencyM(amount,fromValue);
        toValue = Number((rates[toCurrencyTag.value]).replace(",",""))
        resultTag.textContent = ((convertCurrencyG(mmk,toValue)).toFixed(2)).toString()+" " + toCurrencyTag.value;
    } else {       
        resultTag.textContent = ((convertCurrencyM(amount,fromValue)).toFixed(2)).toString()+" " + toCurrencyTag.value;  
    }
    date = new Date().toLocaleString();
    amountTag.focus()
    amountTag.value=""
})

//to take the data from save function
class toSaveInLocalStorage {
    constructor (date,from,to,result) {
        this.Date = date;
        this.From = from;
        this.To = to;
        this.Result = result;
    }
}

let ID = 1;
let dataList = [];
if (localStorage.length > 0){
    ID = Number(localKeys[localKeys.length-1])+1
}


//to record the data in localStorage by class
let recordToLocalStorage = (date,from,to,result) => {
    let recordToSave = new toSaveInLocalStorage(date,from,to,result);
    localStorage.setItem(ID,JSON.stringify(recordToSave));
    ID++;
}

//to show the recorded data when page is reload
let showTheSavedRecord = () =>{
    localKeys.map((el)=>{
        let data = JSON.parse(localStorage.getItem(el));
        saveFunc(data.Date,data.From,data.To,data.Result)
    })
}

//when user press save button
//this will work for to show the new data on table and record the saved data to localStorage
saveTag.addEventListener("click",() => {    
    let unitAmount = amount.toString() +" "+ fromCurrencyTag.value;
    dataList = [date,unitAmount,toCurrencyTag.value,resultTag.textContent]
    saveFunc(...dataList);
    recordToLocalStorage(...dataList)
})

showTheSavedRecord()