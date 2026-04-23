export const analyzeUserBehavior = ({
  isFrequent,
}: {
  isFrequent: boolean;
}) => {
  let adjustment = 0;

  if (isFrequent) {
    adjustment -= 20; // trusted payee → reduce risk
  } else {
    adjustment += 10; // unknown → slightly risky
  }

  return adjustment;
};