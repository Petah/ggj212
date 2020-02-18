<?php
$chrome = '"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"';
$baseUrl = 'http://localhost:81/work/phaser3-typescript/src/boilerplate/assets/ship/';
foreach (glob('*.svg') as $svg) {
    $xml = simplexml_load_file($svg);
    $width = (string) $xml['width'];
    $height = (string) $xml['height'];
    $outputFile = str_replace('.svg', '.png', realpath($svg));
    $command = "$chrome --headless --enable-logging --disable-gpu --window-size=$width,$height --default-background-color=00000000 --screenshot=$outputFile $baseUrl/$svg";
    echo $command . PHP_EOL;
    exec($command);
    $command = "convert -rotate 90 -trim +repage $outputFile $outputFile";
    echo $command . PHP_EOL;
    exec($command);
}
