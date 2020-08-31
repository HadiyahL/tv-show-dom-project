//You can edit ALL of the code here

const allEpisodes = getAllEpisodes();

function setup() {
  console.log(allEpisodes);
  makePageForEpisodes(allEpisodes);
}
let displaySpan = document.createElement("span");

function makePageForEpisodes(episodeList) {
  const episodesElem = document.querySelector(".episodes");
  episodesElem.textContent = "";

  //episodesElem.textContent = `Got ${episodeList.length} episode(s)`;
  episodeList.forEach((episode) => {
    let divEl = document.createElement("div");
    let header = document.createElement("h2");
    let image = document.createElement("img");
    let textEl = document.createElement("p");
    let spanEl = document.createElement("span");

    //ZERO PADDING EPISODE CODE TO TWO DIGITS
    // let season = episode.season;
    // let epi = episode.number;
    // if (season <= 9) {
    //   season = "0" + season;
    // }
    // if (epi <= 9) {
    //   epi = "0" + epi;
    // }

    //ADDING CONTENT TO THE ELEMENTS CREATED
    spanEl.textContent = displayEpisodeCode(episode);
    header.textContent = `${episode.name} - `;
    image.src = episode.image.original;
    textEl.innerHTML = episode.summary;

    //APPENDING THE ELEMENTS CREATED AS APPROPRIATE
    episodesElem.appendChild(divEl);
    divEl.appendChild(header);
    header.appendChild(spanEl);
    divEl.appendChild(image);
    divEl.appendChild(textEl);

    //ADDING CLASS NAME TO THE ELEMENTS CREATED
    divEl.className = "episode-box";
    header.className = "episode-name";
    image.className = "episode-img";
    spanEl.className = "episode-code";
    textEl.className = "episode-summary";

    //LIVE SEARCH
    let searchBar = document.forms["search"].querySelector("input");
    searchBar.addEventListener("keyup", searchEpisodes);

    let form = document.querySelector("#search");
    form.addEventListener("submit", function (event) {
      event.preventDefault();
    });
  });
  let divElem = document.querySelector(".searchEpisodes");

  displaySpan.textContent = `Displaying ${allEpisodes.length}/${allEpisodes.length} episodes`;
  displaySpan.className = "searching";
  divElem.appendChild(displaySpan);
  selectEpisode(episodeList);
}

//FUNCTION SEARCHING THE EPISODES
function searchEpisodes(event) {
  // event.preventDefault();
  let searchTerm = event.target.value.toLowerCase();
  let filteredEpisodes = allEpisodes.filter((episode) => {
    let name = episode.name.toLowerCase();
    //console.log(name);
    let summary = episode.summary.toLowerCase();
    return name.includes(searchTerm) || summary.includes(searchTerm);
  });
  let divEl = document.querySelector(".searchEpisodes");

  makePageForEpisodes(filteredEpisodes);

  displaySpan.textContent = `Displaying ${filteredEpisodes.length}/${allEpisodes.length} episodes`;

  divEl.appendChild(spanEl);
  console.log(spanEl);
}

//FUNCTION CREATING & ADDING OPTIONS TO THE SELECT ELEMENT
function selectEpisode(episodeList) {
  let dropdownEl = document.querySelector("#episodesDropdown");
  episodeList.forEach((episode) => {
    let optionEl = document.createElement("option");
    optionEl.textContent = `${displayEpisodeCode(episode)} - ${episode.name}`;
    optionEl.value = episode.name;
    dropdownEl.appendChild(optionEl);
  });

  let selection = document.querySelector("#episodesDropdown");
  selection.addEventListener("change", selectOption);
}

//FUNCTION SELECTING EPISODE FROM DROPDOWN ENSURING ONLY SELECTED EPISODE IS DISPLAYED
function selectOption(event) {
  let episodeName = event.target.value;
  if (episodeName === "default") {
    return makePageForEpisodes(allEpisodes);
  }
  let selectedEpisode = allEpisodes.filter((episode) => {
    if (episode.name === episodeName) {
      return true;
    } else {
      return false;
    }
  });
  makePageForEpisodes(selectedEpisode);
}

//FUNCTION GENERATES SEASON AND EPISODE WHILE ZERO PADDING EPISODE CODE (LESS THAN 10) TO TWO DIGITS
function displayEpisodeCode(episode) {
  let season = episode.season;
  let epi = episode.number;
  if (season <= 9) {
    season = "0" + season;
  }
  if (epi <= 9) {
    epi = "0" + epi;
  }

  return `S${season}E${epi}`;
}
window.onload = setup;
