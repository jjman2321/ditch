# Paywall wording: every word, checked for clarity

Written Nov 10, 2026. Covers only the words of the approved layout A (`paywall-v11.md`) and doesn't repeat its research. **Two picks touch locked wording and need your OK:** the table row from #22 ("Reminders" becomes "Subscriptions with reminders") and the free button from #11 (adds "subscriptions"). The #6b Lifetime text stays word for word.

## Summary (10 lines)
1. **The "3" fix: name the unit in the row label.** "Subscriptions with reminders · 3 · Unlimited". Apple asks apps to say "how many" of what (3.1.2(c)), and TradingView, Cash App and Wispr Flow all put the unit in the label.
2. **"Track every subscription ✓ ✓" goes right above that row**, so nobody reads "3" as a cap on tracking. Orbit's table uses "3" for exactly that.
3. **Free button on two lines:** **Continue free**, with "Reminders for 3 subscriptions" in small text under it. These are your words; the action comes first and it fits an SE.
4. **The headline stays** "Get a reminder before all 6 renewals." (#22). No subline: the logo line already does that job.
5. **Logo line: "Netflix, Spotify and 4 more".** "and" instead of "+", because Disney+, Apple TV+ and Paramount+ already end in "+".
6. **Tiles: the name gives the period and the price stands alone.** Yearly $29.99 "$2.50 a month" · Monthly $4.99 "No free trial" · Lifetime $49.99 "Pay once". Badges: "Save 49%" (rounded down) and "7 days free".
7. **Trial strip:** Today **$0** → Sat, Nov 14 **Reminder** → Tue, Nov 17 **$29.99**. Starting and ending on a price tells the story, and numbers need no translating.
8. **Buttons:** "Start 7-day free trial" / "Subscribe for $4.99 a month" / "Pay $49.99 once". Fine print: "Then $29.99 a year. Cancel anytime."
9. **Simulated 5-second test (5 personas):** the new row was clear to 5 of 5 at first glance, the current "Reminders · 3" to none of them. "Continue free" alone was clear to only 2 of 5, and one mixed it up with the trial. This is a simulation, so test with 5 real people before building.
10. **Wording tests rarely win.** Copy tests beat the control only ~35% of the time (Adapty), and no vendor has published a clean "free trial" vs "try free" result. Pick the clearest words now and use A/B tests on plans later.

## 1. How to read the scores
Each option is scored **C·V·H·F·T** out of 10: **C**lear in 5 seconds · con**V**ersion (likely effect on trial starts) · **H**onest · **F**it on one line at the SE's 327pt content width at default text size · **T**ranslation (no idioms, phrasal verbs or abbreviations). **Total** is my judgment, not an average, and an honesty problem caps it. ★ = pick. Fit rule of thumb: a table label at 14–15pt fits one SE line up to **~26 characters** (about 190pt is left after a 40pt Free column and a 72pt Pro column). Confirm this in the mockup.

## 2. What 76 real paywalls say (Mobbin, iOS)
| Pattern | Exact wording seen | Lesson for Ditch |
|---|---|---|
| Unit named in the label | [TradingView](https://mobbin.com/screens/840efb8e-8b56-49ae-8b1c-7f12a0121a28?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "Price alerts · 3 · 20", "Charts per tab · 1 · 2" · [Cash App](https://mobbin.com/screens/4d260ea2-b691-4506-9d78-631a4d266070?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "Custom weekly offers · 2 · 5" · [Wispr Flow](https://mobbin.com/screens/6c7e92bd-e6d7-4635-8981-95cba7b1e236?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "1,000 words per week" vs "Unlimited words per week" · [Mercury](https://mobbin.com/screens/f27f6369-8b93-44bd-b5ba-9189834234fa?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "up to 5 users/month" · [Evernote](https://mobbin.com/screens/e897962a-4e39-442f-abc6-298bdc026226?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "Sync devices · Unlimited" | A number is only clear when the label says what is being counted. |
| Number with no unit | [Orbit](https://mobbin.com/screens/05b8e0fa-1f61-43d7-a9f0-c77506ce6377?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "Unlimited tracking · 3 · ✓" · [Unfold](https://mobbin.com/screens/e8331a11-b2a4-4833-8b5f-e88b8c12c4a3?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "Background Removal · 2 · ∞" | Orbit's "3" sitting under "Unlimited" is the exact confusion you spotted. |
| Number + "up to" | [Cleo](https://mobbin.com/screens/c330c3f7-92f0-4323-8260-19342d065716?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "Up to $250 · Up to $500" · [Jomo](https://mobbin.com/screens/46254a5c-b3a2-4092-b36d-c1202878bbc8?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "Includes 1 lock" · [Monzo](https://mobbin.com/screens/baf88068-f789-4371-be70-4a7848e4c999?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "Up to 3.15%" · [GoPay](https://mobbin.com/screens/9f6969fd-335a-40cf-9dc1-67c6f705ce1d?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "2 million · 20 million" | Clear, but the wider cell squeezes the label. |
| Missing feature | "—" [Comet](https://mobbin.com/screens/d0723672-d16e-4883-977b-f7e4cb31e9f7?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp), [Wanderlog](https://mobbin.com/screens/1df519b6-08cd-4d5b-8a72-8a6049fa3681?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp), [Sweatcoin](https://mobbin.com/screens/a0a30ade-06f6-44ff-8a23-826ca9a4beae?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · ✗ [Structured](https://mobbin.com/screens/164379e9-258f-4b6c-9f91-7a02a3f4c277?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp), [Fixtured](https://mobbin.com/screens/0576cc85-bcfb-48ce-9115-cc4fbd774e02?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp), [Brilliant](https://mobbin.com/screens/9ff9cfa3-8209-4275-a972-11a892f7d0a5?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp), [Kitchen Stories](https://mobbin.com/screens/34a3f181-e9bd-473a-9363-ebbf79caebb7?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp), pink ✗ [Me+](https://mobbin.com/screens/a5da95c9-41db-40a5-952b-e64cec74cda8?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · blank [Matter](https://mobbin.com/screens/2133c08c-0529-46a0-a735-ad7ab815beaf?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp), [SCMP](https://mobbin.com/screens/0b41f5dd-af78-409d-b708-f4e43ff52554?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · "…" [PayPal](https://mobbin.com/screens/efcb6e30-60c0-4d62-b909-1a562b6b0c4b?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) | The dash is calm. A ✗ next to "Free" feels like a telling-off. |
| Headers | "Free · Pro" ([Comet](https://mobbin.com/screens/d0723672-d16e-4883-977b-f7e4cb31e9f7?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp), [Tide Guide](https://mobbin.com/screens/5b34dc0f-7bf4-4ba1-ac0f-1780eb282738?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp), [Matter](https://mobbin.com/screens/2133c08c-0529-46a0-a735-ad7ab815beaf?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)) · "Free · Plus" ([Fixtured](https://mobbin.com/screens/0576cc85-bcfb-48ce-9115-cc4fbd774e02?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)) · "BASIC · PRO" ([Wanderlog](https://mobbin.com/screens/1df519b6-08cd-4d5b-8a72-8a6049fa3681?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)) · top-left "Features", "What's Included", "Benefits", "Comparison", or nothing ([Structured](https://mobbin.com/screens/164379e9-258f-4b6c-9f91-7a02a3f4c277?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)) | "Free · Pro" is the most common and the shortest. The top-left word adds nothing. |
| Trial steps | [AllTrails](https://mobbin.com/screens/0e508882-f772-497d-959e-d51095983ef1?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "Today: Start your free trial / Day 5: Get a trial reminder / Day 7: You'll be charged $79.99/year" · [foodpanda](https://mobbin.com/screens/5c330e96-9e24-4420-a703-7612ab830a4b?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "Day 89 Billing reminder – cancel anytime" · [Vocabulary](https://mobbin.com/screens/32238af5-552f-4ac3-bede-16981f4c23d3?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "Mar 27 - Become member" · [Quizlet](https://mobbin.com/screens/1c14274b-c9e0-4c46-bdb5-018567fa5f49?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "4 June 2026: Trial ends" · [Mesh](https://mobbin.com/screens/60db255e-0f7c-4caf-a0a5-4d91c0aa8740?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "DAY 14 You will be charged" · [Headway](https://mobbin.com/screens/c550c1aa-b7d4-4b06-b4f3-ef448c07419f?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)/[Nibble](https://mobbin.com/screens/e722f5a0-b638-4060-86cc-2a05426b3f17?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "Cancel in advance to avoid payment" | The clearest charge step shows the amount. "Become member" and "Trial ends" hide the money. |
| More timelines | [5 Minute Journal](https://mobbin.com/screens/855c42a9-4d3c-4c80-86b4-45ee94667c74?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "In 3 Days: Full access starts" · [Mimo](https://mobbin.com/screens/e257555e-bd98-4163-b095-198a8c58473b?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Copilot](https://mobbin.com/screens/b6ba77c0-7d8f-423e-8453-9db2a97f8035?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "7 days before" · [Headspace](https://mobbin.com/screens/17e4ce60-0851-40be-92af-336be1220857?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "You'll be charged on September 1" · [Strava](https://mobbin.com/screens/40d104f8-8f25-4ae3-90eb-373e30e35acd?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "You'll be charged S$ 169.00" · [Blinkist](https://mobbin.com/screens/1c74c6aa-ae67-4bdf-811f-9019e3ad8564?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Brilliant](https://mobbin.com/screens/c5954cee-b3b0-4d32-a959-bbd9907c5785?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Dropbox](https://mobbin.com/screens/5ea4e218-270a-4fd8-b086-67ed9bb9ea55?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Kitchen Stories](https://mobbin.com/screens/8d0a33c4-54d1-406d-b502-7cf17b997e91?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Pillow](https://mobbin.com/screens/73a2cafa-d97e-477b-9e00-1e276ef50151?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [Flo](https://mobbin.com/screens/e91cde1b-542d-4989-8921-596ccb2a07c7?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "regular payment plan" · [pillowtalk](https://mobbin.com/screens/2f9bcce8-e4bd-4cf1-9027-3b8f44eb4ca6?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [N26](https://mobbin.com/screens/e3c08810-b4c7-46c1-9a3f-d98ed02c910a?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) (5 steps) | Real dates plus an amount beat "Day 7". Flo's "regular payment plan" is vague. |
| Under the button | [Mimo](https://mobbin.com/screens/e257555e-bd98-4163-b095-198a8c58473b?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "No charges yet. Cancel anytime on the App Store." · [Strava](https://mobbin.com/screens/40d104f8-8f25-4ae3-90eb-373e30e35acd?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "You won't be charged until Jul 1." · [Transit](https://mobbin.com/screens/cec48cfd-248d-4bd2-9109-90b98e37057e?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "The subscription starts 11 November. You can cancel anytime." · [5 Minute Journal](https://mobbin.com/screens/855c42a9-4d3c-4c80-86b4-45ee94667c74?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "NO PAYMENT NOW" | One fact plus "cancel anytime". |
| Price prominence | Breaks Apple's rule: [Blinkist](https://mobbin.com/screens/1c74c6aa-ae67-4bdf-811f-9019e3ad8564?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) bold "Only $16.66 / month", [Vocabulary](https://mobbin.com/screens/32238af5-552f-4ac3-bede-16981f4c23d3?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "$2.91/month, billed yearly as S$ 34.98/year", [Pillow](https://mobbin.com/screens/73a2cafa-d97e-477b-9e00-1e276ef50151?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "Only US$3,33 per month". OK: [Comet](https://mobbin.com/screens/d0723672-d16e-4883-977b-f7e4cb31e9f7?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) big "$300 /yr", small "$25/mo" | The billed price is the big number; the monthly breakdown is small and grey. |
| Tiles | [Bloom](https://mobbin.com/screens/db6e7f44-adcb-48a5-a585-48df56e93efe?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "YEARLY $59.99 · Billed yearly · 7-day free trial", "LIFETIME · Billed once · No trial" · [Hevy](https://mobbin.com/screens/19fce77b-a3e7-428c-857c-79aa00fbe716?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "SAVE 33%", "LIFETIME $74.99 Pay once" · [Brink](https://mobbin.com/screens/94cdf6cd-939e-4a80-80b0-c708b098130d?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "Billed once" · [FocusFlight](https://mobbin.com/screens/01e0b4d2-a045-47e0-a67d-37b3470e72f2?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "Pay once." · [Buddy](https://mobbin.com/screens/d81d0d25-b0c2-4138-a32e-759950886662?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "∞ UNLIMITED $149.98 One-off" · [Joi](https://mobbin.com/screens/f534ccc2-5c15-4ef1-b50c-b823dd786fa6?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "Pay once, use forever" · [Outsiders](https://mobbin.com/screens/2bd8918c-f2f0-4d61-9ee3-7663ac4057d0?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "/once" · [Tide Guide](https://mobbin.com/screens/0a7fe4f5-58f1-46f5-a498-af07baa409fe?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) · [5 Minute Journal](https://mobbin.com/screens/7fff754e-0548-4edf-bcb4-e6693302e99b?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "yours forever" · [Plex](https://mobbin.com/screens/579c0b00-dfb7-434d-a987-c8903866ddfc?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "Pure Dedication" | Name + price + one plain fact. "Pay once" and "No trial" are the plainest. |
| Buttons | "Start Free Trial" ([Tide Guide](https://mobbin.com/screens/5b34dc0f-7bf4-4ba1-ac0f-1780eb282738?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)) · "Start 7-day free trial" ([Transit](https://mobbin.com/screens/cec48cfd-248d-4bd2-9109-90b98e37057e?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)) · "Try free for 7 days" ([Fixtured](https://mobbin.com/screens/0576cc85-bcfb-48ce-9115-cc4fbd774e02?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)) · "Start my free week" ([Me+](https://mobbin.com/screens/a5da95c9-41db-40a5-952b-e64cec74cda8?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)) · "Start with a free 7-day trial" ([Julienne](https://mobbin.com/screens/3cbc1928-a4e0-4ab6-83a7-4ce825088e67?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)) · "Try free and subscribe" ([Quizlet](https://mobbin.com/screens/1c14274b-c9e0-4c46-bdb5-018567fa5f49?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)) · "Subscribe to Yearly plan" ([Hevy](https://mobbin.com/screens/19fce77b-a3e7-428c-857c-79aa00fbe716?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)) · "Pay S$ 9.98" ([Brink](https://mobbin.com/screens/94cdf6cd-939e-4a80-80b0-c708b098130d?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)) · "Get Pro" ([Comet](https://mobbin.com/screens/d0723672-d16e-4883-977b-f7e4cb31e9f7?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)) · "Continue" ([Sweatcoin](https://mobbin.com/screens/a0a30ade-06f6-44ff-8a23-826ca9a4beae?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)) · "Start For Free" ([Wanderlog](https://mobbin.com/screens/1df519b6-08cd-4d5b-8a72-8a6049fa3681?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)) | Wanderlog shows the risk: when the trial button says "free", it blurs into the free path. |
| Free path | "Skip For Now" ([Structured](https://mobbin.com/screens/164379e9-258f-4b6c-9f91-7a02a3f4c277?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)) · "Not right now" ([Cleo](https://mobbin.com/screens/c330c3f7-92f0-4323-8260-19342d065716?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)) · "Remind me later" ([Brilliant](https://mobbin.com/screens/9ff9cfa3-8209-4275-a972-11a892f7d0a5?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)) · "Continue with Standard" ([N26](https://mobbin.com/screens/e3c08810-b4c7-46c1-9a3f-d98ed02c910a?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)) · "Not now" ([Hevy](https://mobbin.com/screens/19fce77b-a3e7-428c-857c-79aa00fbe716?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)) · "Maybe later" ([Brainly](https://mobbin.com/screens/ba6ce0da-0545-485c-8138-fbe1f51bd414?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)) · "Free forever … Continue" ([Universe](https://mobbin.com/screens/52b7c3b1-515b-4363-8320-a18ce2563fbb?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)) · "not ready for a paid tier? that's ok." ([timespent](https://mobbin.com/screens/c9098dc0-df20-49c8-9ff0-3720857cee3a?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)) | Only N26 names the plan you keep. None says what the free plan includes, so Ditch can be the one that does. |
| Avoid | [Moonly](https://mobbin.com/screens/b2a7f4f6-e03e-4875-97ec-79c299a244c7?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) weekly pre-selected · [Sunlitt](https://mobbin.com/screens/1be71829-fa39-4b78-a3c9-c2726c2ef26f?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) trial toggle · [Me+](https://mobbin.com/screens/a5da95c9-41db-40a5-952b-e64cec74cda8?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "76% users' choice" · [Insight Timer](https://mobbin.com/screens/04b668d5-9abd-4bb4-8dc7-f75386e3739f?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "94% of members reported…" · [ABY Journal](https://mobbin.com/screens/65f1ef09-8067-43b6-a2d0-2210febda055?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "Best deal!" · [pillowtalk](https://mobbin.com/screens/4139d31a-e861-4982-b075-7e8d5ffd1468?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "your gift for limited time only" · [AllTrails](https://mobbin.com/screens/5f3e4df9-ad41-4d04-91ca-cf8c8a69507a?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) "3x more likely" | Unsourced claims and urgency break our honesty rules. |

## 3. What the data says about wording
- **No clean public test of "free trial" vs "try free".** In Lazyweb's count of 1,886 paywall buttons, "Continue" appears 350 times and "Start free trial" 84 times. Across 304 rewrites, 31 added trial/free wording and 24 removed it (Headspace went "Start my free trial" → "Start subscription"; SoundCloud went "Continue" → "Try free"). These are before/after snapshots, not A/B results ([Lazyweb](https://experiments.lazyweb.com/research/how-apps-change-trial-wording-paywall-cta.md), [Lazyweb](https://design.lazyweb.com/blog/paywall-cta-copy-changes-real-companies-tested.md)).
- **Copy tests move results a little.** Superwall expects 2–10% from button-copy tests and ~9,000 views per variant to see it ([Superwall](https://superwall.com/blog/how-to-ab-test-a-paywall)). Adapty: copy and visual tests beat the control ~35% of the time, against 57–60% for plan and trial tests ([Adapty](https://adapty.io/blog/high-performing-paywall-2026/)).
- **RevenueCat (no numbers):** use everyday words for benefits; repeat the trial in the supporting copy, not only on the button; pair it with "cancel anytime"; "clever copy typically backfires" at the point of paying ([RevenueCat](https://www.revenuecat.com/blog/growth/paywall-conversion-boosters)).
- **Apple:** the billed amount must be "the most prominent pricing element"; a trial must "clearly indicate how long the free trial lasts and the price billed once the free trial is over" ([Apple](https://developer.apple.com/app-store/subscriptions/)). 3.1.2(c): "clearly describe what the user will get for the price. How many issues per month? How much cloud storage?" ([Guidelines](https://developer.apple.com/app-store/review/guidelines/#subscriptions)). Since Aug 2024, Schedule 2 §3.8(b) asks only for the title, the length, the price and links to Privacy and Terms, so **the old 24-hour paragraph doesn't need to be on screen** ([RevenueCat](https://www.revenuecat.com/blog/engineering/schedule-2-section-3-8-b)). It can live in Terms.
- **Non-native readers:** avoid idioms, phrasal verbs ("go up") and abbreviations, and keep sentences short ([St Andrews](https://digitalcommunications.wp.st-andrews.ac.uk/2023/12/12/writing-for-an-international-audience/), [UX Planet](https://uxplanet.org/how-to-write-for-a-global-audience-d12c3a9cd46)). That's why "heads-up" went (#22), and why this doc avoids "/yr", "subs" and "for life".

## 4. Line by line (N = 6 subs ticked; yearly selected; today Tue, Nov 10)
### 4.1 Headline and subline
| Option | C·V·H·F·T | Total | Note |
|---|---|---|---|
| ★ "Get a reminder before all 6 renewals." | 9·9·9·9·8 | **9** | Locked (#22). Uses their own number, which Adapty links to +13–35%. 2 lines on SE. |
| "Reminders for all 6 of your subscriptions." | 9·8·9·8·9 | 8.5 | Very literal, but drops "before", the part that matters. |
| "Get reminded before all 6 renewals." | 8·8·9·9·6 | 7.5 | The passive "get reminded" is harder for learners. |
| "Know before all 6 charges." | 7·8·9·10·7 | 7.5 | Short and dry; "know" what? |
| "Never miss one of your 6 renewals." | 8·8·5·9·7 | 6 | "Never" breaks if notifications are off. |
| Subline: ★ none (the logo line is the subline) · "Your list stays free either way." · "Free covers 3. Pro covers all 6." | 9 · 7.5 · 6.5 | — | The table already says both. Less clutter. |

### 4.2 Logo line
| Option | C·V·H·F·T | Total | Note |
|---|---|---|---|
| ★ "Netflix, Spotify and 4 more" | 9·8·10·10·9 | **9** | Works with Disney+ and Apple TV+; translates as "e altri 4", "und 4 weitere". |
| "Netflix, Spotify + 4 more" | 9·8·10·10·8 | 8 | "Disney+ + 4 more" looks like a typo. |
| Logos only, "+4" | 6·7·10·10·10 | 7 | Small logos are hard to recognise. |
| "Your 6: Netflix, Spotify…" | 7·7·10·8·7 | 7 | The "…" hides the rest. |
Rules: the 2 biggest yearly charges first (same order as the 3-picker). 1 sub: "Netflix"; 2: "Netflix and Spotify"; 3: "Netflix, Spotify and Hulu". Never cut a name off; if two don't fit, use "Netflix and 5 more".

### 4.3 Free | Pro table
| Slot | Option | C·V·H·F·T | Total | Note |
|---|---|---|---|---|
| Headers | ★ (blank) · **Free** · **Pro** on a sunflower tint | 9·8·10·10·10 | **9** | The most common and the shortest. |
| | "What you get" · Free · Pro | 8·8·10·9·9 | 8 | One more phrase to read. |
| | Free · "Ditch Pro" | 8·8·10·8·9 | 7.5 | Repeats the top bar and widens the column. |
| Missing | ★ "—" (VoiceOver: "Not included") | 9·9·10·10·10 | **9** | Calm. |
| | ✗ | 7·7·10·10·9 | 6.5 | Feels like a telling-off to an anxious user. |
| | blank | 6·7·10·10·10 | 6.5 | Looks unfinished, and VoiceOver says nothing. |
| Row 1 | ★ "Track every subscription" · ✓ · ✓ | 9·9·10·10·9 | **9** | 24 characters. Says "no cap" before anyone reads "3". |
| | "Full list, totals, calendar" (v11) | 7·8·10·9·8 | 7.5 | Full list of what? |
| | "Unlimited tracking" | 8·8·10·10·9 | 7.5 | Puts "Unlimited" in two rows, which muddles row 2. |
| Row 2 | ★ "Subscriptions with reminders" · **3** · **Unlimited** | 9·9·10·7·9 | **9** | Your proposal. 28 characters: one line on the iPhone 12, may wrap on SE (allowed for this row only). |
| | "Reminders" · 3 · Unlimited (#22 today) | 5·8·9·10·8 | 6 | "3 reminders" reads as 3 notifications (§5). |
| | "Reminders for" · "3 subscriptions" · "All" | 9·8·10·4·8 | 6.5 | The cells are too wide, and "All" reads like a cap (#22). |
| | Pro cell: ★ "Unlimited" (9) · "No limit" (7.5) · "∞" (6: VoiceOver says "infinity") · "All 6" (5: reads like a cap) | | | Free cell: ★ "3" · "Up to 3" (8, but widens the column) · "Pick 3" (7.5, reads like an instruction). |
| Row 3 | ★ "Choose reminder timing" · — · ✓ | 8·8·10·10·9 | **8.5** | 22 characters. "Timing" is a loanword in Italian and German. |
| | "Choose when you're reminded" | 9·8·10·7·8 | 8 | The most human, but 27 characters may wrap. |
| | "Your own timing" (v11) | 6·7·10·10·7 | 6.5 | Timing of what? |
| | "Custom lead times" | 5·6·10·10·5 | 5 | Jargon. |
| Row 4 | ★ "Import screenshots anytime" · — · ✓ | 8·8·10·8·8 | **8.5** | "Anytime", because the onboarding scan was free once (#16). Show it only once import after onboarding works (#24). |
| | "Import from screenshots" | 7·8·7·10·8 | 7 | They just did that for free, so "—" looks false. |
| | "Scan screenshots anytime" | 8·8·10·9·7 | 8 | "Scan" can suggest the camera. |
| | "Magic import" | 4·6·5·10·5 | 4 | Orbit's word, and buyers regretted it (v11 §2.4). |
| Row 5 *(only when built)* | ★ "Price increase alerts" · — · ✓ | 8·8·10·10·8 | **8.5** | The words people search for (#18). |
| | "Price-rise alerts" | 7·8·10·10·6 | 7 | British, with a hyphen. |
| | "Alerts when prices go up" | 9·8·10·9·6 | 7.5 | Phrasal verb. |
| Row 6 *(only when built)* | ★ "Widget and iCloud backup" · — · ✓ | 8·7·10·10·9 | **8.5** | |
| | "Widget + iCloud backup" | 8·7·10·10·8 | 8 | VoiceOver reads "plus". |
| | Two separate rows | 9·7·10·8·9 | 7 | One more row of clutter. |
**At launch the table has rows 1–4.** Each later row adds ~28pt, so re-check the SE height budget (v11 §5).

### 4.4 Plan tiles (each tile is ~104pt wide on SE)
| Slot | Option | C·V·H·F·T | Total | Note |
|---|---|---|---|---|
| Names | ★ Yearly · Monthly · Lifetime | 9·9·10·10·9 | **9** | Bloom, Joi, Tide Guide. |
| | Annual · Monthly · Lifetime | 8·9·10·10·8 | 8.5 | "Annual" doesn't match the "a year" wording. |
| | 1 year · 1 month · Forever | 7·8·7·10·8 | 6.5 | "Forever" invites "all future features" (#6b). |
| Price | ★ "$29.99" alone (the name says "Yearly") | 9·9·10·10·10 | **9** | Fits the tile at Archivo size; no abbreviation. |
| | "$29.99/yr" | 8·9·10·6·7 | 7.5 | Overflows a 104pt tile at price size; "yr" is an abbreviation. |
| | "$29.99 a year" | 9·9·10·4·9 | 7 | Needs 2 lines. |
| Yearly sub | ★ "$2.50 a month" (small, grey) | 9·9·9·9·9 | **8.5** | Apple allows a smaller breakdown. 29.99 ÷ 12 = 2.499, which rounds up, so it doesn't flatter us. |
| | "Billed yearly" | 8·7·10·10·8 | 8 | |
| | "Just $2.50 a month" | 8·9·6·7·7 | 6 | "Just" is salesy. |
| Monthly sub | ★ "No free trial" | 9·8·10·10·9 | **9** | Prevents the worst surprise: being charged today. |
| | "$59.88 a year" | 7·8·10·10·9 | 7.5 | Proves the 49%, but adds another number. |
| | "Billed monthly" | 8·7·10·10·8 | 7.5 | |
| Lifetime sub | ★ "Pay once" | 9·8·10·10·9 | **9** | Hevy, FocusFlight. |
| | "One-time" / "Billed once" | 8·8·10·10·8 | 8 | |
| Badge | ★ "Save 49%" | 9·9·9·10·9 | **8.5** | 1 − 29.99 ÷ 59.88 = 49.9%, rounded **down**. Work it out from each country's StoreKit prices; hide it below 10%. |
| | "Save 50%" | 9·9·7·10·9 | 7.5 | Rounds up and looks like a made-up sale. |
| | "Best value" | 7·8·10·10·9 | 7.5 | True, but vague. |
| | "−49%" | 7·8·6·10·9 | 6 | Looks like a sale price. |
| Trial chip | ★ "7 days free" | 9·9·10·10·9 | **9** | Tide Guide "1 Week Free", Fixtured "Free for 7 days". |
| | "Free for 7 days" | 9·9·10·8·9 | 8.5 | A little wide for a chip. |
| | "Free trial" | 7·8·9·10·9 | 7 | Doesn't say how long. |

### 4.5 Trial strip (3 steps)
| Option | C·V·H·F·T | Total | Note |
|---|---|---|---|
| ★ **Today** · $0 → **Sat, Nov 14** · Reminder → **Tue, Nov 17** · $29.99 | 9·9·10·10·9 | **9** | Two prices bookend the story. Fewest words. |
| Today · Free → … → $29.99 (v11) | 8·9·10·10·9 | 8.5 | Fine, but it mixes a word with a number. |
| … → Tue, Nov 17 · You pay $29.99 | 9·8·10·7·8 | 8 | The clearest charge words, but ~96pt in a ~109pt column. |
| 3 one-line rows ("Nov 17: $29.99 charged", AllTrails style) | 9·8·10·6·8 | 7.5 | Adds ~32pt of height. |
| One sentence: "Free until Tue, Nov 17. Reminder Sat, Nov 14." | 7·7·10·9·7 | 6.5 | Puts the events out of order. |
Dates follow the phone's region ("sab 14 nov" in Italy). Keep the weekday, because people plan by weekday. **If notifications are off,** the middle step says "Turn on reminders" and opens Settings; never promise a reminder that can't fire. Monthly: "No free trial. You pay $4.99 today." Lifetime: §4.9.

### 4.6 Main button (CTA)
| Plan | Option | C·V·H·F·T | Total | Note |
|---|---|---|---|---|
| Yearly | ★ "Start 7-day free trial" | 9·9·10·10·9 | **9** | Says "trial", so it's clear money comes later. Apple asks for the trial length. Transit, Mimo. |
| | "Try 7 days free" | 9·9·8·10·9 | 8.5 | Matches the chip, but "try" hides that it turns into a paid plan. |
| | "Start free trial" | 8·9·10·10·10 | 8.5 | The most-translated string; the length only appears on the chip. |
| | "Try for $0" | 7·8·8·10·8 | 7 | Sounds like a deal. |
| | "Continue" | 4·7·6·10·10 | 5 | The most common button (350 of 1,886) but hides what happens. The "+111%" claim is unverified. |
| Monthly | ★ "Subscribe for $4.99 a month" | 9·8·10·9·9 | **9** | Puts the exact charge on the button. |
| | "Pay $4.99 a month" | 9·8·10·10·9 | 8.5 | |
| | "Subscribe" | 7·8·9·10·10 | 7.5 | |
| Lifetime | ★ "Pay $49.99 once" | 9·8·10·10·9 | **9** | Matches the tile's "Pay once". |
| | "Buy lifetime for $49.99" (v11) | 9·8·10·9·8 | 8.5 | |
| | "Get Pro for life" | 7·8·7·10·6 | 6.5 | An idiom, with no price. |

### 4.7 Free button
| Option | C·V·H·F·T | Total | Note |
|---|---|---|---|
| ★ Two lines: **Continue free** + small "Reminders for 3 subscriptions" | 9·8·10·9·9 | **9** | Your words; the action comes first. 56pt tall instead of 48. |
| One line: "Continue free: reminders for 3 subscriptions" | 9·8·10·6·7 | 7.5 | ≈300pt at 16pt, which fills the button and wraps at larger text sizes. The colon makes it read like a label. |
| "Continue with Free" (N26 style) | 8·8·10·10·8 | 7.5 | Names the plan, not what you keep. |
| "Continue free" | 7·8·9·10·10 | 7 | Only 2 of 5 personas read it right; one confused it with the trial (§5). |
| "Not now, keep 3 free reminders" | 5·8·7·9·7 | 5.5 | "3 reminders" again, and "Not now" makes free sound like a delay. |
With 3 or fewer subs: plain "Continue free" (they lose nothing). VoiceOver: "Continue free. Reminders for 3 subscriptions."

### 4.8 Fine print under the CTA
| Option (yearly) | C·V·H·F·T | Total | Note |
|---|---|---|---|
| ★ "Then $29.99 a year. Cancel anytime." | 9·8·10·10·9 | **9** | The full renewal price plus the phrase anxious users look for. The chip and CTA give the length. |
| "Free for 7 days, then $29.99 a year. Cancel anytime." | 9·8·10·7·9 | 8 | Complete on its own, but wraps on SE and repeats the chip. |
| "Then $29.99 a year until you cancel." | 9·7·10·10·8 | 8 | Says it renews, but reassures less. |
| Apple's old 24-hour paragraph | 4·5·10·2·4 | 4 | No longer required on screen; put it in Terms. |
Monthly ★ "Renews every month. Cancel anytime." · Lifetime ★ "One payment. No renewals." · Links ★ "Restore · Terms · Privacy".

### 4.9 Lifetime sentence (#6b)
| Option | C·V·H·F·T | Total | Note |
|---|---|---|---|
| ★ #6b word for word: "Everything in Pro, forever. Bank sync, if we add it, is a separate plan because it costs us money every month." | 8·7·10·7·8 | **8.5** | Locked, and the reason makes it feel fair. 2–3 lines at 13pt fit the 52pt strip slot. |
| "Everything in Pro, forever. A future bank sync would be a separate plan." | 8·8·9·8·8 | 8 | Shorter, but loses the "why", and #6b would have to be reopened. |
| "Pro for life. Bank sync would cost extra." | 7·8·8·10·6 | 7 | An idiom, and "extra" sounds like an upsell. |
**When it shows:** ★ only while Lifetime is selected, in the trial strip's place (9; same height, so nothing jumps; v11, your OK is still pending). Always showing it under the tile: 6 (no room in 104pt).

## 5. 5-second comprehension check (simulated)
Setup: SE screen, 6 subs, yearly selected, shown for 5 seconds. Questions: "What does 3 mean? What does Unlimited mean? What does the grey button do?" I role-played each persona. **This is a reasoned guess, not data.** ✓ = right on first read · ⚠ = unsure or needed another clue · ✗ = wrong.

| Persona | T1 ★ "Subscriptions with reminders · 3 · Unlimited" | T2 "Reminders · 3 · Unlimited" | B1 ★ "Continue free / Reminders for 3 subscriptions" | B2 "Continue free" |
|---|---|---|---|---|
| Maya, 26, US student | ✓ "3 of my subs get reminders, Pro does all" | ⚠ "3 reminders… a month?" The headline fixes it | ✓ | ✓ (read the table) |
| Giulia, 34, Italian nurse (B1 English) | ✓ "3 abbonamenti con promemoria"; "illimitati" is a familiar word | ✗ "3 promemoria" = three notifications in total | ✓ | ⚠ "Two 'free' buttons. Is this the trial?" |
| Tom, 40, UK parent | ✓, then "which 3?" | ⚠ "3 reminders per bill?" (thinks of the schedule) | ✓ | ⚠ worries Free hides his list; checks row 1 |
| Arjun, 23, Indian engineer | ✓, then "does it reset monthly?" | ✗ reads it as credits ("3 free, then pay"), like Brainly's "10 of 10 free questions" | ✓ | ✗ thinks both buttons start something free |
| Lena, 31, German designer (C1) | ✓; finds the label a bit long | ⚠ works it out from "all 6" | ✓ | ✓ |
| **Score** | **5 ✓** | **0 ✓, 3 ⚠, 2 ✗** | **5 ✓** | **2 ✓, 2 ⚠, 1 ✗** |

**Flags:** (1) "Which 3?" and "Does it reset?" aren't answered on the paywall. Row 2's tap detail answers them ("You pick which 3. Change them anytime."), and so does the picker after "Continue free". (2) People who know Orbit may read "3" as a tracking cap, which is why row 1 sits directly above. (3) B2's risk is real: someone who starts the trial thinking it's "free" gets a surprise charge, which leads to refunds and 1★ reviews. (4) "Renewals" was Giulia's slowest word, which is acceptable. **Before building:** show a screenshot for 5 seconds to 5 real people (2 or more non-native), ask the 3 questions, and pass if at least 4 of 5 get "3" right. Lyssna has a free 5-second test, or use friends on WhatsApp.

## 6. Final copy deck (top to bottom)
| Slot | Yearly ★ (default) | Monthly | Lifetime |
|---|---|---|---|
| Top bar | "ditch Pro" wordmark · × (VoiceOver: "Close, continue free") | same | same |
| Headline | More than 3 subs: **Get a reminder before all 6 renewals.** · 3 or fewer: "Reminders on every subscription you add." (switch to "Add the rest from a screenshot." once import ships) | same | same |
| Logo line | 5 logos + "Netflix, Spotify and 4 more" | same | same |
| Table | (blank) · **Free** · **Pro** / Track every subscription · ✓ · ✓ / Subscriptions with reminders · 3 · Unlimited / Choose reminder timing · — · ✓ / Import screenshots anytime · — · ✓ | same | same |
| Later rows | Price increase alerts · — · ✓ / Widget and iCloud backup · — · ✓ (**only when built**) | same | same |
| Tiles | tab **Save 49%** · Yearly · **$29.99** · $2.50 a month · chip **7 days free** | Monthly · **$4.99** · No free trial | Lifetime · **$49.99** · Pay once |
| Strip | **Today** $0 → **Sat, Nov 14** Reminder → **Tue, Nov 17** $29.99 | No free trial. You pay $4.99 today. | Everything in Pro, forever. Bank sync, if we add it, is a separate plan because it costs us money every month. |
| CTA | **Start 7-day free trial** | **Subscribe for $4.99 a month** | **Pay $49.99 once** |
| Fine print | Then $29.99 a year. Cancel anytime. | Renews every month. Cancel anytime. | One payment. No renewals. |
| Free button | **Continue free** / Reminders for 3 subscriptions (3 or fewer subs: "Continue free") | same | same |
| Links | Restore · Terms · Privacy | same | same |

**Tap details (sheet + VoiceOver):** row 1 "Your full list, totals per currency and the calendar. Free forever." · row 2 "Free: you pick which 3 and can change them anytime. Pro: every subscription." · row 3 "Free: 3 days and 1 day before. Pro: a week before, the day of, or more than one." · row 4 "Screenshots and bank statements, read on your phone." VoiceOver reads each row as one sentence ("Subscriptions with reminders. Free: 3. Pro: unlimited."); "—" is read as "Not included". Tile: "Yearly, $29.99 a year, about $2.50 a month, 7 days free, save 49%, selected."

## 7. Mock text layout (iPhone SE, 375×667)
```
┌──────────────────────────────────────────────────┐
│ ditch Pro                                    (×) │
│ Get a reminder before                            │
│ all 6 renewals.                                  │
│ ◉◉◉◉◉ Netflix, Spotify and 4 more                │
│                                   Free    Pro    │
│ Track every subscription           ✓       ✓     │
│ Subscriptions with reminders       3   Unlimited │
│ Choose reminder timing             —       ✓     │
│ Import screenshots anytime         —       ✓     │
│                                                  │
│ ╭─Save 49%─╮                                     │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  │
│ │● Yearly     │ │○ Monthly    │ │○ Lifetime   │  │
│ │  $29.99     │ │  $4.99      │ │  $49.99     │  │
│ │$2.50 a month│ │No free trial│ │  Pay once   │  │
│ │[7 days free]│ │             │ │             │  │
│ └─────────────┘ └─────────────┘ └─────────────┘  │
│  Today           Sat, Nov 14      Tue, Nov 17    │
│  ●───────────────○────────────────○              │
│  $0              Reminder         $29.99         │
│ ┌─────────────────────────────────────────────┐  │
│ │           Start 7-day free trial            │  │
│ └─────────────────────────────────────────────┘  │
│        Then $29.99 a year. Cancel anytime.       │
│ ┌─────────────────────────────────────────────┐  │
│ │                Continue free                │  │
│ │        Reminders for 3 subscriptions        │  │
│ └─────────────────────────────────────────────┘  │
│             Restore · Terms · Privacy            │
└──────────────────────────────────────────────────┘
```

## 8. Sources
Web: [Lazyweb, trial wording on CTAs](https://experiments.lazyweb.com/research/how-apps-change-trial-wording-paywall-cta.md) · [Lazyweb, CTA rewrites](https://design.lazyweb.com/blog/paywall-cta-copy-changes-real-companies-tested.md) · [Superwall, how to A/B test a paywall](https://superwall.com/blog/how-to-ab-test-a-paywall) · [Adapty, high-performing paywall 2026](https://adapty.io/blog/high-performing-paywall-2026/) · [RevenueCat, paywall conversion boosters](https://www.revenuecat.com/blog/growth/paywall-conversion-boosters) · [RevenueCat, Schedule 2 §3.8(b)](https://www.revenuecat.com/blog/engineering/schedule-2-section-3-8-b) · [Apple, auto-renewable subscriptions](https://developer.apple.com/app-store/subscriptions/) · [App Review Guidelines 3.1.2](https://developer.apple.com/app-store/review/guidelines/#subscriptions) · [St Andrews, writing for an international audience](https://digitalcommunications.wp.st-andrews.ac.uk/2023/12/12/writing-for-an-international-audience/) · [UX Planet, writing for a global audience](https://uxplanet.org/how-to-write-for-a-global-audience-d12c3a9cd46)
Also used: Adapty State of Paywalls 2026 (<https://adapty.io/blog/paywall-optimization-tests/>, personalisation +13–35%), and the earlier Ditch notes `paywall-v11.md`, `paywalls-competitors.md` and `freemium-v2.md`. Mobbin screens are linked inline in §2 (76 looked at, pulled Nov 10, 2026). Also seen: [Acorns](https://mobbin.com/screens/6f8958c4-f659-431b-a287-6d22161632e3?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp), [Everyday Rewards](https://mobbin.com/screens/a29ff19d-b7a2-4466-b213-3730b9cd08a9?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp), [GoPro Quik](https://mobbin.com/screens/7d539f43-fd8e-4654-9cb4-7551b2d76eb0?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp), [WHOOP](https://mobbin.com/screens/96632f8f-06c5-4cf9-9917-67421e97de81?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp), [Bumble](https://mobbin.com/screens/4948aae3-5134-4a97-aaa0-d8e9c2faa67a?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp), [Insight Timer](https://mobbin.com/screens/04b668d5-9abd-4bb4-8dc7-f75386e3739f?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp), [Superlist](https://mobbin.com/screens/0b0db02e-55b2-4e31-a113-2c2b931af542?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp), [Duolingo](https://mobbin.com/screens/2e2f5144-d03d-46b2-9b8d-cf9a22456852?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp), [Upwork](https://mobbin.com/screens/17e300b4-4ea2-4a65-bc81-714af724132f?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp), [Preply](https://mobbin.com/screens/aa3d1ae8-b0f3-447d-8bd1-41c14c02bbcd?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp), [Photoroom](https://mobbin.com/screens/1e1b9135-afc7-4935-a8fd-b2b576b385e8?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp).. All vendor numbers are vendors reporting on themselves: read them as direction, not proof.

---

**Your Mobbin AI usage is high this month**

Usage is unlimited during beta. If your usage stays at this level, you may need to purchase more credits once limits take effect. [View usage and plan options](https://mobbin.com/settings/billing-and-usage?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp)
