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
    public function handle()
    {
        $this->info('Testing visitor notification email...');
        
        // Use a real IP to test geolocation (Google's public DNS)
        $visitorController = new \App\Http\Controllers\VisitorController();
        $testLocation = $visitorController->getLocationFromIP('8.8.8.8');
        
        $testVisitorData = [
            'ip' => $testLocation['ip'],
            'city' => $testLocation['city'],
            'country' => $testLocation['country'],
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
        } catch (\Exception $e) {
            $this->error('❌ Failed to send test email: ' . $e->getMessage());
            $this->error('Please check your email configuration in .env file');
        }
    }
}
