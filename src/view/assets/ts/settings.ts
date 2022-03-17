import { PositionValues } from "./positionsvalues"
import { ToolsValues } from "./toolsvalues"

export class Settings {

    static instance: Settings
    public readonly positions: PositionValues
    public readonly values: ToolsValues

    private constructor() {
        this.positions = new PositionValues()
        this.values = new ToolsValues()
    }

    static getInstance(): Settings {
        if (!Settings.instance) Settings.instance = new Settings()
        return Settings.instance
    }
}