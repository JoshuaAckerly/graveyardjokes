<?php

namespace App\Http\Middleware;

use App\Models\PageSeo;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $rawQuote = Inspiring::quotes()->random();
        if ($rawQuote instanceof \Stringable) {
            $rawQuote = $rawQuote->__toString();
        } elseif (! is_string($rawQuote)) {
            $rawQuote = '';
        }
        /** @var string $rawQuote */
        $parts = explode('-', $rawQuote, 2);
        /** @var array<int, string> $parts */
        $message = isset($parts[0]) ? (string) $parts[0] : '';
        $author = isset($parts[1]) ? (string) $parts[1] : '';

        $intakeSession = $request->session()->get('website_intake', []);
        if (! is_array($intakeSession)) {
            $intakeSession = [];
        }

        $selectedPackage = $intakeSession['selected_package'] ?? null;
        if (! is_string($selectedPackage) || $selectedPackage === '') {
            $selectedPackage = null;
        }

        $submittedAt = $intakeSession['submitted_at'] ?? null;
        if (! is_string($submittedAt) || $submittedAt === '') {
            $submittedAt = null;
        }

        $submissionId = $intakeSession['submission_id'] ?? null;
        if (! is_int($submissionId) && ! (is_string($submissionId) && ctype_digit($submissionId))) {
            $submissionId = null;
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
                'is_admin' => $request->user()?->email === config('app.admin_email'),
            ],
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'seo' => PageSeo::forPath($request->path(), 'graveyardjokes'),
            'websiteIntake' => [
                'completed' => (bool) ($intakeSession['completed'] ?? false),
                'submissionId' => $submissionId !== null ? (int) $submissionId : null,
                'selectedPackage' => $selectedPackage,
                'submittedAt' => $submittedAt,
            ],
        ];
    }
}
