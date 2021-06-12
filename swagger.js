import swaggerAutogen from 'swagger-autogen'

const outputFile = './swagger_output.json'
const endpointsFiles = ['./routes/account.routes.js']

swaggerAutogen()(outputFile, endpointsFiles)