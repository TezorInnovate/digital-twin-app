export const checkUpiFraud = (upi: string) => {
  // Simulated ML logic

  let risk = 0;
  let isFraud = false;

  // Rule-like ML patterns (can be replaced later)
  if (!upi.includes("@")) risk += 30;

  if (upi.includes("test") || upi.includes("fake")) {
    risk += 40;
    isFraud = true;
  }

  if (upi.length < 6) risk += 20;

  return {
    isFraud,
    mlRisk: risk,
  };
};