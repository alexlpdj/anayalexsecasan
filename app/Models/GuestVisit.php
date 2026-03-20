<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GuestVisit extends Model
{
    public $timestamps = false;

    protected $fillable = ['group_id', 'device', 'browser', 'os', 'created_at'];

    protected $casts = ['created_at' => 'datetime'];

    public function group()
    {
        return $this->belongsTo(InvitationGroup::class);
    }

    /**
     * Detecta device, browser y OS desde un User-Agent string.
     * Operación puramente en memoria, sin I/O.
     */
    public static function parseUserAgent(string $ua): array
    {
        $mobile = preg_match('/Mobile|Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i', $ua);
        $device = $mobile ? 'mobile' : 'desktop';

        $browser = match (true) {
            str_contains($ua, 'Edg/')    => 'Edge',
            str_contains($ua, 'OPR/')    => 'Opera',
            str_contains($ua, 'Firefox') => 'Firefox',
            str_contains($ua, 'Chrome')  => 'Chrome',
            str_contains($ua, 'Safari')  => 'Safari',
            default                      => 'Otro',
        };

        $os = match (true) {
            str_contains($ua, 'iPhone') || str_contains($ua, 'iPad') => 'iOS',
            str_contains($ua, 'Android')  => 'Android',
            str_contains($ua, 'Windows')  => 'Windows',
            str_contains($ua, 'Mac OS X') => 'macOS',
            str_contains($ua, 'Linux')    => 'Linux',
            default                       => 'Otro',
        };

        return compact('device', 'browser', 'os');
    }
}
