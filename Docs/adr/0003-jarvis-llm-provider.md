# ADR-0003 — Jarvis LLM provider and model policy

**Status:** Stub — to be drafted post-demo
**Date:** 2026-07-02
**Deciders:** Aditya Phadke

## Why this is a stub

The demo runs on hardcoded copy; no LLM calls happen. Drafting this ADR before we have production traffic would be premature — we don't yet know:

- Real cost envelope (nudges + closes + miss probes × active users × frequency)
- Which prompts benefit from streaming (chat probes) vs batch (digest)
- Fallback policy under refusal / rate-limit / outage
- Latency budget per call type

## Open questions to resolve before drafting

1. **Provider.** Anthropic (Claude API) is the strong default given the voice work is calibrated to Claude's tone. Do we take a dependency on one provider?
2. **Model per prompt.** Sonnet 4.6 for nudges/closes (cheap, fast, good voice). Opus 4.8 for miss probes and milestone identity moments (slower, richer, worth the cost on the emotional payload). Haiku 4.5 for pre-formed digest bullets. Confirm on real traffic.
3. **Streaming vs batch.** Streaming for miss-reflection probes (feels conversational). Batch for morning nudges (deterministic time budget).
4. **Fallback.** Pre-written line per prompt type if the API errors — the PRD (FR6.3) already requires this for the milestone close. Extend to all Jarvis surfaces.
5. **Cost envelope.** At what active-user count does the LLM bill dominate hosting? Draw the line at which we cache templated variants.

## To be drafted when

- We have ≥ 20 active users generating real LLM traffic, OR
- Anthropic's pricing shifts in a way that changes the model-per-prompt calculus, OR
- We add a second provider for redundancy.

Until then, the voice prompt library (Backend/prompts/) hardcodes Claude API + Sonnet 4.6 as the default, with the fallback lines inlined next to each prompt.
