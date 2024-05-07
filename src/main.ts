import fs from 'node:fs';

type JsonConfig = {
  typeCheck: boolean;
};

type JsonTreeNode = {
  key: string;
  type: 'number' | 'string' | 'boolean' | 'null' | 'array' | 'json';
  resolvedValue: number | string | boolean | null | Array<any> | JsonTree;
};

type JsonTree = JsonTreeNode[];

function cloneDeep(obj: object) {
  return JSON.parse(JSON.stringify(obj));
}

function buildJsonTree(obj: object, jt: JsonTree = []): JsonTree {
  Object.keys(obj).forEach((key) => {
    const value = obj[key];

    if (typeof value === 'boolean') {
      jt.push({ key, type: 'boolean', resolvedValue: value });
    } else if (typeof value === 'number') {
      jt.push({ key, type: 'number', resolvedValue: value });
    } else if (typeof value === 'string') {
      jt.push({ key, type: 'string', resolvedValue: value });
    } else if (value === null) {
      jt.push({ key, type: 'null', resolvedValue: value });
    } else if (Array.isArray(value)) {
      jt.push({ key, type: 'array', resolvedValue: value });
    } else {
      jt.push({
        key,
        type: 'json',
        resolvedValue: buildJsonTree(value),
      });
    }
  });

  return jt;
}

function deepSet(obj: object, key: string, value: any) {
  const _obj = cloneDeep(obj);

  let _ticker = _obj;
  const keyPath = key.split('.');

  while (keyPath.length >= 1) {
    const _key = keyPath.shift();

    if (keyPath.length === 0) {
      _ticker[_key] = value;
    } else {
      _ticker = _ticker[_key];
    }
  }

  return _obj;
}

function deepDelete(obj: object, key: string) {
  const keyPath = key.split('.');
  const _obj = cloneDeep(obj);

  let _ticker = _obj;
  while (keyPath.length >= 1) {
    const _key = keyPath.shift();

    if (keyPath.length === 0) {
      delete _ticker[_key];
    } else {
      _ticker = _ticker[_key];
    }
  }

  return _obj;
}

function deepGet(obj: object, key: string): any {
  const keyPath = key.split('.');

  let targetValue = obj;
  while (keyPath.length) {
    targetValue = targetValue[keyPath.shift()];
  }

  return targetValue;
}

function formatJson(obj: object): any {
  return JSON.stringify(obj, null, 2);
}

export class Json {
  filePath: string;

  config: JsonConfig;

  resolvedJson: JsonTree;

  jsonObject: object;

  constructor(filePath: string, config?: JsonConfig) {
    this.filePath = filePath;
    this.config = Object.assign(config ?? {}, {
      typeCheck: false,
    });

    this.parse(filePath);
  }

  private parse(filePath: string) {
    try {
      const content = fs.readFileSync(filePath).toString();
      const jsonObject = JSON.parse(content);

      this.resolvedJson = buildJsonTree(jsonObject);
      this.jsonObject = jsonObject;
    } catch (e) {
      console.log(e);
    }
  }

  get(key: string) {
    return deepGet(this.jsonObject, key);
  }

  set(key: string, value: any) {
    this.jsonObject = deepSet(this.jsonObject, key, value);
    this.resolvedJson = deepSet(this.resolvedJson, key, buildJsonTree(value));
    return this;
  }

  delete(key: string) {
    this.jsonObject = deepDelete(this.jsonObject, key);
    this.resolvedJson = deepDelete(this.resolvedJson, key);
    return this;
  }

  write(outputPath?: string) {
    fs.writeFileSync(outputPath ?? this.filePath, formatJson(this.jsonObject));
  }
}
