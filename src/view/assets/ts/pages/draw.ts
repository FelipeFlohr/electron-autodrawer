import { Page } from "../models/page";
import { Settings } from "../settings";

export class Draw extends Page {
    yesMarkerHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="bi bi-check-lg green-svg" viewBox="0 0 16 16"><path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" /></svg>`
    noMarkerHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" class="bi bi-x-lg red-svg" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"/><path fill-rule="evenodd" d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"/></svg>`

    public async run() {
        const status = await this.setStatus()
        if (!status) {
            const drawerElement = await this.waitForElement("#drawer")
            drawerElement.innerHTML = "It is necessary to set the coordinates, values and image before using the drawer."
        }
    }

    private async setStatus() {
        const coordElement = await this.waitForElement("#drawer-coords-status")
        const valuesElement = await this.waitForElement("#drawer-values-status")
        const imageElement = await this.waitForElement("#drawer-image-status")

        const coordStatus = Settings.getInstance().positions.isAllCoordsValid()
        const valuesStatus = Settings.getInstance().values.isAllValuesValid()
        const imageStatus = Settings.getInstance().image.isImageValid()

        const createStatus = (status: boolean, yesMessage: string, noMessage: string) => {
            return status ? `${this.yesMarkerHtml}<span>${yesMessage}</span>` : `${this.noMarkerHtml}<span>${noMessage}</span>`
        }

        coordElement.innerHTML = createStatus(coordStatus, "Coordinates are set.", "Coordinates are not set.")
        valuesElement.innerHTML = createStatus(valuesStatus, "Values are set.", "Values are not set.")
        imageElement.innerHTML = createStatus(imageStatus, "Image is loaded.", "Image is not loaded.")

        return coordStatus && valuesStatus && imageStatus
    }
}