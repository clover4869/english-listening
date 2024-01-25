const audioTag = document.getElementById("myAudio");
let startTime = 0;
let endTime = 0;
let breakCase;

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
  // audioTag.removeEventListener("timeupdate", handleTimeUpdate);
  // audioTag.addEventListener("timeupdate", handleTimeUpdate);

  // Set the start time and play the audio
  audioTag.currentTime = start;
  audioTag.play();

  const functionControlTime = () => {
    // console.log({
    //   "audioTag.ended": audioTag.ended,
    //   "audioTag.currentTime": audioTag.currentTime,
    // });

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
    console.log({ audioTag });
    // appendBreakCase(0, endTime);

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
  console.log(breakCase);
  for (let index = 0; index < breakCase.length; index++) {
    const element = breakCase[index];
    const start = element.getAttribute("start");
    const end = element.getAttribute("end");

    element.addEventListener("click", (a, b) => {
      console.log("hihi", start, end);
      startTime = Number(start);
      endTime = Number(end);
    });
  }
};

// handle remove break case when click btn remove
const handleRemoveBreakCase = (event) => {
  event.preventDefault();
  event.stopPropagation();
  console.log($(event.target), event);
  $(event.target).closest(".break-case").remove();
  saveData()
};
const handleInitRemove = () => {
  const btnRemoves = document.querySelectorAll(".break-delete");
  console.log("hihi", btnRemoves);

  for (let index = 0; index < btnRemoves.length; index++) {
    const element = btnRemoves[index];
    // element.removeEventListener('click',handleRemoveBreakCase);
    element.addEventListener("click", handleRemoveBreakCase);
  }
};

// function append break case
const appendBreakCase = (start, end) => {
  if (start > end) start = 0;
  const breakContainerElement = document.getElementById("break-container");
  $(breakContainerElement).append(`
  <li class="break-case" start=${start} end=${end} >
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

// handle add break case when click btn break
$(function () {
  const btnElement = document.getElementById("break-btn");
  const breakContainerElement = document.getElementById("break-container");
  btnElement.addEventListener("click", () => {
    const { start, end } = getStartEnd();
    console.log({ start, end });
    appendBreakCase(Number(start), Number(end));
    handleInitRemove();
    initHandleApplyBreak();
    saveData();
  });
});

// init handle break case
$(function () {
  getData();
  handleInitRemove();
  initHandleApplyBreak();
});

$(function () {
  $("#break-container").sortable({
    revert: true,
  });
});

// save data
function saveData(params) {
  const breakContainerElement = document.getElementById("break-container");
  const html = breakContainerElement.outerHTML;
  localStorage.setItem("html", JSON.stringify(html));
  const htmlStore = localStorage.getItem("html");
  console.log({ html, htmlStore });
}

// save data
function getData(params) {
  const breakContainerElement = document.getElementById("break-container");
  const htmlStore = localStorage.getItem("html");
  if (!htmlStore) return;
  breakContainerElement.outerHTML = JSON.parse(htmlStore);
}
