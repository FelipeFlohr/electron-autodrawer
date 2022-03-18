import { Coordinates } from "./pages/coordinates"
import { ToolsValues } from "./pages/values"
import { Welcome } from "./pages/welcome"

// Global classes variables
var welcome: Welcome
var coordinates: Coordinates
var values: ToolsValues

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
            welcome = new Welcome()
            welcome.run()
            break
        case "coordinates.html":
            coordinates = new Coordinates()
            coordinates.run()
            break
        case "values.html":
            values = new ToolsValues()
            values.run()
            break
        default:
            console.warn(`Current page (${currentPage}) is not routed to its main function.`)
    }
}

window.onhashchange = (event: any) => {
    navThroughAjax(location.hash)
    route()
}

configLinks()
initialNav()

// Externalizing classes function to the DOM
global.loadDefaultPositionValues = () => coordinates.loadDefaultValues()
global.loadPositionValues = () => coordinates.loadValuesButton()
global.savePositionValues = () => coordinates.saveValuesButton()
global.loadDefaultToolsValues = () => values.loadDefaultValues()
global.changeTool = (tool: string) => values.changeTool(tool)
global.loadToolsValues = () => values.loadValuesButton()
global.saveToolsValues = () => values.saveValuesButton()