import { getTimeClassification, formatMedicineTime } from './src/utils/timeUtils.js';

const t = (key) => {
  const dict = { morning: 'ఉదయం', afternoon: 'మధ్యాహ్నం', evening: 'సాయంత్రం', night: 'రాత్రి' };
  return dict[key] || key;
};

console.log("08:00 ->", formatMedicineTime("08:00", t));
console.log("14:00 ->", formatMedicineTime("14:00", t));
console.log("18:00 ->", formatMedicineTime("18:00", t));
console.log("22:00 ->", formatMedicineTime("22:00", t));
console.log("14:00 type ->", getTimeClassification("14:00"));
