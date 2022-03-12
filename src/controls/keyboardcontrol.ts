const robot = require("robotjs")

robot.setKeyboardDelay(1)

export class KeyboardControl {

    /**
     * Types a string
     * @param value String to be typed
     */
    public static type(value: any) {
        robot.typeString(`${value}`)
    }

    /**
     * Simulates an enter button tap
     */
    public static enter() {
        robot.keyTap("enter")
    }

    /**
     * Simulates a delete button tap
     * @param amount The amount of times to tap. Default value is 1
     */
    public static delete(amount = 1) {
        for (let i = 0; i < amount; i++) {
            robot.keyTap("delete")
        }
    }
}
