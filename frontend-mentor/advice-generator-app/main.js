let advice_id = document.getElementById("advice-id");
let advice_text = document.getElementById("advice-text");
const URL = "https://api.adviceslip.com/advice"; 

getAdvice();

function getAdvice() {
    fetch(URL, { cache: 'no-cache' })
  .then(response => response.json())
  .then(data =>{
    advice_id.textContent = data.slip.id;
    advice_text.textContent = data.slip.advice;
  })
  .catch(error => console.error(error));
}