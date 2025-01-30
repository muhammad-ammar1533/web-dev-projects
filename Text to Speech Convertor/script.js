const speechBox = document.querySelector(".speechBox"),
speechBtn = document.querySelector(".convert"),
voiceList = document.querySelector(".voices select");

let voiceOptions = []
let synth = window.speechSynthesis;
let isSpeaking = true;

synth.addEventListener("voiceschanged", ()=>{
  voiceOptions = synth.getVoices();
  for(let i = 0; i < voiceOptions.length; i++){
    // Creating an option tag with voice details
    let option = "<option>"+voiceOptions[i].name+"</option>";

    voiceList.insertAdjacentHTML("beforeend",option);// Inset this option tag we created in select tag
  }
});

function textToSpeech(text){
  let speech = new SpeechSynthesisUtterance(text);
  for(let i = 0; i < voiceOptions.length; i++){
    if(voiceOptions[i].name === voiceList.value){
      speech.voice = voiceOptions[i];
    }
  }
  speechSynthesis.speak(speech);
}

speechBtn.addEventListener("click", (e)=>{
  e.preventDefault();
  if(speechBox.value.length > 0){
    if(!synth.speaking){ 
      // Call the function only when the speech is not currently speaking
      textToSpeech(speechBox.value);
    }

    if(speechBox.value.length > 50){
      if(isSpeaking){
        synth.resume();
        isSpeaking = false;
        speechBtn.innerHTML = "Pause";
      }
      else{
        synth.pause();
        isSpeaking = true;
        speechBtn.innerHTML = "Play";
      }
    }

    setInterval(() =>{
      if(!synth.speaking && !isSpeaking){
        isSpeaking = true;
        speechBtn.innerHTML = "Convert To Speech";
      }
    })
  }
});