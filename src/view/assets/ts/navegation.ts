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
        console.log("caiu aqui1. Location: " + location.hash)
    } else {
        const firstLink = document.querySelector("[rPage]")
        console.log("caiu aqui. firstLink: " + firstLink.getAttribute("rPage"))
        navThroughAjax(firstLink.getAttribute("rPage"))
    }
}

window.onhashchange = (event: any) => navThroughAjax(location.hash)

configLinks()
initialNav()