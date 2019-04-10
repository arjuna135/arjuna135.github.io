const BASE_URL = "https://api.football-data.org/v2/";
const API_KEY = "07c7e1fd1daa4f42ad6d515d50ef354c";

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
    if (response.status !== 200) {
        console.log("Error : " + response.status);
        // Method reject() akan membuat blok catch terpanggil
        return Promise.reject(new Error(response.statusText));
    } else {
        // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
        return Promise.resolve(response);
    }
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
    return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
    // Parameter error berasal dari Promise.reject()
    console.log("Error : " + error);
}

function getTeams() {
    var teamsApiUrl = BASE_URL + "teams"
    if ('caches' in window) {
        caches.match(teamsApiUrl)
            .then(function (response) {
                if (response) {
                    response.json().then(function (data) {
                        window.onload = processTeamsData(data);
                    })
                }
            })
    }

    fetch(teamsApiUrl, {
        headers: {
            'X-Auth-Token': API_KEY
        }
    }).then(status)
        .then(json)
        .then(function (data) {
            window.onload = processTeamsData(data);
        })
        .catch(error);
}

function getTeamDetail() {
    // Ambil nilai query parameter (?id=)
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");

    if ('caches' in window) {
        caches.match(BASE_URL + "teams/" + idParam)
            .then(function (response) {
                if (response) {
                    response.json().then(function (data) {
                        window.onload = processTeamDetail(data);
                    })
                }
            })
    }

    fetch(BASE_URL + "teams/" + idParam, {
        headers: {
            'X-Auth-Token': API_KEY
        }
    })
        .then(status)
        .then(json)
        .then(function (data) {
            window.onload = processTeamDetail(data);
        });
}

function processTeamsData(data) {
    var teamsHTML = ``;
    if (data && data.teams) {
        data.teams.forEach(function (team) {
            var teamCrestHttps = getTeamCrestHttps(team.crestUrl);
            teamsHTML += `
            <div class="col s6 m4 l3">
                <div id="${team.id}" class="card unfavorite">
                    <a href="./team-detail.html?id=${team.id}">
                        <div class="card-image waves-effect waves-block waves-light padding10">
                        <img class="crest" src="${teamCrestHttps}" onerror="if (this.src != '/assets/ball.jpg') this.src = '/assets/ball.jpg';" />
                        </div>
                    </a>
                    <div class="card-content">
                        <span class="card-title truncate title">${team.shortName}</span>
                        <!-- <p>${team.description}</p> -->
                    </div>
                </div>
            </div>
            `;
        });
    } else {
        teamsHTML = `<div>no data</div>`;
    }
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("progress-bar").classList.add("hide");
    document.getElementById("teams").innerHTML = teamsHTML;
    setFavoriteBorder();
}

function processTeamDetail(team) {
    // Menyusun komponen card artikel secara dinamis
    var teamCrestHttps = getTeamCrestHttps(team.crestUrl)
    var teamCrestHTML = `
            <div class="card" style="padding:10px;">
                <div class="card-image waves-effect waves-block waves-light padding10">
                    <img class="crest" src="${teamCrestHttps}" onerror="if (this.src != '/assets/ball.jpg') this.src = '/assets/ball.jpg';"/>
                </div>
                <div class="card-image waves-effect waves-block waves-light padding10">
                    <img id="${team.id}" src="/assets/unfavorite-icon.png" onclick="favToggle(this, ${team.id}, '${team.shortName}', '${teamCrestHttps}')"/>
                </div>
            </div>
        `;

    var teamContentHTML = `
        <div class="card">
            <div class="card-content">
                <p class="card-title">${team.shortName}</p>
            
    `;

    team.squad.forEach(function (player) {
        teamContentHTML += `<div>
            <p>${player.position} : ${player.name}</p>
            </div>`;
    });

    teamContentHTML += `</div></div>`;

    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("progress-bar").classList.add("hide");
    document.getElementById("team-crest").innerHTML = teamCrestHTML;
    document.getElementById("team-content").innerHTML = teamContentHTML;
    setFavIcon(team.id);
}

function getTeamCrestHttps(teamCrest) {
    var teamCrestHttps = '/assets/ball.jpg';
    if (teamCrest) {
        if (teamCrest.includes("https")) {
            teamCrestHttps = teamCrest;
        } else {
            teamCrestHttps = teamCrest.replace("http", "https");
        }
    }
    return teamCrestHttps;
}