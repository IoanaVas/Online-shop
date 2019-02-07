const assert = require('assert')
const crypto = require('crypto')
const {
  stripProperties,
  emailRegex,
  clientPasswordRegex,
  databasePasswordRegex,
  validate
} = require('../../src/utils').default

describe('Utils', function () {
  describe('Email regex', function () {
    const regex = emailRegex

    it('Should validate a propperly formatted e-mail', function (done) {
      // Arrange
      const email = 'mihai.bojescu@thinslices.com'
      const expected = true

      // Act
      const result = regex.test(email)

      // Assert
      assert.equal(result, expected)
      done()
    })

    it('Should validate a poorly formatted e-mail', function (done) {
      // Arrange
      const email = 'mihai.bojescu@thinslices'
      const expected = false

      // Act
      const result = regex.test(email)

      // Assert
      assert.equal(result, expected)
      done()
    })

    it('Should validate an empty e-mail', function (done) {
      // Arrange
      const email = ''
      const expected = false

      // Act
      const result = regex.test(email)

      // Assert
      assert.equal(result, expected)
      done()
    })

    it('Should validate an invalid string', function (done) {
      // Arrange
      const email = 'Learning project 📖'
      const expected = false

      // Act
      const result = regex.test(email)

      // Assert
      assert.equal(result, expected)
      done()
    })
  })

  describe('Client password regex', function () {
    const regex = clientPasswordRegex

    it('Should validate a properly formatted password', function (done) {
      // Arrange
      const password = 'properlyformattedpassword'
      const expected = true

      // Act
      const result = regex.test(password)

      // Assert
      assert.equal(result, expected)
      done()
    })

    it('Should validate a short password', function (done) {
      // Arrange
      const password = 'hello'
      const expected = false

      // Act
      const result = regex.test(password)

      // Assert
      assert.equal(result, expected)
      done()
    })
  })

  describe('Hashed client password regex', function () {
    const regex = databasePasswordRegex

    it('Should validate a good hash', function (done) {
      // Arrange
      const clientPassword = 'properlyformattedpassword'
      const password = crypto.createHash('sha256').update(clientPassword).digest('hex')
      const expected = true

      // Act
      const result = regex.test(password)

      // Assert
      assert.equal(result, expected)
      done()
    })

    it('Should validate a bad hash', function (done) {
      // Arrange
      const password = '123456789hash123456789'
      const expected = false

      // Act
      const result = regex.test(password)

      // Assert
      assert.equal(result, expected)
      done()
    })
  })

  describe('Strip properties', function () {
    let object = {}

    beforeEach(() => {
      object = {
        array: ['Dummy'],
        number: 42,
        object: { name: 'Dummy' },
        string: 'Dummy'
      }
    })

    it('Should strip properties properly', function (done) {
      // Arrange
      const properties = ['number', 'object']
      const expected = {
        array: ['Dummy'],
        string: 'Dummy'
      }

      // Act
      const result = stripProperties(properties, object)

      // Assert
      assert.deepEqual(result, expected)
      done()
    })

    it('Should strip no properties if the properties array is empty', function (done) {
      // Arrange
      const properties = []
      const expected = {
        object: { name: 'Dummy' },
        array: ['Dummy'],
        number: 42,
        string: 'Dummy'
      }

      // Act
      const result = stripProperties(properties, object)

      // Assert
      assert.deepEqual(result, expected)
      done()
    })

    it('Should strip no properties if the properties array has no key from the object', function (done) {
      // Arrange
      const properties = ['something']
      const expected = {
        array: ['Dummy'],
        number: 42,
        object: { name: 'Dummy' },
        string: 'Dummy'
      }

      // Act
      const result = stripProperties(properties, object)

      // Assert
      assert.deepEqual(result, expected)
      done()
    })

    it('Should strip all properties if the properties array has all the keys in the object', function (done) {
      // Arrange
      const properties = ['array', 'number', 'object', 'string']
      const expected = {}

      // Act
      const result = stripProperties(properties, object)

      // Assert
      assert.deepEqual(result, expected)
      done()
    })

    it('Should strip only the valid keys provided in the array', function (done) {
      // Arrange
      const properties = ['array', 'object', 'string', 'something']
      const expected = {
        number: 42
      }

      // Act
      const result = stripProperties(properties, object)

      // Assert
      assert.deepEqual(result, expected)
      done()
    })
  })

  describe('Validate input', function () {
    it('Should pass when the input is valid', function (done) {
      // Arrange
      const email = 'mihai.bojescu@thinslices.com'
      const password = '12345678'
      const username = 'MihaiBojescu'
      const expected = ''

      // Act
      const result = validate(email, password, username)

      // Assert
      assert.equal(result, expected)
      done()
    })

    it('Should return that e-mail is invalid when it is invalid', function (done) {
      // Arrange
      const email = 'mihai.bojescu@thinslices'
      const password = '12345678'
      const username = 'MihaiBojescu'
      const expected = 'E-mail is invalid\n'

      // Act
      const result = validate(email, password, username)

      // Assert
      assert.equal(result, expected)
      done()
    })

    it('Should return that e-mail is invalid when it is missing', function (done) {
      // Arrange
      const email = ''
      const password = '12345678'
      const username = 'MihaiBojescu'
      const expected = 'E-mail is invalid\n'

      // Act
      const result = validate(email, password, username)

      // Assert
      assert.equal(result, expected)
      done()
    })

    it('Should return that password is invalid when it is invalid', function (done) {
      // Arrange
      const email = 'mihai.bojescu@thinslices.com'
      const password = '123'
      const username = 'MihaiBojescu'
      const expected = 'Password is invalid\n'

      // Act
      const result = validate(email, password, username)

      // Assert
      assert.equal(result, expected)
      done()
    })

    it('Should return that password is invalid when it is missing', function (done) {
      // Arrange
      const email = 'mihai.bojescu@thinslices.com'
      const password = ''
      const username = 'MihaiBojescu'
      const expected = 'Password is invalid\n'

      // Act
      const result = validate(email, password, username)

      // Assert
      assert.equal(result, expected)
      done()
    })

    it('Should return that username is invalid when it is missing', function (done) {
      // Arrange
      const email = 'mihai.bojescu@thinslices.com'
      const password = '12345678'
      const username = ''
      const expected = 'Username is invalid\n'

      // Act
      const result = validate(email, password, username)

      // Assert
      assert.equal(result, expected)
      done()
    })

    it('Should return that e-mail and password are invalid when they are invalid', function (done) {
      // Arrange
      const email = 'mihai.bojescu@thinslices'
      const password = '123'
      const username = 'MihaiBojescu'
      const expected = 'E-mail is invalid\nPassword is invalid\n'

      // Act
      const result = validate(email, password, username)

      // Assert
      assert.equal(result, expected)
      done()
    })

    it('Should return that e-mail and username are invalid when they are invalid', function (done) {
      // Arrange
      const email = 'mihai.bojescu@thinslices'
      const password = '12345678'
      const username = ''
      const expected = 'E-mail is invalid\nUsername is invalid\n'

      // Act
      const result = validate(email, password, username)

      // Assert
      assert.equal(result, expected)
      done()
    })

    it('Should return that password and username are invalid when they are invalid', function (done) {
      // Arrange
      const email = 'mihai.bojescu@thinslices.com'
      const password = '123'
      const username = ''
      const expected = 'Password is invalid\nUsername is invalid\n'

      // Act
      const result = validate(email, password, username)

      // Assert
      assert.equal(result, expected)
      done()
    })

    it('Should return that e-mail, password and username are invalid when they are invalid', function (done) {
      // Arrange
      const email = 'mihai.bojescu@thinslices'
      const password = '123'
      const username = ''
      const expected = 'E-mail is invalid\nPassword is invalid\nUsername is invalid\n'

      // Act
      const result = validate(email, password, username)

      // Assert
      assert.equal(result, expected)
      done()
    })
  })
})
