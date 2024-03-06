export const formatAccountId = (
  accountId: string,
  length = 12,
  leadingLength: number | undefined = undefined
): string => {
  if (accountId.length < 10) return accountId;
  return (
    accountId.substring(0, leadingLength ? leadingLength : length) +
    "..." +
    accountId.substring(accountId.length - length, accountId.length)
  );
};
