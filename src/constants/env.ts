export default {
  minTableNumber: Number.parseInt(process.env.MIN_TABLE_NUMBER ?? '1', 10),
  maxTableNumber: Number.parseInt(process.env.MAX_TABLE_NUMBER ?? '100', 10),
};
