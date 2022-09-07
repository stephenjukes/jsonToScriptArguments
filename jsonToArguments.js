const jsonSection = document.getElementById('json');
const results = document.getElementById('results');
const convert = document.getElementById('convert');
const delimiter = '\n';

convert.addEventListener('click', convertToScriptArguments);

function convertToScriptArguments() {
  const jsonString = jsonSection.value;
  if (!jsonString) return;
  
  const json = JSON.parse(jsonString);
  const result = convertToResult(json);
  results.value = result.join(delimiter);
}

function convertToResult(kvp) {  
  const isRoot = kvp instanceof Object && !Array.isArray(kvp);
  if (isRoot) {
    return Object.entries(kvp)
      .map(kv => convertToResult(kv))
      .flat();
  }
  
  const key = kvp[0];
  const value = kvp[1];
  
  if (!(value instanceof Object)) {
    const typedValue = typeof value === 'string' ? `\"${ value }\"` : value;
    return `--${ key }=${ typedValue }`;
  }
  
  if (Array.isArray(value)) {
    return value
      .map((v, i) => convertToResult([`${ key }:${ i }`, v]))
      .flat();
  }
 
  // value is object
  return Object.entries(value)
    .map(kv => convertToResult([`${ key }:${ kv[0] }`, kv[1]]))
    .flat();
}