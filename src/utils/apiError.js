class ApiError extends Error {
    constructor(
        message = "Something went wrong", 
        statusCode,
        errors =[],
        stack = "",
    ) {
        super(message); // Call the parent constructor with the message
        this.statusCode = statusCode // Default to 500 if no status code is provided
        this.data = null // Initialize data as null
        this.message = message
        this.success = false // Initialize success as false
        this.errors = errors

        if(stack) {
            this.stack = stack; // Assign the stack trace if provided
        } else {
            Error.captureStackTrace(this, this.constructor); // Capture the stack trace if not provided
        }
    }
}

// if any api error occurs we can use this class to throw error with custom message and status code

export { ApiError };