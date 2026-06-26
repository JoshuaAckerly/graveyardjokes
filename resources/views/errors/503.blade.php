<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="robots" content="noindex,nofollow">
    <title>We'll Be Back — Graveyard Jokes Studios</title>
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet">
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
            --bg:      oklch(0.33 0.025 147.23);
            --card:    oklch(0.706 0.148 145.35 / 0.85);
            --primary: oklch(80.808% 0.22159 144.175 / 0.85);
            --accent:  oklch(0.2988 0.0406 145.73);
        }

        html, body {
            height: 100%;
            font-family: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif;
            background: var(--bg);
            color: #fff;
        }

        .hero {
            position: relative;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 2rem 1.5rem 6rem;
            overflow: hidden;
        }

        .hero-img {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0.35;
            pointer-events: none;
        }

        .hero-gradient-top {
            position: absolute;
            inset: 0;
            background: linear-gradient(to bottom, var(--bg) 0%, transparent 35%, transparent 65%, var(--bg) 100%);
            pointer-events: none;
        }

        .content {
            position: relative;
            z-index: 10;
            max-width: 680px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1.5rem;
        }

        .skull { font-size: 4rem; animation: bob 3s ease-in-out infinite; }

        @keyframes bob {
            0%, 100% { transform: translateY(0); }
            50%       { transform: translateY(-10px); }
        }

        h1 {
            font-size: clamp(2rem, 6vw, 3.5rem);
            font-weight: 700;
            line-height: 1.1;
            background: var(--card);
            padding: 1.25rem 2rem;
            border-radius: 0.75rem;
        }

        .tagline {
            font-size: clamp(1rem, 2.5vw, 1.2rem);
            color: rgba(255,255,255,0.75);
            max-width: 500px;
            line-height: 1.6;
        }

        .badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.15);
            border-radius: 999px;
            padding: 0.5rem 1.25rem;
            font-size: 0.9rem;
            color: rgba(255,255,255,0.8);
        }

        .badge span { font-size: 1rem; }

        .joke-box {
            width: 100%;
            background: rgba(255,255,255,0.06);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 0.75rem;
            padding: 1.5rem;
        }

        .joke-setup {
            font-size: 1.05rem;
            color: #fff;
            min-height: 1.5rem;
        }

        .joke-punchline {
            margin-top: 0.75rem;
            font-size: 0.9rem;
            color: rgba(255,255,255,0.55);
            min-height: 1.2rem;
            font-style: italic;
        }

        .joke-btn {
            margin-top: 1rem;
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
            background: var(--card);
            color: #fff;
            border: none;
            border-radius: 0.5rem;
            padding: 0.5rem 1.1rem;
            font-size: 0.9rem;
            font-family: inherit;
            cursor: pointer;
            transition: background 0.2s;
        }

        .joke-btn:hover { background: var(--accent); }

        .contact-link {
            font-size: 0.85rem;
            color: rgba(255,255,255,0.45);
        }

        .contact-link a {
            color: var(--primary);
            text-decoration: none;
        }

        .contact-link a:hover { text-decoration: underline; }

        .footer-img-wrap {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 180px;
            pointer-events: none;
            z-index: 1;
        }

        .footer-img-wrap img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0.5;
        }

        .footer-img-wrap::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(to bottom, var(--bg) 0%, transparent 100%);
            z-index: 2;
        }
    </style>
</head>
<body>
    <div class="hero">
        <img class="hero-img"
             src="https://d3fjkusrpksks7.cloudfront.net/graveyardjokes/images/AdobeStock_327183052.webp"
             alt="">
        <div class="hero-gradient-top"></div>

        <div class="content">
            <div class="skull">💀</div>

            <h1>We're Digging<br>Something Up</h1>

            <p class="tagline">
                The site is down for a quick security audit — making sure nothing
                haunts us later. We'll be back from the grave soon.
            </p>

            <div class="badge">
                <span>🔒</span> Security audit in progress — back shortly
            </div>

            <div class="joke-box">
                <p class="joke-setup" id="joke-setup">Loading a grave joke…</p>
                <p class="joke-punchline" id="joke-punchline"></p>
                <button class="joke-btn" onclick="loadJoke()">
                    💀 Another one
                </button>
            </div>

            <p class="contact-link">
                Urgent? Reach out at
                <a href="mailto:joshua@graveyardjokes.com">joshua@graveyardjokes.com</a>
            </p>
        </div>

        <div class="footer-img-wrap">
            <img src="https://d3fjkusrpksks7.cloudfront.net/graveyardjokes/images/AdobeStock_471779082.webp" alt="">
        </div>
    </div>

    <script>
        const jokes = [
            { setup: "Why don't skeletons fight each other?", punchline: "They don't have the guts." },
            { setup: "What do you call a skeleton who won't work?", punchline: "Lazy bones." },
            { setup: "Why did the skeleton go to the party alone?", punchline: "He had no body to go with." },
            { setup: "What do you call a skeleton that lies?", punchline: "A boney liar." },
            { setup: "Why did the skeleton cross the road?", punchline: "To get to the body shop." },
            { setup: "What do skeletons order at restaurants?", punchline: "Spare ribs." },
            { setup: "What's a skeleton's least favourite room?", punchline: "The living room." },
            { setup: "Why did the ghost go to the bar?", punchline: "For the boos." },
            { setup: "What do you call two witches who share an apartment?", punchline: "Broom-mates." },
            { setup: "Why don't mummies take vacations?", punchline: "They're afraid to unwind." },
        ];

        let last = -1;

        function loadJoke() {
            let idx;
            do { idx = Math.floor(Math.random() * jokes.length); } while (idx === last);
            last = idx;
            document.getElementById('joke-setup').textContent = jokes[idx].setup;
            document.getElementById('joke-punchline').textContent = jokes[idx].punchline;
        }

        loadJoke();
    </script>
</body>
</html>
