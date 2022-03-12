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
