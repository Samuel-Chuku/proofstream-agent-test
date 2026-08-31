// A tiny in-memory ledger.
//
// DELIBERATELY DEPENDENCY-FREE, and it has to stay that way. The agent runs its
// generated tests in a sandbox with no network, so nothing here can be resolved
// from a registry. Anything imported from outside this file makes the whole
// check unrunnable, and it reports that honestly rather than blaming the code.

export type Account = { id: string; balance: number };

export type TransferRecord = {
  from: string;
  to: string;
  amount: number;
  timestamp: number;
};

export function balanceOf(account: Account): number {
  return account.balance;
}

export function transfer(
  from: Account,
  to: Account,
  amount: number,
  log: TransferRecord[] = [],
): [Account, Account, TransferRecord[]] {
  if (from.id === to.id) {
    throw new Error(`self-transfer blocked: ${from.id}`);
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error(`transfer amount must be positive, got ${amount}`);
  }
  if (from.balance < amount) {
    throw new Error(`overdraft blocked: ${from.id} holds ${from.balance}, ${amount} requested`);
  }

  const record: TransferRecord = { from: from.id, to: to.id, amount, timestamp: Date.now() };

  return [
    { ...from, balance: from.balance - amount },
    { ...to, balance: to.balance + amount },
    [...log, record],
  ];
}

export function history(records: TransferRecord[], accountId: string): TransferRecord[] {
  return records.filter((r) => r.from === accountId || r.to === accountId);
}
