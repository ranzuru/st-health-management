// filterUtils.js
function translateFiltersToMongoQuery(filters) {
  const query = {};
  filters.items.forEach((filter) => {
    const { columnField, operatorValue, value } = filter;

    // Ensure that the filter has a value and a field to operate on
    if (!columnField || value === undefined || value === null || value === "")
      return;

    switch (operatorValue) {
      case "contains":
        query[columnField] = { $regex: escapeRegExp(value), $options: "i" };
        break;
      case "equals":
        query[columnField] = value;
        break;
      case "startsWith":
        query[columnField] = {
          $regex: `^${escapeRegExp(value)}`,
          $options: "i",
        };
        break;
      case "endsWith":
        query[columnField] = {
          $regex: `${escapeRegExp(value)}$`,
          $options: "i",
        };
        break;
      case "greaterThan":
      case "greaterThanOrEqual":
      case "lessThan":
      case "lessThanOrEqual":
        // For these operators, assume the value is a number or a date.
        // If it's a date, it should be passed as a string in ISO format.
        if (isValidDate(value)) {
          const dateValue = new Date(value);
          query[columnField] = {
            [`$${
              operatorValue === "greaterThan"
                ? "gt"
                : operatorValue === "greaterThanOrEqual"
                ? "gte"
                : operatorValue === "lessThan"
                ? "lt"
                : "lte"
            }`]: dateValue,
          };
        } else if (typeof value === "number") {
          query[columnField] = {
            [`$${operatorValue}`]: value,
          };
        }
        break;
      default:
        // Handle any filters that do not match the above cases
        // This could log an error, throw an exception, or handle a default behavior
        console.log(
          `Unhandled filter operator: ${operatorValue} for field: ${columnField}`
        );
        break;
    }
  });
  return query;
}

// Utility function to escape special characters for use in regex
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Utility function to check if a string is an ISO date
function isValidDate(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
  return regex.test(dateString);
}

module.exports = {
  translateFiltersToMongoQuery,
};
