/* Every number allowed in the site's copy. Each one appears in the October 2026
   résumé, plus the "Top 10" row label and the LinkedIn handle (anushreya1306). */
export const RESUME_NUMBERS = new Set([
  '2', '3', '4', '8', '9', '13', '14', '19', '20', '38', '45', '60', '90', '95', '99', '100', '200', '309',
  '2017', '2021', '2022', '2023', '2024', '2026', '21', '24',
  '0.10', '0.18', '0.44', '2.0', '2.4', '3.5', '6.7', '26.17', '31.4', '81.8', '2,500', '14,000',
  '10', '1306'
]);

export const numbersIn = text => text.match(/\d+(?:[.,]\d+)*/g) || [];
