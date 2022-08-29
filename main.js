// select items
let qstCount = document.querySelector(".qsts-count span");
let spans = document.querySelector(".bullets .spans");
let title = document.querySelector(".qst h2");
let labels = document.querySelectorAll(".answers label");
let submit = document.querySelector(".submit");
let firstInp = document.querySelector("input");
let answersArea = document.querySelector(".answers");
let result = document.querySelector(".result");
let resultRemark = document.querySelector(".result span");
let minutes = document.getElementById("mins");
let seconds = document.getElementById("secs");
let correctAnswers = 0;
let currentIndex = 0;
let duration = 15;
let countDown = setInterval(countdown, 1000);

getQuestions();

function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = () => {
    if (myRequest.readyState === 4 && myRequest.status === 200) {
      let qstObj = JSON.parse(myRequest.responseText);
      let qstCount = qstObj.length;
      document.querySelector(".from").innerHTML = qstCount;
      addBullets(qstCount);
      addData(qstObj[currentIndex], qstCount);
      submitAnswer(qstObj, qstCount);
    }
  };
  myRequest.open("GET", "qsts.json");
  myRequest.send();
}

function addBullets(num) {
  qstCount.innerHTML = num;
  for (i = 0; i < num; i++) {
    let bullet = document.createElement("span");
    spans.appendChild(bullet);
  }
  spans.firstElementChild.classList.add("on");
}

function addData(obj, count) {
  if (currentIndex < count) {
    title.textContent = obj.title;
    firstInp.checked = "true";
    let j = 1;
    labels.forEach((label) => {
      label.textContent = obj[`answer_${j}`];
      j++;
    });
  }
}

function submitAnswer(obj, count) {
  submit.addEventListener("click", () => {
    if (currentIndex < count) {
      checkAnswers(obj[currentIndex]);
      currentIndex++;
      addData(obj[currentIndex], count);
      handleBullets(currentIndex, count);
      duration = 9;
      if (currentIndex == count) {
        showResult();
      }
    }
  });
}

function checkAnswers(obj) {
  if (
    document.querySelector(".answers input:checked + label").textContent ==
    obj["right_answer"]
  ) {
    correctAnswers++;
  }
}

function handleBullets(qstNum, count) {
  if (qstNum < count) {
    spans.children[qstNum].classList.add("on");
  }
}

function showResult() {
  clearInterval(countDown);
  result.style.display = "block";
  document.querySelector(".bullets").remove();
  title.innerHTML = "";
  answersArea.innerHTML = "";
  if (correctAnswers < 5) {
    resultRemark.className = "Bad";
  } else if (correctAnswers < 9) {
    resultRemark.className = "Good";
  } else {
    resultRemark.className = "Perfect";
  }
  resultRemark.innerHTML = resultRemark.className;
  document.querySelector(".mark").innerHTML = correctAnswers;
  answersArea.appendChild(result);
  document.querySelector(".qst").style.display = "none";
  answersArea.style.marginTop = "10px";
  submit.style.display = "none";
}

function countdown() {
  mins = parseInt(duration / 60);
  secs = duration % 60;
  duration--;
  minutes.innerHTML = mins < 10 ? `0${mins}` : mins;
  seconds.innerHTML = secs < 10 ? `0${secs}` : secs;
  if (duration < 0) {
    duration = 15;
    submit.click();
  }
}
