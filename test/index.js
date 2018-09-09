import test from 'tape';
import normalizable from '../src';
import {normalize} from 'normalizr';

@normalizable()
class Missing {}

@normalizable()
class Basic {
  number = 4;
  boolean = true;
}
Basic.schema = {
  type: 'entity',
  props: {
    number: {
      type: 'number',
      isRequired: true
    },
    boolean: {
      type: 'boolean',
      isRequired: true
    }
  }
};

@normalizable()
class Arr {
  numbers = [];
}
Arr.schema = {
  type: 'entity',
  collections: {
    numbers: {
      type: 'number'
    }
  }
};

@normalizable()
class CompoundProperty {
  basic;
}
CompoundProperty.schema = {
  type: 'entity',
  props: {
    basic: {
      type: Basic
    }
  }
};

@normalizable()
class CompoundCollection {
  basics = [];
}
CompoundCollection.schema = {
  type: 'entity',
  collections: {
    basics: {
      element: Basic
    }
  }
};

class Embedded {
  name;
}
Embedded.schema = {
  type: 'embedded',
  props: {
    name: {
      type: 'string'
    }
  }
};

@normalizable()
class EmbeddedProperty {
  embedded;
}
EmbeddedProperty.schema = {
  type: 'entity',
  props: {
    embedded: {
      type: Embedded
    }
  }
};

@normalizable()
class EmbeddedCollection {
  embeddeds = [];
}
EmbeddedCollection.schema = {
  type: 'entity',
  collections: {
    embeddeds: {
      element: Embedded
    }
  }
};

@normalizable({idAttribute: 'name'})
class Custom {
  name;
}
Custom.schema = {
  type: 'entity',
  props: {
    name: {
      type: 'string',
      isRequired: true
    }
  }
};

test('errors if schema is missing', t => {
  t.throws(() => Missing.normalizedSchema, /Missing schema/);
  t.end();
});

test('basic normalizable entity is correctly normalized', t => {
  const basic = {
    id: 123,
    wheels: 2,
    electric: false
  };
  const response = normalize(basic, Basic.normalizedSchema);

  t.equal(response.result, 123, 'the result contains a single id');
  t.equal(Object.keys(response.entities).length, 1, 'the result contains a single entity type');
  t.notEqual(typeof response.entities.basics, "'undefined'", 'the entity type is "basics"');
  t.equal(Object.keys(response.entities.basics).length, 1, 'there is a single basic entity');
  t.deepEqual(response.entities.basics[123], basic, 'the basic entity is identical');
  t.end();
});

test('normalizable entity with value array is correctly normalized', t => {
  const arr = {
    id: 123,
    numbers: [1, 2, 3, 4]
  };
  const response = normalize(arr, Arr.normalizedSchema);

  t.equal(response.result, 123, 'the result contains a single id');
  t.deepEqual(response.entities.arrs[123], arr, 'the entity is identical');
  t.end();
});

test('array of basic normalizable entities is correctly normalized', t => {
  const basics = [
    {
      id: 123,
      wheels: 2,
      electric: false
    },
    {
      id: 124,
      wheels: 4,
      electric: true
    }
  ];
  const response = normalize(basics, [Basic.normalizedSchema]);

  t.equal(response.result.length, 2, 'the result contains two ids');
  t.equal(Object.keys(response.entities.basics).length, 2, 'there are two single basic entities');
  t.end();
});

test('normalizable entity with compounded property is correctly normalized', t => {
  const basic = {
    id: 123,
    wheels: 2,
    electric: false
  };
  const compound = {id: 100, basic};
  const response = normalize(compound, CompoundProperty.normalizedSchema);

  t.equal(response.result, 100, 'the result contains a single id');
  t.equal(Object.keys(response.entities).length, 2, 'the result contains two entity types');
  t.notEqual(
    typeof response.entities.compoundproperties,
    'undefined',
    'the entity type "compoundproperties" exists'
  );
  t.notEqual(typeof response.entities.basics, 'undefined', 'the entity type "basics" exists');
  t.equal(
    Object.keys(response.entities.compoundproperties).length,
    1,
    'there is a single compound entity'
  );
  t.equal(Object.keys(response.entities.basics).length, 1, 'there is a single basic entity');
  t.deepEqual(
    response.entities.compoundproperties[100],
    {id: 100, basic: 123},
    'the compound entity is identical'
  );
  t.end();
});

test('normalizable entity with compounded collection is correctly normalized', t => {
  const basics = [
    {
      id: 124,
      wheels: 3,
      electric: false
    },
    {
      id: 125,
      wheels: 4,
      electric: true
    }
  ];
  const compound = {id: 100, basics};
  const response = normalize(compound, CompoundCollection.normalizedSchema);

  t.equal(response.result, 100, 'the result contains a single id');
  t.equal(Object.keys(response.entities).length, 2, 'the result contains two entity types');
  t.notEqual(
    typeof response.entities.compoundcollections,
    "'undefined'",
    'the entity type "compoundcollections" exists'
  );
  t.notEqual(typeof response.entities.basics, "'undefined'", 'the entity type "basics" exists');
  t.equal(
    Object.keys(response.entities.compoundcollections).length,
    1,
    'there is a single compound entity'
  );
  t.equal(Object.keys(response.entities.basics).length, 2, 'there are two basic entities');
  t.deepEqual(
    response.entities.compoundcollections[100],
    {id: 100, basics: [124, 125]},
    'the compound entity is identical'
  );
  t.end();
});

test('normalizable entity with embedded property is correctly normalized', t => {
  const embedded = {id: 123};
  const compound = {id: 100, embedded};
  const response = normalize(compound, EmbeddedProperty.normalizedSchema);

  t.equal(response.result, 100, 'the result contains a single id');
  t.equal(Object.keys(response.entities).length, 1, 'the result contains a single entity type');
  t.notEqual(
    typeof response.entities.embeddedproperties,
    'undefined',
    'the entity type "embeddedproperties" exists'
  );
  t.equal(
    Object.keys(response.entities.embeddedproperties).length,
    1,
    'there is a single compound entity'
  );
  t.deepEqual(
    response.entities.embeddedproperties[100],
    compound,
    'the compound entity is identical'
  );
  t.end();
});

test('normalizable entity with embedded collection is correctly normalized', t => {
  const embeddeds = [{id: 124}, {id: 125}];
  const compound = {id: 100, embeddeds};
  const response = normalize(compound, EmbeddedCollection.normalizedSchema);

  t.equal(response.result, 100, 'the result contains a single id');
  t.equal(Object.keys(response.entities).length, 1, 'the result contains a single entity type');
  t.notEqual(
    typeof response.entities.embeddedcollections,
    'undefined',
    'the entity type "embeddedcollections" exists'
  );
  t.equal(
    Object.keys(response.entities.embeddedcollections).length,
    1,
    'there is a single compound entity'
  );
  t.deepEqual(
    response.entities.embeddedcollections[100],
    compound,
    'the compound entity is identical'
  );
  t.end();
});

test('normalizable entity with custom id attribute is correctly normalized', t => {
  const custom = {name: 'custom'};
  const response = normalize(custom, Custom.normalizedSchema);

  t.equal(response.result, 'custom', 'the result contains a single id');
  t.equal(Object.keys(response.entities).length, 1, 'the result contains a single entity type');
  t.notEqual(typeof response.entities.customs, "'undefined'", 'the entity type is "customs"');
  t.equal(Object.keys(response.entities.customs).length, 1, 'there is a single custom entity');
  t.deepEqual(response.entities.customs['custom'], custom, 'the custom entity is identical');
  t.end();
});
