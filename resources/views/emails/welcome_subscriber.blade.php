<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to the Graveyard Jokes Studios blog</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: #1a1a1a;
            color: white;
            padding: 28px 24px;
            border-radius: 8px 8px 0 0;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 22px;
            letter-spacing: 0.03em;
        }
        .header p {
            margin: 6px 0 0;
            font-size: 13px;
            color: #aaa;
        }
        .content {
            background: #f8f9fa;
            padding: 28px 24px;
            border: 1px solid #e9ecef;
        }
        .content p {
            margin: 0 0 16px;
        }
        .cta {
            display: inline-block;
            background: #1a1a1a;
            color: #fff;
            padding: 12px 24px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: bold;
            margin: 8px 0 16px;
        }
        .footer {
            background: #343a40;
            color: #aaa;
            padding: 16px;
            border-radius: 0 0 8px 8px;
            text-align: center;
            font-size: 12px;
        }
        .footer a {
            color: #aaa;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Graveyard Jokes Studios</h1>
        <p>graveyardjokes.com</p>
    </div>

    <div class="content">
        <p>Thanks for subscribing — you're in.</p>
        <p>
            You'll get an email whenever a new post goes up on the blog. No spam,
            no digest cadence — just new posts when they happen.
        </p>
        <a href="{{ rtrim(config('app.url', ''), '/') }}/studio/blog" class="cta">Browse the blog →</a>
        <p style="font-size: 13px; color: #666; margin-top: 16px;">
            Changed your mind? <a href="{{ $unsubscribeUrl }}">Unsubscribe in one click</a>.
        </p>
    </div>

    <div class="footer">
        Graveyard Jokes Studios &mdash; graveyardjokes.com<br>
        <a href="{{ $unsubscribeUrl }}">Unsubscribe</a>
    </div>
</body>
</html>
