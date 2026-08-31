import assert from 'node:assert/strict';
import { test } from 'node:test';
import { balanceAt, balanceOf, history, transfer, type Account } from './ledger.ts';

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

test('balanceAt reconstructs a past balance from the log', () => {
  const log = [
    { from: 'alice', to: 'bob', amount: 30, timestamp: 100 },
    { from: 'bob', to: 'carol', amount: 10, timestamp: 200 },
  ];
  assert.equal(balanceAt(log, 'bob', 150), 30, 'after the first transfer only');
  assert.equal(balanceAt(log, 'bob', 250), 20, 'after both');
});

test('an account that BOTH SENT AND RECEIVED is reconstructed correctly', () => {
  // Named in the milestone, because it is the case a one-directional
  // implementation gets wrong.
  const log = [
    { from: 'alice', to: 'bob', amount: 50, timestamp: 100 },
    { from: 'bob', to: 'carol', amount: 20, timestamp: 200 },
    { from: 'dave', to: 'bob', amount: 5, timestamp: 300 },
  ];
  assert.equal(balanceAt(log, 'bob', 400), 35, '50 in, 20 out, 5 in');
});

test('balanceAt ignores anything after the instant asked about', () => {
  const log = [{ from: 'alice', to: 'bob', amount: 30, timestamp: 500 }];
  assert.equal(balanceAt(log, 'bob', 100), 0, 'nothing had happened yet');
});

test('balanceAt honours an opening balance', () => {
  const log = [{ from: 'alice', to: 'bob', amount: 10, timestamp: 100 }];
  assert.equal(balanceAt(log, 'bob', 200, 100), 110);
});
