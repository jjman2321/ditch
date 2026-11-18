# Trading-education niche: could a duck beat Finelo? (Nov 18, 2026)

Brief: a duck-led competitor to **Finelo: Master Trading** (id 6670422243). Money first; aggressive monetization is OK.
Two hard lines: **no false or guaranteed-return claims** and **no unlicensed personalised investment advice**. 🚩 marks anything that crosses or nears them.
**All AppKittie revenue and download numbers are model estimates** of store gross per month. Read them as rankings.
**Budget:** AppKittie 119 credits (log 1,425 → 1,544, cap 1,545). DataForSEO not used. Everything else was free.

## 1. Short answer
- **The money is real, and it is not empty below Finelo any more.** Finelo makes ~$311k/mo on iOS and ~$213k/mo on Android, plus web sales the estimates can't see. **Finrise** (DeepFlow, a Dubai studio with ~15 apps) launched **June 16, 2026** and is already at **~$64k/mo**, growing 11% a month, with ~760 active Meta ads.
- **Finelo's money comes from a promise we can't copy.** The quiz sells a "28-day AI Trader challenge" as a "second job / replace current job" plan. It asks "How much do you think traders earn? $30k–$100k+" and runs ads saying "AI bots handle the routine." Its 1–3★ reviews say "I came because an ad said AI bots trade for me" and "where is the money? I thought it was stacking in an account." 🚩 Both of our lines sit right next to this.
- **An honest duck version sells something different:** a trading **game**, a simulator you can't lose money in, plus short lessons. That buyer is younger and pays less: honest simulators earn **$1.5–3.4 per download**, against Finelo's ~$10.
- **The paid-ads maths only works with a web funnel and a hard paywall.** US finance CPI is ~$4 (Adjust 2026). At Finrise-level $2.56 per download, App Store-only ads lose money.
- **Verdict: 5/10, not now.** A Finelo clone is a **no-go (3/10)**. A **"Paper Duck" trading-simulator game is a conditional go (5.5/10)**: start it after Ditch ships, cap the first test at **$3–5k**, and kill it if the numbers in §8 miss.

## 2. Finelo's web funnel (walked Nov 18 with Playwright, iPhone size; screenshots in scratchpad `finelo/01–19.png`)
**Entry.** `quiz.finelo.com` redirects to `/dynamic?prc_id=2019`. Dark UI, lime green, and a cartoon trader character ("Ben", glasses and moustache) in front of a candle chart.
- Hero: "1M+ users' choice", "Rated on Trustpilot 4.5", "**28-DAY AI TRADER CHALLENGE** · Take the quiz to personalize your subscription".
- First question: "Have you ever traded before? YES / NO".
- Footer: "**Arnegen Digital Corp, Las Vegas, Nevada**", which looks like a US entity for web checkout.
- The config also carries a "Ranked #1 Education Platform (2025) Newsweek & Statista" badge.

**13 questions** (progress bar "x / 13"; "We will personalize your AI Trader Challenge based on your answers"):
1. Age: 18-34 / 35-44 / 45-54 / 55-64 / 65+ (five buckets, four of them 35+. Reviews read older too: retired, truck driver, GM)
2. "Which best matches your plan for AI trading now?" Second job / Side hustle / Hobby only / **Replace current job** 🚩
3. "Why are you interested in trading?" (multi) Flexible schedule / Not tied to salary / Being my own boss / Remote-friendly. Then an interstitial: "62% of Americans own stock (Gallup, 2025)… a calm, structured path"
4. "How do you feel about your financial situation?" comfortable / more stability / struggling
5. "What held you back?" (multi) No clear system / Not enough time / Felt too late / Too complicated. Then an interstitial: "64% named fear of losing money… Finelo breaks the loop. A simulator on live market data… on virtual money"
6. "How familiar are you with the basics of AI trading?" (5 levels)
7. "Will you take higher risks for bigger rewards?" The answer is reused on the offer as "Your trading profile: **High returns**". 🚩 This is close to a personalised risk profile.
8. "Is it hard for you to make quick decisions?"
9. "How confident are you about your financial future?"
10. "Do you feel **FOMO** when you see others making money with AI?"
11. "**How much do you think traders earn?** $30k–50k / $50k–100k / More than $100k" 🚩 This plants an income figure.
12. "How would you celebrate your first trading results?" Pay off bills / emergency fund / reinvest / retirement / mini vacation
13. "Let's set daily learning goal" 10 / 15 / 20 min

**Then:**
- A fake-progress screen ("Creating your personal challenge… 1 million+ people have chosen Finelo", Trustpilot cards).
- An **email gate**: "Enter your email to get your Personal AI Trader Challenge… do not miss your BONUS". **I stopped here.** I entered no email, and opening the summary or selling page directly redirects back to the gate.
- The page also hides a form asking automated browsers to identify themselves. I left it blank.

**Pricing page.** The quiz's public config (`_next/data/…/quote-social-proof.json`) shows what comes after the email gate:
- **Offer:** "Welcome discount: Your personal 28-day AI Trader challenge", with **1-week, 4-week and 12-week plans** in a dual-price layout: "Save $y with x% OFF" and the old price struck through.
- **Copy:** "12-week plan users are 23% more likely to complete…" and "91% of users are satisfied…"
- **Pressure tactics:** a **countdown** ("Your discount reserved for {time} min"), an auto-applied promo code ("Your promo code is applied!") and an exit sheet ("**GET 60% OFF**" special offer).
- **Other plans:** a **daily-billed challenge** ("charge… every day until I cancel"), a **lifetime** offer, and Basic vs Max tiers ("No AI explanations" vs "AI trade explanations").
- **Fine print:** "30-day money-back", a "$1 temporary authorization hold", PayPal and cards. The intro price then auto-renews at full price, and you cancel in the web profile.
- **Real prices:** finelo.com/pricing says "**$19.99** is a first-month discount price for our 4-week plan"; third-party sites list about $6.99 for 1 week and $39.99 for 12 weeks (unverified); one review says "$6.95 for a couple of weeks… then close to $100."
- **Checkout is on the web** (US merchant entity). People then download the app and log in.
- **The AI bots trade real money through Alpaca** where it's available: "our AI Bots rely on Alpaca as the trading broker, which isn't currently available in your country". 🚩 We should not touch this.

**Tracking stack on the quiz:** 5 Meta pixel IDs, TikTok pixel, Google Ads and GA, Bing UET, Taboola, AppLovin, Microsoft Clarity, plus a server-side `conversions.finelo.com` endpoint and a geo service. A full multi-network web-to-app machine.

## 3. Finelo in the app (App Store, finelo.com/app, 150 reviews; not on Mobbin; ScreensDesign page gone)
- **Format:** four 28-day challenges (Classic or AI-assisted, Trading or Investing); one few-minute lesson a day (concept → decision → outcome → reflection); quizzes, characters (Ben), audio; "300+ lessons".
- **Simulator:** virtual funds on real market data. "Practice trading risk-free in a real-time simulator."
- **AI:** AI Chart Analyzer (snap any chart), Smart Pattern Finder, AI Mentor chat, and 3 bot presets (Cautious, Momentum, Contrarian) in demo mode with virtual money, with real brokerage "depending on your region".
- **Gamification:** streaks (no penalty for missing a day), an activity leaderboard (not profit), achievements. No XP or leagues.
- **App Store purchases:** Premium $9.99 / $12.49 / $24.99 / $119.99; Personal AI Coach $19.99; AI Tools $19.99; AI Tools and Mentor pack $19.99–29.99.
- **Other:** 347 MB, rated 4+, tracks users (identifiers, third-party advertising), v1.50.2 (Nov 3, 2026).

**Reviews:** the 150 most recent US reviews cover just **one week** (Nov 9–16), about 21 a day.
- **91% are 4–5★**, mostly a few words written right after lesson 1. That suggests an early in-app review prompt.
- **What people love** (about 60 say so outright): easy for total beginners ("explained as if I were a child"), step-by-step structure, demo mode, audio ("I'm a truck driver"), "Duolingo for trading!"
- **What people hate** (14 of 150 are 1–3★):
  - misleading ads: "Utube commercial telling me to let AI bots trade for me" (3 reviews)
  - surprise upsells: "charged double to have the AI assistant" (3)
  - unclear or double charges: "charged twice", "unclear on charges" (4)
  - thinking money was being invested: "where is the money already spent… I thought it would be stacking in an account", "put up 20 bucks and don't know where it went" (2) 🚩
  - having to download a second app or open a brokerage account (2)
  - a rigid quiz (1)

## 4. The niche (AppKittie, US iOS unless noted; $/dl = monthly revenue ÷ monthly downloads)
| App (developer) | Launched | Rev/mo | DL/mo | $/dl | Ratings | 30-day rev growth |
|---|---|---|---|---|---|---|
| **Finelo** (Finelo Ltd / Zimran) | Oct 2024 | $311k | 31k | **$10.0** | 104k | +3% |
| Finelo Android (io.zimran.finelo) | Sep 2024 | $213k | 50k | $4.3 | 23k | +4% |
| **Finrise** (DeepFlow, Dubai studio) | **Jun 2026** | **$64k** | 25k | $2.6 | 2.0k | +11% |
| Profit AI – Trading Assistant | Mar 2025 | $50k | 9.7k | $5.2 | 3.9k | +67% |
| Forex Trading School & Game (Fitster) | 2015 | $22k | 10k | $2.2 | 11.4k | +260% |
| Trading Game Stock Market Sim (Chimpanzee) | 2023 | $19k | 8.5k | $2.2 | 7.0k | +8% |
| Best Brokers Stock Market Game | 2012 | $16k | 7.1k | $2.2 | 14k | −1% |
| Forex Trading for Beginners (Tiim) | 2014 | $15k | 10k | $1.5 | 2.9k | +5% |
| Day Trading Simulator & Games | May 2024 | $15k | 4.4k | $3.4 | 1.2k | +50% |
| Chart AI Pro Trading Assistant | Apr 2025 | $15k | 3.9k | $3.8 | 549 | +50% |
| TIC: AI Trading Journal | May 2026 | $11k | 8.0k | $1.4 | 19 | n/a |
| Trading Game: Stock Simulator | 2017 | $10k | 5.1k | $2.0 | 5.5k | −1% |
| ChartBuddy: Learn Trading | Jun 2026 | $7k | 5.9k | $1.2 | 216 | n/a |
| Finademy: Learn Stock Basics | 2019 | $6.5k | 3.7k | $1.7 | 6.4k | n/a |
| GameStock: Stock Market Game | Dec 2025 | $5.8k | 3.8k | $1.5 | 242 | +5% |
| Elearnmarkets (India) | 2020 | $5.5k | 3.2k | $1.7 | 1.2k | n/a |
| Redvest / Cryptomania / Paper Trading Sim / Mr. Bigshot | 2020–23 | $4–5k each | 4–6k | $0.8–1.3 | 14–1.5k | flat |
| Charty: Learn Day Trading | Feb 2025 | $3.2k | 4.0k | $0.8 | 194 | −6% |
| "Learn investing" newcomers 2025–26 (FinCamp, StockSim, Brevity, Stack…) | 2026 | **$0** | 0–2k | $0 | <10 | n/a |

**What the numbers say:**
- **It's a two-tier market.** Studio web-funnel players (Finelo, Finrise) make $64–311k. Simulators and old lesson apps cluster at **$3–22k** with $1.5–3.4 per download.
- **Funded studios are already entering in 2026.** Finrise has ~760 active Meta ads (long 2–3 min videos, "Install Now" straight to the App Store), and Finelo's App Store page lists it under "You Might Also Like". AI chart-analysis apps (Profit AI, Chart AI Pro) are a third, fast-growing cluster.
- **Finelo's $10 per download is inflated by the web funnel.** Many installs come from people who already paid on the web. A copycat selling only through the App Store should plan on Finrise's ~$2.6.

**App Store keywords (AppKittie, US popularity/difficulty):** trading 88/33 · crypto 90/36 (mostly exchanges) · **trading simulator 39/16** (the best opening) · learn trading 31/13 · forex trading 30/14 · learn stocks 23/13 · day trading 19/12 · stock market game 11/8.

Search is a side channel. Paid social is what drives this niche.

## 5. How they market
- **Finelo:**
  - Meta ads (keyword search found ~64 active), many run from **persona pages with personal names** ("Kevin Banks", "Gregory Ellis", "Chris Lawson"…, 25+ copies). The copy is "What if trading fit into your coffee break? ☕ AI bots handle the routine — you keep the free time 🚀", shows the domain BOTSERA.AI, and the description says "Finelo guides you with beginner-friendly lessons made for adults."
  - YouTube ads ("let AI bots trade for me", per reviews).
  - Creator partnership videos ("Kick-start your trading journey") that land on the quiz.
  - Tracking on Meta, TikTok, Google, Bing, Taboola and AppLovin.
- **Finrise:** ~760 Meta ads from its own branded page, 2–3 minute videos ("Master Trading Now", "Unlock Financial Literacy"), English and Spanish, sending people straight to the App Store.
- **Costs:** North American finance-app CPI fell from $7.03 to **$4.13** (Adjust 2026); global CPM ~$2.86 (Singular Q3 2026); iOS finance and business apps carry a **4.6×** CPI premium (Mintegral). Nano finance creators (5–20k followers) cost **$150–600 per video**, mid-tier (100–500k) $2.5–10k (vendor rate cards, rough).
- **Platform rules:**
  - **Meta (US):** since **Jan 14, 2025**, ads for "financial products and services" must use that Special Ad Category, which limits targeting (age, ZIP, detailed interests, lookalikes).
    - Pure education is usually outside it. Mentioning bots, brokers or "investment services" pulls you in.
    - Meta also requires licensed or verified advertisers for financial ads in some countries: India (SEBI for securities ads), Australia, Thailand, and the UK via FCA authorisation (reported; check each market's help page before targeting it).
  - **TikTok:** restricts investment advice, trading platforms, forex and binary options, and "get rich quick". Financial *education* is generally allowed (secondary source); branded finance content is banned in some markets (e.g. Australia).
  - **Apple:** 3.2.1(viii) says real trading apps must come from the licensed institution; 3.2.2 bans binary options. Virtual-money simulators are fine (dozens are live, Finelo included). Don't add a "link your broker" button or broker affiliate links.
  - **US law:** FTC Act §5 says earnings claims need proof (trading-course cases: Online Trading Academy 2020, $90M+ surrendered and a sales ban; Warrior Trading $3M; IM Mastery Academy 2025, $1.2B alleged). The Investment Advisers Act "publisher" exclusion covers impersonal, general education; a personalised "your profile → do this trade" crosses it. 🚩 Auto-renewal rules (ROSCA, state laws) cover intro-then-renewal paywalls.
  - **UK:** FCA **FG24/1** (Mar 2024) on finfluencers and social-media promotions. Pure education usually isn't a financial promotion. Naming a broker or investment, or affiliate links, makes it one, and promoting without approval is a criminal offence (the FCA charged finfluencers in 2024). The ASA also polices income claims.

## 6. Our angle: how a duck could beat Finelo honestly
1. **Game first, not "AI trader".**
   - The core loop is a **historical replay**: real past charts with the ticker hidden. Buy, sell or hold, fast-forward a week, see what happened, and the duck explains why.
   - Daily "Market Duck" puzzles, streaks, a weekly league scored on **risk-adjusted skill (a playful drawdown score), not profit**, and badges.
   - Lessons come as a 5-minute path between games.
   - This owns "trading simulator" (39/16) and "stock market game", and makes good TikTok clips ("I turned $10k fake into…").
2. **The duck as the face of honesty**, the opposite of Finelo's AI-bot dream: "Lose fake money here so you don't lose real money there." Positioning line: "Practice before it's real."
3. **Our own web quiz funnel:**
   - 10–12 questions about learning style, time, goals and fears, never income.
   - A **real** plan reveal (week 1 topics), then the email, then web checkout.
   - Since the anti-steering ruling (in force since the Supreme Court denied a stay on May 6, 2026), US apps may link out to web checkout with no Apple fee for now.
   - **Risk:** the Supreme Court took the contempt question on Jun 30, 2026 and argument is due this term. A commission could come back in 2027, so keep App Store purchases working as the fallback.
4. **Price under Finelo with a hard paywall:**
   - App Store: **$6.99/week** with a 3-day trial, or **$49.99/year** (pre-selected); lifetime $79.99 as an exit offer.
   - Web: 4 weeks for $14.99 intro, then $29.99 per 4 weeks; 12 weeks for $49.99.
   - Discounts must be real: the "was" price must actually have been charged. No fake countdowns. 🚩
5. **Free tier:** the first module plus one replay a day. Enough to hook, with a hard wall after.
6. **TikTok engine:** the owner posts 1–2 duck replay clips a day (screen recording plus voiceover). Then 3–5 nano finance creators at $150–600 each, with the rule "**no income claims, #ad, education only**" in the contract.
7. **Never build:** auto-trading bots, broker links, AI "buy X" signals, "profile: high returns", income questions or persona-page ads. 🚩

**Names (App Store US checked Nov 18):**
| Name | Taken? | Score | Note |
|---|---|---|---|
| **Paper Duck** | clear | **8/10** | "paper trading" pun, and it honestly says *fake money*. **Pick.** |
| Ticker Duck | clear | 7/10 | clear, a bit generic |
| Bull Duck | clear | 6/10 | fun, but weak meaning |
| Duckfolio | clear | 6/10 | sounds like a portfolio tracker |
| Quack Trader | clear | 3/10 | "quack" means a fraud, which is a terrible signal in finance |
| Duckets | **taken** ("Duckets App") | n/a | n/a |

## 7. Build effort (Expo, local-first)
**MVP (6–9 weeks with Claude for a non-coder):** 60 lessons and 300 replay scenarios as bundled JSON; charts with `react-native-wagmi-charts` or Skia; SQLite for progress, streaks and XP; StoreKit through `expo-iap`; local notifications for the streak.
**Not local-first:** a web funnel needs a small backend for accounts and entitlements (Supabase plus Stripe, and an email log-in in the app). He already runs this stack in AnkiDecks.

**Content risk:** AI-drafted lessons must be fact-checked. One wrong fact in finance is a 1★ review or a complaint.

**Market data:**
- **Historical end-of-day data** for replays is cheap: one-off datasets or Massive (ex-Polygon) Starter ~$29–99/mo. Store snapshots in the app, so there's no live feed and no per-user cost.
- **Live quotes** (a Finelo-style live simulator): Alpaca's free tier is IEX-only (partial volume); Finnhub's free tier is personal or limited commercial use; showing exchange data to app users needs **display/redistribution rights**, usually paid; for crypto exchange public APIs, check each one's terms.
- **Pick:** historical replay for v1 (cheap and licence-light). Add delayed or live data only once revenue covers a paid licence.

## 8. Money: test budget, payback, year 1
**Paid-ads payback (App Store only):**
- At CPI $3–5 and $2.6 per download (Finrise-like), you lose about $0.5–2.5 per install.
- To break even you need **≥ $4 per download**. That roughly means installs → trial ≥ 10%, trial → paid ≥ 35%, and about $35+ net per payer in year 1.

**Web funnel (Finelo-like), with assumptions marked:**
- Meta cost per click $0.8–1.5 (assumed).
- Quiz → email 35–45% and email → purchase 4–7% (assumed), so about 2% of clicks buy. That's **$40–75 to win a customer**.
- First charge $14.99, renewals $29.99 per 4 weeks. If 45% / 30% / 20% renew in months 2–4, value is ≈ $15 + $13.5 + $9 + $6 ≈ **$44–50 by day 120**, minus about 3% Stripe fees.
- **This is around break-even.** Finelo makes it work with upsells (AI Coach, packs), daily or lifetime offers and massive creative volume.

**Test budget:**
- **Phase 0 (free):** 30 days of organic TikTok. Kill if no clip passes 10k views.
- **Phase 1 ($3–5k):**
  - $3k Meta over 3 weeks (about 600–1,000 installs or 2,000+ quiz starts) plus $1k on 3–5 creators.
  - **Go if:** CPI ≤ $3.5, install → trial ≥ 8%, trial → paid ≥ 35%, and day-30 ROAS ≥ 0.6.
- **Phase 2:** scale to $20–50k only while payback stays under 90 days. You also need $10–20k of cash float, because Apple pays about 33–45 days after month end.

**Year-1 gross (App Store plus web, before Apple's 15% and ad spend):**
| | Bear | Base | Bull |
|---|---|---|---|
| No ads (ASO + TikTok) | $1–3k (like 2026 "learn investing" apps) | $15–25k (ramp to ~$3k/mo, like Charty/ChartBuddy) | $60–100k (a viral sim clip, $10k/mo by month 9) |
| $30k ads, reinvested | $12k revenue, **−$20k net** | $50–70k revenue, about break-even | $200–300k revenue (a quarter of Finrise's curve), +$60–100k net, needs $40k float |

## 9. Go / no-go
| Factor | Score /10 |
|---|---|
| Market size and proof | 9 |
| Room for an honest player | 4 (the big money sits on the "AI side hustle" promise) |
| Competition (Zimran, DeepFlow, AI-chart apps) | 3 |
| Fit with our two hard lines | 5 (fine as a game; the clone path crosses them) |
| Solo build effort | 6 |
| Organic and TikTok fit for the duck | 7 |
| Cash needed to win on paid | 3 |
| **Overall** | **5/10: not now.** **No-go on a Finelo clone (3/10).** **Conditional go on Paper Duck, a trading-sim game (5.5/10)**, after Ditch ships, with a $3–5k cap and the kill rules in §8. |

## Sources
- AppKittie API (list-apps + keyword difficulty), Nov 18, 2026: scratchpad `ak/tn_*.json`, `ak/r9_*.json`, `ak/sk_finelo.json`, log `ak_log.tsv`.
- Funnel: [quiz.finelo.com/dynamic](https://quiz.finelo.com/dynamic), [Subscription terms](https://legal.finelo.com/subscription), [finelo.com/pricing](https://finelo.com/pricing), [finelo.com/app](https://finelo.com/app), [finelo.com/ai](https://finelo.com/ai); screenshots and config in scratchpad `finelo/`.
- App Store: [Finelo](https://apps.apple.com/us/app/id6670422243) · [Finrise](https://apps.apple.com/us/app/id6761892518) · [Profit AI](https://apps.apple.com/us/app/id6743035682) · [Forex Trading School & Game](https://apps.apple.com/us/app/id1011097561) · [Day Trading Simulator](https://apps.apple.com/us/app/id6498900321) · [Trading Game Stock Market Sim](https://apps.apple.com/us/app/id6451070439) · [ChartBuddy](https://apps.apple.com/us/app/id6775106732) · [Charty](https://apps.apple.com/us/app/id6741344263) · [Google Play: Finelo](https://play.google.com/store/apps/details?id=io.zimran.finelo)
- Reviews: `https://itunes.apple.com/us/rss/customerreviews/page=1..3/id=6670422243/sortby=mostrecent/json`.
- Meta Ad Library (US, active, keyword "finelo" / "finrise"): [Finelo search](https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=finelo) · [Finrise search](https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=finrise)
- Third-party pricing: [Plisio Finelo review](https://plisio.net/profiles/finelo-review) · [Nibble blog](https://nibble-app.com/blog/finelo-reviews) (competitor blog)
- Epic v. Apple: [MacRumors, Apr 29 2026](https://macrumors.com/2026/04/29/epic-games-wins-reversal-app-store-fee-battle/) · [TNW, stay denied May 6 2026](https://thenextweb.com/news/supreme-court-apple-epic-contempt-stay-denial) · [IPWatchdog, cert granted Jun 30 2026](https://ipwatchdog.com/2026/06/30/high-court-grants-cert-in-apples-challenge-to-ninth-circuit-contempt-ruling-in-app-store-dispute/) · [WLF case page](https://www.wlf.org/case/epic-games-v-apple-inc/)
- Ads rules: [Meta special ad category docs](https://developers.facebook.com/docs/marketing-api/audiences/special-ad-category) · [Meta financial services policy](https://transparency.meta.com/en-gb/policies/ad-standards/restricted-goods-services/financial-services/) · [Meta SEBI verification (ppc.land)](https://ppc.land/meta-mandates-sebi-verification-for-india-securities-ads/) · [Meta Thailand verification](https://ppc.land/meta-expands-advertiser-verification-for-thailand-campaigns/) · [Meta Australia verification](https://www.moneymag.com.au/meta-to-combat-social-media-finance-scams-introduces-new-ad-verification) · [TikTok financial services policy](https://ads.tiktok.com/help/article/tiktok-ads-policy-financial-services) · [TikTok AU branded content ban](https://mumbrella.com.au/tiktok-prohibits-financial-services-and-products-branded-content-693178)
- Apple: [Guideline 3.2.1(viii) forum](https://developer.apple.com/forums/thread/771105) · [Mondaq on fintech approvals](https://www.mondaq.com/unitedstates/fin-tech/1483090/the-long-and-winding-road-navigating-fintech-and-crypto-app-approvals-by-the-apple-store)
- Regulators: [FCA FG24/1](https://fca.org.uk/publications/finalised-guidance/fg24-1-finalised-guidance-financial-promotions-social-media) · [A&O Shearman on FCA finfluencer charges](https://www.aoshearman.com/en/insights/ao-shearman-on-investigations/the-reel-cost-fca-cracks-down-on-finfluencers) · [FTC: Online Trading Academy](https://www.ftc.gov/news-events/news/press-releases/2020/09/ftc-settlement-requires-online-trading-academy-forgive-consumer-debt-principals-turn-over-millions) · [Warrior Trading $3M](https://advertisinglaw.fkks.com/post/102hn6f/ftc-gets-3m-settlement-over-false-money-making-claims) · [IM Mastery Academy (The Block)](https://www.theblock.co/news/business/2025-05-02-ftc-nevada-sue-crypto-trading-course-firm-for-1-2-billion-fraud-targeting-young-investors-353013)
- Costs: [Adjust Mobile App Trends 2026](https://www.adjust.com/resources/ebooks/mobile-app-trends-2026/) · [Singular Q3 2026](https://www.singular.net/quarterly-report-2026-q3-pt/) · [Mintegral non-gaming 2026](https://gameindustrylibrary.com/documents/global-non-gaming-app-trends-report-2026/read) · [Elev8or finance creator rates](https://www.elev8or.io/blog/what-finance-influencers-charge-in-2026)
- Data APIs: [QVeris free stock API comparison](https://qveris.ai/guides/stock-api-free-comparison/) (vendor-affiliated; check each provider's terms)
- Earlier rounds: `skill-pick-2026-11-18.md` (scored personal finance 4.5, "no, for us").
