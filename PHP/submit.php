<?php
// --- Header für JSON-Antwort ---
header('Content-Type: application/json');

// --- Konfiguration ---
$csvFile = __DIR__ . '/data/anmeldungen.csv'; // Speicherort der CSV

// --- Hilfsfunktion: Eingaben säubern ---
function cleanInput($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

// --- 1. Sicherheitsprüfungen ---

// Honeypot-Feld muss leer sein
if (!empty($_POST['website'])) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "Spam-Verdacht erkannt."
    ]);
    exit;
}

// Timestamp prüfen (mind. 5s, max. 1h)
$formStart = $_POST['form_start'] ?? 0;
$currentTime = time();
$minSeconds = 5;
$maxSeconds = 3600;

if (!is_numeric($formStart) || ($currentTime - $formStart) < $minSeconds || ($currentTime - $formStart) > $maxSeconds) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "Ungültiger Zeitstempel – bitte das Formular korrekt ausfüllen."
    ]);
    exit;
}

// --- 2. Eingaben validieren und bereinigen ---
$name          = cleanInput($_POST['name'] ?? '');
$adresse       = cleanInput($_POST['adresse'] ?? '');
$telefon       = cleanInput($_POST['telefon'] ?? '');
$email         = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
$teilnehmer    = cleanInput($_POST['teilnehmer'] ?? '');
$unterkunft    = cleanInput($_POST['unterkunft'] ?? '');
$anreisedatum  = cleanInput($_POST['anreisedatum'] ?? '');
$foodSelection = cleanInput($_POST['food-selection'] ?? '');
$nachricht     = cleanInput($_POST['nachricht'] ?? '');

// Pflichtfelder prüfen
if (!$name || !$adresse || !$telefon || !$unterkunft || !$anreisedatum || !$foodSelection || !$nachricht) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "Bitte fülle alle Pflichtfelder korrekt aus."
    ]);
    exit;
}
// E-Mail-Format prüfen
if (!$email) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "Bitte gib eine gültige E-Mail-Adresse an."
    ]);
    exit;
}

// --- 3. CSV-Daten vorbereiten ---
$csvLine = [
    date('Y-m-d H:i:s'),
    $name,
    $adresse,
    $telefon,
    $email,
    $teilnehmer,
    $unterkunft,
    $anreisedatum,
    $foodSelection,
    $nachricht
];

// --- 4. Speichern in CSV ---
if (!is_dir(dirname($csvFile))) {
    mkdir(dirname($csvFile), 0755, true); // Ordner anlegen, falls nicht vorhanden
}

$fileExists = file_exists($csvFile);
$isEmpty = !$fileExists || filesize($csvFile) === 0;

if (($fp = fopen($csvFile, 'a')) !== false) {
    flock($fp, LOCK_EX);
    if ($isEmpty) {
    fputcsv($fp, [
        'Datum',
        'Name',
        'Adresse',
        'Telefon',
        'E-Mail',
        'Begleitpersonen',
        'Unterkunft',
        'Anreisedatum',
        'Essenswahl',
        'Nachricht'
    ], ';', '"', '\\'); // <-- Escape-Parameter ergänzt
    }
    fputcsv($fp, $csvLine, ';', '"', '\\'); // <-- Escape-Parameter ergänzt
    flock($fp, LOCK_UN);
    fclose($fp);
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Konnte Datei zum Speichern nicht öffnen."
    ]);
    exit;
}

// --- 5. Erfolg zurückgeben ---
echo json_encode([
    "success" => true,
    "message" => "Danke für deine Anmeldung, $name! Wir freuen uns auf dich."
]);
exit;
?>
