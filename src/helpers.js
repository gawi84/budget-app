// helpers.js

export const USER_MAP = {
  'd1248566-a2f7-4d93-8d38-b6d4aa40b2dc': 'Darek',
  '7f32e418-b66e-48b7-bb06-951080a4c6c0': 'Agnieszka',
};

export function getUserName(uid) {
  return USER_MAP[uid] || 'Nieznany';
}
