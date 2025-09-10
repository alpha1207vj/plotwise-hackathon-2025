<?php
// download.php

// Folder where your PDFs are stored
$dir = 'pdfs/';

// Get filename from query string
if (!isset($_GET['file'])) {
    die('No file specified.');
}

$filename = basename($_GET['file']); // prevent directory traversal
$filepath = $dir . $filename;

// Check if file exists
if (!file_exists($filepath)) {
    die('File not found.');
}

// Set headers to force download
header('Content-Description: File Transfer');
header('Content-Type: application/pdf');
header('Content-Disposition: attachment; filename="' . $filename . '"');
header('Expires: 0');
header('Cache-Control: must-revalidate');
header('Pragma: public');
header('Content-Length: ' . filesize($filepath));

// Read the file and output to browser
readfile($filepath);
exit;
?>
