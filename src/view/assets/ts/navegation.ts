// Navegation used for keeping the SPA
// Self invoked
(function () {
    function navThroughAjax(hash: string) {
        if (!hash) return

        const link = document.querySelector(`[rPage="${hash}"]`)
        if (!link) return

        const destiny = document.querySelector("main")

        // Gets the destiny page content using Fetch API
        const url = hash.substring(1)
        fetch(url)
            .then(resp => resp.text())
            .then(html => {
                destiny.innerHTML = html
            })
    }

    function configLinks() {
        document.querySelectorAll("[rPage]")
            .forEach(link => {
                link.setAttribute("href", link.attributes["rPage"].value)
            })
    }

    function initialNav() {
        if (location.hash) {
            navThroughAjax(location.hash)
        } else {
            const firstLink = document.querySelector("[rPage]")
            navThroughAjax(firstLink.getAttribute("hash"))
        }
    }

    window.onhashchange = event => navThroughAjax(location.hash)

    configLinks()
    initialNav()
})()