export function typeToCppKey(type) {
  if (!type || !type.kind) {
    throw new Error("Invalid type object");
  }

  if (type.kind === "primitive") {
    return type.name;
  }

  if (type.kind === "array") {
    return typeToCppKey(type.element) + "[]";
  }

  throw new Error("Unsupported type");
}
