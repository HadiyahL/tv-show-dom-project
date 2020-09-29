let allShows;
let allEpisodes = "";
let dropdownEl = document.querySelector("#episodesDropdown");
let displaySpan = document.createElement("span");

function setup() {
  allShows = getAllShows();
  makePageForShows(allShows);
  //LIVE SHOW
  let searchBar = document.forms["search"].querySelector("input");
  searchBar.addEventListener("keyup", searchShows);
}

function fetchEpisodes(showId = 82) {
  fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
    .then((response) => response.json())
    .then((data) => {
      allEpisodes = data;
      // console.log(allEpisodes);
      createBackToShowsListButton();
      makePageForEpisodes(allEpisodes);
      createEpisodeDropdown(allEpisodes);
      showEpisodesDropdown();
      hideShowsDropdown();
      //LIVE SEARCH
      let searchBar = document.forms["search"].querySelector("input");
      searchBar.addEventListener("keyup", searchEpisodes);
    })
    .catch((error) => {
      console.log(error);
    });
}

function makePageForShows(showsArray) {
  let shows = document.querySelector(".shows");
  showsArray.forEach((show) => {
    //console.log(show);
    //CREATE ELEMENTS
    let showBox = document.createElement("div");
    let showInfo = document.createElement("div");
    let showText = document.createElement("div");
    let showName = document.createElement("h2");
    let showImage = document.createElement("img");
    //let showSummary = document.createElement("p");
    let showDetails = document.createElement("ul");

    //ATTACH CONTENT TO ELEMENTS
    showName.textContent = show.name;
    if (show.image !== null) {
      showImage.src = show.image.original;
    }
    showSummary = show.summary;
    showDetails.innerHTML = `<li>Genre: ${show.genres}</li>
                            <li>Runtime: ${show.runtime}</li>
                            <li>Rating: ${show.rating}</li>
                            <li>Status: ${show.status}</li>`;
    //APPEND ELEMENTS
    showBox.appendChild(showName);
    showBox.appendChild(showInfo);
    showBox.appendChild(showText);
    shows.appendChild(showBox);

    showInfo.appendChild(showImage);
    showText.innerHTML += showSummary;
    showText.appendChild(showDetails);

    //ADDING CLASS NAME
    showBox.className = "showBox";
    showText.className = "showText";
    showInfo.className = "showInfo";

    //ADDING ID TO THE SHOWS
    showBox.id = show.id;

    //ADDING EVENT LISTENER TO ENABLE GETTING THE EPISODES FOR SHOW SELECTED
    showBox.addEventListener("click", showBoxHandler);
  });

  createShowList();
}

function makePageForEpisodes(episodesArray) {
  const episodesElem = document.querySelector(".episodes");
  episodesElem.textContent = "";

  //episodesElem.textContent = `Got ${episodeList.length} episode(s)`;
  episodesArray.forEach((episode) => {
    let divEl = document.createElement("div");
    let header = document.createElement("h2");
    let image = document.createElement("img");
    let textEl = document.createElement("p");
    let episodeCode = document.createElement("span");

    //ADDING CONTENT TO THE ELEMENTS CREATED
    episodeCode.textContent = displayEpisodeCode(episode);
    header.textContent = `${episode.name} - `;
    if (episode.image !== null) {
      image.src = episode.image.original;
    }

    textEl.innerHTML = episode.summary || "Sorry, no summary provided.";

    //APPENDING THE ELEMENTS CREATED AS APPROPRIATE
    episodesElem.appendChild(divEl);
    divEl.appendChild(header);
    header.appendChild(episodeCode);
    divEl.appendChild(image);
    divEl.appendChild(textEl);

    //ADDING CLASS NAME TO THE ELEMENTS CREATED
    divEl.className = "episode-box";
    header.className = "episode-name";
    image.className = "episode-img";
    episodeCode.className = "episode-code";
    textEl.className = "episode-summary";

    let form = document.querySelector("#search");
    form.addEventListener("submit", function (event) {
      event.preventDefault();
    });
  });
  let divElem = document.querySelector(".searchEpisodes");

  displaySpan.textContent = `Displaying ${episodesArray.length}/${allEpisodes.length} episodes`;
  displaySpan.className = "searching";
  divElem.appendChild(displaySpan);
}

//FUNCTION CREATING A BUTTON THAT RETURNS TO SHOW LIST
function createBackToShowsListButton() {
  let backToShowListButton = document.createElement("button");
  let divElem = document.querySelector(".searchEpisodes");
  backToShowListButton.textContent = "Back To Show";
  backToShowListButton.className = "homePageBtn";
  divElem.prepend(backToShowListButton);
  backToShowListButton.addEventListener("click", returnToShowsPage);
}

//ADDING EVENT LISTENER TO THE 'BACK TO SHOW' BUTTON TO RETURN TO SHOWS LIST & HIDE ALL THE EPISODES
function returnToShowsPage() {
  makePageForShows(allShows);
  const episodesElem = document.querySelector(".episodes");
  episodesElem.textContent = "";
  let bactToShowBtn = document.querySelector(".homePageBtn");
  bactToShowBtn.remove();
  hideEpisodesDropdown();
  showShowsDropdown();
}

//FUNCTION SEARCHING SHOWS
function searchShows(event) {
  console.log('searching in shows');
  let searchTerm = event.target.value.toLowerCase();
  let filteredShows = allShows.filter((show) => {
    let name = show.name.toLowerCase();
    //console.log(name);
    let summary = show.summary.toLowerCase();
    let isInGenres = show.genres.some((genre) =>
      genre.toLowerCase().includes(searchTerm)
    );
    return (
      name.includes(searchTerm) ||
      summary.includes(searchTerm) ||
      isInGenres
    );
  });
  // let divEl = document.querySelector(".searchEpisodes");
  makePageForEpisodes(filteredShows);

  displaySpan.textContent = `Displaying ${filteredShows.length}/${allEpisodes.length} episodes`;
}

//FUNCTION SEARCHING THE EPISODES
function searchEpisodes(event) {
  console.log('searching in episodes');
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
//FUNCTION ............
function showBoxHandler(event) {
  let { id } = event.currentTarget;
  fetchEpisodes(id);
  removeShows();
}
// FUNCTION REMOVE SHOWS
function removeShows() {
  let showsEl = document.querySelector(".shows");
  showsEl.textContent = "";
}
//FUNCTION TO HIDE SHOWS SELECT ELEMENT
function hideShowsDropdown() {
  let showsDropdown = document.querySelector("#showsDropdown");
  showsDropdown.classList.add("hide");
}

//FUNCTION TO SHOW SHOWS SELECT ELEMENT /
function showShowsDropdown() {
  let showsDropdown = document.querySelector("#showsDropdown");
  showsDropdown.classList.remove("hide");
}

//FUNCTION TO HIDE EPISODES SELECT ELEMENT
function hideEpisodesDropdown() {
  let episodesDropdown = document.querySelector("#episodesDropdown");
  episodesDropdown.classList.add("hide");
}

//FUNCTION TO SHOW EPISODES SELECT ELEMENT
function showEpisodesDropdown() {
  let episodesDropdown = document.querySelector("#episodesDropdown");
  episodesDropdown.classList.remove("hide");
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
//FUNCTION SELECTING SHOW FROM DROPDOWN AND SCROLLING TO THE SHOW SELECTED
function selectShow(event) {
  let showId = event.target.value;
  //fetchEpisodes(showId);
  let selectedShow = document.getElementById(showId);
  selectedShow.scrollIntoView({ block: "center" });
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

// fetchEpisodes();
window.onload = setup;
