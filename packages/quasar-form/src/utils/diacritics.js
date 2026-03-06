// Remove diacritics
export function makeDiacriticPattern (pattern, options = {}) {
  // List of families of diacritics, the first character in a family is the one without a diacritic
  const diacritics = ['a,á,à,ä,â,ã', 'e,é,ë,è,ê', 'i,í,ï,ì,î', 'o,ó,ö,ò,õ,ô', 'u,ü,ú,ù,û', 'c,ç']
  let result = ''
  // Loop over all pattern characters
  for (const character of pattern) {
    // Iterate over all diacritics to find matching one if any
    const family = diacritics.find(family => {
      // The reverse option is used to allow for any diacritic or
      // the character without a diacritic to be matched by any other one
      if (options.reverse) return family.includes(character)
      // Otherwise by default we allow to match all diacritics
      // for the character without a diacritic but not the other way around
      else return family[0] === character
    })
    // If not a diacritic simply leave as it
    if (!family) result += character
    else result += `[${family}]`
  }
  return result
}
