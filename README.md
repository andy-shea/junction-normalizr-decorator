# Junction Normalizr Decorator
**Requirements:** Node.js 6+

Map your Junction entity schema to an output suitable for normalizr

## Install

```npm install junction-normalizr-decorator --save```

## Usage

Decorate your schema-defined entities with `@normalizable([options])` and access the normalizr schema via the `normalizedSchema` getter.
The options parameter, if provided, is passed as the second argument to the normalizr schema.

```
@normalizable()
class Car {

  wheels = 4;
  electric = true;

}

Car.schema = {
  type: 'entity',
  props: {
    wheels: {
      type: 'number',
      isRequired: true
    },
    electric: {
      type: 'boolean',
      isRequired: true
    }
  }
}

const response = normalize(fetchCars(), Car.normalizedSchema);
```

## Licence

[MIT](./LICENSE)
