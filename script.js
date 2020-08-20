//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  console.log(allEpisodes);
  makePageForEpisodes(allEpisodes);
}
/*
the episode's name
the season number
the episode number
the episode's medium-sized image
the episode's summary text

*/
function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  //rootElem.textContent = `Got ${episodeList.length} episode(s)`;
  episodeList.map((episode) => {
    let divEl = document.createElement("div");
    let header = document.createElement("h2");
    let image = document.createElement("img");
    let textEl = document.createElement("p");
    let spanEl = document.createElement("span");

    //ZERO PADDING EPISODE CODE TO TWO DIGITS
    let season = episode.season;
    let epi = episode.number;
    if (season <= 9) {
      season = "0" + season;
    }
    if (epi <= 9) {
      epi = "0" + epi;
    }

    //ADDING CONTENT TO THE ELEMENTS CREATED
    spanEl.textContent = ` - S${season}E${epi}`;
    header.textContent = episode.name;
    image.src = episode.image.original;
    textEl.innerHTML = episode.summary;

    //APPENDING THE ELEMENTS CREATED AS APPROPRIATE
    rootElem.appendChild(divEl);
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
  });
}

window.onload = setup;
