import jimp from "jimp";
import { Point } from "../types/point";
import { Color } from "../types/color";
import { log, LogLevel } from "../logger/logger";

/**
 * Class that parses the Image to Pixels and Instructions.
 * @see ParsedInstructions
 * @author Felipe Matheus Flohr
 */
export class ImageParser {
    private readonly _image: Buffer
    private _imageParsed: jimp
    private _pixels: ParsedInstructions[]

    /**
     * Class constructor
     * @param image - ArrayBuffer containing the image
     */
    constructor(image: ArrayBuffer) {
        this._image = Buffer.from(image)
    }

    /**
     * Parses the image and returns *this* instance. An async substitute for the constructor
     * @returns *this* instance
     * @async
     */
    public async build() {
        this._imageParsed = await jimp.read(this._image)
        this._pixels = this.getPixels()

        log(LogLevel.OK, "Parsed the image.")
        return this
    }

    /**
     * "Reads" every pixel of the image, then parses it to instructions and returns an array of ParsedInstructions
     * @returns an array of {@link ParsedInstructions}
     * @see {@link ParsedInstructions}
     */
    private getPixels(): ParsedInstructions[] {
        const pixels: Pixel[] = []
        const width = this._imageParsed.bitmap.width
        const height = this._imageParsed.bitmap.height

        // Get all the pixels with its position
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const position: Point = { x: x, y: y }
                pixels.push({ color: this.getPixelAt(position), position: position})
            }
        }
        log(LogLevel.INFO, `The image has a total amount of ${pixels.length} pixels`)

        // Applies a logic to each pixel and determines its instruction
        const pixelInstructions: PixelInstruction[] = []
        for (let i = 0; i < pixels.length; i++) {
            const previousPixel = i == 0 ? null : pixels[i - 1] // If it is the first iteration, then there is no Previous Pixel
            const currentPixel = pixels[i]
            const nextPixel = i == (pixels.length - 1) ? null : pixels[i + 1] // If it is the last iteration, then there is no Next Pixel

            if (previousPixel == null) { // Same as i == 0
                if (this.colorEquals(currentPixel.color, nextPixel.color)) { // If next pixel's color is equals to the current one, then command will be DRAG
                    pixelInstructions.push({ pixel: currentPixel, command: Command.DRAG })
                } else {
                    pixelInstructions.push({ pixel: currentPixel, command: Command.CLICK })
                }
            } else if (nextPixel == null) { // Same as i == (pixels.length -1)
                if (this.colorEquals(currentPixel.color, previousPixel.color)) { // If previous pixel is equals to the last, then it will be DRAG
                    pixelInstructions.push({ pixel: currentPixel, command: Command.DRAG })
                } else {
                    pixelInstructions.push({ pixel: currentPixel, command: Command.CLICK })
                }
            } else if (currentPixel.color.a == 0) {
                pixelInstructions.push({ pixel: currentPixel, command: Command.SKIP })
            } else { // Pixel is not the first nor the last within the array
                if (this.colorEquals(currentPixel.color, previousPixel.color) && this.colorEquals(currentPixel.color, nextPixel.color)) { // Previous Pixel and Next Pixel -> SKIP
                    pixelInstructions.push({ pixel: currentPixel, command: Command.SKIP })
                } else if (this.colorEquals(currentPixel.color, previousPixel.color)) {
                    pixelInstructions.push({ pixel: currentPixel, command: Command.DRAG }) // Previous Pixel -> DRAG
                } else if (this.colorEquals(currentPixel.color, nextPixel.color)) {
                    pixelInstructions.push({ pixel: currentPixel, command: Command.CLICK }) // Next Pixel -> CLICK
                } else {
                    pixelInstructions.push({ pixel: currentPixel, command: Command.CLICK }) // None -> CLICK
                }
            }
        }

        const pixelMessage = pixelInstructions.length >= 200000 ? `Pixels parsed. Total amount of ${pixelInstructions.length} pixels including instructions. Process may take some time.`
        : `Pixels parsed. Total of ${pixelInstructions.length} pixels including instructions.`
        log(pixelInstructions.length >= 200000 ? LogLevel.WARNING : LogLevel.INFO, pixelMessage)

        // Now it will separate each color and attach the pixels
        // Starting now, it is going to take every color
        const colorSet: ColorSet = new ColorSet()
        pixelInstructions.forEach(instruction => colorSet.add(instruction.pixel.color))
        log(LogLevel.OK, "All colors separated")
        log(LogLevel.INFO, `Total amount of colors: ${colorSet.size}`)

        // Now it will create some parsed instructions
        const parsedInstructions: ParsedInstructions[] = []
        const colors = colorSet.colors

        colors.forEach(color => {
            const instructions: PixelInstruction[] = []

            pixelInstructions.forEach(instruction => {
                if (this.colorEquals(color, instruction.pixel.color)) {
                    instructions.push(instruction)
                }
            })

            parsedInstructions.push({
                color: color,
                instructions: instructions
            })
        })

        return parsedInstructions
    }

    /**
     * Getter for the image
     * @returns the image as a JIMP type
     */
    get image(): jimp {
        return this._imageParsed
    }

    /**
     * Getter for the parsed image
     * @returns the parsed image as an array of {@link ParsedInstructions}
     */
    get pixels(): ParsedInstructions[] {
        return this._pixels
    }

    /**
     * Takes the RGBA color of the specified pixel
     * @param point Pixel at the specified {@link Point}
     * @returns The RGBA of the pixel read
     */
    private getPixelAt(point: Point): Color {
        const toInt = (num: number) => parseInt(`${num}`)
        const hex = this._imageParsed.getPixelColor(point.x, point.y)
        return {
            r: toInt(jimp.intToRGBA(hex).r),
            g: toInt(jimp.intToRGBA(hex).g),
            b: toInt(jimp.intToRGBA(hex).b),
            a: jimp.intToRGBA(hex).a == 0 ? null : toInt(jimp.intToRGBA(hex).a)
        }
    }

    /**
     * Compares two colors
     * @param color1 Color 1
     * @param color2 Color 2
     * @returns true if the two colors are the same
     */
    private colorEquals(color1: Color, color2: Color): boolean {
        return color1.r == color2.r && color1.g == color2.g && color1.b == color2.b && color1.a == color2.a
    }
}

/**
 * Creates a "fake" *Set* of colors based on an ID generated
 */
class ColorSet {
    private readonly _colors: Color[]
    private readonly _ids: number[]
    private _size: number

    constructor() {
        this._colors = []
        this._ids = []
        this._size = 0
    }

    /**
     * Adds a color to the Set
     * @param color Color to be added
     * @returns true if the color has been added
     */
    add(color: Color): boolean {
        const id = this.generateId(color)

        if (!this._ids.includes(id)) {
            this._colors.push(color)
            this._ids.push(id)
            this._size += 1

            return true
        }

        return false
    }

    get colors() {
        return this._colors
    }

    get ids() {
        return this._ids
    }

    get size() {
        return this._size
    }

    private generateId(color: Color): number {
        let sum = 0

        sum += color.r
        sum += color.g
        sum += color.b
        if (color.a) sum += color.a

        return sum
    }
}

/**
 * Represents the three commands used by the program to draw on Paint 3D.
 */
export enum Command {
    CLICK,
    SKIP,
    DRAG
}

/**
 * Type that represents the parsed instructions and pixels.
 */
export type ParsedInstructions = {
    color: Color
    instructions: PixelInstruction[]
}

type PixelInstruction = {
    pixel: Pixel
    command: Command
}

type Pixel = {
    position: Point
    color: Color
}
