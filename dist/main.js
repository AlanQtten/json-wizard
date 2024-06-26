var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import fs from "node:fs";
function cloneDeep(obj) {
  return JSON.parse(JSON.stringify(obj));
}
function buildJsonTree(obj, jt = []) {
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (typeof value === "boolean") {
      jt.push({ key, type: "boolean", resolvedValue: value });
    } else if (typeof value === "number") {
      jt.push({ key, type: "number", resolvedValue: value });
    } else if (typeof value === "string") {
      jt.push({ key, type: "string", resolvedValue: value });
    } else if (value === null) {
      jt.push({ key, type: "null", resolvedValue: value });
    } else if (Array.isArray(value)) {
      jt.push({ key, type: "array", resolvedValue: value });
    } else {
      jt.push({
        key,
        type: "json",
        resolvedValue: buildJsonTree(value)
      });
    }
  });
  return jt;
}
function deepSet(obj, key, value) {
  const _obj = cloneDeep(obj);
  let _ticker = _obj;
  const keyPath = key.split(".");
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

function deepDelete(obj, key) {
  const keyPath = key.split(".");
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
function deepGet(obj, key) {
  const keyPath = key.split(".");
  let targetValue = obj;
  while (keyPath.length) {
    targetValue = targetValue[keyPath.shift()];
  }
  return targetValue;
}
function formatJson(obj) {
  return JSON.stringify(obj, null, 2);
}
class Json {
  constructor(filePath, config) {
    __publicField(this, "filePath");
    __publicField(this, "config");
    __publicField(this, "resolvedJson");
    __publicField(this, "jsonObject");
    this.filePath = filePath;
    this.config = Object.assign(config ?? {}, {
      typeCheck: false
    });
    this.parse(filePath);
  }
  parse(filePath) {
    try {
      const content = fs.readFileSync(filePath).toString();
      const jsonObject = JSON.parse(content);
      this.resolvedJson = buildJsonTree(jsonObject);
      this.jsonObject = jsonObject;
    } catch (e) {
      console.log(e);
    }
  }
  get(key) {
    return deepGet(this.jsonObject, key);
  }
  set(key, value) {
    this.jsonObject = deepSet(this.jsonObject, key, value);
    this.resolvedJson = deepSet(this.resolvedJson, key, buildJsonTree(value));
    return this;
  }
  delete(key) {
    this.jsonObject = deepDelete(this.jsonObject, key);
    this.resolvedJson = deepDelete(this.resolvedJson, key);
    return this;
  }
  write(outputPath) {
    fs.writeFileSync(outputPath ?? this.filePath, formatJson(this.jsonObject));
  }
}
export {
  Json
};
