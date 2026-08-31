# proofstream-agent-test

A deliberately small repository for exercising the ProofStream agent end to end.
Nothing here is a product. It exists so a real merge can be driven through a real
stream and the result read on the dashboard.

## The one rule about this repo

**It has no dependencies, and it must not gain any.**

The agent runs its generated tests in a sandbox with the network cut, so nothing
can be fetched from a registry. A single third-party import makes the correctness
check unrunnable. It reports that honestly rather than blaming the contributor's
code, but the check then tells you nothing.

Plain Node is enough: `node --test src/*.test.ts`.

## Milestone text

Paste this into the stream when you create it. It is the wording the oracle has
been measured against, so a poor result is about the agent rather than about an
ambiguous brief.

```
Milestone 1: a caller should be able to find out what an account balance was at
an earlier point in time, using the transfer history that src/ledger.ts already
keeps. Cover it with unit tests in src/ledger.test.ts, including an account that
both sent and received.
```

`src/ledger.ts` deliberately does **not** implement that yet. It keeps a history
and can report a current balance; reconstructing a past one is the work.

## What to test, in order

Each step is one pull request into `main`, and each one is checking a different
thing. Merge them one at a time and read the stream page between each.

### 1. Partial work

Add `balanceAt` to `src/ledger.ts`. **Do not add tests for it.**

Expect a partial certification. The milestone asks for the function *and* its
tests, so the agent should credit the implementation and say the tests are
missing. This is the case that proves the judgment is graded rather than a
yes-or-no.

### 2. Finish it

Add the tests the milestone asks for, including an account that both sent and
received.

Expect certification to rise. With the correctness check on, the sandbox panel
should show more of the generated suite passing than it did at step 1.

### 3. A comment-only change

Change nothing but a comment. No behaviour, no tests.

**Expect the certification NOT to move.** This is the case that used to take a
standing 95% to 100%: the model was simply asked again and the higher answer
stuck, because certification only ever rises. A comment cannot make a test pass,
so it cannot raise what is owed.

If the number moves here, that is the bug, and it is worth stopping to look at.

### 4. Something unrelated

Add a file that has nothing to do with the milestone.

Expect no certification and no payment. Worth doing once, because "a merge
happened" is not the signal; "the milestone is more done" is.

## Things worth watching on the dashboard

- **The version chip.** A stream on the current contract reads `V2`. Anything
  deployed earlier reads `V1` and carries a note about what it cannot do.
- **The sandbox panel**, under each verdict when the correctness check is on. It
  reports what was executed, and names any test that failed here but not on the
  earlier version. A named failing test is a case you can reproduce.
- **A held judgment.** The agent now needs more confidence to make a larger
  claim: about 0.85 to certify 90% or more. Below that it releases nothing and
  waits, which is the correct outcome rather than a failure.
