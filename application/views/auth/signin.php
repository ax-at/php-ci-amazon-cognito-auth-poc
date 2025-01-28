<!DOCTYPE html>
<html>
<head>
    <title>Sign In</title>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body>
    <div class="container">
        <form id="signinForm">
            <div>
                <input type="tel" 
                       name="phone_number" 
                       placeholder="Phone Number" 
                       required>
            </div>
            <div>
                <input type="password" 
                       name="password" 
                       placeholder="Password" 
                       required>
            </div>
            <div id="error" style="color: red;"></div>
            <button type="submit">Sign In</button>
        </form>
    </div>

    <script>
    $(document).ready(function() {
        $('#signinForm').on('submit', function(e) {
            e.preventDefault();
            
            $.ajax({
                url: '<?= site_url('auth/signin') ?>',
                type: 'POST',
                data: {
                    phone_number: $('input[name="phone_number"]').val(),
                    password: $('input[name="password"]').val()
                },
                success: function(response) {
                    if (response.success) {
                        // Store tokens if needed
                        localStorage.setItem('tokens', JSON.stringify(response.tokens));
                        window.location.href = '<?= site_url() ?>'; // Redirect to home
                    } else {
                        $('#error').text(response.message);
                    }
                },
                error: function() {
                    $('#error').text('An error occurred. Please try again.');
                }
            });
        });
    });
    </script>
</body>
</html> 