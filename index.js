//You can edit ALL of the code here

//const allEpisodes = getAllEpisodes();

function setup() {
    const allEpisodes = getAllEpisodes();
    console.log(allEpisodes);
    
    makePageForEpisodes(allEpisodes);
}
/*
For each episode, AT LEAST following must be displayed:
the episode's name
the season number
the episode number
the episode's medium-sized image
the episode's summary text
*/

function makePageForEpisodes(episodeList) {
    const episodesElem = document.querySelector(".episodes");

    episodeList.forEach((episode) => {
        let headerEl = document.createElement("h2");
        let imageEl = document.createElement("img");
        let pEl = document.createElement("p");

        headerEl.textContent = episode.name;
        imageEl.src = episode.image.medium;
    })
}

["#a70267", "#f10c49", "#fb6b41", "#f6d86b", "#339194"];
["#382f32", "#ffeaf2", "#fcd9e5", "#fbc5d8", "#f1396d"];