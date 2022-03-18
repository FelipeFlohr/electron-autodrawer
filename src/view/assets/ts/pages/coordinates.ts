import { Point } from "../../../../types/point";
import { Page } from "../models/page";
import defaultPositions from "../../../../json/defaultpositions.json"
import { Positions } from "../../../../types/positions";
import { Settings } from "../settings";

const positionValues = Settings.getInstance().positions

export class Coordinates extends Page {

    private readonly yesMarkerHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="bi bi-check-lg green-svg" viewBox="0 0 16 16"><path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" /></svg>`
    private readonly noMarkerHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" class="bi bi-x-lg red-svg" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"/><path fill-rule="evenodd" d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"/></svg>`

    public run(): void {
        this.setSvgs()
        this.setListeners()
        this.loadValues()
    }

    public async loadDefaultValues(): Promise<void> {
        const inputDivs = await this.waitForElements("div [coordinateDiv]")

        inputDivs.forEach(async element => {
            if (element instanceof Element) {
                const svgPlace = await this.waitForElement("span[svg-working]", element)
                const xInput = await this.waitForElement(`input[placeholder^="x"]`, element)
                const yInput = await this.waitForElement(`input[placeholder^="y"]`, element)
                const id = element.id

                xInput.setAttribute("value", defaultPositions[id].x)
                xInput["value"] = defaultPositions[id].x

                yInput.setAttribute("value", defaultPositions[id].y)
                yInput["value"] = defaultPositions[id].y

                await this.setSvg(svgPlace, xInput, yInput, id)
            }
        })
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

        inputFile.addEventListener("change", e => {
            const fileNotParsed = inputFile.files[0]
            fileNotParsed.text()
                .then(text => {
                    const positions: Positions = JSON.parse(text)

                    let allValidKeys = true
                    for (let key in positionValues) {
                        if (key.startsWith("_")) key = this.replaceAt(key, "", 0)
                        if (typeof(positionValues[key]) === "object" && positions[key] == undefined) {
                            allValidKeys = false
                            alert(`Property ${key} is missing on the JSON file.`, bootstrapAlerts.DANGER)
                        }
                    }

                    if (allValidKeys) {
                        alert("File loaded.", bootstrapAlerts.SUCCESS)

                        for (let key in positions) {
                            positionValues[key] = positions[key]
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
        a.href = window.URL.createObjectURL(new Blob([JSON.stringify(positionValues.getPositions())], { type: "application/json" }))
        a.download = "positions.json"

        a.click()
    }

    private async loadValues() {
        const inputDivs = await this.waitForElements("div [coordinateDiv]")

        inputDivs.forEach(async element => {
            if (element instanceof Element) {
                const id: string = element.id
                const xInput = await this.waitForElement(`input[placeholder^="x"]`, element)
                const yInput = await this.waitForElement(`input[placeholder^="y"]`, element)
                const point: Point = positionValues[id]

                xInput["value"] = point == null ? "" : `${point.x}`
                yInput["value"] = point == null ? "" : `${point.y}`
            }
        })

        await this.setSvgs()
    }

    private async setSvgs(): Promise<void> {
        const inputDivs = await this.waitForElements("div [coordinateDiv]")

        inputDivs.forEach(async element => {
            if (element instanceof Element) {
                const id: string = element["id"]
                const svgPlace: Element = await this.waitForElement("span[svg-working]", element)

                if (positionValues[id] != null) {
                    svgPlace.innerHTML = this.yesMarkerHtml
                } else {
                    svgPlace.innerHTML = this.noMarkerHtml
                }
            }
        })
    }

    private async setSvg(svgPlace: Element, xInput: Element, yInput: Element, id: string): Promise<void> {
        if (parseInt(xInput["value"]) == NaN && parseInt(yInput["value"]) == NaN) {
            svgPlace.innerHTML = this.noMarkerHtml
        } else {
            const xValue = xInput["value"]
            const yValue = yInput["value"]

            const point: Point = { x: parseInt(xValue), y: parseInt(yValue) }
            positionValues[id] = point

            if (positionValues[id] == null) {
                svgPlace.innerHTML = this.noMarkerHtml
            } else {
                svgPlace.innerHTML = this.yesMarkerHtml
            }
        }
    }

    private async setListeners(): Promise<void> {
        const inputDivs = await this.waitForElements("div [coordinateDiv]")

        // Adding listeners to each div
        inputDivs.forEach(async element => {
            if (element instanceof Element) {
                const svgPlace = await this.waitForElement("span[svg-working]", element)
                const xInput = await this.waitForElement(`input[placeholder^="x"]`, element)
                const yInput = await this.waitForElement(`input[placeholder^="y"]`, element)
                const id = element.id
                const isNumeric = (value: string) => {
                    const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
                    const valueSpread = [...value]
                    return valueSpread.every(e => numbers.includes(e))
                }

                const listenerForInputs = async (e: Event) => {
                    let xValue: string
                    let yValue: string

                    if (e.currentTarget instanceof Element) {
                        xValue = e.currentTarget.parentElement.querySelector(`input[placeholder^="x"]`)["value"].trim()
                        yValue = e.currentTarget.parentElement.querySelector(`input[placeholder^="y"]`)["value"].trim()
                    }

                    if (parseInt(xValue) == NaN || parseInt(yValue) == NaN || !isNumeric(xValue) || !isNumeric(yValue)) {
                        svgPlace.innerHTML = this.noMarkerHtml
                    } else {
                        const point: Point = { x: parseInt(xValue), y: parseInt(yValue) }
                        positionValues[id] = point

                        if (positionValues[id] == null || !positionValues[id].x || !positionValues[id].y) {
                            svgPlace.innerHTML = this.noMarkerHtml
                        } else {
                            svgPlace.innerHTML = this.yesMarkerHtml
                        }
                    }
                }

                xInput.addEventListener("input", listenerForInputs)
                yInput.addEventListener("input", listenerForInputs)
            }
        })
    }
}

export enum bootstrapAlerts {
    SUCCESS = "alert-success",
    DANGER = "alert-danger"
}