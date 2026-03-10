// @ts-check

import './style.css'
import creatureClasslevelstatsData from '../creature_classlevelstats.json'

/** @type {HTMLFormElement} form */
// @ts-ignore
const form = document.getElementById('mod-form')

const outputElement = document.getElementById('output')

const buildUpdateCreatureTemplateQuery = (healthModifier, entryId) => {
  return `UPDATE creature_template SET HealthModifier = ${healthModifier} WHERE entry = ${entryId};`;
}

const findCreatureStats = (
  /** @type Array */ rows,
  /** @type Number */ level,
  /** @type Number */ creatureClassNumber
) => {
  const creatureStat = rows.find(row => {
    return row.level === level && row.class === creatureClassNumber
  });

  if (creatureStat) {
    return creatureStat

  }

  const serializedParams = JSON.stringify({ level, class: creatureClassNumber })
  throw Error(`'Cannont find in creature stats with params: ${serializedParams}'`)
}

const calculateHealthModifier = (baseHp, targetHp) => {
  return Number(targetHp / baseHp).toFixed(4);
}

form.addEventListener('submit', (e) => {
  e.preventDefault()

  const formData = new FormData(e.target)

  const entryId = Number(formData.get('entryId'))
  const level = Number(formData.get('level'))
  const classNumber = Number(formData.get('classNumber'))
  const targetHealth = Number(formData.get('targetHealth'))

  try {
    const creatureStat = findCreatureStats(creatureClasslevelstatsData, level, classNumber)
    const healthModifier = calculateHealthModifier(creatureStat.basehp1, targetHealth)
    const query = buildUpdateCreatureTemplateQuery(healthModifier, entryId)
    outputElement.innerText = query
  }
  catch (e) {
    outputElement.innerText = e
  }
})



// document.querySelector('#app').innerHTML = `
//   <div>
//     <a href="https://vite.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
//       <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
//     </a>
//     <h1>Hello Vite!</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite logo to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector('#counter'))
