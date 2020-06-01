let currentSeason = "0";

//We draw the first 20 episodes
$(document).ready(function () {
    $(".container").hide();
    drawEpis(1);
});

//When user click on "Show More" button, the next page of API is loaded
$("#episode_more_btn").click(function(){
    drawEpis(2);
    $(this).remove()
});

//Function to draw episodes buttons
function drawEpis(page) { 
    axios.get("https://rickandmortyapi.com/api/episode?page=" + page)
    .then(function(res) { 
        let episodes = res.data.results

        episodes.forEach(ep => {
            if(currentSeason != ep.episode.split("0")[1].split("E")[0]) {
                currentSeason = ep.episode.split("0")[1].split("E")[0];
                $("#episode_box").append(`<h3>Season ${currentSeason}</h3>`)
            }

            $("#episode_box").append(`<div class="episode_btn" data-url="${ep.url}">EP${ep.episode.split("E")[1]}: ${ep.name}</div>`)      
        });

        $(".episode_btn").unbind();
        $(".episode_btn").click(function(){ showEpis($(this).data("url"))})
    })
}

//Function to draw the episode container
function showEpis(url) {
    $(".container").hide();
    $("#episode_container").empty();

    axios.get(url).then(function(res){
        let episode = res.data;
        $("#episode_container").show();

        $("#episode_container").append(`
        <div id="ec_header">
            <h1>${episode.name}</h1>
            <h4>${episode.air_date}</h4>
        </div>
        <h3>${episode.episode}</h3>
        <h2>Characters</h2>
        <div id="ec_characters_box">
            
        </div>            
        `)

        episode.characters.forEach(ch => {
            axios.get(ch).then(function(res){
                let ch = res.data;
                $("#ec_characters_box").append(`
                <div class="ec_character" onclick="showChar('${ch.url}')">
                    <div class="ec_character_photo">
                        <img src="${ch.image}">
                    </div>
                    <div class="ec_character_info">
                        <h1>${ch.name}</h1>
                        <h2>${ch.species}</h2>
                        <h3>${ch.status}</h3>
                    </div>
                </div>
                `)
            })
        })
    })
}

//Function to draw the character container
function showChar(url){
    $(".container").hide();
    $("#character_container").empty();

    axios.get(url).then(function(res){
        let ch = res.data;
        let origin = ch.origin.name == "unknown" ? "Unknown" : `<a onclick="showLoc('${ch.origin.url}')">${ch.origin.name}</a>`
        let location = ch.location.name == "unknown" ? "Unknown" : `<a onclick="showLoc('${ch.location.url}')">${ch.location.name}</a>`

        $("#character_container").show()
        $("#character_container").append(`
        <div id="cc_main">
            <h4>${ch.status}</h4>
            <div id="cc_image">
                <img src="${ch.image}">
            </div>
            <div id="cc_info">
                <h1>${ch.name}</h1>
                <h2>${ch.species}</h2>
                <h3>${ch.gender}</h3>
                <div id="cc_info_location">
                    <h4>Born: ${origin}</h4>
                    <h4>Actual location: ${location}</h4>
                </div>
            </div>
        </div>
        <h1>Episodes</h1>
        <div id="cc_episodes"></div>
        `);

        ch.episode.forEach(ep => {
            axios.get(ep).then(function(res){
                let ep = res.data;
                $("#cc_episodes").append(`
                <div class="cc_episode" onclick="showEpis('${ep.url}')">
                    <h2>${ep.name}</h2>
                    <h4>${ep.episode}</h4>
                </div>
                `)
            })
        });
    })
}

//Function to draw the location container
function showLoc(url){
    $(".container").hide();
    $("#location_container").empty();

    axios.get(url).then(function(res){
        let location = res.data;
        $("#location_container").show();

        $("#location_container").append(`
        <div id="lc_header">
            <h1>${location.name}</h1>
            <h4>${location.type}</h4>
        </div>
        <h3>${location.dimension}</h3>
        <h2>Residents</h2>
        <div id="lc_characters_box">
            
        </div>            
        `)

        location.residents.forEach(re => {
            axios.get(re).then(function(res){
                let re = res.data;
                $("#lc_characters_box").append(`
                <div class="ec_character" onclick="showChar('${re.url}')">
                    <div class="ec_character_photo">
                        <img src="${re.image}">
                    </div>
                    <div class="ec_character_info">
                        <h1>${re.name}</h1>
                        <h2>${re.species}</h2>
                        <h3>${re.status}</h3>
                    </div>
                </div>
                `)
            })
        })

        if(location.residents.length < 1) $("#lc_characters_box").append(`<h2>No residents known</h2>`)
    })
}
