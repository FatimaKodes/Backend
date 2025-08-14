class ApiError extends Error {
    constructor(
        statusCode,
        message = 'Something went wrong',
        errors = [],
        statck
    ) {
        super(message)
        this.message = message
        this.statusCode = statusCode
        this.errors = this.errors
        this.success = false
        this.data = null

        if (statck) {
            this.stack = statck
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}