pushd %~dp0\..
call rsync -avz --delete --no-perms --no-owner --no-group --checksum --exclude=node_modules --exclude=.git --exclude=temp ./ root@pluto.neilsen.nz:/var/www/phaser.projectz.co.nz/site/public/
call ssh root@pluto.neilsen.nz "chown -R root:root /var/www/phaser.projectz.co.nz/ && chmod -R 755 /var/www/phaser.projectz.co.nz/"
popd
