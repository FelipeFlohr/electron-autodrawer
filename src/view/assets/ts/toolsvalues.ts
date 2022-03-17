import { Tool, ToolMinBrushSizeValue, ToolMaxBrushSizeValue } from "../../../types/values"

export class ToolsValues {

    private _zoom: number = 1
    private _brushSize: number = 1
    private _brushOpacity: number = 100
    private _tool: Tool = Tool.PIXEL_PENCIL

    private zoomAndOpacityValidator(value: number): boolean {
        if (value == null) return false
        return value > 0 && value <= 100
    }

    private brushSizeValidator(value: number): boolean {
        if (value == null) return false
        switch (this._tool) {
            case Tool.CRAYON:
                return value >= ToolMinBrushSizeValue.CRAYON && value <= ToolMaxBrushSizeValue.CRAYON
            case Tool.GRAPHITE_PENCIL:
                return value >= ToolMinBrushSizeValue.GRAPHITE_PENCIL && value <= ToolMaxBrushSizeValue.GRAPHITE_PENCIL
            case Tool.MARKER:
                return value >= ToolMinBrushSizeValue.MARKER && value <= ToolMaxBrushSizeValue.MARKER
            case Tool.PIXEL_PENCIL:
                return value >= ToolMinBrushSizeValue.PIXEL_PENCIL && value <= ToolMaxBrushSizeValue.PIXEL_PENCIL
            case Tool.WATERCOLOR:
                return value >= ToolMinBrushSizeValue.WATERCOLOR && value <= ToolMaxBrushSizeValue.WATERCOLOR
        }
    }

    get zoom(): number {
        return this._zoom;
    }

    set zoom(value: number) {
        this._zoom = this.zoomAndOpacityValidator(value) ? parseInt(`${value}`) : 100
    }

    get brushSize(): number {
        return this._brushSize;
    }

    set brushSize(value: number) {
        this._brushSize = this.brushSizeValidator(value) ? parseInt(`${value}`) : ToolMinBrushSizeValue[this._tool]
    }

    get brushOpacity(): number {
        return this._brushOpacity;
    }

    set brushOpacity(value: number) {
        this._brushOpacity = this.zoomAndOpacityValidator(value) ? parseInt(`${value}`) : 100
    }

    get tool(): Tool {
        return this._tool;
    }

    set tool(value: Tool) {
        if (value == null) this._tool = Tool.PIXEL_PENCIL
        this._tool = value;
    }
}