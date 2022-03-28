import { Positions } from "../types/positions";
import { Canvas } from "../models/canvas";
import { MouseControl } from "../controls/mousecontrol";
import { sleep } from "../utils/delay";
import { Tool, Values } from "../types/values";
import { KeyboardControl } from "../controls/keyboardcontrol";
import { log, LogLevel } from "../logger/logger";
import { Command, ParsedInstructions } from "../parsers/imageparser";
import { Color } from "../types/color";
import { Point } from "../types/point";

/**
 * Class that represents the Drawer. Will use Robot.JS for Mouse and Keyboard control
 */
export class Drawer {
    private readonly _parsedInstructions: ParsedInstructions[]
    private readonly _positions: Positions
    private readonly _values: Values
    private readonly _canvas: Canvas

    /**
     * Constructor for the class
     * @param parsedInstructions The parsed pixels and instructions 
     * @param positions The XY positions of Paint 3D UI elements
     * @param values Values which will be set on Paint 3D
     * @param canvas A canvas instance
     */
    constructor(parsedInstructions: ParsedInstructions[], positions: Positions, values: Values, canvas: Canvas) {
        this._parsedInstructions = parsedInstructions
        this._positions = positions
        this._values = values
        this._canvas = canvas
    }

    /**
     * Starts the drawing.
     */
    public async start() {
        log(LogLevel.INFO, "Starting in 3 seconds...")
        await sleep(3000)

        await this.redefineCanvas()
        await this.setZoomValue()
        this.setTool()
        await this.setThickness()
        await this.setOpacity()

        for (let parsedInstruction of this._parsedInstructions) {
            const color = parsedInstruction.color
            log(LogLevel.INFO, `Total amount of instructions for (${color.r}, ${color.g}, ${color.b}): ${parsedInstruction.instructions.length}`)

            await this.setColor(color)
            parsedInstruction.instructions.forEach(instruction => {
                const pixelRelativePosition = instruction.pixel.position
                const startingPoint = this._canvas.startingPoint
                const position: Point = {
                    x: pixelRelativePosition.x + startingPoint.x,
                    y: pixelRelativePosition.y + startingPoint.y
                }

                switch(instruction.command) {
                    case Command.CLICK:
                        MouseControl.leftClick(position)
                        break;
                    case Command.DRAG:
                        MouseControl.dragTo(position)
                        break;
                }

            })

            if (parsedInstruction.instructions.length > 90000) {
                log(LogLevel.WARNING, `The color had more than 90k pixels. A sleep of 4s will be applied.`)
                await sleep(4000)
            }
        }

        log(LogLevel.OK, "Drawing finished")
    }

    /**
     * Sets the color on Paint 3D
     * @param color Color to be set
     */
    private async setColor(color: Color) {
        const doubleClick = () => {
            MouseControl.leftClick()
            MouseControl.leftClick()
        }

        MouseControl.moveTo(this._positions.buttonSelectedColorPreview)

        await sleep(1750)
        MouseControl.leftClick()

        await sleep(350)
        MouseControl.moveTo(this._positions.selectColorRed)
        await sleep(200)
        MouseControl.leftClick()
        await sleep(200)
        KeyboardControl.delete()
        KeyboardControl.type(color.r)

        MouseControl.moveTo(this._positions.selectColorGreen)
        doubleClick()
        await sleep(200)
        KeyboardControl.delete()
        KeyboardControl.type(color.g)

        MouseControl.moveTo(this._positions.selectColorBlue)
        doubleClick()
        await sleep(200)
        KeyboardControl.delete()
        KeyboardControl.type(color.b)

        MouseControl.moveTo(this._positions.selectColorOkButton)
        await sleep(100)
        MouseControl.leftClick()
        await sleep(100)
        KeyboardControl.type("a") // Prevents from switching to 2D or 3D mode
        await sleep(100)

        if (color.a) {
            const baseOpacity = this._values.brushOpacity
            const opacityScale = color.a / baseOpacity // a >= 0 <= 255
            const opacity = color.a / opacityScale
            this.setOpacity(opacity)
        }

        log(LogLevel.INFO, `Color set to ${color.r}-${color.g}-${color.b}-${color.a}`)
    }

    /**
     * Sets the opacity on Paint 3D
     * @param opacity Opacity value. If no value is passed, then it will use the {@link Values}' one.
     */
    private async setOpacity(opacity = this._values.brushOpacity) {
        MouseControl.leftClick(this._positions.boxBrushOpacity)
        await sleep(150)

        KeyboardControl.type(opacity)
        KeyboardControl.enter()

        log(LogLevel.INFO, `Opacity set to ${opacity}%`)
    }

    /**
     * Sets the tool's thickness on Paint 3D
     */
    private async setThickness() {
        MouseControl.leftClick(this._positions.boxBrushSize)
        await sleep(150)

        KeyboardControl.type(this._values.brushSize)
        KeyboardControl.enter()

        log(LogLevel.INFO, `Thickness set to ${this._values.brushSize}px`)
    }

    /**
     * Sets the drawing tool
     */
    private setTool() {
        switch (this._values.tool) {
            case Tool.CRAYON:
                MouseControl.leftClick(this._positions.toolCrayon)

                log(LogLevel.INFO, "Tool set to Crayon")
                break;
            case Tool.GRAPHITE_PENCIL:
                MouseControl.leftClick(this._positions.toolGraphitePencil)

                log(LogLevel.INFO, "Tool set to Graphite Pencil")
                break;
            case Tool.MARKER:
                MouseControl.leftClick(this._positions.toolMarker)

                log(LogLevel.INFO, "Tool set to Marker")
                break;
            case Tool.PIXEL_PENCIL:
                MouseControl.leftClick(this._positions.toolPixelPencil)

                log(LogLevel.INFO, "Tool set to Pixel Pencil")
                break;
            case Tool.WATERCOLOR:
                MouseControl.leftClick(this._positions.toolWatercolor)

                log(LogLevel.INFO, "Tool set to Watercolor")
                break;
            default:
                throw "Invalid tool selected"
        }
    }

    /**
     * Sets the zoom value
     */
    private async setZoomValue() {
        MouseControl.leftClick(this._positions.boxZoom)
        KeyboardControl.type(this._values.zoom)
        KeyboardControl.enter()
        await sleep(500)

        log(LogLevel.INFO, `Zoom value set to ${this._values.zoom}`)
    }

    /**
     * Redefine the canvas
     */
    private async redefineCanvas() {
        MouseControl.moveTo(this._canvas.center)
        await sleep(75)
        MouseControl.rightClick()
        await sleep(150)
        MouseControl.move(this._positions.contextRedefineCanvas)
        MouseControl.leftClick()

        log(LogLevel.INFO, "Canvas redefined.")
    }
}
