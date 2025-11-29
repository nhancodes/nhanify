require("dotenv").config({
  path: ".env",
});

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js", "json", "node"],
  transform: { "^.+\\.(ts|tsx)$": "ts-jest" },
};
