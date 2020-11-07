// A recursive helper function for allowing state to update when changing complex/deeply nested objects
export const deepCopyFunction = (inObject) => {
  let outObject, value, key

  if(typeof inObject !== "object" || inObject === null) {
    return inObject;
  }

  outObject = Array.isArray(inObject) ? [] : {};
  for(key in inObject){
    value = inObject[key]
    outObject[key] = deepCopyFunction(value);
  }
  return outObject
}
