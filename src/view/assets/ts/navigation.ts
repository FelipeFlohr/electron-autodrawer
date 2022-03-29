import { Coordinates } from "./pages/coordinates"
import { Draw } from "./pages/draw";
import { Image } from "./pages/image";
import { ToolsValues } from "./pages/values"
import { Welcome } from "./pages/welcome"
import { Settings } from "./settings"

// Global classes variables
let welcome: Welcome
let coordinates: Coordinates
let values: ToolsValues
let image: Image
let draw: Draw

// Creates the instance
Settings.getInstance()

/**
 * A client side Ajax navigation. Needed for the SPA.
 * @param hash Hash destiny to navigate.
 * @returns null if there is no hash.
 */
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

/**
 * Defines all links for the SPA.
 */
function configLinks() {
    document.querySelectorAll("[rPage]")
        .forEach(link => {
            link.setAttribute("href", link.attributes["rPage"].value)
        })
}

/**
 * Realizes the initial navigation. If hash is defined, then it will navigate to it, else it will navigate to "Welcome".
 */
function initialNav() {
    if (location.hash) {
        navThroughAjax(location.hash)
    } else {
        const aWelcomePage = document.querySelector(`a[rPage$="welcome.html"]`)
        if (aWelcomePage instanceof HTMLElement) aWelcomePage.click()
    }
}

/**
 * Defines routes for the SPA, then execute each page's scripts
 */
function route() {
    const locationHash: string = location.hash
    const hashSplit: string[] = locationHash.split("/")

    const currentPage = hashSplit[hashSplit.length - 1]
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
        case "image.html":
            image = new Image()
            image.run()
            break
        case "draw.html":
            draw = new Draw()
            draw.run()
            break
        default:
            console.warn(`Current page (${currentPage}) is not routed to its main function.`)
    }
}

window.onhashchange = () => {
    navThroughAjax(location.hash)
    route()
}

configLinks()
initialNav()

// Externalizing classes functions to the DOM
global.loadDefaultPositionValues = () => coordinates.loadDefaultValues()
global.loadPositionValues = () => coordinates.loadValuesButton()
global.savePositionValues = () => coordinates.saveValuesButton()

global.loadDefaultToolsValues = () => values.loadDefaultValues()
global.changeTool = (tool: string) => values.changeTool(tool)
global.loadToolsValues = () => values.loadValuesButton()
global.saveToolsValues = () => values.saveValuesButton()

global.loadImage = (e: HTMLInputElement) => image.loadImageButton(e)