// @ts-check

import './style.css';
import creatureClasslevelstatsData from '../creature_classlevelstats.json';
import {
  buildUpdateCreatureTemplateQuery,
  calculateHealthModifier,
  expansionsEnum,
  findBaseHealth,
} from './creature-template.js';

/** @type {HTMLFormElement} form */
// @ts-expect-error
const form = document.getElementById('mod-form');
const code = document.getElementById('output');
const copyButton = document.getElementById('copyButton');
let sql = '';

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  const entryId = Number(formData.get('entryId'));
  const level = Number(formData.get('level'));
  const classNumber = Number(formData.get('classNumber'));
  const targetHealth = Number(formData.get('targetHealth'));
  const expansion = formData.has('expansion') ? Number(formData.get('expansion')) : undefined;

  try {
    const expansions = Object.values(expansionsEnum);
    if (!expansions.includes(expansion)) {
      throw Error(`Invalid expansion. Only supported: ${expansions.join(', ')}. Given: ${expansion}`);
    }

    const baseHealth = findBaseHealth(creatureClasslevelstatsData, level, classNumber, expansion);

    const healthModifier = calculateHealthModifier(baseHealth, targetHealth);
    sql = buildUpdateCreatureTemplateQuery(
      entryId,
      level,
      classNumber,
      baseHealth,
      targetHealth,
      healthModifier,
      expansion,
    );

    code.innerText = sql;
  }
  catch (e) {
    code.innerText = e;
  }
});

copyButton.addEventListener('click', async () => {
  await navigator.clipboard.writeText(sql);

  copyButton.textContent = 'Copied';
  setTimeout(() => {
    copyButton.textContent = 'Copy';
  }, 1500);
});
