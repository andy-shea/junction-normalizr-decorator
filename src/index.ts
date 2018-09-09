import {schema} from 'normalizr';
import pluralize from 'pluralize';

function visit(target: any, options = {}): any {
  if (!target.schema) throw Error('Missing schema');
  const {type, props, collections} = target.schema;
  let schemaDefinition = {};
  if (props) {
    Object.assign(schemaDefinition, Object.keys(props).reduce((map: any, prop) => {
      const {type} = props[prop];
      if (type && type.schema) {
        const propSchema = (type.schema.type === 'entity' && type.normalizedSchema);
        map[prop] = propSchema || visit(type);
      }
      return map;
    }, {}));
  }
  if (collections) {
    Object.assign(schemaDefinition, Object.keys(collections).reduce((map: any, prop) => {
      const {element} = collections[prop];
      if (element) {
        const elementSchema = (element.schema.type === 'entity' && element.normalizedSchema);
        map[prop] = [elementSchema || visit(element)];
      }
      return map;
    }, {}));
  }
  if (type === 'entity') {
    const normalizedSchema = new schema.Entity(pluralize(target.name.toLowerCase()), {}, options);
    normalizedSchema.define(schemaDefinition);
    return normalizedSchema;
  }
  return schemaDefinition;
}

function normalizable(options = {}) {
  let schema: any;
  return (target: any) => {
    Object.defineProperty(target, 'normalizedSchema', {
      get: function normalizedSchema() {
        if (!schema) schema = visit(target, options);
        return schema;
      }
    });
  };
}

export default normalizable;
