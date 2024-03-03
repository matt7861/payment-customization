// @ts-check

// Use JSDoc annotations for type safety
/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

/**
 * @type {FunctionRunResult}
 */
const NO_CHANGES = {
  operations: [],
};

// The configured entrypoint for the 'purchase.payment-customization.run' extension target
/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  // Check if any product in the cart has the custom.hide_payment metafield set to "true"
  const hidePaymentMethodRequired = input.cart.lines.some(
    (line) =>
      line.merchandise.__typename === "ProductVariant" &&
      line.merchandise.product.metafield &&
      line.merchandise.product.metafield.value === "true",
  );

  // If no product requires the Afterpay payment method to be hidden, return with no operations.
  if (!hidePaymentMethodRequired) {
    console.error("No product requires hiding the Afterpay payment method.");
    return NO_CHANGES;
  }

  // Find the Afterpay payment method among the available payment methods.
  const hidePaymentMethod = input.paymentMethods.find((method) =>
    method.name.includes("Afterpay"),
  );

  // If the Afterpay payment method is not found, return with no operations.
  if (!hidePaymentMethod) {
    console.error("Afterpay payment method not found.");
    return NO_CHANGES;
  }

  // Return an operation to hide the Afterpay payment method if the conditions are met.
  return {
    operations: [
      {
        hide: {
          paymentMethodId: hidePaymentMethod.id,
        },
      },
    ],
  };
}
