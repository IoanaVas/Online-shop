'use strict'

const AWS = require('aws-sdk')
const crypto = require('crypto')

const { Product } = require('../../../database/models').default
const { extensionRegex, validate } = require('../../../utils').default
const {
  SECRET_ACCESS_KEY,
  ACCESS_KEY_ID,
  AWS_REGION,
  S3_BUCKET_NAME
} = require('../../../../secrets.json')

const s3 = new AWS.S3({
  credentials: new AWS.Credentials({
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY
  }),
  region: AWS_REGION
})

const createMultipartUpload = async (s3, fileName) => {
  const extension = fileName.match(extensionRegex)[0]
  const params = {
    Bucket: S3_BUCKET_NAME,
    Key: crypto
      .createHash('sha256')
      .update(fileName)
      .digest('hex') + extension
  }

  try {
    const result = await s3.createMultipartUpload(params).promise()

    return result
  } catch (error) {
    console.error(error)

    throw error
  }
}

const uploadPart = (s3, params, index) => {
  return s3.uploadPart(params).promise()
    .then(eTag => {
      eTag.PartNumber = index
      return eTag
    })
}

const completeMultipartUpload = async (s3, params) => {
  try {
    const result = await s3.completeMultipartUpload(params).promise()

    return result
  } catch (error) {
    console.error(error)

    throw error
  }
}

const action = async (req, res) => {
  const { id } = req.params
  const fileName = req.headers['x-file-name']
  const error = validate('File name', fileName, extensionRegex)

  let bigChunk = Buffer.alloc(0)
  let index = 1
  let multipartMap = { Parts: [] }

  if (error) {
    res.status(400).json({ error: 'File name not provided' })
    return
  }

  try {
    if (!(await Product.findById(id))) {
      return
    }
    const createdMultipartUpload = await createMultipartUpload(s3, fileName)

    req.on('data', async (chunk) => {
      if (bigChunk.length < 1024 * 1024 * 5) {
        bigChunk = Buffer.concat([bigChunk, chunk])
      } else {
        const updatePartParams = {
          ...createdMultipartUpload,
          Body: bigChunk.slice(),
          PartNumber: index
        }

        try {
          const eTag = uploadPart(s3, updatePartParams, index)
          multipartMap.Parts.push(eTag)
          index++
        } catch (error) {
          console.error(error)

          throw error
        }

        bigChunk = Buffer.alloc(0)
      }
    })

    req.on('end', async () => {
      if (bigChunk.length !== 0) {
        const updatePartParams = {
          ...createdMultipartUpload,
          Body: bigChunk,
          PartNumber: index
        }

        try {
          const eTag = uploadPart(s3, updatePartParams, index)
          multipartMap.Parts.push(eTag)
        } catch (error) {
          console.error(error)

          throw error
        }

        let completeUploadParams = {
          Bucket: createdMultipartUpload.Bucket,
          Key: createdMultipartUpload.Key,
          UploadId: createdMultipartUpload.UploadId,
          MultipartUpload: multipartMap
        }

        try {
          completeUploadParams.MultipartUpload.Parts = await Promise.all(multipartMap.Parts)
        } catch (error) {
          console.error(error)

          throw error
        }

        const completedUpload = await completeMultipartUpload(s3, completeUploadParams)

        try {
          const result = await Product.findOneAndUpdate({ _id: id }, { $push: { media: completedUpload.Location } })

          res.status(200).json({ data: result })
        } catch (error) {
          throw error
        }
      }
    })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).json({ error: 'Invalid product ID' })
    } else {
      console.error(error)
      res.status(500).json({ error: 'Something went wrong...' })
    }
    return error
  }
}

exports.default = action
