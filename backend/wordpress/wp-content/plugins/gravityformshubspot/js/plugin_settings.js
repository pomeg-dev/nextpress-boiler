/* global gform_hubspot_pluginsettings_strings */
window.GFHubSpotSettings = null;

(function ($) {
    GFHubSpotSettings = function () {
        var self = this;

        this.init = function () {
            this.pageURL = gform_hubspot_pluginsettings_strings.settings_url;

            this.deauthActionable = false;

            this.bindDeauthorize();
            this.bindClearCache();
			this.bindToggleTrackingScript();
        }

        this.bindDeauthorize = function () {
            // De-Authorize Zoho CRM.
            $('.gform_hubspot_deauth_button').on('click', function (e) {
                e.preventDefault();

                // Get button.
                var deauthButton = $('#gform_hubspot_deauth_button'),
                    deauthScope = $('#deauth_scope'),
                    disconnectMessage = gform_hubspot_pluginsettings_strings.disconnect;

                if (!self.deauthActionable) {
                    $('.gform_hubspot_deauth_button').eq(0).hide();

                    deauthScope.show(0, function(){
                        self.deauthActionable = true;
                    });
                } else {
                    var deauthScopeVal = $('#deauth_scope0').is(':checked') ? 'site' : 'account';
                    // Confirm deletion.
                    if (!confirm(disconnectMessage[deauthScopeVal])) {
                        return false;
                    }

                    // Set disabled state.
                    deauthButton.attr('disabled', 'disabled');

                    // De-Authorize.
                    $.ajax({
                        async: false,
                        url: ajaxurl,
                        dataType: 'json',
                        method: 'POST',
                        data: {action: 'gfhubspot_deauthorize', scope: deauthScopeVal, nonce: gform_hubspot_pluginsettings_strings.deauth_nonce},
                        success: function (response) {
                            if (response.success) {
                                window.location.href = self.pageURL;
                            } else {
                                alert(response.data.message);
                            }

                            deauthButton.removeAttr('disabled');
                        }
                    }).fail(function(jqXHR, textStatus, error) {
                        alert(error);
                        deauthButton.removeAttr('disabled');
                    });
                }

            });
        }

        this.bindClearCache = function() {
			$( '#clear_hubspot_cache' ).on( 'click', function ( e ) {

				e.preventDefault();
				e.stopImmediatePropagation();

				var $button = $( this );
				$button.attr( 'disabled', true );

				$.ajax({
					method: 'POST',
					url: ajaxurl,
					data: {
						action: 'gf_hubspot_clear_cache',
						nonce: gform_hubspot_pluginsettings_strings.clear_cache_nonce,
					},
					success: function( response ) {
						if ( 'last_clearance' in response.data ) {
							jQuery('.success-alert-container').fadeIn();
							$( '#last_cache_clearance .time' ).text( response.data.last_clearance );
						}
					},
					error: function () {
							jQuery('.error-alert-container').fadeIn();
					},
					complete: function () {
						$button.attr( 'disabled', false );
						setTimeout( function () { jQuery('.alert-container').fadeOut(); }, 10000 );
					}
				});
			});
		};

		/**
		 * @function bindToggleTrackingScript
		 * @description Binds the change event for the disable_tracking_script toggle, saving it via AJAX.
		 *
		 * @since 3.0.4
		 *
		 */
		this.bindToggleTrackingScript = function () {
			var $toggle = $( '#_gform_setting_disable_tracking_script' );

			var $status = $(
				'<span class="gform-status-indicator gform-status-indicator--size-sm gform-status-indicator--theme-cosmos gform-status--no-icon gform-status--no-hover" role="status" aria-live="polite" style="display:none;">' +
					'<span class="gform-status-indicator-status gform-typography--weight-medium gform-typography--size-text-xs"></span>' +
				'</span>'
			).insertAfter( $toggle.next( '.gform-field__toggle-container' ) );

			var $statusText   = $status.find( '.gform-status-indicator-status' );
			var statusTimeout = null;

			function setStatus( text, statusClass ) {
				clearTimeout( statusTimeout );

				$status.stop( true, true );
				$status.removeClass( 'gform-status--gray gform-status--active gform-status--success gform-status--error' ).addClass( statusClass );
				$statusText.text( text );
				$status.show();

				statusTimeout = setTimeout( function () {
					$status.fadeOut();
				}, 2000 );
			}

			function handleError( message ) {
				$toggle.prop( 'checked', ! $toggle.prop( 'checked' ) );
				setStatus( message || gform_hubspot_pluginsettings_strings.status_error, 'gform-status--error' );
			}

			$toggle.on( 'change', function () {
				$toggle.prop( 'disabled', true );
				setStatus( gform_hubspot_pluginsettings_strings.status_saving, 'gform-status--gray' );

				$.ajax({
					method: 'POST',
					url: ajaxurl,
					dataType: 'json',
					data: {
						action: 'gf_hubspot_toggle_tracking_script',
						disable_tracking_script: $toggle.is( ':checked' ) ? 1 : 0,
						nonce: gform_hubspot_pluginsettings_strings.tracking_nonce,
					},
					success: function ( response ) {
						if ( response.success ) {
							setStatus( gform_hubspot_pluginsettings_strings.status_saved, 'gform-status--success' );
						} else {
							handleError( response.data && response.data.message );
						}

					},
					error: function () {
						handleError();
					},
					complete: function () {
						$toggle.prop( 'disabled', false );
					}
				});
			});
		};

        this.init();
    };

    $(document).ready( GFHubSpotSettings );
})(jQuery);
