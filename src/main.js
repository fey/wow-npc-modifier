// @ts-check

import './style.css'
import creatureClasslevelstatsData from '../creature_classlevelstats.json'

const expansionsEnum = {
  vanilla: 0,
  tbc: 1,
};

/** @type {HTMLFormElement} form */
// @ts-ignore
const form = document.getElementById('mod-form')
const code = document.getElementById("output");
const copyButton = document.getElementById("copyButton");
let sql = '';

const buildUpdateCreatureTemplateQuery = (
  entryId,
  level,
  classNumber,
  baseHealth,
  targetHealth,
  healthModifier,
  expansion,
) => {
  const comments = Object.entries({
    entryId,
    level,
    classNumber,
    baseHealth,
    targetHealth,
    healthModifier,
    expansion
  })
    .map(([key, value]) => `--${key}: ${value}`)

  return `${comments.join('\n')}\n\nUPDATE creature_template\nSET HealthModifier = ${healthModifier}\nWHERE entry = ${entryId};`;
}

const findBaseHealth = (
  /** @type Array */ rows,
  /** @type Number */ level,
  /** @type Number */ creatureClassNumber,
  expansion,
) => {
  const creatureStat = rows.find(row => {
    return row.level === level && row.class === creatureClassNumber
  });

  if (!creatureStat) {
    const serializedParams = JSON.stringify({ level, class: creatureClassNumber })
    throw Error(`'Cannont find in creature stats with params: ${serializedParams}'`)
  }

  if (expansion === expansionsEnum.vanilla) {
    return creatureStat.basehp0
  } else if (expansion === expansionsEnum.tbc) {
    return creatureStat.basehp1
  }

  throw Error(`Invalid expansion. Given: ${expansion}`)
}

const calculateHealthModifier = (baseHealth, targetHealth) => {
  // console.log({baseHealth, targetHealth})
  return targetHealth / baseHealth;
}

form.addEventListener('submit', (e) => {
  e.preventDefault()

  const formData = new FormData(e.target)

  const entryId = Number(formData.get('entryId'))
  const level = Number(formData.get('level'))
  const classNumber = Number(formData.get('classNumber'))
  const targetHealth = Number(formData.get('targetHealth'))
  const expansion = formData.has('expansion') ? Number(formData.get('expansion')) : undefined

  try {
    const expansions = Object.values(expansionsEnum);
    if (!expansions.includes(expansion)) {
      throw Error(`Invalid expansion. Only supported: ${expansions.join(', ')}. Given: ${expansion}`)
    }

    const baseHealth = findBaseHealth(creatureClasslevelstatsData, level, classNumber, expansion)

    const healthModifier = calculateHealthModifier(baseHealth, targetHealth)
    sql = buildUpdateCreatureTemplateQuery(
      entryId,
      level,
      classNumber,
      baseHealth,
      targetHealth,
      healthModifier,
      expansion,
    );

    code.innerText = sql
  }
  catch (e) {
    code.innerText = e
  }
})

copyButton.addEventListener("click", async () => {
  await navigator.clipboard.writeText(sql);

  copyButton.textContent = "Copied";
  setTimeout(() => {
    copyButton.textContent = "Copy";
  }, 1500);
});
