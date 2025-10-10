<!DOCTYPE html>
<html>
<head>
    <title>Subdomain Tracking Test</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
</head>
<body>
    <h1>Subdomain Tracking Test</h1>
    <p>Current domain: <span id="domain"></span></p>
    <p>Tracking status: <span id="status">Testing...</span></p>
    
    <script>
        document.getElementById('domain').textContent = window.location.hostname;
        
        // Test tracking
        async function testTracking() {
            try {
                const currentHost = window.location.hostname;
                const isLocalDev = currentHost.includes('.test') || currentHost === 'localhost';
                
                const trackingUrl = isLocalDev 
                    ? '/track-visit'
                    : currentHost === 'graveyardjokes.com' 
                        ? '/track-visit'
                        : 'https://graveyardjokes.com/track-visit';
                
                const fetchOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    },
                    body: JSON.stringify({
                        referrer: window.location.href,
                        subdomain: window.location.hostname
                    })
                };

                if (trackingUrl.startsWith('https://')) {
                    fetchOptions.credentials = 'include';
                }

                const response = await fetch(trackingUrl, fetchOptions);
                const data = await response.json();
                
                document.getElementById('status').textContent = 'Success! Check your email.';
                document.getElementById('status').style.color = 'green';
                console.log('Tracking result:', data);
            } catch (error) {
                document.getElementById('status').textContent = 'Error: ' + error.message;
                document.getElementById('status').style.color = 'red';
                console.error('Tracking error:', error);
            }
        }
        
        // Auto-test on page load
        testTracking();
    </script>
</body>
</html>