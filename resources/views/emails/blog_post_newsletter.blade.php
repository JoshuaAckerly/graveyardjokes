<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $post->title }} — Graveyard Jokes Studios</title>
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
        .header span {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #888;
        }
        .header h1 {
            margin: 8px 0 0;
            font-size: 22px;
            color: #fff;
        }
        .content {
            background: #f8f9fa;
            padding: 28px 24px;
            border: 1px solid #e9ecef;
        }
        .content p {
            margin: 0 0 16px;
        }
        @if($post->featured_image)
        .hero-image {
            width: 100%;
            height: auto;
            border-radius: 6px;
            margin-bottom: 20px;
            display: block;
        }
        @endif
        .cta {
            display: inline-block;
            background: #1a1a1a;
            color: #fff;
            padding: 12px 24px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: bold;
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
        <span>New post from the studio</span>
        <h1>{{ $post->title }}</h1>
    </div>

    <div class="content">
        @if($post->featured_image)
            <img src="{{ $post->featured_image }}" alt="{{ $post->title }}" class="hero-image">
        @endif

        @if($post->excerpt)
            <p>{{ $post->excerpt }}</p>
        @endif

        <a href="{{ $postUrl }}" class="cta">Read the full post →</a>

        <p style="font-size: 13px; color: #666; margin-top: 24px;">
            <a href="{{ $unsubscribeUrl }}">Unsubscribe</a> from these emails at any time.
        </p>
    </div>

    <div class="footer">
        Graveyard Jokes Studios &mdash; graveyardjokes.com<br>
        <a href="{{ $unsubscribeUrl }}">Unsubscribe</a>
    </div>
</body>
</html>
