<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteVisit;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function index(): Response
    {
        $now = now();
        $thirtyDaysAgo = $now->copy()->subDays(30);
        $sevenDaysAgo = $now->copy()->subDays(7);

        $totalVisits = SiteVisit::human()->count();
        $visitsLast30Days = SiteVisit::human()->where('created_at', '>=', $thirtyDaysAgo)->count();
        $visitsLast7Days = SiteVisit::human()->where('created_at', '>=', $sevenDaysAgo)->count();
        $uniqueIpsLast30 = SiteVisit::human()->where('created_at', '>=', $thirtyDaysAgo)
            ->distinct('ip_address')
            ->count('ip_address');
        $loggedInLast30 = SiteVisit::human()->where('created_at', '>=', $thirtyDaysAgo)
            ->whereNotNull('user_id')
            ->count();

        $dailyVisits = SiteVisit::human()->select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('COUNT(*) as count')
        )
            ->where('created_at', '>=', $now->copy()->subDays(13)->startOfDay())
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $dailyChart = [];
        for ($i = 13; $i >= 0; $i--) {
            $date = $now->copy()->subDays($i)->toDateString();
            $dailyChart[] = [
                'date' => $date,
                'count' => $dailyVisits->has($date) ? (int) $dailyVisits[$date]->count : 0,
            ];
        }

        $topPages = SiteVisit::human()->select('path', DB::raw('COUNT(*) as count'), DB::raw('MAX(created_at) as last_visited'))
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->groupBy('path')
            ->orderByDesc('count')
            ->limit(10)
            ->get()
            ->sortByDesc('last_visited')
            ->values();

        $topCities = SiteVisit::human()->select(
            'city',
            'country',
            DB::raw('COUNT(*) as count'),
            DB::raw('MAX(created_at) as last_visited')
        )
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->whereNotNull('city')
            ->groupBy('city', 'country')
            ->orderByDesc('count')
            ->limit(10)
            ->get()
            ->sortByDesc('last_visited')
            ->values();

        $visitsByHost = SiteVisit::human()->select('host', DB::raw('COUNT(*) as count'), DB::raw('MAX(created_at) as last_visited'))
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->groupBy('host')
            ->orderByDesc('last_visited')
            ->get();

        $recentVisits = SiteVisit::human()->with('user:id,name,email')
            ->orderByDesc('created_at')
            ->limit(50)
            ->get()
            ->map(fn ($v) => [
                'id' => $v->id,
                'user_name' => $v->user?->name,
                'user_email' => $v->user?->email,
                'host' => $v->host,
                'ip_address' => $v->ip_address,
                'city' => $v->city,
                'region' => $v->region,
                'country' => $v->country,
                'path' => $v->path,
                'browser' => $v->browser,
                'referer' => $v->referer,
                'visited_at' => $v->created_at?->toIso8601String(),
            ]);

        $socialPatterns = ['facebook', 'instagram', 'tiktok', 'twitter', 'x.com', 'linkedin', 'reddit', 'youtube'];

        $detectPlatform = static function (string $referer): string {
            $r = strtolower($referer);
            if (str_contains($r, 'facebook') || str_contains($r, 'fb.com')) {
                return 'Facebook';
            }
            if (str_contains($r, 'instagram')) {
                return 'Instagram';
            }
            if (str_contains($r, 'tiktok')) {
                return 'TikTok';
            }
            if (str_contains($r, 'twitter') || str_contains($r, 'x.com')) {
                return 'X / Twitter';
            }
            if (str_contains($r, 'linkedin')) {
                return 'LinkedIn';
            }
            if (str_contains($r, 'reddit')) {
                return 'Reddit';
            }
            if (str_contains($r, 'youtube')) {
                return 'YouTube';
            }

            return 'Other';
        };

        $socialQuery = SiteVisit::human()
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->whereNotNull('referer')
            ->where(function ($q) use ($socialPatterns) {
                foreach ($socialPatterns as $p) {
                    $q->orWhere('referer', 'like', "%{$p}%");
                }
            });

        $socialVisits = (clone $socialQuery)
            ->select('referer', 'path', 'host', 'city', 'country', 'ip_address', 'created_at')
            ->orderByDesc('created_at')
            ->limit(50)
            ->get()
            ->map(fn ($v) => [
                'platform' => $detectPlatform($v->referer),
                'referer' => $v->referer,
                'path' => $v->path,
                'host' => $v->host,
                'city' => $v->city,
                'country' => $v->country,
                'ip_address' => $v->ip_address,
                'visited_at' => $v->created_at?->toIso8601String(),
            ]);

        $socialSummary = (clone $socialQuery)
            ->select('referer', DB::raw('COUNT(*) as count'))
            ->groupBy('referer')
            ->get()
            ->groupBy(fn ($row) => $detectPlatform($row->referer))
            ->map(fn ($rows) => $rows->sum('count'))
            ->sortDesc()
            ->map(fn ($count) => (int) $count);

        return Inertia::render('admin/Analytics/Index', [
            'stats' => [
                'totalVisits' => $totalVisits,
                'visitsLast30Days' => $visitsLast30Days,
                'visitsLast7Days' => $visitsLast7Days,
                'uniqueIpsLast30' => $uniqueIpsLast30,
                'loggedInLast30' => $loggedInLast30,
            ],
            'dailyChart' => $dailyChart,
            'topPages' => $topPages,
            'topCities' => $topCities,
            'visitsByHost' => $visitsByHost,
            'recentVisits' => $recentVisits,
            'socialVisits' => $socialVisits,
            'socialSummary' => $socialSummary,
        ]);
    }
}
