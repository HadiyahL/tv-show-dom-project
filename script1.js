//You can edit ALL of the code here

let allEpisodes = "";
let dropdownEl = document.querySelector("#episodesDropdown");

function fetchEpisodes(showId = 82) {
  fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
    .then((response) => response.json())
    .then((data) => {
      allEpisodes = data;
      // console.log(allEpisodes);
      makePageForEpisodes(allEpisodes);
      createEpisodeDropdown(allEpisodes);
    })
    .catch((error) => {
      console.log(error);
    });
}
let displaySpan = document.createElement("span");

function makePageForEpisodes(episodesArray) {
  const episodesElem = document.querySelector(".episodes");
  episodesElem.textContent = "";

  //episodesElem.textContent = `Got ${episodeList.length} episode(s)`;
  episodesArray.forEach((episode) => {
    let divEl = document.createElement("div");
    let header = document.createElement("h2");
    let image = document.createElement("img");
    let textEl = document.createElement("p");
    let spanEl = document.createElement("span");

    //ADDING CONTENT TO THE ELEMENTS CREATED
    spanEl.textContent = displayEpisodeCode(episode);
    header.textContent = `${episode.name} - `;
    if (episode.image !== null) {
      image.src = episode.image.original;
    }

    textEl.innerHTML = episode.summary || "Sorry, no summary provided.";

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

  displaySpan.textContent = `Displaying ${episodesArray.length}/${allEpisodes.length} episodes`;
  displaySpan.className = "searching";
  divElem.appendChild(displaySpan);
  
  createShowList();
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

//FUNCTION CREATING & ADDING OPTIONS TO THE SHOW SELECT ELEMENT
function createShowList() {
  let showDropdown = document.querySelector("#showsDropdown");
  let shows = getAllShows();
  //console.log(shows);
  shows
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((show) => {
      let optionEl = document.createElement("option");
      optionEl.textContent = show.name;
      showDropdown.appendChild(optionEl);
      optionEl.value = show.id;
    });
}

//FUNCTION CREATING & ADDING OPTIONS TO THE EPISODE SELECT ELEMENT
function createEpisodeDropdown(episodesArray) {
  dropdownEl.textContent = "";
  let defaultOption = document.createElement("option");
  defaultOption.textContent = "All Episodes";
  defaultOption.value = "default";
  dropdownEl.appendChild(defaultOption);

  episodesArray.forEach((episode) => {
    let optionEl = document.createElement("option");
    optionEl.textContent = `${displayEpisodeCode(episode)} - ${episode.name}`;
    optionEl.value = episode.name;
    dropdownEl.appendChild(optionEl);
  });

  let selection = document.querySelector("#episodesDropdown");
  selection.addEventListener("change", selectOption);
}
//FUNCTION SELECTING SHOW FROM DROPDOWN ENSURING ONLY SELECTED SHOW IS DISPLAYED
function selectShow(event) {
  let showId = event.target.value;
  fetchEpisodes(showId)
  
}
document.querySelector("#showsDropdown").addEventListener("change", selectShow);
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

fetchEpisodes();
