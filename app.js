//elements

const startBtn = document.querySelector("#start");
const stopBtn = document.querySelector("#stop");
const speakBtn = document.querySelector("#speak");
const time = document.querySelector("#time");
const battery = document.querySelector("#battery");
const internet = document.querySelector("#internet");
const msgs = document.querySelector(".messages");


document.querySelector("#start_charlie_btn").addEventListener("click", () =>{
    recognition.start();
});
//weather the recognition is stopping on my command or automatically 
let stopingR = false;
//charlie commands
let charlieComs = [];
charlieComs.push("hi charlie");
charlieComs.push("what are your commands");
charlieComs.push("close this - to close opened popups");
charlieComs.push(
  "change my information - information regarding your acoounts and you"
);
charlieComs.push("whats the weather or temperature");
charlieComs.push("show the full weather report");
charlieComs.push("are you there - to check fridays presence");
charlieComs.push("shut down - stop voice recognition");
charlieComs.push("open google");
charlieComs.push('search for "your keywords" - to search on google ');
charlieComs.push("open whatsapp");
charlieComs.push("open youtube");
charlieComs.push('play "your keywords" - to search on youtube ');
charlieComs.push("close this youtube tab - to close opened youtube tab");
charlieComs.push("open firebase");
charlieComs.push("open netlify");
charlieComs.push("open twitter");
charlieComs.push("open my twitter profile");
charlieComs.push("open instagram");
charlieComs.push("open my instagram profile");
charlieComs.push("open github");
charlieComs.push("open my github profile");

//weather setup
function weather(location) {
    const weatherCont = document.querySelector(".temp").querySelectorAll("*");

    let url =`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=48ddfe8c9cf29f95b7d0e54d6e171008`;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = function () {
        if(this.status === 200) {
            let data = JSON.parse(this.responseText);
            weatherCont[0].textContent = `Location : ${data.name}`;
            weatherCont[1].textContent = `Country : ${data.sys.country}`;
            weatherCont[2].textContent = `Weather type : ${data.weather[0].main}`;
            weatherCont[3].textContent = `Weather description : ${data.weather[0].description}`;
            weatherCont[4].src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            weatherCont[5].textContent = `Original Temperature : ${ktc(data.main.temp)}`; 
            weatherCont[6].textContent = `feel like ${ktc(data.main.feels_like)}`;
            weatherCont[7].textContent = `Min temperature ${ktc(data.main.temp_min)}`;
            weatherCont[8].textContent = `Max temperature ${ktc(data.main.temp_max)}`;
            weatherStatement = `sir the weather in ${data.namd} is${data.weather[0].description} and the temperature feels like ${ktc(data.main.feels_like)}`;
        }else{
            weatherCont[0].textContent = "Weather Info Not Found";
        }
    };

    xhr.send();
}
//convert kelvin to celcius
function ktc(k) {
    k = k - 273.15;
    return k.toFixed(2);
}
//time setup
let date = new Date();
let hrs = date.getHours();
let mins = date.getMinutes();
let secs = date.getSeconds();
//this is what charlie tells about weather
let weatherStatement = "";
let charge,chargeStatus,connectivity,currentTime
chargeStatus = "unplugged"
//onload (window)
window.onload = () => {
    //jarvis commands adding
    charlieComs.forEach((e) => {
        document.querySelector(".commands").innerHTML += `<p>#${e}</p><br/>`
    })
    // time - clock
    // time.textContent = `${hrs} : ${mins} : ${secs}`
    // setInterval(() => {
    //     let date = new Date();
    //     let hrs = date.getHours();
    //     let mins = date.getMinutes();
    //     let secs = date.getSeconds();
    //     time.textContent = `${hrs} : ${mins} : ${secs}`
    // }, 1000);

    function formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        currentTime = strTime
        time.textContent = strTime
      }
      
      formatAMPM(date)
      setInterval(() => {
        formatAMPM(date)
      }, 60000);
    }


// battery setup
let batteryPromise = navigator.getBattery()
batteryPromise.then(batteryCallback)

function batteryCallback(batteryObject) {
    printBatteryStatus(batteryObject)
    setInterval(() => {
        printBatteryStatus(batteryObject)
    }, 5000);
}
 


// function printBatteryStatus(batteryObject) {
//     // battery.textContent=`${batteryObject.level*100}%`
//     if(batteryObject.charging = true) {
//         document.querySelector(".battery").style.width ="200px"
//         battery.textContent = `${batteryObject.level*100}% Charging`
//     }
// }

function printBatteryStatus(batteryObject) {
    document.querySelector("#battery").textContent = `${
      (batteryObject.level * 100).toFixed(2)
    }%`;
    charge = batteryObject.level * 100
    if (batteryObject.charging === true) {
      document.querySelector(".battery").style.width = "200px";
      document.querySelector("#battery").textContent = `${
        (batteryObject.level * 100).toFixed(2)
      }% Charging`;
      chargeStatus = "plugged in"
    }
  }

// internet setup
if(navigator.onLine){
   document.querySelector("#internet").textContent = "online"
   connectivity = "online"
}else{
   document.querySelector("#internet").textContent = "offline"
   connectivity = "offline"
}
setInterval(() => {
if(navigator.onLine){
   document.querySelector("#internet").textContent = "online"
   connectivity = "online"
}else {
    document.querySelector("#internet").textContent = "offline"
    connectivity = "offline"
}
}, 60000);

//create a new chats
function createMsg(who,msg){
    let newmsg = document.createElement("p")
    newmsg.innerText = msg;
    newmsg.setAttribute("class", who)
    msgs.appendChild(newmsg)
}

//jarvis setup

if(localStorage.getItem("jarvis_setup") !== null) {
    weather(JSON.parse(localStorage.getItem("jarvis_setup")).location)
}

//jarvis information setup
const setup = document.querySelector(".jarvis_setup");
setup.style.display = "none"
if(localStorage.getItem("jarvis_setup") === null) {
    setup.style.display = "block"
    // setup.style.display = "flex"
    setup.querySelector("button").addEventListener("click" ,userInfo);
}

//userInfo functrion
function userInfo(){
    let setupInfo = {
        name : setup.querySelectorAll("input")[0].value,
        bio : setup.querySelectorAll("input")[1].value,
        location : setup.querySelectorAll("input")[2].value,
        instagaram : setup.querySelectorAll("input")[3].value,
        twitter : setup.querySelectorAll("input")[4].value,
    }

    let testArr = []

    setup.querySelectorAll("input").forEach((e) => {
        testArr.push(e.value)
    }) 

    if(testArr.includes("")) {
        readOut("sir enter your complete information")
    } else{
      localStorage.clear()
      localStorage.setItem("jarvis_setup", JSON.stringify(setupInfo));
      setup.style.display = "none"
      weather(JSON.parse(localStorage.getItem("jarvis_setup")).location)
    }
}



//speech recognition setup

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.continuous = true
var synth = window.speechSynthesis;
const speech = new SpeechSynthesisUtterance();
//sr start
recognition.onstart = function () {
    console.log("vr active");
    document.querySelector("#stop_charlie_btn").style.display = "flex"
};

//sr result

//arr of window
let windowsB = []

recognition.onresult = function (event) {
let current = event.resultIndex;
    let transcript = event.results[current][0].transcript;
    transcript = transcript.toLowerCase();
    let userdata = localStorage.getItem("jarvis_setup");
    
    createMsg("usermsg",transcript)


    if(transcript.includes("hi, charlie")) {
        readOut("hello sir");
    }  
    // some casual commands
    if (transcript.includes("what's the current charge") || transcript.includes("what's the current charging")) {
        readOut(`the current charge is ${charge}`);
      }
      if (transcript.includes("what's the charging status")) {
        readOut(`the current charging status is ${chargeStatus}`);
      }
      if (transcript.includes("current time")) {
        readOut(currentTime);
      }
      if (transcript.includes("what's the connection status")) {
        readOut(`you are ${connectivity} sir`);
      }
    if(transcript.includes("what are your commands")) {
        readOut("sir, I follow the following commands");
        if(window.innerWidth <= 400 ){
            window.resizeTo(screen.width,screen.height)
          }
        document.querySelector(".commands").style.display = "block"
    }
    if(transcript.includes("who created you?")) {
        readOut("I was created by Mr. Rajiv Tomar");
    }
    if(transcript.includes("close this")) {
        readOut("closed");
        document.querySelector(".commands").style.display = "none"
        setup.style.display = "none"
    }
    // close popups
    if (transcript.includes("close all tabs") || transcript.includes("close all tab")) {
        readOut("closing the tab sir");
        document.querySelector(".commands").style.display = "none";
        if(window.innerWidth >= 401 ){
          window.resizeTo(250,250)
        }
        setup.style.display = "none";
      }
      // info change
    if (transcript.includes("change my information")) {
        readOut("Opening the information tab sir");
        localStorage.clear();
        
        if(window.innerWidth <= 400 ){
          window.resizeTo(screen.width,screen.height)
        }
        setup.style.display = "flex";
        setup.querySelector("button").addEventListener("click", userInfo);
      }
      // availability check
    if (transcript.includes("are you there")) {
        readOut("yes sir");
      }
      // close voice recognition
      if (transcript.includes("shut down")) {
        readOut("Ok sir i will take a nap");
        stopingR = true;
        recognition.stop();
      }
    
    // weather report
    if (
        transcript.includes("what's the temperature")
      ) {
        readOut(weatherStatement);
      }
      if (transcript.includes("full weather report")) {
        readOut("opening the weather report sir");
        let a = window.open(`https://www.google.com/search?q=weather+in+${JSON.parse(localStorage.getItem("jarvis_setup")).location}`);
        windowsB.push(a)
      }
    //jarvis bio
    if(transcript.includes("tell me about yourself")){
        readOut("sir, i am a charlie, a voice assistant made for browsers using javascript by Rajiv Tomar. i can do anything whoch can be done from a browser.")
    }
    if(transcript.includes("open youtube")) {
        readOut("opening youtube sir");
        let a = window.open("https://www.youtube.com/");
        windowsB.push(a)
    }
    if (transcript.includes("play")) {
        let playStr = transcript.split("");
        playStr.splice(0, 5);
        let videoName = playStr.join("");
        playStr = playStr.join("").split(" ").join("+");
        readOut(`searching youtube for ${videoName}`);
        let a = window.open(`https://www.youtube.com/search?q=${playStr}`
        );
        windowsB.push(a)
      }
    if(transcript.includes("open google")) {
        readOut("opening google sir");
        let a = window.open("https://www.google.com/");
        windowsB.push(a)
    }
    //google search
    if(transcript.includes("search for")) {
        readOut("here's the result");
        let input = transcript.split("");
        input.splice(0,11);
        input.pop();
        input = input.join("").split(" ").join("+");
        console.log(input);
        window.open(`https://www.google.com/search?q=${input}`);
    }
    if(transcript.includes("open firebase") || transcript.includes("open fire base")) {
        readOut("opening firebase console");
        window.open("https://console.firebase.google.com/");
    }
    // whatsapp
    if (transcript.includes("open whatsapp")) {
        readOut("opening whatsapp");
        let a = window.open("https://web.whatsapp.com/");
        windowsB.push(a)
      }
    // spotify
    if (transcript.includes("open spotify")) {
        readOut("opening spotify");
        let a = window.open("https://open.spotify.com/");
        windowsB.push(a)
    }
    if(transcript.includes("suggest me a song")){
        readOut("i think you listen SOULMATE song by arijit singh and badshah")
    }
    // canva
  
    if (transcript.includes("open my canva designs")) {
        readOut("opening canva designs");
        window.open("https://www.canva.com/folder/all-designs");
    }
    // calendar
    if (transcript.includes("open calendar")) {
        readOut("opening calendar");
        let a = window.open("https://calendar.google.com/");
        windowsB.push(a)
    }
    if (transcript.includes("open canva")) {
        readOut("opening canva");
        window.open("https://www.canva.com/");
    }
    
    //instagram command
    if(transcript.includes("open instagram")) {
        readOut("opening instagram sir")
        window.open("https://www.instagram.com/")
    }
    if(transcript.includes("open my instagram profile")) {
        readOut("opening your instagram profile sir")
        window.open(`https://www.instagram.com/iam_raj.iv/`)
    }
    if(transcript.includes("open map")){
        readOut("opening google map")
        window.open("https://www.google.co.in/maps")
    }
    if (transcript.includes("top headlines")) {
      // readOut("These are today's top headlines sir")
      let input = transcript
      let a = input.indexOf("regarding")
      input = input.split("")
      input.splice(0,a+9)
      input.shift()
      input.pop()
  
      readOut(`here's some headlines sir ${input.join("")}`)
      getCategoryNews(input.join(""))
      window.open("https://news.google.com/home?hl=en-IN&gl=IN&ceid=IN:en")
    }
};

// //sr stop
// recognition.onend = function () {
//     console.log("vr deactive");
// }
recognition.onend = function() {
    if(stopingR === false){
        setTimeout(() =>{
            recognition.start();
        },500);
    }else if(stopingR === true){
        recognition.stop();
        document.querySelector("#stop_charlie_btn").style.display ="none"
    }
};

//sr continuous
recognition.continuous = true;

startBtn.addEventListener("click", () => {
   recognition.start();
});
stopBtn.addEventListener("click", () => {
   recognition.stop();
 });

//charlie speech
function readOut(message){
    const speech = new SpeechSynthesisUtterance();
    speech.text = message;
    speech.volume = 1;
    window.speechSynthesis.speak(speech);
    console.log("speaking out");
    createMsg("jmsg",message);
}


// example
speakBtn.addEventListener("click", () => {
    readOut("Hi i am charlie");
});
// // small jarvis
// const smallJarvis = document.querySelector("#small_jarvis")
// smallJarvis.addEventListener("click", () => {
//   window.open(`${window.location.href}`,"newWindow","menubar=true,location=true,resizable=false,scrollbars=false,width=200,height=200,top=0,left=0")
//   window.close()
// })
// document.querySelector("#jarvis_start").addEventListener("click", () => {
//   recognition.start()
// })
// const lang = navigator.language;
// let datex =new Date();
// let dayNumber =date.getDate();
// let monthx =date.getMonth();

// let dayName =date.toLocaleString(lang,{weekday: 'long'});
// let monthName =date.toLocaleString(lang,{month: 'long'});
// let year =date.getFullYear();

// document.querySelector("#month").innerHTML = monthName
// document.querySelector("#day").innerHTML = dayName
// document.querySelector("#date").innerHTML = dayNumber
// document.querySelector("#year").innerHTML = year

// document.querySelector(".calender").addEventListener("click", ()=>{
//     window.open("https://calendar.google.com/")
// })

//news setup
async function getNews() {
    var url = "https://newsapi.org/v2/top-headlines?country=in&apiKey=b0712dc2e5814a1bb531e6f096b3d7d3"
    var req =newRequest(url)
    await fetch(req).then((response) => response.JSON())
    .then((data) =>{
        console.log(data);
        let arrNews = data.articles
        console.log(arrNews.length);
        arrNews.length =10
        console.log(arrNews.length);
        console.log(arrNews);
        let a =[]
        arrNews.forEach((e,index)=>{
            a.push(e.title)
        });
        readOut(a)
    })
}
// news setup

async function getNews(){
  var url = "https://newsapi.org/v2/top-headlines?country=in&apiKey=b0712dc2e5814a1bb531e6f096b3d7d3"
  var req = new Request(url)
  await fetch(req).then((response) => response.json())
  .then((data) => {
    console.log(data);
    let arrNews = data.articles
    arrNews.length = 10
    let a = []
    arrNews.forEach((e,index) => {
      a.push(index+1)
      a.push(".........")
      a.push(e.title)
      a.push(".........")

    });
    readOut(a)
  })
}

// category news

let yyyy,mm,dd

dd = date.getDate()
mm = date.getMonth()
yyyy = date.getFullYear()

async function getCategoryNews(category){
  var url =
    "https://newsapi.org/v2/everything?" +
    `q=${category}&` +
    `from=${yyyy}-${mm}-${dd}&` +
    "sortBy=popularity&" +
    "apiKey=b0712dc2e5814a1bb531e6f096b3d7d3";

    // https://newsapi.org/v2/everything?q=Apple&from=2021-09-19&sortBy=popularity&apiKey=API_KEY

    var req = new Request(url)

  await fetch(req).then((response) => response.json())
  .then((data) => {
    console.log(data);
    let arrNews = data.articles
    arrNews.length = 10
    let a = []
    arrNews.forEach((e,index) => {
      a.push(index+1)
      a.push(".........")
      a.push(e.title)
      a.push(".........")
    });
    readOut(a)
  })
}
