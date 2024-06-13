

/**
 * Validation class
 */
export default class Validation {
    success: boolean;
    message: string;

    /**
     * Create a new validation object
     * @param success If successful or not
     * @param message The validation message, if validation failed
     */
    constructor(success: boolean = true, message: string = '') {
        this.success = success;
        this.message = message;
    }
}