'use strict'

const AWS = require('aws-sdk')
const crypto = require('crypto')

const { Product } = require('../../../database/models').default
const { extensionRegex, validate } = require('../../../utils').default
const {
  AWS_CLIENT_ACCESS_KEY,
  AWS_CLIENT_SECRET_KEY,
  AWS_REGION,
  AWS_S3_BUCKET
} = require('../../../../secrets.json')

const S3 = new AWS.S3({
  credentials: new AWS.Credentials({
    accessKeyId: AWS_CLIENT_ACCESS_KEY,
    secretAccessKey: AWS_CLIENT_SECRET_KEY
  }),
  region: AWS_REGION
})

const initUpload = extension =>
  S3.createMultipartUpload({
    Bucket: AWS_S3_BUCKET,
    Key:
      crypto
        .createHash('sha256')
        .update('' + Date.now() * Math.random())
        .digest('hex') + extension,
    ACL: 'public-read'
  }).promise()

const uploadPart = (PartNumber, upload, chunk) =>
  S3.uploadPart({
    Bucket: upload.Bucket,
    Key: upload.Key,
    Body: chunk,
    PartNumber,
    UploadId: upload.UploadId
  })
    .promise()
    .then(data => ({
      ...data,
      PartNumber
    }))

const completeUpload = (upload, Parts) =>
  S3.completeMultipartUpload({
    Bucket: upload.Bucket,
    Key: upload.Key,
    UploadId: upload.UploadId,
    MultipartUpload: { Parts }
  }).promise()

const endpointLogic = async (id, extension) => {
  let index = 1
  let parts = []
  let bigChunk = Buffer.alloc(0)

  const upload = await initUpload(extension)

  const handleError = res => () => {
    res.status(400).json({
      message: 'Something went wrong while uploading the file to the server'
    })
  }

  const handleData = res => async chunk => {
    if (bigChunk.length < 5242880) {
      bigChunk = Buffer.concat([bigChunk, chunk])
    } else {
      try {
        const part = uploadPart(index, upload, bigChunk.slice())
        bigChunk = Buffer.alloc(0)
        parts = [...parts, part]

        res.write(`${index}|`)
        index++
      } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Something went wrong...' })
      }
    }
  }

  const handleEnd = res => async () => {
    try {
      const part =
        bigChunk.length !== 0
          ? uploadPart(index, upload, bigChunk.slice())
          : null
      const Parts = await Promise.all(part !== null ? [...parts, part] : parts)
      const response = await completeUpload(upload, Parts)

      await Product.findOneAndUpdate(
        { _id: id },
        {
          $push: {
            media: {
              location: response.Location
            }
          }
        }
      )

      res.status(200).end(`${response.Location}`)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Something went wrong...' })
    }
  }

  return {
    handleEnd,
    handleData,
    handleError
  }
}

const action = async (req, res) => {
  const { id } = req.params
  const { 'x-file-name': fileName } = req.headers

  try {
    const error = validate('File name', fileName, extensionRegex)
    if (error) {
      res.status(400).json({ message: 'File name header not provided!' })
      return
    }
  } catch (error) {
    res.status(400).json({ message: 'File name header not provided!' })
    return
  }

  try {
    if (!(await Product.findById(id))) {
      res.status(404).json({ message: 'Product with given id not found' })
      return
    }

    const extension = fileName.match(extensionRegex)[0]
    const logic = await endpointLogic(id, extension)

    req.on('error', logic.handleError(res))
    req.on('data', logic.handleData(res))
    req.on('end', logic.handleEnd(res))
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400).json({ error: 'Invalid product ID' })
    } else {
      console.error(error)
      res.status(500).json({ error: 'Something went wrong...' })
    }
  }
}

exports.default = action
