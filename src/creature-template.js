export const expansionsEnum = {
  vanilla: 0,
  tbc: 1,
};

export const buildUpdateCreatureTemplateQuery = (
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
    expansion,
  })
    .map(([key, value]) => `--${key}: ${value}`);

  return `${comments.join('\n')}\n\nUPDATE creature_template\nSET HealthModifier = ${healthModifier}\nWHERE entry = ${entryId};`;
};

export const findBaseHealth = (
  rows,
  level,
  creatureClassNumber,
  expansion,
) => {
  const creatureStat = rows.find((row) => {
    return row.level === level && row.class === creatureClassNumber;
  });

  if (!creatureStat) {
    const serializedParams = JSON.stringify({ level, class: creatureClassNumber });
    throw Error(`'Cannont find in creature stats with params: ${serializedParams}'`);
  }

  if (expansion === expansionsEnum.vanilla) {
    return creatureStat.basehp0;
  }

  if (expansion === expansionsEnum.tbc) {
    return creatureStat.basehp1;
  }

  throw Error(`Invalid expansion. Given: ${expansion}`);
};

export const calculateHealthModifier = (baseHealth, targetHealth) => {
  return targetHealth / baseHealth;
};
