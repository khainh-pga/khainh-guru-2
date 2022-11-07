const glob = require('glob')
const path = require('path')
const yaml = require('js-yaml')
const fs   = require('fs')

module.exports = async () => {
  const tables = []

  await new Promise((resolve, reject) => {
    try {
      glob('src/**/resources/*.yml', { absolute: true }, function (er, files) {
        (files).forEach((file) => {
          const doc = yaml.load(fs.readFileSync(file, 'utf8'))

          Object.values(doc.Resources)
          .filter((r) => r.Type === 'AWS::DynamoDB::Table')
          .forEach(resource => {
            const table = resource.Properties
            const { TABLE } = require(path.resolve(path.dirname(file), '../databases'))

            table.TableName = TABLE
            tables.push(table)
          });
        })

        resolve()
      })
    } catch (e) {
      reject(e)
    }
  })

  return {
    tables,
    port: 8008
  }
}
