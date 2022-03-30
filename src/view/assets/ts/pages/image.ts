import { Page } from "../models/page";
import { Settings } from "../settings";
import { Dimension } from "../../../../types/dimension";
import { Canvas } from "../../../../models/canvas";
import { bootstrapAlerts } from "./coordinates";
import Jimp from "jimp"

/**
 * Hold all the logic for "image.html".
 */
export class Image extends Page {
    private instance = Settings.getInstance().image

    run(): void {
        if (!Settings.getInstance().positions.isAllCoordsValid()) {
            this.waitForElement("#input-form").then(element => element.innerHTML = `<span class="fs-3">Before loading the image, it is necessary to set all the coordinates.</span>`)
        }

        this.loadImageOnPage()
    }

    /**
     * Defines the logic for the "Load Image" button.
     * @param imgElement The HTML "Input Upload" element.
     */
    public async loadImageButton(imgElement: HTMLInputElement) {
        const fileReader = new FileReader()
        fileReader.readAsArrayBuffer(imgElement.files[0])

        const inputAlert = document.createElement("div")
        const alert = (message: string, type: bootstrapAlerts) => {
            inputAlert.innerHTML = ""

            const wrapper = document.createElement("div")
            wrapper.innerHTML = `<div class="alert ${type} alert-dismissible" role="alert">${message}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`

            inputAlert.append(wrapper)
        }

        fileReader.onload = async e => {
            if (typeof(fileReader.result) == "object") {
                const buffer = Buffer.from(fileReader.result)
                const image = await Jimp.read(buffer)
                const imageStatusElement = await this.waitForElement("#imageStatus")
                const imageLoadedElement = await this.waitForElement("#imageLoaded")

                const imageSize: Dimension = { width: image.getWidth(), height: image.getHeight() }
                let valid: boolean
                try {
                    new Canvas(Settings.getInstance().positions.canvasTopLeftCorner, 
                                Settings.getInstance().positions.canvasBottomRightCorner, 
                                imageSize)
                    valid = true
                } catch (e) {
                    valid = false
                }

                if (valid) {
                    this.instance.image = fileReader.result

                    // Creates the image
                    const img = this.createImageElement(URL.createObjectURL(imgElement.files[0]))

                    // Appends the image and an alert to the status div
                    alert("Image loaded", bootstrapAlerts.SUCCESS)
                    imageStatusElement.innerHTML = ""
                    imageStatusElement.append(inputAlert)

                    imageLoadedElement.innerHTML = ""
                    imageLoadedElement.append(img)
                } else {
                    const canvasSize: Dimension = {
                        width: Settings.getInstance().positions.canvasBottomRightCorner.x - Settings.getInstance().positions.canvasTopLeftCorner.x,
                        height: Settings.getInstance().positions.canvasBottomRightCorner.y - Settings.getInstance().positions.canvasTopLeftCorner.y
                    }

                    alert(`Image size (${imageSize.width}x${imageSize.height}) is greater than canvas size (${canvasSize.width}x${canvasSize.height}). Please, resize it.`, bootstrapAlerts.DANGER)
                    imageStatusElement.innerHTML = ""
                    imageStatusElement.append(inputAlert)
                }
            }
        }
    }

    /**
     * Load and show the image on the page.
     */
    private loadImageOnPage() {
        this.waitForElement("#imageLoaded")
            .then(element => {
                if (this.instance.image != null) {
                    // Based of https://stackoverflow.com/a/246813/1464608
                    const encode64 = (input: any) => {
                        const keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
                        let output = "";
                        let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
                        let i = 0;

                        while (i < input.length) {
                            chr1 = input[i++];
                            chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index 
                            chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here
                    
                            enc1 = chr1 >> 2;
                            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                            enc4 = chr3 & 63;
                    
                            if (isNaN(chr2)) {
                                enc3 = enc4 = 64;
                            } else if (isNaN(chr3)) {
                                enc4 = 64;
                            }
                            output += keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                                      keyStr.charAt(enc3) + keyStr.charAt(enc4);
                        }
                        return output;
                    }

                    const bytes = new Uint8Array(this.instance.image)

                    const img = this.createImageElement("data:image/png;base64," + encode64(bytes))
                    element.innerHTML = ""
                    element.append(img)
                }
            })
    }

    /**
     * Creates the image element.
     * @param src The "src" attribute.
     * @returns A HTMLImageElement.
     */
    private createImageElement(src: string): HTMLImageElement {
        const img = document.createElement("img")
        img.src = src
        img.className = "img-preview"

        img.onmouseenter = e => this.imgAnimationMouseHover(e)
        img.onmouseleave = e => this.imgAnimationMouseLeave(e)
        img.onload = () => URL.revokeObjectURL(img.src)
        return img
    }

    /**
     * Defines the animation when Mouse hovers on the image.
     * @param e The MouseEvent.
     */
    private imgAnimationMouseHover(e: MouseEvent) {
        if (e.currentTarget instanceof Element) {
            e.currentTarget.classList.remove("img-deactive")
            e.currentTarget.classList.add("img-active")
        }
    }

    /**
     * Defines the animation when Mouse leaves the image.
     * @param e The MouseEvent.
     */
    private imgAnimationMouseLeave(e: MouseEvent) {
        if (e.currentTarget instanceof Element) {
            e.currentTarget.classList.remove("img-active")
            e.currentTarget.classList.add("img-deactive")
        }
    }
}