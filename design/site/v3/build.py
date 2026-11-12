"""Builds three home-page directions (a, b, c) from shared sections. Run: python3 design/site/v3/build.py"""
from pathlib import Path

D = Path(__file__).parent
P = 'public-assets'
L = '../../../assets/logos'

NAV = f'''<div class="wrap nav"><a class="wm" href="#">ditch</a><div class="links"><a href="#">Cancel guides</a><a href="#">Prices</a><a href="#">Pricing</a><a href="#">Support</a></div><div class="sp"></div>
<span class="ib" aria-hidden><svg width="20" height="20" viewBox="0 0 20 20"><circle cx="8.5" cy="8.5" r="6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M13 13l5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></span><a class="btn sm" href="#">Join the waitlist</a><span class="ib menu">☰</span></div>'''
EMAIL = '<form class="email"><input type="email" placeholder="you@email.com" aria-label="Email"><button class="btn" type="button">Join the waitlist</button></form>'

HERO = {
'a': f'''<header style="background:var(--sun);overflow:hidden">{NAV}
<div class="wrap" style="display:grid;grid-template-columns:minmax(0,6fr) minmax(0,6fr);gap:40px;align-items:center;padding-top:40px">
 <div style="padding-bottom:80px"><h1 class="h1">Ditch it before it <span class="hl">renews.</span></h1>
 <p class="lead" style="color:var(--sunfg2);margin-top:28px;max-width:32rem">See everything you pay for, and get a reminder 3 days before every charge. No bank login. No account.</p>
 <div style="margin-top:36px">{EMAIL}</div><p class="fine" style="color:var(--sunfg2)"><b>Free forever for tracking.</b> Reminders on 3, or all of them with Pro. Coming to iPhone.</p></div>
 <img src="{P}/art/hero-hand.webp" alt="Ditch on an iPhone, showing $90.95 a month and the next reminder" style="width:100%;max-width:560px;justify-self:end;margin-bottom:-2px">
</div></header>''',
'b': f'''<header>{NAV}
<div class="wrap" style="text-align:center;padding-top:64px"><p class="eb">Subscription tracker for iPhone</p>
 <h1 class="h1" style="margin:20px auto 0;max-width:12ch">Ditch it before it <span class="ul">renews.</span></h1>
 <p class="lead" style="margin:28px auto 0;max-width:34rem">See everything you pay for. Get a reminder 3 days before every charge. No bank login, no account.</p>
 <div style="margin:36px auto 0;max-width:500px">{EMAIL}</div><p class="fine"><b>Free forever for tracking.</b> Reminders on 3, or all with Pro.</p>
 <div style="margin-top:56px;border-radius:36px;overflow:hidden"><img src="{P}/art/two-phones.webp" alt="Ditch on two iPhones: your yearly total and your list" style="width:100%"></div>
</div></header>''',
'c': f'''<header style="overflow:hidden">{NAV}
<div class="wrap" style="display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:48px;align-items:center;padding:48px var(--pad) 0">
 <div><p class="eb">Most people guess low. In one study, the real total was 2.5× the guess.</p><h1 class="h1" style="margin-top:20px">What do <span class="hl">you</span> pay for?</h1>
 <p class="lead" style="margin-top:24px;max-width:32rem">Tap what you have and see your real yearly total. Then Ditch reminds you before every charge.</p>
 <div style="display:grid;grid-template-columns:repeat(var(--cols,6),minmax(0,1fr));gap:10px;margin-top:32px;max-width:560px">
  {''.join(f'<div style="background:#fff;border:2px solid {"var(--ink)" if i<5 else "var(--hair)"};border-radius:16px;padding:12px 4px;text-align:center;font-size:12px;font-weight:600"><img src="{L}/{s}.png" style="width:40px;height:40px;border-radius:9px;margin:0 auto 6px">{n}</div>' for i,(s,n) in enumerate([('netflix','Netflix'),('spotify','Spotify'),('chatgpt-plus','ChatGPT'),('amazon-prime','Prime'),('disney-plus','Disney+'),('max','Max'),('youtube-premium','YouTube'),('apple-music','Music'),('xbox-game-pass','Game Pass'),('claude-pro','Claude'),('hulu','Hulu'),('peacock','Peacock')]))}
 </div>
 <div style="display:flex;align-items:baseline;gap:12px;margin-top:24px"><span class="h1 num" style="font-size:64px">$965</span><b style="font-size:20px">a year</b></div>
 <div style="margin-top:20px">{EMAIL}</div></div>
 <img src="{P}/art/flatlay-total.webp" alt="Ditch on an iPhone showing $1,157 a year" style="width:100%;border-radius:32px">
</div></header>''',
}

SECTIONS = f'''
<section class="wrap" style="margin-top:0"><div class="proof">
 <div><b class="num">42</b><span>services with checked prices</span></div><div><b class="num">17</b><span>countries, in local money</span></div>
 <div><b class="num">1,581</b><span>plan prices checked by hand</span></div><div><b>Nov 12</b><span>last checked · how</span></div></div></section>

<section class="sec"><div class="wrap"><div class="head"><p class="eb">How it works</p><h2 class="h2">Three taps. Then you’re covered.</h2></div>
<div class="steps">
 <div class="step"><div class="t"><span class="n">1</span><h3 class="h3">Tap what you pay for</h3><p>Real logos, real prices for your country. Anything else, type it in.</p></div><div class="pic"><img src="{P}/app/services-list.webp" alt=""></div></div>
 <div class="step"><div class="t"><span class="n">2</span><h3 class="h3">Get a reminder</h3><p>3 days and 1 day before each charge, at 9:00. Trials too.</p></div><div class="pic" style="align-items:center;padding-bottom:28px"><img src="{P}/app/lock.webp" alt="" style="border-radius:22px;width:92%"></div></div>
 <div class="step"><div class="t"><span class="n">3</span><h3 class="h3">Ditch what you don’t use</h3><p>Hold to ditch. Ditch opens the official cancel page for you to finish.</p></div><div class="pic" style="align-items:center;padding-bottom:28px"><img src="{P}/app/ditched-top.webp" alt="" style="border-radius:22px;width:100%"></div></div>
</div></div></section>

<section class="sec" style="padding-top:0"><div class="wrap split">
 <div><p class="eb">The whole point</p><h2 class="h2" style="margin-top:12px">Reminders that actually go off.</h2>
 <p class="lead" style="margin-top:20px">In 5,535 reviews of other trackers, reminders that never came were one of the biggest complaints. Ditch plans every reminder on your phone and shows you the next one.</p>
 <ul class="ticks"><li>3 days and 1 day before<span>Or pick your own days with Pro.</span></li><li>Trials too<span>Know before a free trial turns into a charge.</span></li><li>Send yourself a test<span>A real reminder in 5 seconds.</span></li></ul></div>
 <div class="frame"><img src="{P}/app/home-top.webp" alt="Ditch home: $90.95 a month, next reminder Netflix"></div>
</div></section>

<section class="sec" style="padding-top:0"><div class="wrap"><div class="head"><p class="eb">Pricing</p><h2 class="h2">Yes, Pro is a subscription. It costs less than the ones it catches.</h2></div>
<div class="vs"><div><b class="num">$2.50</b><span>a month for Pro, billed $29.99 a year</span></div><div><b>~$205</b><span>a year people lose on subscriptions they don’t use (CNET/YouGov, 2025)</span></div><div><b class="num">$49.99</b><span>once, if you’d rather not subscribe at all</span></div></div>
<div class="money">
 <div class="plan"><div class="row"><span class="h3">Free</span></div><div class="price">$0</div><p class="per">forever. No card, no account.</p><ul><li>Track every subscription</li><li>Totals, calendar, cancel guides</li><li>Reminders on 3 subscriptions</li><li class="no">Pick reminder days</li><li class="no">Nudge if you miss one</li></ul></div>
 <div class="plan pro"><div class="row"><span class="h3">Pro</span><span class="tag">7 days free</span></div><div class="price num">$29.99<small style="font-size:18px;font-family:var(--body);font-weight:600"> /yr</small></div><p class="per">about $2.50 a month, or $4.99 monthly. Cancel anytime.</p><ul><li>Track every subscription</li><li>Totals, calendar, cancel guides</li><li><b>Reminders on every subscription</b></li><li>Pick reminder days</li><li>Nudge if you miss one</li></ul></div>
 <div class="plan life"><div class="row"><span class="h3">Lifetime</span><span class="tag">No subscription</span></div><div class="price num">$49.99</div><p class="per">once. Everything in Pro, yours for good.</p><ul><li>Everything in Pro</li><li>Pay once, never renews</li><li>Restore on a new iPhone</li></ul></div>
</div></div></section>

<section class="sec" style="padding-top:0"><div class="wrap"><div class="head"><p class="eb">Guides</p><h2 class="h2">Want out? There’s a guide for that.</h2><p class="lead">Official cancel links and steps, split by how you pay. Checked by hand, dated.</p></div>
<div class="cats">
 <a class="cat" href="#"><div class="stk"><img src="{L}/netflix.png"><img src="{L}/disney-plus.png"><img src="{L}/max.png"></div><b>Streaming</b><span>10 guides</span></a>
 <a class="cat" href="#"><div class="stk"><img src="{L}/spotify.png"><img src="{L}/apple-music.png"><img src="{L}/youtube-music.png"></div><b>Music</b><span>4 guides</span></a>
 <a class="cat" href="#"><div class="stk"><img src="{L}/claude-pro.png"><img src="{L}/google-ai-pro.png"></div><b>AI</b><span>2 guides</span></a>
 <a class="cat" href="#"><div class="stk"><img src="{L}/xbox-game-pass.png"><img src="{L}/ps-plus.png"><img src="{L}/nintendo-online.png"></div><b>Gaming</b><span>4 guides</span></a>
</div></div></section>

<section class="wrap"><div class="final"><div class="c"><h2 class="h2">Be first when it’s out.</h2><p class="lead">One email when Ditch is on the App Store. Want the monthly Price Hike Report too? Tick the box.</p>{EMAIL}</div>
<img src="{P}/art/hero-hand.webp" alt="" style="max-height:520px;object-position:center 20%"></div></section>

<footer><div class="wrap"><div class="cols"><div><b>Cancel guides</b><a>Cancel Netflix</a><a>Cancel Spotify</a><a>Cancel Disney+</a></div><div><b>Prices</b><a>Netflix prices</a><a>Spotify prices</a><a>All prices</a></div><div><b>Ditch</b><a>Pricing</a><a>Support</a><a>About</a></div><div><b>Legal</b><a>Privacy</a><a>Terms</a></div></div><div class="giant">ditch</div></div></footer>
'''

for k, hero in HERO.items():
    (D / f'{k}.html').write_text(f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ditch v3 {k}</title><link rel="stylesheet" href="v3.css">'
        '<style>@media (max-width:860px){header > .wrap{grid-template-columns:minmax(0,1fr)!important}:root{--cols:4}}</style></head><body>' + hero + SECTIONS + '</body></html>')
print('ok')
