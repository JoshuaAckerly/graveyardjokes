<?php

namespace App\Console\Commands;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Console\Command;

/**
 * Exchanges a Facebook User Access Token for all Page Access Tokens
 * associated with that user's managed pages.
 *
 * Usage:
 *   php artisan social:facebook-pages                 # reads token from FACEBOOK_USER_ACCESS_TOKEN
 *   php artisan social:facebook-pages --token=EAAx…   # pass token directly
 *
 * Copy the output values into .env:
 *   FACEBOOK_PAGE_ID=<page_id>
 *   FACEBOOK_PAGE_ACCESS_TOKEN=<page_access_token>
 */
class FacebookPageTokens extends Command
{
    protected $signature = 'social:facebook-pages
        {--token= : User access token (falls back to FACEBOOK_USER_ACCESS_TOKEN in .env)}';

    protected $description = 'List Facebook pages you manage and their Page Access Tokens.';

    private const GRAPH_URL = 'https://graph.facebook.com/v22.0';

    public function handle(): int
    {
        $userToken = $this->option('token')
            ?? config('social.facebook.access_token')
            ?? env('FACEBOOK_USER_ACCESS_TOKEN');

        if (empty($userToken)) {
            $this->error(
                'No user access token found. Pass --token=EAAx… or set FACEBOOK_USER_ACCESS_TOKEN in .env.'
            );
            $this->line('');
            $this->line('To get a user token:');
            $this->line('  1. Go to https://developers.facebook.com/tools/explorer/');
            $this->line('  2. Select your app → Generate Token');
            $this->line('  3. Grant: pages_show_list, pages_read_engagement, pages_manage_posts');
            $this->line('  4. Copy the token and run this command again with --token=<token>');

            return self::FAILURE;
        }

        $client = new Client(['timeout' => 15]);

        try {
            $response = $client->get(self::GRAPH_URL.'/me/accounts', [
                'query' => [
                    'access_token' => $userToken,
                    'fields' => 'id,name,access_token,category',
                ],
            ]);
        } catch (ClientException $e) {
            $body = json_decode((string) $e->getResponse()->getBody(), true);
            $message = $body['error']['message'] ?? $e->getMessage();
            $this->error('Facebook API error: '.$message);

            return self::FAILURE;
        }

        /** @var array{data: array<int, array{id: string, name: string, access_token: string, category: string}>} $data */
        $data = json_decode((string) $response->getBody(), true);
        $pages = $data['data'] ?? [];

        if (empty($pages)) {
            $this->warn('No pages found for this token. Make sure pages_show_list is granted.');

            return self::FAILURE;
        }

        $this->line('');
        $this->line('<fg=green>Pages found:</fg=green>');
        $this->line('');

        $headers = ['Page ID', 'Name', 'Category', 'Page Access Token'];
        $rows = array_map(
            static fn (array $page): array => [
                $page['id'],
                $page['name'],
                $page['category'] ?? '—',
                $page['access_token'],
            ],
            $pages,
        );

        $this->table($headers, $rows);

        $this->line('');
        $this->line('Add these to your graveyardjokes .env:');
        $this->line('');

        foreach ($pages as $page) {
            $this->line("# {$page['name']}");
            $this->line("FACEBOOK_PAGE_ID={$page['id']}");
            $this->line("FACEBOOK_PAGE_ACCESS_TOKEN={$page['access_token']}");
            $this->line('');
        }

        $this->warn(
            'Page Access Tokens from this endpoint are short-lived (~1 hour). '
            .'Exchange for a long-lived token at:'
        );
        $this->line(
            '  https://developers.facebook.com/docs/facebook-login/guides/access-tokens/get-long-lived'
        );

        return self::SUCCESS;
    }
}
