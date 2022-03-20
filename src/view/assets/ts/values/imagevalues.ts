import { Dimension } from "../../../../types/dimension"

export class ImageValues {

    private _image: ArrayBuffer
    private _imageSize: Dimension

    public isImageValid(): boolean {
        return this.image != null
    }

    get image() {
        return this._image
    }

    set image(value: ArrayBuffer) {
        this._image = value
    }

    get imageSize() {
        return this.imageSize
    }

    set imageSize(value: Dimension) {
        this._imageSize = value
    }
}