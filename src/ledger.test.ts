import assert from 'node:assert/strict';
import { test } from 'node:test';
import { balanceOf, history, transfer, type Account } from './ledger.ts';

const alice = (): Account => ({ id: 'alice', balance: 100 });
const bob = (): Account => ({ id: 'bob', balance: 50 });

test('a transfer moves the amount and leaves the total unchanged', () => {
  const [from, to] = transfer(alice(), bob(), 30);
  assert.equal(balanceOf(from), 70);
  assert.equal(balanceOf(to), 80);
  assert.equal(balanceOf(from) + balanceOf(to), 150);
});

test('a transfer is recorded in the log without mutating the old one', () => {
  const before: ReturnType<typeof history> = [];
  const [, , log] = transfer(alice(), bob(), 10, before);
  assert.equal(before.length, 0, 'the caller’s log is not mutated');
  assert.equal(log.length, 1);
  assert.equal(log[0].amount, 10);
});

test('an overdraft is refused', () => {
  assert.throws(() => transfer(alice(), bob(), 1000));
});

test('history returns only the records involving an account', () => {
  const [, , log] = transfer(alice(), bob(), 10);
  assert.equal(history(log, 'alice').length, 1);
  assert.equal(history(log, 'carol').length, 0);
});
