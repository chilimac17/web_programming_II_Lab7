export let errorCheckID = (p_id) => {
    p_id = Number(p_id);
  if (!Number.isInteger(p_id) || p_id <= 0) {
    throw new Error("Invalid id");
  }

  return p_id;
};