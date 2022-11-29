const fs = require('fs')
// Load active-effects and passive-effects JSON files
const activeEffects = require('./active-effects.json')
const passiveEffects = require('./passive-effects.json')

// Parse wiki tags that are inside double curly braces
const wikiTagRegex = /\{\{([^}]+)\}\}/g

// Get all wiki tags from the JSON files by regex
const activeEffectsTags = activeEffects
  .map((effect) => effect.match(wikiTagRegex))
  .flat()
  .filter((tag) => tag !== null)
const passiveEffectsTags = passiveEffects
  .map((effect) => effect.match(wikiTagRegex))
  .flat()
  .filter((tag) => tag !== null)

// Get all unique wiki tags
const allTags = [...new Set([...activeEffectsTags, ...passiveEffectsTags])].map((tag) =>
  tag.replaceAll('{{', '').replaceAll('}}', '').replaceAll(/'''/g, '**').replaceAll('[[', '').replaceAll(']]', '')
)

// Save all unique wiki tags to a file
fs.writeFileSync('examples/wiki-tags.txt', allTags.join('\n'))

// Parse wiki keywords that are inside double square brackets
const wikiKeywordRegex = /\[\[([^\[]+)\]\]/g

const activeEffectsKeywords = activeEffects
  .map((effect) => effect.match(wikiKeywordRegex))
  .flat()
  .filter((keyword) => keyword !== null)

const passiveEffectsKeywords = passiveEffects
  .map((effect) => effect.match(wikiKeywordRegex))
  .flat()
  .filter((keyword) => keyword !== null)

const allKeywords = [...new Set([...activeEffectsKeywords, ...passiveEffectsKeywords])].map((keyword) =>
  keyword.replaceAll('[[', '').replaceAll(']]', '')
)
fs.writeFileSync('examples/wiki-keywords.txt', allKeywords.join('\n'))

// Parse wiki keywords that are bolded inside triple single quotes
const wikiBoldKeywordRegex = /'''([^']+)'''/g

const activeEffectsBoldKeywords = activeEffects
  .map((effect) => effect.match(wikiBoldKeywordRegex))
  .flat()
  .filter((keyword) => keyword !== null)

const passiveEffectsBoldKeywords = passiveEffects
  .map((effect) => effect.match(wikiBoldKeywordRegex))
  .flat()
  .filter((keyword) => keyword !== null)

const allBoldKeywords = [...new Set([...activeEffectsBoldKeywords, ...passiveEffectsBoldKeywords])].map((keyword) =>
  keyword.replaceAll(/'''/g, '')
)

// Save all unique wiki bold keywords to a file
fs.writeFileSync('examples/wiki-bold-keywords.txt', allBoldKeywords.join('\n'))
