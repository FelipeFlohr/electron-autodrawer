import { ImageValues } from "./values/imagevalues"
import { PositionValues } from "./values/positionsvalues"
import { ToolsValues } from "./values/toolsvalues"

/**
 * A Settings class. It's only instanciated once. Holds values and other instances.
 */
export class Settings {

    static instance: Settings
    public readonly positions: PositionValues
    public readonly values: ToolsValues
    public readonly image: ImageValues

    private constructor() {
        this.positions = new PositionValues()
        this.values = new ToolsValues()
        this.image = new ImageValues()
    }

    static getInstance(): Settings {
        if (!Settings.instance) Settings.instance = new Settings()
        return Settings.instance
    }
}