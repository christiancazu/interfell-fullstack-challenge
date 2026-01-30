<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;


return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $config = json_decode(file_get_contents('../../packages/shared/config.json'), true);
            $config_fields = $config['FIELDS'];

            $table->uuid("id")->primary();
            $table->string("name", $config_fields['NAME_MAX_LENGTH']);
            $table->string("document", $config_fields['DOCUMENT_MAX_LENGTH'])->unique();
            $table->string("email", $config_fields['EMAIL_MAX_LENGTH'])->unique();
            $table->string("cellphone", $config_fields['CELLPHONE_MAX_LENGTH'])->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
