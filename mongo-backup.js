mongodump -d coffeecu -o ~/dev/backups/db_dump

mongoexport --db coffeecu --collection seo --out seo.json
mongoexport --db coffeecu --collection people-master --out people-master.json
mongoexport --db coffeecu --collection people-pending --out people-pending.json
mongoexport --db coffeecu --collection people-rejected --out people-rejected.json
mongoexport --db coffeecu --collection users --out users.json
mongoexport --db coffeecu --collection uni --out uni.json
mongoexport --db coffeecu --collection meetings --out meetings.json
mongoexport --db coffeecu --collection meteor_accounts_loginServiceConfiguration --out meteor_accounts_loginServiceConfiguration.json
mongoexport --db coffeecu --collection blacklist --out blacklist.json
mongoexport --db coffeecu --collection system.indexes --out system.indexes.json
mongoexport --db coffeecu --collection meteor_oauth_pendingCredentials --out meteor_oauth_pendingCredentials.json
