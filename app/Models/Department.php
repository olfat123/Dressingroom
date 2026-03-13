<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Department extends Model
{
    protected $fillable = ['name', 'slug', 'image', 'active', 'meta_title', 'meta_description'];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute(): ?string
    {
        return $this->image ? Storage::url($this->image) : null;
    }

    public function categories()
    {
        return $this->hasMany(Category::class);
    }
}
