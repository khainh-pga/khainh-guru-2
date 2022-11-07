const glob = require('glob')
const path = require('path')
const yaml = require('js-yaml')
const fs   = require('fs')

module.exports = async () => {
  const tables = []
  const GetAttYamlType = new yaml.Type('!GetAtt', { kind: 'scalar' });
  const NEW_SCHEMA = yaml.DEFAULT_SCHEMA.extend([ GetAttYamlType ])

  await new Promise((resolve, reject) => {
    try {
      glob('../dynamoDB.yml', { absolute: true }, function (er, files) {
        (files).forEach((file) => {
          const doc = yaml.load(fs.readFileSync(file, 'utf8'), { schema: NEW_SCHEMA })

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
