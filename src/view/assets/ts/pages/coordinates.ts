import { Point } from "../../../../types/point";
import { Page } from "../models/page";
import { values } from "../values";

export class Coordinates extends Page {

    private readonly yesMarkerHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="bi bi-check-lg green-svg" viewBox="0 0 16 16"><path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" /></svg>`
    private readonly noMarkerHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" class="bi bi-x-lg red-svg" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"/><path fill-rule="evenodd" d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"/></svg>`

    public run(): void {
        this.setSvgs()
        this.setListeners()
    }

    private async setSvgs(): Promise<void> {
        const inputDivs = await this.waitForElements("div [coordinateDiv]")

        inputDivs.forEach(async element => {
            if (element instanceof Element) {
                const id: string = element["id"]
                const svgPlace: Element = await this.waitForElement("span[svg-working]", element)

                if (values[id] != null) {
                    svgPlace.innerHTML = this.yesMarkerHtml
                } else {
                    svgPlace.innerHTML = this.noMarkerHtml
                }
            }
        })
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
                const listenerForInputs = async (e: Event) => {
                    let xValue: string
                    let yValue: string

                    if (e.currentTarget instanceof Element) {
                        xValue = e.currentTarget.parentElement.querySelector(`input[placeholder^="x"]`)["value"].trim()
                        yValue = e.currentTarget.parentElement.querySelector(`input[placeholder^="y"]`)["value"].trim()
                    }

                    if (parseInt(xValue) == NaN || parseInt(yValue) == NaN) {
                        svgPlace.innerHTML = this.noMarkerHtml
                    } else {
                        const point: Point = { x: parseInt(xValue), y: parseInt(yValue) }
                        values[id] = point

                        if (values[id] == null) {
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