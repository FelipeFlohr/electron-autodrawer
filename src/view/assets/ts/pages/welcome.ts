import { Page } from "../models/page";
import { Settings } from "../settings";
import { shell } from "electron";

export class Welcome extends Page {
    private readonly yesMarkerHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="bi bi-check-lg green-svg" viewBox="0 0 16 16"><path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" /></svg>`
    private readonly noMarkerHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" class="bi bi-x-lg red-svg" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"/><path fill-rule="evenodd" d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"/></svg>`

    public run() {
        const positions = Settings.getInstance().positions
        const values = Settings.getInstance().values
        const image = Settings.getInstance().image
        this.updateStatus(positions.isAllCoordsValid(), values.isAllValuesValid(), image.isImageValid())
        this.setExternalAnchorLinks()
    }

    /**
     * Show the coord, values and image status on the view.
     * @param coordinateStatus Boolean for coordinates validation.
     * @param valuesStatus Boolean for values validation.
     * @param imageStatus Boolean for image validation.
     */
    private async updateStatus(coordinateStatus: boolean, valuesStatus: boolean, imageStatus: boolean) {
        const coordinateStatusElement = await this.waitForElement("#drawer-coordinates-status")
        const valuesStatusElement = await this.waitForElement("#drawer-values-status")
        const imageStatusElement = await this.waitForElement("#drawer-image-status")

        coordinateStatusElement.innerHTML = coordinateStatus ? `${this.yesMarkerHtml}<span>Coordinates are set.</span>` : `${this.noMarkerHtml}<span>Coordinates are not set.</span>`
        valuesStatusElement.innerHTML = valuesStatus ? `${this.yesMarkerHtml}<span>Values are set.</span>` : `${this.noMarkerHtml}<span>Values are not set.</span>`
        imageStatusElement.innerHTML = imageStatus ? `${this.yesMarkerHtml}<span>Image is loaded.</span>` : `${this.noMarkerHtml}<span>Image is not loaded.</span>`
    }

    private setExternalAnchorLinks() {
        this.waitForElements("a[externalAnchor]").then(elements => {
            elements.forEach(element => {
                element.addEventListener("click", e => {
                    e.preventDefault()
                    shell.openExternal(element["href"])
                })
            })
        })
    }
}