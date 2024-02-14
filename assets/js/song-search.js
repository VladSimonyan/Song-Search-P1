
const element = {
    main: document.querySelector("#lyrics-container"),
    input: document.querySelector("#input"),
    submit: document.querySelector("#submit"),
    song: document.createElement("h1"),
    artist: document.createElement("h2"),
    releaseDate: document.createElement("p"),
    imageContainer: document.createElement("div"),
    coverArt: document.createElement("img"),
    lyrics: document.createElement("div"),
    searching: document.createElement("h3"),
};


const genius = {
    url: "https://api.genius.com/",
    token: "0mnLuVjVhj3q71HPoO4qeXl5XHowzNHG87dc1Vr9VfLCKYy_apxIFSsGRajaCKh9",
    search: "search?q="
}


const corsProxyURL = "https://api.codetabs.com/v1/proxy?quest=";    


if (localStorage.getItem("lastSearch") !== null) {
    SearchGenius(JSON.parse(localStorage.getItem("lastSearch")));
}


element.submit.addEventListener("click", function (event) {
    event.preventDefault()
    let input = element.input.value;
    SearchGenius(input);
});


function SearchGenius(input) {
    fetch(genius.url + genius.search + input + "&access_token=" + genius.token)
        .then(function (response) {
            
            if (response.ok) {
                return response.json();
            }
            
            throw ErrorMessage();
        })
        .then(function (data) {
            ClearContent();

            
            element.main.appendChild(element.searching);
            element.searching.textContent = "Searching...";

           
            let info = {
                song: null,
                artist: null,
                releaseDate: null,
                coverArt: null,
            }

            
            if (data.response.hits.length === 0) {
                SongNotFound();
            } else {
               
                info.song = data.response.hits[0].result.title;                              
                info.artist = data.response.hits[0].result.artist_names;                     
                info.releaseDate = data.response.hits[0].result.release_date_for_display;    
                info.coverArt = data.response.hits[0].result.header_image_url;               

                
                let lyricsURL = corsProxyURL + "https://genius.com" + data.response.hits[0].result.path;
                GetLyrics(lyricsURL, info);
            }
        }
        );
}


function GetLyrics(lyricsURL, info) {
    fetch(lyricsURL)
        .then(function (response) {
            
            if (response.ok) {
                $.get(lyricsURL, function (html) {
                    ClearContent();

                    
                    element.main.appendChild(element.song);                         
                    element.main.appendChild(element.artist);                       
                    element.main.appendChild(element.releaseDate);                  
                    element.main.appendChild(element.imageContainer);               
                    element.imageContainer.setAttribute("id", "image-container");                       
                    element.imageContainer.appendChild(element.coverArt);          
                    element.coverArt.setAttribute("id", "cover-art");                    
                    element.main.appendChild(element.lyrics);                       
                    element.lyrics.setAttribute("id", "lyrics");                    

                    
                    element.song.textContent = info.song;                  
                    element.artist.textContent = "by " + info.artist;         
                    element.releaseDate.textContent = info.releaseDate;     
                    element.coverArt.setAttribute("src", info.coverArt);    
                    element.coverArt.setAttribute("height", "300px");       

                    
                    let lyrics = ($(html).find('#lyrics-root').html());
                    element.lyrics.innerHTML = lyrics;

                    
                    $('.LyricsHeader__Container-ejidji-1').remove();
                    $('.RightSidebar__Container-pajcl2-0').remove();
                    $('.InreadContainer__Container-sc-19040w5-0').remove();
                    $('.Lyrics__Footer-sc-1ynbvzw-1').remove();
                    $("a").removeAttr("href");

                    
                    localStorage.setItem("lastSearch", JSON.stringify(info.song + " " + info.artist));
                })
            }
            
            throw ErrorMessage();
        })
        .catch(() => { SearchIssue(); })
}

function ClearContent() {
    
    element.main.innerHTML = "";
}

function SongNotFound() {
    ClearContent();

    
    element.main.appendChild(element.searching);
    element.searching.textContent = "Song not found";
}

function ErrorMessage() {
    ClearContent();

    
    element.main.appendChild(element.searching);
    element.searching.textContent = "ERROR";
}

function SearchIssue() {
    ClearContent();

    
    element.main.appendChild(element.searching);
    element.searching.textContent = "Trying to reach Genius.com...";
}