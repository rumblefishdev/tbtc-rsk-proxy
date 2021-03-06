const responseFixes = require('./responseFixes')
const requestFixes = require('./requestFixes')
const logger = require('./logger')

const SocketProxy = require('./socketProxy')

module.exports = {
    inject: function(client, proxySocket) {
        const requestProxy = new SocketProxy()
        const responseProxy = new SocketProxy()

        logger.match = (process.env.MATCH_REQUESTS == 1)
        logger.mute = (process.env.MUTE_LOGGING == 1)

        responseProxy.editCallback = (json) => {
            logger.logResponse(json)
            responseFixes.apply(json)
        }

        requestProxy.editCallback = (json) => {
            logger.logRequest(json)
            requestFixes.apply(json)
        }

        const responseTransform = responseProxy.transform()
        const requestTransform = requestProxy.transform()

        client.pipe(requestTransform).pipe(proxySocket).pipe(responseTransform).pipe(client)
    }
}