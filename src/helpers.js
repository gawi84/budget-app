// helpers.js

export const userMap = {
  'd1248566-a27f-4d93-8d38-b6d4aa40b2dc': 'Darek',
  '7132e418-b66e-48b7-bb06-951080a4c6c0': 'Agnieszka',
};


export function getUserName(uid) {
  return USER_MAP[uid] || 'Nieznany';
}
