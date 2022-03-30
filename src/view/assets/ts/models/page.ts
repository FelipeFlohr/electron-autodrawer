/**
 * Abstract class that represents logic for a page.
 */
export abstract class Page {

    /**
     * Wait for an element to appear on the page, then returns it.
     * @param selector CSS selector to get the element.
     * @param baseElement The scope to search for the element. Default scope is "document".
     * @returns Element if found.
     */
    protected waitForElement(selector: string, baseElement: Document | Element = document): Promise<Element> {
        return new Promise(resolve => {
            if (baseElement.querySelector(selector)) {
                return resolve(baseElement.querySelector(selector))
            }

            const observer = new MutationObserver(() => {
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

    /**
     * Wait for elements to appear on the page, then return them as a Node List.
     * @param selector CSS selector to the elements.
     * @param baseElement The scope to search for the element. Default scope is "document".
     * @returns A Node List if elements were found.
     */
    protected waitForElements(selector: string, baseElement: Document | Element = document): Promise<NodeList> {
        return new Promise(resolve => {
            if (baseElement.querySelectorAll(selector).length > 0) {
                return resolve(baseElement.querySelectorAll(selector))
            }

            const observer = new MutationObserver(() => {
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

    /**
     * Replaces a char at a specified index.
     * @param string String which a char will be replaced.
     * @param value Char you want to place.
     * @param index Index which the char will be replaced
     * @returns The string with the replaced char.
     */
    protected replaceAt(string: string, value: string, index: number) {
        if (index > string.length -1) return string
        return string.substring(0, index) + value + string.substring(index + 1)
    }

    /**
     * Similar to a constructor, but can be dealt in an async way. Must be implemented in each child.
     */
    abstract run(): void;
}