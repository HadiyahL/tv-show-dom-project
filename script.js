const rootElem = document.querySelector("#root");
let shows = [];
let allEpisodes = [];

function setup() {
  fetchShows();
}

/*========================== FETCH DATA FOR SHOWS ===========================*/
function fetchShows() {
  addSpinner();
  fetch("https://api.tvmaze.com/shows")
    .then((response) => response.json())
    .then((data) => {
      removeSpinner();
      shows = data;
      makeHeaderInputsForShows();
      createPageForShows();
    })
    .catch((error) => console.log(error));
}
function addSpinner() {
  const spinner = document.createElement("div");
  const spinnerBorder = document.createElement("div");
  const loading = document.createElement("span");
  spinner.className = "text-center";
  spinnerBorder.className = "spinner-grow";
  spinnerBorder.role = "status";
  loading.className = "sr-only";
  loading.textContent = "Loading...";
  // rootElem.style.minHeight = '80vh';
  rootElem.appendChild(spinner);
  spinner.appendChild(spinnerBorder);
  spinnerBorder.appendChild(loading);
}
function removeSpinner() {
  const spinner = document.querySelector(".text-center");
  spinner.remove();
}
/*========================== FETCH DATA FOR SHOWS ENDS===========================*/

function makeHeaderInputsForShows() {
  const showsHeader = document.createElement("div");
  showsHeader.className = "showsHeader";
  rootElem.appendChild(showsHeader);
  createShowsDropdown();
  createShowsSearchBox();
  createShowsFilterResult(shows);
  createScrollToTopBtn();
}
function createShowsSelectElem() {
  let selectEl = document.createElement("select");
  let showsHeader = document.querySelector(".showsHeader");
  selectEl.className = "showsDropdown";
  selectEl.classList.add("showsHeaderEl");

  showsHeader.appendChild(selectEl);
  selectEl.addEventListener("change", selectShow);
}
function selectShow(event) {
  let showId = event.target.value;
  if (showId == "default") {
    let searchBar = document.querySelector(".showsSearch");
    searchBar.value = "";
    createShowList(shows);
    makePageForShows(shows);
    displayShowsResult(shows, shows);
  } else {
    let selectedShow = document.getElementById(showId);
    selectedShow.scrollIntoView({ block: "center" });
  }
}
//FUNCTION CREATING & ADDING OPTIONS TO THE SHOW SELECT ELEMENT
function createShowList(shows) {
  let showsDropdown = document.querySelector(".showsDropdown");
  showsDropdown.textContent = "";
  let optionEl = document.createElement("option");
  optionEl.textContent = "All Shows";
  optionEl.value = "default";
  showsDropdown.appendChild(optionEl);
  shows
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((show) => {
      let optionEl = document.createElement("option");
      optionEl.textContent = show.name;
      showsDropdown.appendChild(optionEl);
      optionEl.value = show.id;
    });
}
function createShowsDropdown() {
  createShowsSelectElem();
  createShowList(shows);
}
/*========================== END OF ===========================*/

/*========================== SEARCH SHOWS STARTS +++++++++++*/
function createShowsSearchBox() {
  const inputEl = document.createElement("input");
  inputEl.className = "showsSearch";
  inputEl.placeholder = "Search Shows...";
  inputEl.classList.add("showsHeaderEl");
  const showsHeader = document.querySelector(".showsHeader");
  showsHeader.appendChild(inputEl);

  inputEl.addEventListener("keyup", handleShowsSearch);
}
function handleShowsSearch(event) {
  const searchTerm = event.target.value.toLowerCase();
  const searchResult = filterShows(shows, searchTerm);
  makePageForShows(searchResult);
  displayShowsResult(searchResult, shows);
  createShowList(searchResult);
}
function filterShows(showsArray, input) {
  return showsArray.filter((show) => {
    let name = show.name.toLowerCase();
    let summary = show.summary.toLowerCase();
    let isInputInGenre = show.genres.some((genre) =>
      genre.toLowerCase().includes(input)
    );
    return name.includes(input) || summary.includes(input) || isInputInGenre;
  });
}
/*================================ENDS==================*/
/*================================start==================*/
function createShowsFilterResult(showsArray) {
  const displayResult = document.createElement("span");
  displayResult.className = "showsFilterResult";
  displayResult.classList.add("showsHeaderEl");
  displayResult.textContent = `Displaying ${showsArray.length} / ${showsArray.length} shows`;
  const showsHeader = document.querySelector(".showsHeader");
  showsHeader.appendChild(displayResult);
}
function displayShowsResult(filteredShows, allShows) {
  const displayResult = document.querySelector(".showsFilterResult");
  displayResult.textContent = `Displaying ${filteredShows.length} / ${allShows.length} shows`;
}

/*================================ENDS==================*/

/*============================SHOWS LIST STARTS==================*/
function createPageForShows() {
  let showsContainer = document.createElement("div");
  showsContainer.className = "showsContainer";
  rootElem.appendChild(showsContainer);
  makePageForShows(shows);
}
function makePageForShows(showsArray) {
  let showsContainer = document.querySelector(".showsContainer");
  showsContainer.textContent = "";
  showsArray.forEach((show) => {
    //console.log(show);
    //CREATE ELEMENTS
    let showBox = document.createElement("div");
    let showInfo = document.createElement("div");
    let showText = document.createElement("div");
    let showName = document.createElement("h2");
    let showImage = document.createElement("img");
    let showDetails = document.createElement("ul");

    //ATTACH CONTENT TO ELEMENTS
    showName.textContent = show.name;
    if (show.image !== null) {
      showImage.src = show.image.original;
    }
    showSummary = show.summary;
    showDetails.innerHTML = `<li><b>Genre:</b> ${show.genres}</li>
                            <li><b>Runtime:</b> ${show.runtime} minutes</li>
                            <li><b>Rating:</b> ${show.rating.average}</li>
                            <li><b>Status:</b> ${show.status}</li>`;
    //ADDING CLASS NAME
    showBox.className = "showBox";
    showText.className = "showText";
    showInfo.className = "showInfo";
    showImage.className = "showImage";
    showName.className = "showName";
    showDetails.className = "showDetails";

    //APPEND ELEMENTS
    showBox.appendChild(showName);
    showBox.appendChild(showInfo);
    showInfo.appendChild(showImage);
    showInfo.appendChild(showText);
    showsContainer.appendChild(showBox);

    showText.innerHTML += showSummary;
    showText.appendChild(showDetails);

    //ADDING ID TO THE SHOWS
    showBox.id = show.id;

    //ADDING EVENT LISTENER TO ENABLE GETTING THE EPISODES FOR SHOW SELECTED
    showBox.addEventListener("click", showBoxHandler);
  });
}
function showBoxHandler(event) {
  let { id } = event.currentTarget;
  removeShows();
  fetchEpisodes(id);
  window.scrollTo({ top: 0 });
}
function removeShows() {
  removeShowsList();
  removeShowsHeader();
}
function removeShowsList() {
  let showsContainer = document.querySelector(".showsContainer");
  showsContainer.remove();
}
function removeShowsHeader() {
  let showsHeader = document.querySelector(".showsHeader");
  showsHeader.remove();
}
/*================================SHOWS END ======================*/

/*================================EPISODES START==================*/

/*====================FETCH EPISODES STARTS===================*/
function fetchEpisodes(showId) {
  addSpinner();
  fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
    .then((response) => response.json())
    .then((data) => {
      removeSpinner();
      allEpisodes = data;
      makeHeaderInputsForEpisodes();
      createPageForEpisodes();
    })
    .catch((error) => {
      console.log(error);
    });
}
/*====================FETCH EPISODES ENDS ===================*/

function makeHeaderInputsForEpisodes() {
  const episodesHeader = document.createElement("div");
  episodesHeader.className = "episodesHeader";
  rootElem.appendChild(episodesHeader);
  createBackToShowsListButton();
  createEpisodesDropdown();
  createEpisodesSearchBox();
  createEpisodesFilterResult(allEpisodes);
}

function createBackToShowsListButton() {
  let backToShowListButton = document.createElement("button");
  let episodesHeader = document.querySelector(".episodesHeader");
  backToShowListButton.textContent = "Back To Show";
  backToShowListButton.className = "homePageBtn";
  episodesHeader.appendChild(backToShowListButton);

  backToShowListButton.addEventListener("click", returnToShowsPage);
}
function returnToShowsPage() {
  removeEpisodes();
  makeHeaderInputsForShows();
  createPageForShows();
}
function createEpisodesSelectElem() {
  let selectEl = document.createElement("select");
  let episodesHeader = document.querySelector(".episodesHeader");
  selectEl.className = "episodesDropdown";
  episodesHeader.appendChild(selectEl);
}

//FUNCTION CREATING & ADDING OPTIONS TO THE EPISODE SELECT ELEMENT
function createEpisodesDropdownList(episodesArray) {
  let episodesDropdown = document.querySelector(".episodesDropdown");
  // episodesDropdown.textContent = "";
  let defaultOption = document.createElement("option");
  defaultOption.textContent = "All Episodes";
  defaultOption.value = "default";
  episodesDropdown.appendChild(defaultOption);

  episodesArray.forEach((episode) => {
    let optionEl = document.createElement("option");
    optionEl.textContent = `${displayEpisodeCode(episode)} - ${episode.name}`;
    optionEl.value = episode.name;
    episodesDropdown.appendChild(optionEl);
  });

  episodesDropdown.addEventListener("change", selectOption);
}
//FUNCTION SELECTING EPISODE FROM DROPDOWN ENSURING ONLY SELECTED EPISODE IS DISPLAYED
function selectOption(event) {
  let episodeName = event.target.value;

  if (episodeName === "default") {
    makePageForEpisodes(allEpisodes);
    displayEpisodesResult(allEpisodes, allEpisodes);
  } else {
    let selectedEpisode = allEpisodes.filter((episode) => {
      if (episode.name === episodeName) {
        return true;
      } else {
        return false;
      }
    });
    makePageForEpisodes(selectedEpisode);
    displayEpisodesResult(selectedEpisode, allEpisodes);
  }
}
function createEpisodesDropdown() {
  createEpisodesSelectElem();
  createEpisodesDropdownList(allEpisodes);
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
/*========================== END OF EPISODES DROPDOWN ===========================*/

/*========================== SEARCH EPISODES STARTS ===========================*/
function createEpisodesSearchBox() {
  const inputEl = document.createElement("input");
  inputEl.className = "episodesSearch";
  inputEl.placeholder = "Search Episodes...";
  const episodesHeader = document.querySelector(".episodesHeader");
  episodesHeader.appendChild(inputEl);

  inputEl.addEventListener("keyup", handleEpisodesSearch);
}
//FUNCTION SEARCHING THE EPISODES
function handleEpisodesSearch(event) {
  const searchTerm = event.target.value.toLowerCase();
  const searchResult = filterEpisodes(allEpisodes, searchTerm);
  makePageForEpisodes(searchResult);
  displayEpisodesResult(searchResult, allEpisodes);
}
function filterEpisodes(episodesArray, input) {
  return episodesArray.filter((episode) => {
    let name = episode.name.toLowerCase();
    let summary = episode.summary.toLowerCase();

    return name.includes(input) || summary.includes(input);
  });
}

function searchEpisodes(event) {
  console.log("searching in episodes");
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
/*================================EPISODE SEARCH ENDS ==================*/
/*================================EPISODES FILTER RESULT STARTS ==================*/
function createEpisodesFilterResult(episodesArray) {
  const displayResult = document.createElement("span");
  displayResult.className = "episodesFilterResult";
  displayResult.textContent = `Displaying ${episodesArray.length} / ${episodesArray.length}  episodes`;
  const episodesHeader = document.querySelector(".episodesHeader");
  episodesHeader.appendChild(displayResult);
}
function displayEpisodesResult(filteredEpisodes, allEpisodes) {
  const displayResult = document.querySelector(".episodesFilterResult");
  displayResult.textContent = `Displaying ${filteredEpisodes.length} / ${allEpisodes.length} episodes`;
}
/*================================EPISODES FILTER RESULT ENDS ==================*/

/*==================================EPISODES LIST DISPLAY BEGINS =========================== */

function createPageForEpisodes() {
  let episodesContainer = document.createElement("div");
  episodesContainer.className = "episodesContainer";
  rootElem.appendChild(episodesContainer);
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodesArray) {
  let episodesContainer = document.querySelector(".episodesContainer");
  episodesContainer.textContent = "";
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
    episodesContainer.appendChild(divEl);
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
  });
}
function removeEpisodes() {
  removeEpisodesList();
  removeEpisodesHeader();
}
function removeEpisodesList() {
  let episodesContainer = document.querySelector(".episodesContainer");
  episodesContainer.remove();
}
function removeEpisodesHeader() {
  let episodesHeader = document.querySelector(".episodesHeader");
  episodesHeader.remove();
}

/*==================================EPISODES LIST DISPLAY ENDS =========================== */
//SCROLL TO TOP BUTTON
function createScrollToTopBtn() {
  let scrollToTopBtn = document.createElement("button");
  let icon = document.createElement("i");
  scrollToTopBtn.appendChild(icon);
  rootElem.appendChild(scrollToTopBtn);
  scrollToTopBtn.title = "Back to top";
  scrollToTopBtn.id = "scrollToTop";
  icon.className = "fa fa-arrow-circle-up";

  scrollToTopBtn.addEventListener("click", scrollToTop);
}
function scrollToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
//FUNCTION TO DISPLAY THE SCROLL TO TOP BUTTON WHEN USER SCROLLS DOWN 20PX
window.onscroll = function () {
  
  scrollFunction();
};
function scrollFunction() {
  let scrollToTopBtn = document.querySelector("#scrollToTop");
  
  if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
    scrollToTopBtn.style.visibility = "visible";
    scrollToTopBtn.style.opacity = 1;
  } else {
    // scrollToTopBtn.style.visibility = "hidden";
    scrollToTopBtn.style.opacity = 0;
  }
}

window.onload = setup;
