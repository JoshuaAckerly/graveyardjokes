<?php

namespace App\Observers;

use App\Models\Contact;
use Illuminate\Support\Facades\Log;

class ContactObserver
{
    /**
     * Handle the Contact "created" event.
     */
    public function created(Contact $contact): void
    {
        try {
            $this->updateTrackingFile($contact);
            Log::info('Contact tracking file updated', ['contact_id' => $contact->id]);
        } catch (\Exception $e) {
            Log::error('Failed to update contact tracking file', [
                'contact_id' => $contact->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Update the tracking markdown file with the new contact
     */
    private function updateTrackingFile(Contact $contact): void
    {
        $trackingPath = base_path('../CONTACTS_TRACKING.md');

        if (! file_exists($trackingPath)) {
            Log::warning('Tracking file does not exist', ['path' => $trackingPath]);

            return;
        }

        $content = file_get_contents($trackingPath);

        // Update last modified timestamp
        $content = preg_replace(
            '/\*\*Last Updated:\*\* .+/i',
            '**Last Updated:** '.now()->format('Y-m-d H:i:s'),
            $content,
            1
        );

        // Extract current total count and increment
        if (preg_match('/\*\*Total Contacts:\*\* (\d+)/', $content, $matches)) {
            $currentCount = (int) $matches[1];
            $newCount = $currentCount + 1;
            $content = preg_replace(
                '/\*\*Total Contacts:\*\* \d+/',
                "**Total Contacts:** {$newCount}",
                $content,
                1
            );
        }

        // Update new count in status breakdown
        if (preg_match('/\*\*Status Breakdown:\*\* (\d+) New/', $content, $matches)) {
            $currentNew = (int) $matches[1];
            $newNewCount = $currentNew + 1;
            $content = preg_replace(
                '/\*\*Status Breakdown:\*\* \d+ New/',
                "**Status Breakdown:** {$newNewCount} New",
                $content,
                1
            );
        }

        // Insert new row in the table
        $messagePreview = substr($contact->message, 0, 60).(strlen($contact->message) > 60 ? '...' : '');
        $formattedDate = $contact->created_at->format('Y-m-d H:i');
        $newRow = "| {$contact->id} | {$formattedDate} | {$contact->first_name} | {$contact->last_name} | {$contact->email} | {$messagePreview} | NEW | | |\n";

        // Insert after the table header
        $content = preg_replace(
            '/(^\|\-+\|.+?\n)/m',
            '$1'.$newRow,
            $content,
            1
        );

        // Insert contact detail section before "## Status Summary"
        $contactDetail = "### Contact #{$contact->id}\n";
        $contactDetail .= "- **Name:** {$contact->first_name} {$contact->last_name}\n";
        $contactDetail .= "- **Email:** {$contact->email}\n";
        $contactDetail .= "- **Date Submitted:** {$contact->created_at->format('Y-m-d H:i:s')}\n";
        $contactDetail .= "- **Source:** Website contact form\n";
        $contactDetail .= "- **Message:**\n";
        $contactDetail .= "  ```\n";
        $contactDetail .= '  '.$contact->message."\n";
        $contactDetail .= "  ```\n";
        $contactDetail .= "- **Status:** NEW\n";
        $contactDetail .= "- **Response Date:** \n";
        $contactDetail .= "- **Response Note:** \n";
        $contactDetail .= "\n---\n\n";

        $content = preg_replace(
            '/(## Contact Details\n+)/m',
            '$1'.$contactDetail,
            $content,
            1
        );

        // Update NEW count in status summary
        if (preg_match('/### NEW \(Unresponded\)\n\[Count: (\d+)\]/', $content, $matches)) {
            $currentNewCount = (int) $matches[1];
            $newNewSummaryCount = $currentNewCount + 1;
            $content = preg_replace(
                '/### NEW \(Unresponded\)\n\[Count: \d+\]/',
                "### NEW (Unresponded)\n[Count: {$newNewSummaryCount}]",
                $content,
                1
            );
        }

        file_put_contents($trackingPath, $content);
    }
}
