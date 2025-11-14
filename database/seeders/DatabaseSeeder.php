<?php

namespace Database\Seeders;

use App\Models\ReminderTemplate;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = User::factory()->create([
            'name' => 'Demo User',
            'email' => 'demo@remindly.app',
        ]);

        $templates = [
            [
                'user_id' => null,
                'name' => 'Birthday love note',
                'category' => 'birthday',
                'channel' => 'whatsapp',
                'body' => 'Happy birthday {{contact.first_name}} 🎉. Wishing you joy and abundance!',
                'placeholders' => ['contact.first_name'],
                'is_default' => true,
            ],
            [
                'user_id' => null,
                'name' => 'Invoice reminder',
                'category' => 'bill',
                'channel' => 'email',
                'subject' => 'Invoice reminder for {{contact.first_name}}',
                'body' => "Hi {{contact.first_name}},\nThis is a quick reminder about your upcoming payment.",
                'placeholders' => ['contact.first_name'],
                'is_default' => true,
            ],
            [
                'user_id' => $user->id,
                'name' => 'Weekly team meeting',
                'category' => 'meeting',
                'channel' => 'whatsapp',
                'body' => 'Meeting check-in reminder for {{contact.first_name}} at {{reminder.send_at}}.',
                'placeholders' => ['contact.first_name', 'reminder.send_at'],
                'is_default' => false,
            ],
        ];

        ReminderTemplate::insert(array_map(function ($template) {
            return [
                ...$template,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }, $templates));
    }
}
