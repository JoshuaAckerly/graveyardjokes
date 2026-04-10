<?php

namespace App\Console\Commands;

use App\Models\Contact;
use Illuminate\Console\Command;

class ExportContactsTracking extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'contacts:export-tracking';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Export all contacts to tracking markdown file';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $contacts = Contact::orderBy('created_at', 'desc')->get();

        $totalCount = $contacts->count();

        // Build table rows
        $tableRows = '';
        $contactDetails = '';

        $counter = 1;
        foreach ($contacts as $contact) {
            $messagePreview = substr($contact->message, 0, 60).(strlen($contact->message) > 60 ? '...' : '');
            $formattedDate = ($contact->created_at ?? now())->format('Y-m-d H:i');

            $tableRows .= "| {$counter} | {$formattedDate} | {$contact->first_name} | {$contact->last_name} | {$contact->email} | {$messagePreview} | NEW | | |\n";

            $contactDetails .= "### Contact #{$contact->id}\n";
            $contactDetails .= "- **Name:** {$contact->first_name} {$contact->last_name}\n";
            $contactDetails .= "- **Email:** {$contact->email}\n";
            $contactDetails .= '- **Date Submitted:** '.($contact->created_at ?? now())->format('Y-m-d H:i:s')."\n";
            $contactDetails .= "- **Source:** Website contact form\n";
            $contactDetails .= "- **Message:**\n";
            $contactDetails .= "  ```\n";
            $contactDetails .= '  '.$contact->message."\n";
            $contactDetails .= "  ```\n";
            $contactDetails .= "- **Status:** NEW\n";
            $contactDetails .= "- **Response Date:** \n";
            $contactDetails .= "- **Response Note:** \n";
            $contactDetails .= "\n---\n\n";

            $counter++;
        }

        $newCount = $contacts->count();

        $content = "# Graveyardjokes Contact Messages Tracking\n\n";
        $content .= '**Last Updated:** '.now()->format('Y-m-d H:i:s')."\n";
        $content .= "**Total Contacts:** {$totalCount}\n";
        $content .= "**Status Breakdown:** {$newCount} New / 0 Responded / 0 Archived\n\n";
        $content .= "---\n\n";
        $content .= "## Contact Submissions Log\n\n";
        $content .= "| # | Date | First Name | Last Name | Email | Message Preview | Status | Response Date | Notes |\n";
        $content .= "|---|---|---|---|---|---|---|---|---|\n";
        $content .= $tableRows;
        $content .= "\n---\n\n";
        $content .= "## Contact Details\n\n";
        $content .= $contactDetails;
        $content .= "## Status Summary\n\n";
        $content .= "### NEW (Unresponded)\n[Count: {$newCount}]\n\n";
        $content .= "### RESPONDED\n[Count: 0]\n\n";
        $content .= "### ARCHIVED\n[Count: 0]\n\n";
        $content .= "---\n\n";
        $content .= "## Quick Actions\n";
        $content .= "- [ ] Check emails for new unresponded contacts\n";
        $content .= "- [ ] Update tracking with latest contacts\n";
        $content .= "- [ ] Follow up on pending responses\n";

        $trackingPath = base_path('../CONTACTS_TRACKING.md');
        file_put_contents($trackingPath, $content);

        $this->info("✓ Contacts exported to CONTACTS_TRACKING.md ({$totalCount} contacts)");

        return Command::SUCCESS;
    }
}
