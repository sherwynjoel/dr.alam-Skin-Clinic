<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: contact.html');
    exit;
}

$to      = 'howthulalamraja@gmail.com';
$name    = htmlspecialchars(strip_tags(trim($_POST['Full Name']   ?? '')));
$phone   = htmlspecialchars(strip_tags(trim($_POST['Phone Number'] ?? '')));
$service = htmlspecialchars(strip_tags(trim($_POST['Service']      ?? '')));
$doctor  = htmlspecialchars(strip_tags(trim($_POST['Doctor']       ?? '')));
$date    = htmlspecialchars(strip_tags(trim($_POST['Preferred Date'] ?? '')));
$time    = htmlspecialchars(strip_tags(trim($_POST['Preferred Time'] ?? '')));

if (empty($name) || empty($phone) || empty($date) || empty($time)) {
    header('Location: contact.html?status=error');
    exit;
}

$subject = 'New Appointment Request — Dr. Alam\'s Skin Clinic';

$message = "
New appointment request received from the website.

--------------------------------------------------
Patient Details
--------------------------------------------------
Name    : $name
Phone   : $phone
Service : $service
Doctor  : $doctor
Date    : $date
Time    : $time
--------------------------------------------------
";

$headers  = "From: noreply@dralamdermcentre.com\r\n";
$headers .= "Reply-To: noreply@dralamdermcentre.com\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

$sent = mail($to, $subject, $message, $headers);

if ($sent) {
    header('Location: contact.html?status=success');
} else {
    header('Location: contact.html?status=error');
}
exit;
?>
