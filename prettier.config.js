/** @type {import("prettier").Config} */
export default {
	// Set tab width to 4
	tabWidth: 4,
	// Print semicolons at the ends of statements
	semi: true,
	// Use double quotes
	singleQuote: false,
	// Print trailing commas wherever possible when multi-line
	trailingComma: "es5",
	// Specify which parser to use
	parser: "typescript",
	// Format quoted code embedded in Markdown
	embeddedLanguageFormatting: "auto",
};
