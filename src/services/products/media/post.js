'use strict'

const AWS = require('aws-sdk')
const crypto = require('crypto')

const { Product } = require('../../../database/models').default
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

const initUpload = () =>
  S3.createMultipartUpload({
    Bucket: AWS_S3_BUCKET,
    Key: crypto
      .createHash('sha256')
      .update('' + Date.now() * Math.random())
      .digest('hex'),
    ACL: 'private'
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

const logic = async () => {
  let index = 1
  let parts = []
  let bigChunk = ''

  const upload = await initUpload()

  const handleError = res => () => {
    res.status(400).json({
      message: 'Something went wrong while uploading the file to the server'
    })
  }

  const handleData = res => async chunk => {
    if (bigChunk.length < 5000000) {
      bigChunk += chunk
    } else {
      try {
        const part = uploadPart(index, upload, bigChunk)
        bigChunk = ''
        parts = [...parts, part]

        res.write(`${index}|`)
        index++
      } catch (error) {
        res.status(500).json({ error: 'Something went wrong...' })
      }
    }
  }

  const handleEnd = res => async () => {
    try {
      const part = bigChunk !== '' ? uploadPart(index, upload, bigChunk) : null
      const Parts = await Promise.all(part !== null ? [...parts, part] : parts)
      const response = await completeUpload(upload, Parts)
      res.status(200).end(`${response.Location}`)
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong...' })
    }
  }

  return {
    handleError,
    handleData,
    handleEnd
  }
}

const action = async (req, res) => {
  const { id } = req.params

  try {
    if (!(await Product.findById(id))) {
      res.status(404).json({ message: 'Product with given id not found' })
      return
    }

    const { handleError, handleData, handleEnd } = await logic()

    req.on('error', handleError(res))
    req.on('data', handleData(res))
    req.on('end', handleEnd(res))
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400).json({ error: 'Invalid product ID' })
    } else {
      console.log(error)
      res.status(500).json({ error: 'Something went wrong...' })
    }
  }
}

exports.default = action
