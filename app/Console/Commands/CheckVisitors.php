<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CheckVisitors extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:check-visitors';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        //
        return self::SUCCESS;
    }
}
