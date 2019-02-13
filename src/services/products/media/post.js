'use strict'

const aws = require('aws-sdk')

const { Product } = require('../../../database/models').default
const {
  SECRET_ACCESS_KEY,
  ACCESS_KEY_ID,
  AWS_REGION,
  S3_BUCKET_NAME
} = require('../../../../secrets.json')

aws.config.update({
  secretAccessKey: SECRET_ACCESS_KEY,
  accessKeyId: ACCESS_KEY_ID,
  region: AWS_REGION
})

const s3 = new aws.S3()

let params = {
  Bucket: S3_BUCKET_NAME,
  Key: 'updatedMedia'
}

let multipartMap = { Parts: [] }
let a = 0

const createMultipartUpload = async (s3, params) => {
  try {
    const result = await s3.createMultipartUpload(params).promise()

    return result
  } catch (error) {
    console.error(error)
  }
}

const uploadPart = async (s3, params) => {
  try {
    const result = await s3.uploadPart(params).promise()
    multipartMap.Parts[a].ETag = result.ETag
    a++

    return result
  } catch (error) {
    console.error(error)
  }
}

const completeMultipartUpload = async (s3, params) => {
  const result = await s3.completeMultipartUpload(params).promise()

  return result
}

const action = async (req, res) => {
  const { id } = req.params
  let bigChunk = ''
  let index = 0

  const createdMultipartUpload = await createMultipartUpload(s3, params)

  req.on('data', async (chunk) => {
    if (bigChunk.length < 1024 * 1024 * 5) {
      bigChunk += chunk
    } else {
      index++

      const updatePartParams = {
        ...createdMultipartUpload,
        Body: bigChunk.slice(),
        PartNumber: index
      }

      bigChunk = Buffer.alloc(0)

      multipartMap.Parts.push({
        PartNumber: index
      })

      await uploadPart(s3, updatePartParams)
      if (a === multipartMap.Parts.length) {
        console.log(a, multipartMap.Parts.length)
        const completeUploadParams = {
          ...params,
          UploadId: createdMultipartUpload.UploadId,
          MultipartUpload: multipartMap
        }
        console.log('params', completeUploadParams.MultipartUpload)

        try {
          const result = await completeMultipartUpload(s3, completeUploadParams)

          console.log(result)
        } catch (error) {
          console.error(error)
        }
      }
    }
  })
}

exports.default = action
