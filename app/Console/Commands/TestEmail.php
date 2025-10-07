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
        
        $testVisitorData = [
            'ip' => '192.168.1.100',
            'city' => 'Test City',
            'country' => 'Test Country',
            'timestamp' => now()->toDateTimeString(),
            'user_agent' => 'Test Browser'
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
