const robot = require("robotjs")
import { Point } from "../types/point"

export class MouseControl {

    /**
     * Moves the cursor relative to the current position
     * @param x X amount to move
     * @param y Y amount to move
     */
    public static move(x: number, y: number): void;
    /**
     * Moves the cursor relative to the current position
     * @param point XY amount to move
     */
    public static move(point: Point): void;
    public static move(xPosOrPoint: number | Point, y?: number): void {
        const currentPos = robot.getMousePos()

        if (typeof(xPosOrPoint) == "number") {
            robot.moveMouse(currentPos.x + xPosOrPoint, currentPos.y + y)
        } else {
            const newPoint: Point = {
                x: currentPos.x + xPosOrPoint.x,
                y: currentPos.y + xPosOrPoint.y
            }

            this.moveTo(newPoint)
        }

    }

    /**
     * Moves the cursor to an absolute coordinate
     * @param x X coordinate
     * @param y Y coordinate
     */
    public static moveTo(x: number, y: number): void;
    /**
     * Moves the cursor to an absolute coordinate
     * @param point XY coordinate
     */
    public static moveTo(point: Point): void;
    public static moveTo(xPosOrPoint: number | Point, y?: number): void {
        if (typeof(xPosOrPoint) == "number") {
            robot.moveMouse(xPosOrPoint, y)
        } else {
            robot.moveMouse(xPosOrPoint.x, xPosOrPoint.y)
        }
    }

    /**
     * Drag the cursor holding down the left mouse button to an absolute coordinate
     * @param x X coordinate
     * @param y Y coordinate
     */
    public static dragTo(x: number, y: number): void;
    /**
     * Drag the cursor holding down the left mouse button to an absolute coordinate
     * @param point XY coordinate
     */
    public static dragTo(point: Point): void;
    public static dragTo(xPosOrPoint: number | Point, y?: number) {
        robot.mouseToggle("down", "left")
        if (typeof(xPosOrPoint) == "number") {
            this.moveTo(xPosOrPoint, y)
        } else {
            this.moveTo(xPosOrPoint)
        }
        robot.mouseToggle("up", "left")
    }

    /**
     * Gets the current cursor XY position
     * @returns cursor's current XY position
     */
    public static getCursorPosition(): Point {
        const pos = robot.getMousePos()
        return {
            x: pos.x,
            y: pos.y
        }
    }

    /**
     * Performs a mouse left button click
     */
    public static leftClick(): void;
    /**
     * Performs a mouse left button click at an absolute XY coordinate
     * @param x X coordinate
     * @param y Y coordinate
     */
    public static leftClick(x: number, y: number): void;
    /**
     * Performs a mouse left button click at an absolute XY coordinate
     * @param point XY coordinate
     */
    public static leftClick(point: Point): void;
    public static leftClick(xPosOrPoint?: number | Point, y?: number): void {
        switch (typeof(xPosOrPoint)) {
            case "undefined":
                robot.mouseClick("left")
                break;
            case "number":
                this.moveTo(xPosOrPoint, y)
                robot.mouseClick("left")
                break;
            default:
                this.moveTo(xPosOrPoint)
                robot.mouseClick("left")
                break;
        }
    }

    /**
     * Performs a mouse right button click
     */
    public static rightClick(): void;
    /**
     * Performs a mouse right button click at an absolute XY coordinate
     * @param x X coordinate
     * @param y Y coordinate
     */
    public static rightClick(x: number, y: number): void;
    /**
     * Performs a mouse right button click at an absolute XY coordinate
     * @param point XY coordinate
     */
    public static rightClick(point: Point): void;
    public static rightClick(xPosOrPoint?: number | Point, y?: number): void {
        switch (typeof(xPosOrPoint)) {
            case "undefined":
                robot.mouseClick("right")
                break;
            case "number":
                this.moveTo(xPosOrPoint, y)
                robot.mouseClick("right")
                break;
            default:
                this.moveTo(xPosOrPoint)
                robot.mouseClick("right")
                break;
        }
    }
}