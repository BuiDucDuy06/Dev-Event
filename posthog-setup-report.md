# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 16 App Router project. PostHog is initialized via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), which runs before React hydration and enables automatic error tracking. A reverse proxy is configured in `next.config.ts` to route PostHog requests through `/ingest`, reducing interception by ad-blockers. Two client-side events were instrumented to track core homepage engagement: the "Explore Events" CTA button and event card clicks.

| Event | Description | File |
|---|---|---|
| `explore_clicked` | User clicked the "Explore Events" CTA button on the homepage | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicked an event card to view event details (properties: `event_title`, `event_slug`, `event_location`, `event_date`) | `components/EventCard.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/473076/dashboard/1720169)
- [Explore button clicks over time](https://us.posthog.com/project/473076/insights/DjHEcpx8)
- [Event card clicks over time](https://us.posthog.com/project/473076/insights/3QIiHmeU)
- [Most clicked events (by title)](https://us.posthog.com/project/473076/insights/eWrlFw72)
- [Homepage engagement (combined)](https://us.posthog.com/project/473076/insights/GbJL2F16)

## Verify before merging

- [ ] Run a full production build (`npm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any onboarding/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
