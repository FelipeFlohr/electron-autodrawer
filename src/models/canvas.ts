import { Dimension } from "../types/dimension";
import { Point } from "../types/point";

/**
 * Represents a Canvas.
 * @author - Felipe Matheus Flohr
 */
export class Canvas {
    private readonly _topLeftCorner: Point
    private readonly _bottomRightCorner: Point
    private readonly _center: Point
    private readonly _startingPoint: Point
    private readonly _imageSize: Dimension
    private readonly _canvasSize: Dimension

    /**
     * Constructor for the canvas
     * 
     * @param topLeftCorner - The XY Top Left Corner position of Paint 3D's canvas.
     * @param bottomRightCorner - The XY Bottom Right Corner position of Paint 3D's canvas.
     * @param imageSize - The image size (dimension).
     * @throws - Exception if image size is greater than canvas size.
     */
    constructor(topLeftCorner: Point, bottomRightCorner: Point, imageSize: Dimension) {
        this._topLeftCorner = topLeftCorner;
        this._bottomRightCorner = bottomRightCorner;
        this._imageSize = imageSize;

        this._canvasSize = {
            width: this._bottomRightCorner.x - this._topLeftCorner.x,
            height: this._bottomRightCorner.y - this._topLeftCorner.x
        }

        this._center = {
            x: (this._bottomRightCorner.x + this._topLeftCorner.x) / 2,
            y: (this._bottomRightCorner.y + this._topLeftCorner.y) / 2
        }

        const toInt = (num: number) => parseInt(`${num}`)
        this._startingPoint = {
            x: this._center.x - toInt(this._imageSize.width / 2),
            y: this._center.y - toInt(this._imageSize.height / 2)
        }

        if (this._imageSize.width >= this._canvasSize.width || this._imageSize.height >= this._canvasSize.height) {
            throw "Image size is greater then Canvas size. Please, resize it."
        }
    }

    /**
     * Getter for the Canvas Top Left Corner.
     * @returns Canvas Top Left Corner XY Position
     */
    get topLeftCorner(): Point {
        return this._topLeftCorner;
    }

    /**
     * Getter for the Canvas Bottom Right Corner.
     * @returns Canvas Bottom Right Corner XY Position
     */
    get bottomRightCorner(): Point {
        return this._bottomRightCorner;
    }

    /**
     * Getter for the Canvas center.
     * @returns Canvas center XY Position
     */
    get center(): Point {
        return this._center;
    }

    /**
     * Getter for the Canvas starting point (position where the first pixel will be drawn).
     * @returns Canvas starting point XY Position
     */
    get startingPoint(): Point {
        return this._startingPoint;
    }

    /**
     * Getter for the Image Size.
     * @returns Image Size as a Dimension type
     */
    get imageSize(): Dimension {
        return this._imageSize;
    }

    /**
     * Getter for the Canvas size
     * @returns Canvas Size as a Dimension type
     */
    get canvasSize(): Dimension {
        return this._canvasSize;
    }
}
