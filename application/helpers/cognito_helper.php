<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require 'vendor/autoload.php';

use Aws\CognitoIdentityProvider\CognitoIdentityProviderClient;

function get_cognito_client() {
    return new CognitoIdentityProviderClient([
        'version' => 'latest',
        'region'  => getenv('AWS_REGION'),
    ]);
}

function calculate_secret_hash($username) {
    $client_id = getenv('COGNITO_CLIENT_ID');
    $client_secret = getenv('COGNITO_CLIENT_SECRET');
    
    $message = $username . $client_id;
    return base64_encode(hash_hmac('sha256', $message, $client_secret, true));
}

function format_phone_number($phone_number) {
    // Remove any non-digit characters except '+'
    $cleaned = preg_replace('/[^\d+]/', '', $phone_number);
    
    // Ensure it starts with '+'
    if (strpos($cleaned, '+') !== 0) {
        $cleaned = '+' . $cleaned;
    }
    
    return $cleaned;
} 