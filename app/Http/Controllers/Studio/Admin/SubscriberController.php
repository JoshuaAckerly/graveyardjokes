<?php

namespace App\Http\Controllers\Studio\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subscriber;
use Inertia\Inertia;
use Inertia\Response;

class SubscriberController extends Controller
{
    public function index(): Response
    {
        $subscribers = Subscriber::orderByDesc('created_at')
            ->select(['id', 'email', 'confirmed_at', 'created_at'])
            ->paginate(50);

        return Inertia::render('studio/Admin/Subscribers', [
            'subscribers' => $subscribers,
            'total' => Subscriber::count(),
        ]);
    }
}
