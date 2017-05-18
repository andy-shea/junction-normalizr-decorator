# Junction Normalizr Decorator

[![Build Status](https://travis-ci.org/andy-shea/junction-normalizr-decorator.svg?branch=master)](https://travis-ci.org/andy-shea/junction-normalizr-decorator)
[![Code Coverage](http://codecov.io/github/andy-shea/junction-normalizr-decorator/coverage.svg?branch=master)](http://codecov.io/github/andy-shea/junction-normalizr-decorator?branch=master)

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
