import fs from 'fs'
import { graphql } from 'graphql'

import { Translation } from './i18n'
import schema from './schema'

type Callback = (error: NodeJS.ErrnoException | null, data: string) => void

interface TranslationsQueryData {
  translations: Translation[]
}

jest.mock('fs')
jest.mock('../config', () => ({ locales: ['en'], translationsDir: 'dir' }))

const readFile = (path: string, _options: any, callback: Callback) => {
  const error: NodeJS.ErrnoException = new Error(
    `EACCES: permission denied, open '${path}'`
  )

  error.code = 'EACCES'
  error.errno = -4092
  error.path = path
  error.syscall = 'open'

  return callback(error, '')
}

describe('i18n', () => {
  describe('translations', () => {
    const source = `
      query TranslationsQuery {
        translations {
          id
          defaultMessage
          description
          files
          message
        }
      }
    `

    test('should return query metadata containing an error related to an unsupported locale', async () => {
      const { data, errors } = await graphql<TranslationsQueryData>({
        contextValue: { locale: 'es' },
        schema,
        source,
      })

      expect(data).toBeNull()
      expect(errors).toHaveLength(1)

      const { 0: { message = '' } = {} } = errors || []

      expect(message).toMatch("Locale 'es' not supported")
    })

    test('should return query metadata containing an array of locale translations', async () => {
      const translations: Translation[] = [
        {
          id: 'path.to.file.a',
          message: 'message a',
          defaultMessage: 'default message a',
          description: 'description a',
          files: ['path/to/file.ts'],
        },
      ]

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore TS2339
      fs.setMockFiles({ 'dir/en.json': JSON.stringify(translations) })

      const { data, errors } = await graphql<TranslationsQueryData>({
        contextValue: { locale: 'en' },
        schema,
        source,
      })

      expect(data).toMatchObject({ translations })
      expect(errors).toBeUndefined()

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore TS2339
      fs.resetMockFiles()
    })

    test('should return query metadata containing an error related to a non-existent locale file', async () => {
      const { data, errors } = await graphql<TranslationsQueryData>({
        contextValue: { locale: 'en' },
        schema,
        source,
      })

      expect(data).toBeNull()
      expect(errors).toHaveLength(1)

      const { 0: { message = '' } = {} } = errors || []

      expect(message).toMatch("Locale 'en' not found")
    })

    test('should return query metadata containing an empty array of locale translations', async () => {
      const { readFile: originalReadFile } = fs

      Object.defineProperty(fs, 'readFile', { value: readFile })

      const { data, errors } = await graphql<TranslationsQueryData>({
        contextValue: { locale: 'en' },
        schema,
        source,
      })

      expect(data).toMatchObject({ translations: [] })
      expect(errors).toBeUndefined()

      Object.defineProperty(fs, 'readFile', { value: originalReadFile })
    })
  })
})
