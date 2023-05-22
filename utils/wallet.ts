export const constrictAddress = (address: string, range1 = 6, range2 = 4) => {
  return `${address.slice(0, range1)}...${address.slice(-range2)}`;
};
