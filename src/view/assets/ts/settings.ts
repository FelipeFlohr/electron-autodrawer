import { PositionValues } from "./values"

export class Settings {

    static instance: Settings
    public readonly positions: PositionValues

    private constructor() {
        this.positions = new PositionValues()
    }

    static getInstance(): Settings {
        if (!Settings.instance) Settings.instance = new Settings()
        return Settings.instance
    }
}