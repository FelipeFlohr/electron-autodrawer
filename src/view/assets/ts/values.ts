import { Positions } from "../../../types/positions"
import { Point } from "../../../types/point"

class PositionValues {

    private _toolMarker?: Point = null
    private _toolWatercolor?: Point = null
    private _toolPixelPencil?: Point = null
    private _toolGraphitePencil?: Point = null
    private _toolCrayon?: Point = null
    private _boxBrushSize?: Point = null
    private _boxBrushOpacity?: Point = null
    private _boxZoom?: Point = null
    private _buttonSelectedColorPreview?: Point = null
    private _selectColorRed?: Point = null
    private _selectColorGreen?: Point = null
    private _selectColorBlue?: Point = null
    private _selectColorOkButton?: Point = null
    private _canvasTopLeftCorner?: Point = null
    private _canvasBottomRightCorner?: Point = null
    private _contextRedefineCanvas?: Point = null

    public isAllCoordsValid(): boolean {
        let valid = true

        for (let key in this) {
            if (typeof(this[key]) == "object") {
                if (this[key] == null) {
                    valid = false
                }
            }
        }

        return valid
    }

    public getPositions(): Positions {
        return {
            toolMarker: this.toolMarker,
            toolWatercolor: this.toolWatercolor,
            toolPixelPencil: this.toolPixelPencil,
            toolGraphitePencil: this.toolGraphitePencil,
            toolCrayon: this.toolCrayon,
            boxBrushSize: this.boxBrushSize,
            boxBrushOpacity: this.boxBrushOpacity,
            boxZoom: this.boxZoom,
            buttonSelectedColorPreview: this.buttonSelectedColorPreview,
            selectColorRed: this.selectColorRed,
            selectColorGreen: this.selectColorGreen,
            selectColorBlue: this.selectColorBlue,
            selectColorOkButton: this.selectColorOkButton,
            canvasTopLeftCorner: this.canvasTopLeftCorner,
            canvasBottomRightCorner: this.canvasBottomRightCorner,
            contextRedefineCanvas: this.contextRedefineCanvas
        }
    }

    private validator(point: Point): Point {
        if (typeof(point.x) != "number" || typeof(point.y) != "number") return null

        const width = window.screen.width
        const height = window.screen.height
        const valid = point.x >= 0 && point.y >= 0 && point.x < width && point.y < height

        return valid ? point : null
    }

    get toolMarker(): Point {
        return this._toolMarker;
    }

    set toolMarker(value: Point) {
        this._toolMarker = this.validator(value);
    }

    get toolWatercolor(): Point {
        return this._toolWatercolor;
    }

    set toolWatercolor(value: Point) {
        this._toolWatercolor = this.validator(value);
    }

    get toolPixelPencil(): Point {
        return this._toolPixelPencil;
    }

    set toolPixelPencil(value: Point) {
        this._toolPixelPencil = this.validator(value);
    }

    get toolGraphitePencil(): Point {
        return this._toolGraphitePencil;
    }

    set toolGraphitePencil(value: Point) {
        this._toolGraphitePencil = this.validator(value);
    }

    get toolCrayon(): Point {
        return this._toolCrayon;
    }

    set toolCrayon(value: Point) {
        this._toolCrayon = this.validator(value);
    }

    get boxBrushSize(): Point {
        return this._boxBrushSize;
    }

    set boxBrushSize(value: Point) {
        this._boxBrushSize = this.validator(value);
    }

    get boxBrushOpacity(): Point {
        return this._boxBrushOpacity;
    }

    set boxBrushOpacity(value: Point) {
        this._boxBrushOpacity = this.validator(value);
    }

    get boxZoom(): Point {
        return this._boxZoom;
    }

    set boxZoom(value: Point) {
        this._boxZoom = this.validator(value);
    }

    get buttonSelectedColorPreview(): Point {
        return this._buttonSelectedColorPreview;
    }

    set buttonSelectedColorPreview(value: Point) {
        this._buttonSelectedColorPreview = this.validator(value);
    }

    get selectColorRed(): Point {
        return this._selectColorRed;
    }

    set selectColorRed(value: Point) {
        this._selectColorRed = this.validator(value);
    }

    get selectColorGreen(): Point {
        return this._selectColorGreen;
    }

    set selectColorGreen(value: Point) {
        this._selectColorGreen = this.validator(value);
    }

    get selectColorBlue(): Point {
        return this._selectColorBlue;
    }

    set selectColorBlue(value: Point) {
        this._selectColorBlue = this.validator(value);
    }

    get selectColorOkButton(): Point {
        return this._selectColorOkButton;
    }

    set selectColorOkButton(value: Point) {
        this._selectColorOkButton = this.validator(value);
    }

    get canvasTopLeftCorner(): Point {
        return this._canvasTopLeftCorner;
    }

    set canvasTopLeftCorner(value: Point) {
        this._canvasTopLeftCorner = this.validator(value);
    }

    get canvasBottomRightCorner(): Point {
        return this._canvasBottomRightCorner;
    }

    set canvasBottomRightCorner(value: Point) {
        this._canvasBottomRightCorner = this.validator(value);
    }

    get contextRedefineCanvas(): Point {
        return this._contextRedefineCanvas;
    }

    set contextRedefineCanvas(value: Point) {
        this._contextRedefineCanvas = this.validator(value);
    }
}

export const positionValues = new PositionValues()