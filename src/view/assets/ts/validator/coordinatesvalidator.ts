export function validateCoordinate(x: number, y: number) {
    const w = window.screen.width // Screen width
    const h = window.screen.height // Screen height

    return x >= 0 && x < w && y >= 0 && y < h
}