<?php
$chrome = '"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"';
$baseUrl = 'http://localhost:81/work/phaser3-typescript/src/boilerplate/assets';
$assetPath = realpath(__DIR__ . '/../src/boilerplate/assets/');
$distPath = __DIR__ . '/../dist/assets/';
if (!is_dir($distPath)) {
    mkdir($distPath, 0777, true);
}
$manifestFile = $distPath . '/render-manifest.json';
$manifest = [];
if (is_file($manifestFile)) {
    $manifest = json_decode(file_get_contents($manifestFile), true);
}

foreach (glob($assetPath . '/**/*.svg') as $svg) {
    $urlSlug = str_replace([$assetPath, '\\'], ['', '/'], realpath($svg));
    $hash = md5_file($svg);
    if (isset($manifest[$urlSlug]) && $manifest[$urlSlug] === $hash) {
        continue;
    }
    $manifest[$urlSlug] = $hash;

    $outputFile = str_replace([$assetPath, '.svg'], [$distPath, '.png'], realpath($svg));
    $outputFile = realpath(dirname($outputFile)) . DIRECTORY_SEPARATOR . basename($outputFile);
    $xml = simplexml_load_file($svg);
    $width = (string) $xml['width'];
    $height = (string) $xml['height'];
    $baseName = basename($svg);
    $command = "$chrome --enable-logging --disable-extensions --headless --disable-gpu --window-size=$width,$height --default-background-color=00000000 --screenshot=$outputFile {$baseUrl}{$urlSlug}?debug=false";
    echo $command . PHP_EOL;
    exec($command);
    $command = "convert -rotate 90 -resize 50% -trim +repage $outputFile $outputFile";
    echo $command . PHP_EOL;
    exec($command);
}

file_put_contents($manifestFile, json_encode($manifest, JSON_PRETTY_PRINT));
