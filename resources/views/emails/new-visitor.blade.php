<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Visitor Alert</title>
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
            background-color: #f4f4f4;
            padding: 20px;
            text-align: center;
            border-radius: 5px;
        }
        .content {
            padding: 20px 0;
        }
        .visitor-info {
            background-color: #e8f5e8;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }
        .info-row {
            margin: 10px 0;
            padding: 5px 0;
        }
        .label {
            font-weight: bold;
            color: #2c3e50;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 14px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎉 New Visitor Alert!</h1>
        <p>Someone just visited your website</p>
    </div>

    <div class="content">
        <p>Hello Joshua,</p>
        
        <p>You have a new visitor on <strong>{{ config('app.name') }}</strong>!</p>

        <div class="visitor-info">
            <h3>Visitor Information:</h3>
            
            <div class="info-row">
                <span class="label">📍 Location:</span>
                {{ $visitor['city'] }}, {{ $visitor['region'] ?? '' }}{{ isset($visitor['region']) ? ', ' : '' }}{{ $visitor['country'] }}
            </div>
            
            @if(isset($visitor['timezone']))
            <div class="info-row">
                <span class="label">⏰ Timezone:</span>
                {{ $visitor['timezone'] }}
            </div>
            @endif
            
            <div class="info-row">
                <span class="label">🌐 IP Address:</span>
                {{ $visitor['ip'] }}
            </div>
            
            <div class="info-row">
                <span class="label">🕒 Visit Time:</span>
                {{ $visitor['timestamp'] }}
            </div>
            
            @if(isset($visitor['subdomain']))
            <div class="info-row">
                <span class="label">🌐 Subdomain:</span>
                {{ $visitor['subdomain'] }}
            </div>
            @endif
            
            @if(isset($visitor['referrer']))
            <div class="info-row">
                <span class="label">🔗 Referrer:</span>
                {{ $visitor['referrer'] }}
            </div>
            @endif
            
            <div class="info-row">
                <span class="label">💻 Browser:</span>
                {{ $visitor['user_agent'] }}
            </div>
        </div>

        <p>This visitor was automatically tracked by your website's visitor monitoring system.</p>
    </div>

    <div class="footer">
        <p>Best regards,<br>
        Your Website Monitoring System</p>
        
        <p><em>This email was sent automatically. You can modify the notification settings in your Laravel application.</em></p>
    </div>
</body>
</html>