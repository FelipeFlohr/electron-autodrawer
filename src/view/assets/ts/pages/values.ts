import { Tool, ToolMaxBrushSizeValue, ToolMinBrushSizeValue, Values } from "../../../../types/values";
import { Page } from "../models/page";
import defaultValues from "../../../../json/defaultvalues.json"
import { Settings } from "../settings";
import { bootstrapAlerts } from "./coordinates";

export class ToolsValues extends Page {

    private readonly zoomAmountRangeSelector = "#zoomAmountRange"
    private readonly brushSizeRangeSelector = "#brushSizeRange"
    private readonly brushOpacityRangeSelector = "#brushOpacityRange"
    private readonly toolSelectedSpanSelector = "#toolSelected"

    private readonly zoomAmountSpanSelector = "#zoomAmountSpan"
    private readonly brushSizeSpanSelector = "#brushSizeSpan"
    private readonly brushOpacitySpanSelector = "#brushOpacitySpan"

    private readonly getInstance = () => Settings.getInstance().values

    run() {
        this.loadValues()
        this.addRangeListeners()
    }

    public loadDefaultValues() {
        for (let key in defaultValues) {
            this.getInstance()[key] = defaultValues[key]
        }

        this.loadValues()
    }

    public async loadValuesButton() {
        const inputFile = document.createElement("input")
        inputFile.type = "file"
        inputFile.accept = "application/json"
        inputFile.multiple = false

        const inputAlert = await this.waitForElement("#fileAlertPlaceholder")
        const alert = (message: string, type: bootstrapAlerts) => {
            inputAlert.innerHTML = ""

            const wrapper = document.createElement("div")
            wrapper.innerHTML = `<div class="alert ${type} alert-dismissible" role="alert">${message}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`

            inputAlert.append(wrapper)
        }

        inputFile.addEventListener("change", () => {
            const fileNotParsed = inputFile.files[0]
            fileNotParsed.text()
                .then(text => {
                    const values: Values = JSON.parse(text)

                    let allValidKeys = true
                    for (let key in values) {
                        const isUndefined = typeof(this.getInstance()[key]) == "undefined"
                        const isNumberOrString = typeof(this.getInstance()[key]) == "number" || typeof(this.getInstance()[key]) == "string"

                        if (isUndefined || !isNumberOrString) {
                            allValidKeys = false
                            alert(`Key "${key}" is undefined or is not a number nor string.`, bootstrapAlerts.DANGER)
                        }
                    }

                    if (allValidKeys) {
                        alert("File loaded.", bootstrapAlerts.SUCCESS)

                        for (let key in values) {
                            this.getInstance().tool = values.tool
                            if (key != "tool") {
                                this.getInstance()[key] = values[key]
                            }
                        }
                    }

                    this.loadValues()
            })
            .catch(err => {
                alert("An error occurred while loading the file. Is there any null value in the file?", bootstrapAlerts.DANGER)
                console.error("Error while loading file.\nError: " + err)
            })
        })

        inputFile.click()
    }

    public saveValuesButton() {
        const a = document.createElement("a")
        a.href = window.URL.createObjectURL(new Blob([JSON.stringify(this.getInstance().getValues())], { type: "application/json" }))
        a.download = "values.json"

        a.click()
    }

    public changeTool(tool: string) {
        this.waitForElement(this.toolSelectedSpanSelector).then(element => {
            switch(tool) {
                case "marker":
                    this.getInstance().tool = Tool.MARKER
                    element.innerHTML = "Marker"
                    break
                case "watercolor":
                    this.getInstance().tool = Tool.WATERCOLOR
                    element.innerHTML = "Watercolor"
                    break
                case "pixelPencil":
                    this.getInstance().tool = Tool.PIXEL_PENCIL
                    element.innerHTML = "Pixel Pencil"
                    break
                case "graphitePencil":
                    this.getInstance().tool = Tool.GRAPHITE_PENCIL
                    element.innerHTML = "Graphite Pencil"
                    break
                case "crayon":
                    this.getInstance().tool = Tool.CRAYON
                    element.innerHTML = "Crayon"
                    break
                default:
                    console.error("Invalid tool selected.")
            }

            this.getInstance().validateBrushSize()
            this.loadValues()
        })
    }

    private async addRangeListeners() {
        const ranges = await this.waitForElements(`input[valueRange]`)
        ranges.forEach(node => {
            node.addEventListener("input", e => {
                if (e.currentTarget instanceof Element) {
                    const parentElement = e.currentTarget.parentElement
                    this.waitForElement("span", parentElement)
                        .then(element => {
                            element.innerHTML = `${e.currentTarget["value"]}`
                            this.getInstance()[parentElement.parentElement.id] = parseInt(`${e.currentTarget["value"]}`)
                        })
                }
            })
        })
    }

    private async loadValues() {
        this.redefineBrushSizeRange()

        this.waitForElement(this.zoomAmountRangeSelector).then(element => element["value"] = this.getInstance().zoom)
        this.waitForElement(this.brushOpacityRangeSelector).then(element => element["value"] = this.getInstance().brushOpacity)
        this.waitForElement(this.toolSelectedSpanSelector).then(element => {
            let value: string

            switch(this.getInstance().tool) {
                case Tool.CRAYON:
                    value = "Crayon"
                    break
                case Tool.GRAPHITE_PENCIL:
                    value = "Graphite Pencil"
                    break
                case Tool.MARKER:
                    value = "Marker"
                    break
                case Tool.PIXEL_PENCIL:
                    value = "Pixel Pencil"
                    break
                case Tool.WATERCOLOR:
                    value = "Watercolor"
                    break
            }

            element.innerHTML = value
        })

        this.waitForElement(this.zoomAmountSpanSelector).then(element => element.innerHTML = `${this.getInstance().zoom}`)
        this.waitForElement(this.brushSizeSpanSelector).then(element => element.innerHTML = `${this.getInstance().brushSize}`)
        this.waitForElement(this.brushOpacitySpanSelector).then(element => element.innerHTML = `${this.getInstance().brushOpacity}`)
    }

    private async redefineBrushSizeRange() {
        const brushSize = await this.waitForElement(this.brushSizeRangeSelector)
        const currentTool = Object.keys(Tool)[Object.values(Tool).indexOf(this.getInstance().tool)]

        brushSize["min"] = `${ToolMinBrushSizeValue[currentTool]}`
        brushSize["max"] = `${ToolMaxBrushSizeValue[currentTool]}`
        brushSize["value"] = this.getInstance().brushSize > ToolMaxBrushSizeValue[currentTool] ? `${ToolMinBrushSizeValue[currentTool]}` : `${this.getInstance().brushSize}`
    }
}