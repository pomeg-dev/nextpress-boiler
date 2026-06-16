<?php

/**
 * Gravity Forms HubSpot API Library.
 *
 * @since     1.0
 * @package   GravityForms
 * @author    Rocketgenius
 * @copyright Copyright (c) 2019, Rocketgenius
 */
class GF_HubSpot_API {

	/**
	 * HubSpot API URL.
	 *
	 * @since  1.0
	 * @var    string $api_url HubSpot API URL.
	 */
	protected $api_url = 'https://api.hubapi.com/';

	/**
	 * HubSpot authentication data.
	 *
	 * @since  1.0
	 * @var    array $auth_data HubSpot authentication data.
	 */
	protected $auth_data = null;

	/**
	 * Initialize API library.
	 *
	 * @since  1.0
	 *
	 * @param  array $auth_data HubSpot authentication data.
	 */
	public function __construct( $auth_data = null ) {
		$this->auth_data = $auth_data;
	}

	/**
	 * Make API request.
	 *
	 * @since  1.0
	 *
	 * @param string    $path          Request path.
	 * @param array     $options       Request options.
	 * @param string    $method        Request method. Defaults to GET.
	 * @param string    $return_key    Array key from response to return. Defaults to null (return full response).
	 * @param int|array $response_code Expected HTTP response code.
	 *
	 * @return array|WP_Error
	 */
	public function make_request( $path = '', $options = array(), $method = 'GET', $return_key = null, $response_code = 200 ) {

		// Log API call succeed.
		gf_hspot()->log_debug( __METHOD__ . sprintf( '(): Making %s request to: %s', $method, $path ) );

		// Get authentication data.
		$auth_data = $this->auth_data;

		// Build request URL.
		if ( $path === 'token/revoke' ) {
			$request_url = 'https://api.hubapi.com/oauth/v1/refresh-tokens/' . $options['token'];

			// Execute request.
			$response = wp_remote_request( $request_url, array( 'method' => $method ) );
		} else {
			$request_url = strpos( $path, 'https://' ) === 0 ? $path : $this->api_url . $path;

			// Add options if this is a GET request.
			if ( 'GET' === $method ) {
				$request_url = add_query_arg( $options, $request_url );
			}

			// Prepare request arguments.
			$args = array(
				'method'  => $method,
				'headers' => array(
					'Accept'        => 'application/json',
					'Authorization' => 'Bearer ' . $auth_data['access_token'],
					'Content-Type'  => 'application/json',
				),
			);

			// Add request arguments to body.
			if ( in_array( $method, array( 'POST', 'PUT', 'PATCH' ) ) ) {
				$args['body'] = json_encode( $options );
				gf_hspot()->log_debug( __METHOD__ . '(): Request body: ' . print_r( $args['body'], true ) );
			}

			// Execute API request.
			$response = wp_remote_request( $request_url, $args );
		}

		if ( is_wp_error( $response ) ) {
			gf_hspot()->log_error( __METHOD__ . '(): HTTP request failed; ' . $response->get_error_message() );

			return $response;
		}

		// If an incorrect response code was returned, return WP_Error.
		$retrieved_response_code = wp_remote_retrieve_response_code( $response );
		if ( is_int( $response_code ) ) {
			$response_code = array( $response_code );
		}
		if ( ! in_array( $retrieved_response_code, $response_code, true ) ) {
			$response_code = implode( ', ', $response_code );
			$error_message = "Expected response code: {$response_code}. Returned response code: {$retrieved_response_code}.";
			$json_body     = gf_hspot()->maybe_decode_json( $response['body'] );

			if ( rgar( $json_body, 'status' ) === 'error' ) {
				$error_data = $json_body;
			} else {
				$error_data = array( 'status' => $retrieved_response_code );
				if ( ! rgempty( 'message', $json_body ) ) {
					$error_message = $json_body['message'];
				}
				if ( ! rgempty( rgars( $json_body, 'errors' ) ) ) {
					$error_data['data'] = rgars( $json_body, 'errors' );
				}
			}

			// 401 Unauthorized - Returned when the authentication provided is invalid.
			if ( $retrieved_response_code === 401 ) {
				$log = 'API credentials are invalid;';
			} else {
				$log = 'API errors returned;';
			}

			gf_hspot()->log_error( __METHOD__ . "(): $log " . $error_message . '; error data: ' . print_r( $error_data, true ) );

			return new WP_Error( 'hubspot_api_error', $error_message, $error_data );
		}

		// Convert JSON response to array.
		$response = gf_hspot()->maybe_decode_json( $response['body'] );

		// If a return key is defined and array item exists, return it.
		if ( ! empty( $return_key ) && rgar( $response, $return_key ) ) {
			return rgar( $response, $return_key );
		}

		return $response;
	}

	/**
	 * Refresh access tokens.
	 *
	 * @since 1.0
	 *
	 * @return array|WP_Error
	 */
	public function refresh_token() {
		// Get authentication data.
		$auth_data = $this->auth_data;

		// If refresh token is not provided, throw exception.
		if ( ! rgar( $auth_data, 'refresh_token' ) ) {
			return new WP_Error( 'hubspot_refresh_token_error', esc_html__( 'Refresh token must be provided.', 'gravityformshubspot' ) );
		}

		$args = array(
			'body' => array(
				'refresh_token' => $auth_data['refresh_token'],
				'state'         => wp_create_nonce( gf_hspot()->get_authentication_state_action() ),
			),
		);

		$response      = wp_remote_post( gf_hspot()->get_gravity_api_url( '/auth/hubspot/refresh' ), $args );
		$response_code = wp_remote_retrieve_response_code( $response );
		$message       = wp_remote_retrieve_response_message( $response );

		if ( $response_code === 200 ) {
			$auth_payload = json_decode( wp_remote_retrieve_body( $response ), true );
			$auth_payload = json_decode( $auth_payload['auth_payload'], true );

			if ( isset( $auth_payload['access_token'] ) && wp_verify_nonce( $auth_payload['state'], gf_hspot()->get_authentication_state_action() ) ) {
				$auth_data['access_token']  = $auth_payload['access_token'];
				$auth_data['refresh_token'] = $auth_payload['refresh_token'];
				$auth_data['expires_in']    = $auth_payload['expires_in'];

				$this->auth_data = $auth_data;

				return $auth_data;
			}

			if ( isset( $auth_payload['error'] ) ) {
				$message = $auth_payload['error'];
			} elseif ( isset( $auth_payload['status'] ) ) {
				$message = $auth_payload['status'];
			}
		}

		return new WP_Error( 'hubspot_refresh_token_error', $message, array( 'status' => $response_code ) );
	}

	/**
	 * Revoke authentication token.
	 *
	 * @since  1.0
	 *
	 * @return array|WP_Error
	 */
	public function revoke_token() {

		// Get authentication data.
		$auth_data = $this->auth_data;

		// If refresh token is not provided, throw exception.
		if ( ! rgar( $auth_data, 'refresh_token' ) ) {
			return new WP_Error( 'hubspot_revoke_token_error', esc_html__( 'Refresh token must be provided.', 'gravityformshubspot' ) );
		}

		return $this->make_request( 'token/revoke', array( 'token' => $auth_data['refresh_token'] ), 'DELETE', null, 204 );
	}

	/**
	 * Get available users.
	 *
	 * @since  1.0
	 * @since  2.3 Updated to use the v3 endpoint.
	 *
	 * @return array|WP_Error
	 */
	public function get_contacts() {
		static $contacts;

		if ( ! isset( $contacts ) ) {
			$contacts = $this->make_request( 'crm/v3/objects/contacts', array(), 'GET', 'results' );
		}

		return $contacts;
	}

	/**
	 * Get contact properties.
	 *
	 * @since 1.0
	 * @depecated 2.3 No longer used as the add-on starts migrating to HubSpot API V3
	 *
	 * @return array|WP_Error Array of grouped property information or WP_Error on failure.
	 */
	public function get_contact_properties() {
		return $this->make_request( 'properties/v1/contacts/groups/?includeProperties=true' );
	}

	/**
	 * Get contact property definitions from HubSpot API v3.
	 *
	 * Fetches a flat list of all contact property definitions.
	 *
	 * @since 2.3
	 *
	 * @return array|WP_Error Array of property definitions or WP_Error on failure.
	 */
	public function get_properties() {
		return $this->make_request( 'crm/v3/properties/contacts', array(), 'GET', 'results' );
	}

	/**
	 * Get contact property groups from HubSpot API v3.
	 *
	 * Fetches a list of all contact property groups.
	 *
	 * @since 2.3
	 *
	 * @return array|WP_Error Array of property groups or WP_Error on failure.
	 */
	public function get_property_groups() {
		return $this->make_request( 'crm/v3/properties/contacts/groups', array(), 'GET', 'results' );
	}

	/**
	 * Update contact properties by email.
	 *
	 * @since 1.0
	 *
	 * @param string $email Email.
	 * @param array  $data Contact data.
	 *
	 * @return array|WP_Error
	 */
	public function update_contact_by_email( $email, $data ) {
		return $this->make_request( "contacts/v1/contact/createOrUpdate/email/{$email}/", $data, 'POST' );
	}

	/**
	 * Create a new form.
	 *
	 * @since 1.0
	 * @since 3.0 Updated to use the v3 endpoint.
	 * @since 3.0.1 Added the $retry_on_error parameter.
	 *
	 * @param array $form           The form options array.
	 * @param bool  $retry_on_error Whether to retry the request if form creation fails due to hubspot_owner_id field.
	 *
	 * @return array|WP_Error
	 */
	public function create_form( $form, $retry_on_error = true ) {
		$result = $this->make_request( 'marketing/v3/forms', $form, 'POST', null, 201 );

		return $retry_on_error ? $this->maybe_retry_without_owner_id_field( $result, $form ) : $result;
	}

	/**
	 * Retries the request if the form creation or update fails due to the hubspot_owner_id field.
	 *
	 * @since 3.0.1
	 *
	 * @param array|WP_Error $result The result of the create or update form request.
	 * @param array          $form   The form options array.
	 * @param null|string    $guid   GUID of the form.
	 *
	 * @return array|WP_Error
	 */
	private function maybe_retry_without_owner_id_field( $result, $form, $guid = null ) {
		if ( ! is_wp_error( $result ) || $result->get_error_code() !== 'hubspot_api_error' ) {
			return $result;
		}

		$error_data = $result->get_error_data();
		if ( ! ( rgar( $error_data, 'message' ) === 'internal error' && rgar( $error_data, 'category' ) === 'VALIDATION_ERROR' ) ) {
			return $result;
		}

		$owner_removed = false;

		foreach ( $form['fieldGroups'] as &$group ) {
			if ( empty( $group['fields'] ) ) {
				continue;
			}

			foreach ( $group['fields'] as $key => $field ) {
				if ( rgar( $field, 'name' ) !== 'hubspot_owner_id' ) {
					continue;
				}

				$owner_removed = true;
				unset( $group['fields'][ $key ] );
				$group['fields'] = array_values( $group['fields'] );
				break;
			}
		}

		if ( ! $owner_removed ) {
			return $result;
		}

		if ( $guid ) {
			$result = $this->update_form( $guid, $form, false );
		} else {
			$result = $this->create_form( $form, false );
		}

		if ( ! is_wp_error( $result ) ) {
			GFCache::set( GF_HubSpot::OWNER_ID_DISABLED, true, true );
		}

		return $result;
	}

	/**
	 * Get form by guid.
	 *
	 * @since 1.0
	 * @since 3.0 Updated to use the v3 endpoint.
	 *
	 * @param string $guid GUID of the form.
	 *
	 * @return array|WP_Error
	 */
	public function get_form( $guid ) {
		return $this->make_request( "marketing/v3/forms/{$guid}" );
	}

	/**
	 * Get all forms.
	 *
	 * @since 1.0
	 * @since 3.0 Updated to use the v3 endpoint.
	 *
	 * @return array|WP_Error Returns an array of forms
	 */
	public function get_forms() {
		return $this->make_request( 'marketing/v3/forms', array(), 'GET', 'results' );
	}

	/**
	 * Update the form.
	 *
	 * @since 1.0
	 * @since 3.0 Updated to use the v3 endpoint.
	 * @since 3.0.1 Added the $retry_on_error parameter.
	 *
	 * @param string $guid           GUID of the form.
	 * @param array  $form           The form options array.
	 * @param bool   $retry_on_error Whether to retry the request if form update fails due to hubspot_owner_id field.
	 *
	 * @return array|WP_Error
	 */
	public function update_form( $guid, $form, $retry_on_error = true ) {
		$result = $this->make_request( "marketing/v3/forms/{$guid}", $form, 'PATCH' );

		return $retry_on_error ? $this->maybe_retry_without_owner_id_field( $result, $form, $guid ) : $result;
	}

	/**
	 * Delete form.
	 *
	 * @since 1.0
	 * @since 3.0 Updated to use the v3 endpoint.
	 *
	 * @param string $guid GUID of the form.
	 *
	 * @return array|WP_Error
	 */
	public function delete_form( $guid ) {
		return $this->make_request( "marketing/v3/forms/{$guid}", array(), 'DELETE', null, 204 );
	}

	/**
	 * Get contact owners from HubSpot.
	 *
	 * @since 1.0
	 * @since 2.1 Updated to use the v3 endpoint.
	 *
	 * @return array|WP_Error
	 */
	public function get_owners() {
		return $this->make_request( 'crm/v3/owners', array( 'limit' => 500 ), 'GET', 'results' );
	}

	/**
	 * Submit form data to HubSpot.
	 *
	 * @since 1.0
	 *
	 * @param string $portal_id HubSpot portal ID.
	 * @param string $form_guid HubSpot form GUID.
	 * @param array  $submission Form submission data.
	 *
	 * @return array|WP_Error
	 */
	public function submit_form( $portal_id, $form_guid, $submission ) {

		// Submit HubSpot form.
		$url = "https://api.hsforms.com/submissions/v3/integration/submit/{$portal_id}/{$form_guid}";

		return $this->make_request( $url, $submission, 'POST' );
	}

	/**
	 * Retrieve account information from HubSpot.
	 *
	 * @since 3.0
	 *
	 * @return array|WP_Error
	 */
	public function get_account_info() {
		return $this->make_request( 'account-info/v3/details' );
	}

}
