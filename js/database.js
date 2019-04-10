const db = new Dexie('FavoriteDB');

// Declare tables, IDs and indexes
db.version(1).stores({
    favoriteIds: '++id, &teamId, teamName, teamCrest'
});

function getFavoritesPage(){
    var favTeamsHTML = ``;
    new window.Promise(function (resolve) {
        resolve("set favorite border");
    }).then(function (x) {
        return db.favoriteIds.each(favorite => {
            favTeamsHTML += `
            <div class="col s6 m4 l3">
                <div id="${favorite.teamId}" class="card favorite">
                    <a href="./team-detail.html?id=${favorite.teamId}">
                        <div class="card-image waves-effect waves-block waves-light padding10">
                        <img class="crest" src="${favorite.teamCrest}" onerror="if (this.src != '/assets/ball.jpg') this.src = '/assets/ball.jpg';"/>
                        </div>
                    </a>
                    <div class="card-content">
                        <span class="card-title truncate title">${favorite.teamName}</span>
                    </div>
                </div>
            </div>
            `;
        });
    }).catch(function (error) {
        // Handle error standardized
        console.log("getFavoritesPage error --> ", error);
        favTeamsHTML = `<div>no favorites data</div>`;
    }).finally(function(){
        var elm = document.getElementById("favorite-teams");
        if(elm){
            elm.innerHTML = favTeamsHTML;
        }
    });
}

function setFavIcon(teamId){
    new window.Promise(function(){
        return db.favoriteIds.each(favorite => {
            if(teamId === favorite.teamId){
                var el = document.getElementById(favorite.teamId);
                el.src = "/assets/favorite-icon.png"
            }
        });
    }).then(function (response) {
        console.log("setFavIcon response --> ", response);
    }).catch(function (error) {
        // Handle error standardized
        console.log("setFavIcon error --> ", error);
    });
}

function setFavoriteBorder() {
    new window.Promise(function (resolve) {
        resolve("set favorite border");
    }).then(function () {
        return db.favoriteIds.each(favorite => {
            var el = document.getElementById(favorite.teamId);
            el.classList.add("favorite");
        });
    }).catch(function (error) {
        // Handle error standardized
        console.log("setFavoriteBorder error --> ", error);
    });
}

function favToggle(element, teamId, teamName, teamCrest) {
    if (element.src.includes("unfavorite")) {
        addIdToFavoriteList(teamId, teamName, teamCrest);
        element.src = "/assets/favorite-icon.png"
    } else {
        deleteIdFromFavoriteList(teamId);
        element.src = "/assets/unfavorite-icon.png"
    }
}

function deleteIdFromFavoriteList(teamId) {
    db.favoriteIds
    .where("teamId").equals(teamId)
    .delete()
    .then(function (deleteCount) {
        console.log( "Deleted " + deleteCount + " objects");
    })
    .catch(error => {
        console.log( "Delete error " + error);
    });
}

async function addIdToFavoriteList(teamId, teamName, teamCrest) {
    await db.favoriteIds.put({
        teamId: teamId,
        teamName: teamName,
        teamCrest: teamCrest
    });
}