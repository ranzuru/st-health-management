// dropdownOptions.js

export const visionScreeningOptions = ["Passed", "Failed"];
export const auditoryScreeningOptions = ["Passed", "Failed"];
export const scalpScreeningOptions = ["Normal", "Presence of Lice"];
export const skinScreeningOptions = [
  "Normal",
  "Redness of Skin",
  "White Spots",
  "Flaky Skin",
  "Impetigo/Boil",
  "Hematoma",
  "Bruises/Injuries",
  "Itchiness",
  "Skin Lesions",
  "Acne/Pimple",
];
export const eyesScreeningOptions = [
  "Normal",
  "Stye",
  "Eye Redness",
  "Ocular Misalignment",
  "Pale Conjunctive",
  "Eye Discharge",
  "Matted Eyelashes",
];
export const earScreeningOptions = [
  "Normal",
  "Ear Discharge",
  "Impacted Cerumen",
];
export const noseScreeningOptions = [
  "Normal",
  "Mucus Discharge",
  "Nose Bleeding",
];

export const mouthNeckThroatOptions = [
  "Normal",
  "Enlarged tonsils",
  "Presence of lesions",
  "Inflamed pharynx",
  "Enlarged lymphnodes",
];

export const lungsHeartOptions = [
  "Normal",
  "Rales",
  "Wheeze",
  "Murmur",
  "Irregular heart rate",
];

export const abdomenOptions = [
  "Normal",
  "Distended",
  "Abdominal Pain",
  "Tenderness",
  "Dysmenorrhea",
];

export const deformitiesOptions = ["Acquired", "Congenital"];

export const ageMenarcheOptions = Array.from(
  { length: 7 },
  (_, i) => `${i + 10} years old`
);
