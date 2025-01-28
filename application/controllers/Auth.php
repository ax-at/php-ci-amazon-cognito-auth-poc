<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Auth extends CI_Controller {
    
    public function __construct() {
        parent::__construct();
        $this->load->helper('cognito');
    }

    public function signin() {
        if ($this->input->method() === 'post') {
            $this->_handle_signin();
            return;
        }
        
        // Load signin view for GET requests
        $this->load->view('auth/signin');
    }

    private function _handle_signin() {
        // Get POST data
        $phone_number = $this->input->post('phone_number');
        $password = $this->input->post('password');
        
        try {
            $formatted_phone = format_phone_number($phone_number);
            $secret_hash = calculate_secret_hash($formatted_phone);
            
            $cognito = get_cognito_client();
            
            $result = $cognito->initiateAuth([
                'AuthFlow' => 'USER_PASSWORD_AUTH',
                'ClientId' => getenv('COGNITO_CLIENT_ID'),
                'AuthParameters' => [
                    'USERNAME' => $formatted_phone,
                    'PASSWORD' => $password,
                    'SECRET_HASH' => $secret_hash
                ]
            ]);

            if (isset($result['AuthenticationResult'])) {
                // Store tokens in session
                $this->session->set_userdata([
                    'access_token' => $result['AuthenticationResult']['AccessToken'],
                    'id_token' => $result['AuthenticationResult']['IdToken'],
                    'refresh_token' => $result['AuthenticationResult']['RefreshToken']
                ]);

                $response = [
                    'success' => true,
                    'tokens' => [
                        'accessToken' => $result['AuthenticationResult']['AccessToken'],
                        'refreshToken' => $result['AuthenticationResult']['RefreshToken'],
                        'idToken' => $result['AuthenticationResult']['IdToken']
                    ]
                ];
            } else {
                $response = [
                    'success' => false,
                    'message' => 'Authentication failed'
                ];
            }

        } catch (Exception $e) {
            $response = [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }

        $this->output
            ->set_content_type('application/json')
            ->set_output(json_encode($response));
    }

    public function signout() {
        try {
            $access_token = $this->session->userdata('access_token');
            
            if ($access_token) {
                $cognito = get_cognito_client();
                
                $cognito->globalSignOut([
                    'AccessToken' => $access_token
                ]);
            }

            // Clear session
            $this->session->sess_destroy();
            
            $response = [
                'success' => true,
                'message' => 'Signed out successfully'
            ];

        } catch (Exception $e) {
            $response = [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }

        $this->output
            ->set_content_type('application/json')
            ->set_output(json_encode($response));
    }
} 