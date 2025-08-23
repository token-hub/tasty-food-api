export function multipleErrorsHandler(err, req, res, next) {
    if (err.errors) {
        const errors = Object.entries(err.errors).map((err) => {
            return {
                [err[0]]: err[1].message
            };
        });
        return res.status(422).json({
            error: err._message,
            details: errors
        });
    } else {
        next(err);
    }
}
