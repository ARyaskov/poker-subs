export function matchFilters(fields: string[], obj: any, filter: any) {
  if (filter === undefined) {
    return true;
  }
  for (const fieldName of fields) {
    const fieldValue = obj?.[fieldName];

    if (fieldValue !== filter[fieldName]) {
      return false;
    }
  }

  return true;
}
