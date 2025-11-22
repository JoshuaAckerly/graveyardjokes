<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use App\Mail\NewVisitorNotification;

class TestEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:email';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test sending visitor notification email';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Testing visitor notification email...');
        
        // Use a real IP to test geolocation (Google's public DNS)
        $visitorController = new \App\Http\Controllers\VisitorController();
        $testLocation = $visitorController->getLocationFromIP('8.8.8.8');
        
        /** @var array<string, mixed> $testVisitorData */
        $testVisitorData = [
            'ip' => $testLocation['ip'] ?? '8.8.8.8',
            'city' => $testLocation['city'] ?? 'Unknown',
            'country' => $testLocation['country'] ?? 'Unknown',
            'region' => $testLocation['region'] ?? null,
            'timezone' => $testLocation['timezone'] ?? null,
            'timestamp' => now()->toDateTimeString(),
            'user_agent' => 'Test Browser - Geolocation Test'
        ];
        
        try {
            Mail::to('admin@graveyardjokes.com')->send(
                new NewVisitorNotification($testVisitorData)
            );
            
            $this->info('✅ Test email sent successfully!');
            $this->info('Check your inbox for the visitor notification.');
            return self::SUCCESS;
        } catch (\Exception $e) {
            $this->error('❌ Failed to send test email: ' . $e->getMessage());
            $this->error('Please check your email configuration in .env file');
            return self::FAILURE;
        }
    }
}
