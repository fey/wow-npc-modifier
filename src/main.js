// @ts-check

import './style.css'
import creatureClasslevelstatsData from '../creature_classlevelstats.json'

/** @type {HTMLFormElement} form */
// @ts-ignore
const form = document.getElementById('mod-form')
const code = document.getElementById("output");
const copyButton = document.getElementById("copyButton");

const buildUpdateCreatureTemplateQuery = (
  entryId,
  level,
  classNumber,
  baseHealth,
  targtetHealth,
  healthModifier
) => {
  const comments = Object.entries({
    entryId,
    level,
    classNumber,
    baseHealth,
    targtetHealth,
    healthModifier,
  })
    .map(([key, value]) => `--${key}: ${value}`)

  return `${comments.join('\n')}\n\nUPDATE creature_template\nSET HealthModifier = ${healthModifier}\nWHERE entry = ${entryId};`;
}

const findBaseHealth = (
  /** @type Array */ rows,
  /** @type Number */ level,
  /** @type Number */ creatureClassNumber
) => {
  const creatureStat = rows.find(row => {
    return row.level === level && row.class === creatureClassNumber
  });

  if (creatureStat) {
    // console.log(creatureStat)
    return creatureStat.basehp1
  }

  const serializedParams = JSON.stringify({ level, class: creatureClassNumber })
  throw Error(`'Cannont find in creature stats with params: ${serializedParams}'`)
}

const calculateHealthModifier = (baseHealth, targetHealth) => {
  // console.log({baseHealth, targetHealth})
  return Number(targetHealth / baseHealth).toFixed(4);
}

form.addEventListener('submit', (e) => {
  e.preventDefault()

  const formData = new FormData(e.target)

  const entryId = Number(formData.get('entryId'))
  const level = Number(formData.get('level'))
  const classNumber = Number(formData.get('classNumber'))
  const targetHealth = Number(formData.get('targetHealth'))

  try {
    const baseHealth = findBaseHealth(creatureClasslevelstatsData, level, classNumber)
    const healthModifier = calculateHealthModifier(baseHealth, targetHealth)
    const query = buildUpdateCreatureTemplateQuery(
      entryId,
      level,
      classNumber,
      baseHealth,
      targetHealth,
      healthModifier
    );

    code.innerText = query
  }
  catch (e) {
    code.innerText = e
  }
})

copyButton.addEventListener("click", async () => {
  await navigator.clipboard.writeText(code.textContent);

  copyButton.textContent = "Copied";
  setTimeout(() => {
    copyButton.textContent = "Copy";
  }, 1500);
});
