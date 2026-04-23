export const calculateRiskScore = ({
  amount,
  isNewDevice,
  recentTransactions,
}: {
  amount: number;
  isNewDevice: boolean;
  recentTransactions: number;
}) => {
  let risk = 0;

  // Rule 1: High amount
  if (amount > 10000) risk += 40;

  // Rule 2: New device
  if (isNewDevice) risk += 30;

  // Rule 3: Rapid transactions
  if (recentTransactions > 3) risk += 20;

  return risk;
};