/**
 * Config for production
 * Config options module to be imported by the other modules to use for consistency.
 */

// Using this instead of es6 module syntax for easier export syntax + import destructuring.
module.exports = {
  // URL cannot have ending slash "/"
  // @todo To update URL once domain is fixed
  apiUrl: "https://goalie.api.enkeldigital.com",
  // @todo Change to error service
  errorApiEndpoint: "https://goalie.api.enkeldigital.com/error",
};
