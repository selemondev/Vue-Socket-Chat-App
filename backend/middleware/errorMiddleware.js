const errorMiddleware = (err, req, res, next ) => {
    const resStatusCode = res.statusCode ? res.statusCode : 500;
    res.status(resStatusCode);

    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })
};

module.exports = {
    errorMiddleware
}