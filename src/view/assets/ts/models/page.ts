export abstract class Page {

    protected waitForElement(selector: string, baseElement: Document | Element = document): Promise<Element> {
        return new Promise(resolve => {
            if (baseElement.querySelector(selector)) {
                return resolve(baseElement.querySelector(selector))
            }

            const observer = new MutationObserver(mutations => {
                if (baseElement.querySelector(selector)) {
                    resolve(baseElement.querySelector(selector))
                    observer.disconnect()
                }
            })

            observer.observe(baseElement, {
                childList: true,
                subtree: true
            })
        })
    }

    protected waitForElements(selector: string, baseElement: Document | Element = document): Promise<NodeList> {
        return new Promise(resolve => {
            if (baseElement.querySelectorAll(selector).length > 0) {
                return resolve(baseElement.querySelectorAll(selector))
            }

            const observer = new MutationObserver(mutations => {
                if (baseElement.querySelectorAll(selector).length > 0) {
                    resolve(baseElement.querySelectorAll(selector))
                    observer.disconnect()
                }
            })

            observer.observe(baseElement, {
                childList: true,
                subtree: true
            })
        })
    }

    protected replaceAt(string: string, value: string, index: number) {
        if (index > string.length -1) return string
        return string.substring(0, index) + value + string.substring(index + 1)
    }

    abstract run(): void;
}