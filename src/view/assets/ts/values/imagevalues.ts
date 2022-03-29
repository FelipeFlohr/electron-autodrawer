import { Dimension } from "../../../../types/dimension"
import Jimp from "jimp"

/**
 * Hold the Image
 */
export class ImageValues {

    private _image: ArrayBuffer

    /**
     * Return True if image is valid.
     * @returns Return true if image is valid
     */
    public isImageValid(): boolean {
        return this.image != null
    }

    /**
     * Get the image dimension and returns it.
     * @returns Return the image width and height as a "Dimension" type.
     */
    public async getImageSize(): Promise<Dimension> {
        const image = await Jimp.read(Buffer.from(this.image))
        const width = image.getWidth()
        const height = image.getHeight()

        return { width: width, height: height }
    }

    get image() {
        return this._image
    }

    set image(value: ArrayBuffer) {
        this._image = value
    }
}