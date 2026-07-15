<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('polls', function (Blueprint $table) {
            $table->boolean('is_anonymous')->default(false)->after('description');
        });

        Schema::table('votes', function (Blueprint $table) {
            // user_id passa a ser nullable: voto anônimo não tem usuário.
            // O MySQL permite múltiplos NULLs numa unique, então unique(user_id, poll_id)
            // continua barrando voto duplicado de usuário logado.
            $table->foreignId('user_id')->nullable()->change();
            $table->string('voter_token')->nullable()->index()->after('user_id');
            $table->unique(['voter_token', 'poll_id']);
        });
    }

    public function down(): void
    {
        Schema::table('votes', function (Blueprint $table) {
            $table->dropUnique(['voter_token', 'poll_id']);
            $table->dropIndex(['voter_token']);
            $table->dropColumn('voter_token');
            $table->foreignId('user_id')->nullable(false)->change();
        });

        Schema::table('polls', function (Blueprint $table) {
            $table->dropColumn('is_anonymous');
        });
    }
};
