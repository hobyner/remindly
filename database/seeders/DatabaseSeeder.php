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
        // Create a demo user
        $user = User::factory()->create([
            'name'  => 'Demo User',
            'email' => 'demo@remindly.app',
        ]);

        // Define templates (note: no "subject" here)
        $templates = [
            [
                'user_id'      => null,
                'name'         => 'Birthday love note',
                'category'     => 'birthday',
                'channel'      => 'whatsapp',
                'body'         => 'Happy birthday {{contact.first_name}} 🎉. Wishing you joy and abundance!',
                'placeholders' => ['contact.first_name'],
                'is_default'   => true,
            ],
            [
                'user_id'      => null,
                'name'         => 'Invoice reminder',
                'category'     => 'bill',
                'channel'      => 'email',
                // If you want a "subject", you can prepend it into the body:
                'body'         => "Invoice reminder for {{contact.first_name}}\n\nHi {{contact.first_name}},\nThis is a quick reminder about your upcoming payment.",
                'placeholders' => ['contact.first_name'],
                'is_default'   => true,
            ],
            [
                'user_id'      => $user->id,
                'name'         => 'Weekly team meeting',
                'category'     => 'meeting',
                'channel'      => 'whatsapp',
                'body'         => 'Meeting check-in reminder for {{contact.first_name}} at {{reminder.send_at}}.',
                'placeholders' => ['contact.first_name', 'reminder.send_at'],
                'is_default'   => false,
            ],
        ];

        // Map only the columns that actually exist in the table
        $insertData = [];
        foreach ($templates as $template) {
            $insertData[] = [
                'user_id'      => $template['user_id'],
                'name'         => $template['name'],
                'category'     => $template['category'],
                'channel'      => $template['channel'],
                'body'         => $template['body'],
                // If your migration defines "placeholders" as JSON, we json_encode it here
                'placeholders' => json_encode($template['placeholders']),
                'is_default'   => $template['is_default'],
                'created_at'   => now(),
                'updated_at'   => now(),
            ];
        }

        ReminderTemplate::insert($insertData);
    }
}
