<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SiteVisit extends Model
{
    protected $connection = 'auth';

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'host',
        'ip_address',
        'city',
        'region',
        'country',
        'org',
        'user_agent',
        'path',
        'referer',
        'created_at',
        'is_bot',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    private const BOT_PATTERN = '/bot|crawler|spider|slurp|scan|wget|curl|python|go-http|java|ruby|nuclei|zgrab|nmap|nikto|sqlmap|masscan|facebookexternalhit|applebot|powershell|symfony|http-client|libwww-perl|axios|node-fetch|postmanruntime|insomnia|okhttp|winhttp|guzzle|mistralai|anthropic-ai|compatible;|trident\//i';

    private const HOSTING_ORG_PATTERN = '/amazon|aws|microsoft|azure|google|digitalocean|ovh|hetzner|linode|akamai|oracle|alibaba|tencent|cloudflare|vultr|choopa|contabo|scaleway|leaseweb|hostinger|godaddy|ionos|datacamp|m247|psychz|zenlayer|ddos-guard|colocrossing|hostwinds|namecheap/i';

    private const LOOPBACK_IPS = ['127.0.0.1', '::1', 'localhost'];

    private const SCAN_PATH_PATTERN = '#\.\.|\.env|\.git/|wp-admin|wp-content|wp-login|wp-config|wp-json|xmlrpc\.php|phpmyadmin|\.aws/|\.ssh/|\.docker|eval-stdin|\.well-known/security|vendor/phpunit|config\.json$|config\.js$|\.htpasswd|\.htaccess|\.bak$|\.sql$|\.zip$|\.tar\.gz$|actuator|core/CHANGELOG|user/login|remote/login|rest/login|dana-na|WebInterface/Login|composer\.json$|mgmt/shared/authn|global-protect|tmui/login|fortisandbox|\.s3cfg|\.boto|s3cfg|s3credentials|aws-credentials|server-status|cacti|cpanel|administrator/|control/main|SetupWizard\.aspx#i';

    private const ALLOWED_HOST_SUFFIXES = ['graveyardjokes.com', 'graveyardjokes.test', 'palineofficial.com'];

    public static function isRecognizedHost(?string $host): bool
    {
        if (empty($host)) {
            return false;
        }

        $host = strtolower($host);

        foreach (self::ALLOWED_HOST_SUFFIXES as $suffix) {
            if ($host === $suffix || str_ends_with($host, '.'.$suffix)) {
                return true;
            }
        }

        return false;
    }

    public static function isBot(?string $userAgent, ?string $ip = null, ?string $path = null, ?string $host = null): bool
    {
        if ($ip !== null && in_array($ip, self::LOOPBACK_IPS, true)) {
            return true;
        }

        if ($path !== null && preg_match(self::SCAN_PATH_PATTERN, $path)) {
            return true;
        }

        if ($host !== null && ! self::isRecognizedHost($host)) {
            return true;
        }

        return empty($userAgent) || (bool) preg_match(self::BOT_PATTERN, $userAgent);
    }

    public static function isHostingProvider(?string $org): bool
    {
        return ! empty($org) && (bool) preg_match(self::HOSTING_ORG_PATTERN, $org);
    }

    // Uses indexed is_bot column — set at write time to avoid full table scans
    public function scopeHuman($query): void
    {
        $query->where('is_bot', false);

        $excludedIps = config('analytics.excluded_ips', []);
        if (! empty($excludedIps)) {
            $query->where(function ($q) use ($excludedIps) {
                $q->whereNull('ip_address')->orWhereNotIn('ip_address', $excludedIps);
            });
        }

        $query->where(function ($q) {
            $q->whereNull('ip_address')->orWhereNotIn('ip_address', function ($sub) {
                $sub->select('ip_address')
                    ->from('site_visits')
                    ->where('is_bot', true)
                    ->whereNotNull('ip_address');
            });
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getBrowserAttribute(): string
    {
        $ua = $this->user_agent ?? '';

        if (str_contains($ua, 'Edg/') || str_contains($ua, 'Edge/')) {
            return 'Edge';
        }
        if (str_contains($ua, 'OPR/') || str_contains($ua, 'Opera')) {
            return 'Opera';
        }
        if (str_contains($ua, 'Chrome/')) {
            return 'Chrome';
        }
        if (str_contains($ua, 'Firefox/')) {
            return 'Firefox';
        }
        if (str_contains($ua, 'Safari/')) {
            return 'Safari';
        }

        return 'Other';
    }
}
