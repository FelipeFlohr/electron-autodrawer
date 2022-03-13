import { Coordinates } from "./pages/coordinates"
import { Welcome } from "./pages/welcome"

// Navegation used for keeping the SPA
function navThroughAjax(hash: string) {
    if (!hash) return

    const link = document.querySelector(`[rPage="${hash}"]`)
    if (!link) return

    const destiny = document.querySelector("main")

    // Gets the destiny page content using Fetch API
    const url = hash.substring(1)
    fetch(url)
        .then(resp => resp.text())
        .then(html => {
            destiny.innerHTML = html
        })
}

function configLinks() {
    document.querySelectorAll("[rPage]")
        .forEach(link => {
            link.setAttribute("href", link.attributes["rPage"].value)
        })
}

function initialNav() {
    if (location.hash) {
        navThroughAjax(location.hash)
    } else {
        const firstLink = document.querySelector("[rPage]")
        navThroughAjax(firstLink.getAttribute("rPage"))
    }
}

function route() {
    const currentPage = location.hash.split("/").at(location.hash.split("/").length - 1)
    switch(currentPage) {
        case "welcome.html":
            new Welcome().run()
            break
        case "coordinates.html":
            new Coordinates().run()
            break
        default:
            console.warn(`Current page (${currentPage}) is not routed to its main function.`)
    }
}

window.onhashchange = (event: any) => {
    console.log("caiu aqui")
    navThroughAjax(location.hash)
    //route()
}

configLinks()
initialNav()