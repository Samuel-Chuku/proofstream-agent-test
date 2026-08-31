/// Nothing to do with the ledger, and nothing to do with the milestone.
///
/// This exists so a merge can be driven through the pipeline that is real work,
/// genuinely merged, and still worth nothing against the milestone the stream
/// is paying for. "A merge happened" is not the signal.
export function greet(name: string): string {
  return `hello, ${name}`;
}
