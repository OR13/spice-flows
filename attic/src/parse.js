import yaml from 'yaml'

export const parse = (yamlString) => {
  const parsed = yaml.parse(yamlString)
  return parsed
}

