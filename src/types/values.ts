/**
 * Represents the Values which will be used on the drawing process
 */
export type Values = {
    zoom: number,
    brushSize: number,
    brushOpacity: number,
    tool: Tool
}

/**
 * Enum for all the tools available
 */
export enum Tool {
    MARKER = "marker",
    WATERCOLOR = "watercolor",
    PIXEL_PENCIL = "pixelpencil",
    GRAPHITE_PENCIL = "graphitepencil",
    CRAYON = "crayon"
}

/**
 * Enum for each tool and its minimum brush size value
 */
export enum ToolMinBrushSizeValue {
    CRAYON = 10,
    GRAPHITE_PENCIL = 5,
    MARKER = 1,
    PIXEL_PENCIL = 1,
    WATERCOLOR = 5
}

/**
 * Enum for each tool and its maximum brush size value
 */
export enum ToolMaxBrushSizeValue {
    CRAYON = 100,
    GRAPHITE_PENCIL = 10,
    MARKER = 100,
    PIXEL_PENCIL = 100,
    WATERCOLOR = 200
}