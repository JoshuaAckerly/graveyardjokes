<?php

namespace App\Contracts;

interface StorageUrlGeneratorInterface
{
    /**
     * Return a public URL for a storage path.
     */
    public function url(string $path, ?int $expiresMinutes = null): string;
}
