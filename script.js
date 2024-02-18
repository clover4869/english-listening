const audioTag = document.getElementById("myAudio");
let startTime = 0;
let endTime = 0;
let breakCase;

const audioData = {
  start: 0,
  end: 0,
  duration: 0,
  breakTimes: [],
  element: document.getElementById("myAudio"),
  audio: null,
};

const makeKey = () => {
  return "audio-key" + Math.round(Math.random() * 99999999999999);
};

const getTimeString = (seconds) => {
  const m = parseInt(((seconds % (60 * 60)) / 60).toString());
  const s = parseInt((seconds % 60).toString());

  return (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
};

// handle time update
function handleTimeUpdate() {
  if (audioTag.currentTime >= endTime || audioTag.ended) {
    // Move the playback to the start time
    audioTag.currentTime = startTime;
  }
}

// handle play audio with loop
function playAudioWithLoop(start, end) {
  // Set the start time and play the audio
  audioTag.currentTime = start;
  audioTag.play();

  const functionControlTime = () => {
    if (audioTag.currentTime >= endTime || audioTag.ended) {
      // Move the playback to the start time
      audioTag.currentTime = startTime;
    } else if (audioTag.currentTime < startTime) {
      audioTag.currentTime = startTime;
    }
  };
  clearInterval(functionControlTime);
  setInterval(functionControlTime, 100);
}

$(function () {
  $(audioTag).on("loadedmetadata", function () {
    startTime = 0;
    endTime = Math.round(audioTag.duration);

    document.querySelector(".slider-range-show-value").innerHTML =
      getTimeString(startTime) + " - " + getTimeString(endTime);

    playAudioWithLoop(startTime, endTime);

    $(".slider-range-input").slider({
      range: true,
      min: 0,
      max: audioTag.duration,
      values: [0, audioTag.duration],
      slide: function (event, ui) {
        startTime = ui.values[0];
        endTime = ui.values[1];
        document.querySelector(".slider-range-show-value").innerHTML =
          getTimeString(startTime) + " - " + getTimeString(endTime);

        playAudioWithLoop(startTime, endTime);
      },
    });
  });
});

// content accodition
$(function () {
  var acc = document.getElementsByClassName("accordion");
  var i;

  for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  }
});

// handle click break case
const initHandleApplyBreak = () => {
  breakCase = document.getElementsByClassName("break-case");
  for (let index = 0; index < breakCase.length; index++) {
    const element = breakCase[index];
    const start = element.getAttribute("start");
    const end = element.getAttribute("end");

    element.addEventListener("click", (a, b) => {
      startTime = Number(start);
      endTime = Number(end);
    });
  }
};

// handle remove break case when click btn remove
const handleRemoveBreakCase = (event) => {
  event.preventDefault();
  event.stopPropagation();
  const key = $(event.target).closest(".break-case").attr("key");

  const newBreakTimes = audioData.breakTimes.filter((item) => item.key !== key);
  audioData.breakTimes = newBreakTimes;
  handleRenderBreakTimes(newBreakTimes, true);
};
const handleInitRemove = () => {
  const btnRemoves = document.querySelectorAll(".break-delete");

  for (let index = 0; index < btnRemoves.length; index++) {
    const element = btnRemoves[index];
    // element.removeEventListener('click',handleRemoveBreakCase);
    element.addEventListener("click", handleRemoveBreakCase);
  }
};

// function append break case
const appendBreakCase = ({ start, end, key }) => {
  const breakContainerElement = document.getElementById("break-container");
  $(breakContainerElement).append(`
  <li class="break-case" start=${start} end=${end} key=${key} >
    ${start} --> ${end} 

    <button class="bin-button break-delete">
  <svg
    class="bin-top"
    viewBox="0 0 39 7"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line y1="5" x2="39" y2="5" stroke="white" stroke-width="4"></line>
    <line
      x1="12"
      y1="1.5"
      x2="26.0357"
      y2="1.5"
      stroke="white"
      stroke-width="3"
    ></line>
  </svg>
  <svg
    class="bin-bottom"
    viewBox="0 0 33 39"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <mask id="path-1-inside-1_8_19" fill="white">
      <path
        d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"
      ></path>
    </mask>
    <path
      d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
      fill="white"
      mask="url(#path-1-inside-1_8_19)"
    ></path>
    <path d="M12 6L12 29" stroke="white" stroke-width="4"></path>
    <path d="M21 6V29" stroke="white" stroke-width="4"></path>
  </svg>
</button>
  </li>
`);
};

// get start end from input
const getStartEnd = () => {
  const start = document.getElementsByClassName("input-start")[0].value;
  const end = document.getElementsByClassName("input-end")[0].value;
  if (!end && !start) {
    const end = Math.round(audioTag.currentTime);
    const breakCaseElements = document.getElementsByClassName("break-case");
    const start =
      breakCaseElements[breakCaseElements.length - 1]?.getAttribute("end") || 0;

    return {
      start,
      end,
    };
  }
  return { start, end };
};

//sort able
$(function () {
  $("#break-container").sortable({
    revert: true,
    stop: function (event, ui) {
      const breakCases = $(".break-case");
      const result = [];
      breakCases.each((index, node) => {

        result.push({
          start: node.getAttribute("start"),
          end: node.getAttribute("end"),
          key: node.getAttribute("key"),
        });
      });

      audioData.breakTimes = result;
      saveData({ key: "breaks", data: result });
    },
  });
});

// save data
function saveData({ key, data }) {
  localStorage.setItem(key, JSON.stringify(data));
}

// get data
function getData(key) {
  const store = localStorage.getItem(key);
  if (!store) return [];
  return JSON.parse(store);
}

const handleRenderBreakTimes = (beakTimes, isSave = false) => {
  const elementBreakContainer = document.getElementById("break-container");
  elementBreakContainer.innerHTML = "";
  for (let index = 0; index < beakTimes.length; index++) {
    const element = beakTimes[index];
    appendBreakCase({ ...element });
  }
  if (isSave) saveData({ key: "breaks", data: beakTimes });
  handleInitRemove();
  initHandleApplyBreak();
};

$(function () {
  // init element audio when html loaded
  audioData.element = document.getElementById("myAudio");
  const btnAddBreakTime = document.getElementById("btn-add-break-time");

  //init
  (function () {
    audioData.breakTimes = getData("breaks");
    handleRenderBreakTimes(audioData.breakTimes);
  })();

  btnAddBreakTime.addEventListener("click", () => {
    const { start, end } = getStartEnd();
    audioData.breakTimes.push({
      start,
      end,
      key: makeKey(),
    });

    handleRenderBreakTimes(audioData.breakTimes, true);
  });
});
