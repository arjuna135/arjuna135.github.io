function loadNav() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status != 200) return;

            // Muat daftar tautan menu
            document.querySelectorAll(".topnav, .sidenav").forEach(function (elm) {
                elm.innerHTML = xhttp.responseText;
            });

            // Daftarkan event listener untuk setiap tautan menu
            setOnClickListener();
        }
    };
    xhttp.open("GET", "nav.html", true);
    xhttp.send();
}

function loadPage(page) {
    var content = document.querySelector("#body-content");
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.status == 200) {
            content.innerHTML = xhr.responseText;
        } else if (this.status == 404) {
            content.innerHTML = "<p>Halaman tidak ditemukan.</p>";
        } else {
            content.innerHTML = "<p>Ups.. halaman tidak dapat diakses.</p>";
        }
        window.onload = loadPageContentFromApi(page);
    };
    xhr.onerror = function () {
        content.innerHTML = "<p>Ups.. halaman tidak dapat diakses.</p>";
    };
    xhr.open("GET", "pages/" + page + ".html", true);
    xhr.send();
}

function setOnClickListener() {
    document.querySelectorAll(".sidenav a, .topnav a").forEach(function (elm) {
        elm.addEventListener("click", function (event) {
            // Tutup sidenav
            var sidenav = document.querySelector(".sidenav");
            M.Sidenav.getInstance(sidenav).close();

            // Muat konten halaman yang dipanggil
            page = event.target.getAttribute("href").substr(1);
            loadPage(page);
        });
    });
}

function loadPageContentFromApi(page) {
    if (page === 'home') {
        getTeams();
    } else if (page === 'favorites') {
        getFavoritesPage();
    }
}

function goToHomePage(){
    window.location = '/index.html';   
}

document.addEventListener("DOMContentLoaded", function () {
    // Activate sidebar nav
    var elems = document.querySelectorAll(".sidenav");
    M.Sidenav.init(elems);
    loadNav();

    // Load page content
    var page = window.location.hash.substr(1);
    if (page == "") page = "home";
    loadPage(page);
});