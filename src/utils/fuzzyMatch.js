export const levenshteinDistance = (s1, s2) => {
  if (!s1 || !s2) return 0;
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();
  
  const m = s1.length;
  const n = s2.length;
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
};

export const fuzzyMatchScore = (query, target) => {
  if (!query || !target) return 0;
  query = query.toLowerCase().trim();
  target = target.toLowerCase().trim();
  
  if (target === query) return 1;
  if (target.includes(query) || query.includes(target)) {
    return 0.9; // Substring match is high confidence
  }
  
  const dist = levenshteinDistance(query, target);
  const maxLength = Math.max(query.length, target.length);
  return (maxLength - dist) / maxLength; // Score between 0 and 1
};
