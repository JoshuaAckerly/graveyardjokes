<?php

namespace Tests\Unit;

use App\Models\User;
use PHPUnit\Framework\TestCase;

class UserModelTest extends TestCase
{
    public function test_fillable_attributes()
    {
        $user = new User();
        $expected = ['name', 'email', 'password'];
        
        $this->assertEquals($expected, $user->getFillable());
    }

    public function test_hidden_attributes()
    {
        $user = new User();
        $expected = ['password', 'remember_token'];
        
        $this->assertEquals($expected, $user->getHidden());
    }

    public function test_casts_configuration()
    {
        $user = new User();
        $casts = $user->getCasts();
        
        $this->assertEquals('datetime', $casts['email_verified_at']);
        $this->assertEquals('hashed', $casts['password']);
    }
}