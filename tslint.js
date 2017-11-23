module.exports = {
  defaultSeverity: "error",
  extends: [
    "tslint-config-airbnb"
  ],
  jsRules: {},
  rules: {
    "no-console": {
      "options": [
        "debug",
        "info",
        "log",
        "time",
        "timeEnd",
        "trace"
      ]
    },
    "trailing-comma": [false],
    "variable-name": [
      true,
      "allow-pascal-case",
      "allow-leading-underscore"
    ],
    "import-name": [false]
  },
  rulesDirectory: []
};