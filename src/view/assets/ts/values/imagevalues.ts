import { Dimension } from "../../../../types/dimension"
import Jimp from "jimp"

export class ImageValues {

    private _image: ArrayBuffer

    public isImageValid(): boolean {
        return this.image != null
    }

    get image() {
        return this._image
    }

    set image(value: ArrayBuffer) {
        this._image = value
    }

    getImageSize(): Dimension {
        const image = new Jimp(this._image)
        const width = image.getWidth()
        const height = image.getHeight()

        return { width: width, height: height }
    }
}