<?php

namespace App\Models;

class VideoLog
{
    public int $id;

    public string $title;

    public string $date;

    public string $thumbnail;

    public string $url;

    public ?string $description;

    public function __construct(array $data)
    {
        $this->id = $data['id'] ?? 0;
        $this->title = $data['title'] ?? '';
        $this->date = $data['date'] ?? '';
        $this->thumbnail = $data['thumbnail'] ?? '';
        $this->url = $data['url'] ?? '';
        $this->description = $data['description'] ?? null;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'date' => $this->date,
            'thumbnail' => $this->thumbnail,
            'url' => $this->url,
            'description' => $this->description,
        ];
    }
}
