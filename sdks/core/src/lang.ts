import root from "window-or-global";

let memoizedResult: any = null;

// Function to split languages and countries from the preferred languages list
export function getUniqueLanguagesAndCountries() {
  // Check if we have a memoized result
  if (memoizedResult) {
    return memoizedResult;
  }

  // Get the list of preferred languages of the user
  const preferredLanguages = root.navigator.languages;

  // Sets to store unique languages and countries
  const uniqueLanguages = new Set();
  const uniqueCountries = new Set();

  // Iterate over each language tag
  preferredLanguages.forEach((languageTag) => {
    // Split the language tag into language and country
    const parts = languageTag.split("-");

    // Add the language part to the uniqueLanguages set
    if (parts.length > 0) {
      uniqueLanguages.add(parts[0]);
    }

    // Add the country part to the uniqueCountries set (if present)
    if (parts.length > 1) {
      uniqueCountries.add(parts[1]);
    }
  });

  // Convert sets to arrays
  const languages = Array.from(uniqueLanguages);
  const countries = Array.from(uniqueCountries);

  // Memoize the result
  memoizedResult = { languages, countries };

  // Log the results to the console
  console.log("Unique languages:", languages);
  console.log("Unique countries:", countries);

  return memoizedResult;
}
