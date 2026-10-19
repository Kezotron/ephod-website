#!/bin/bash
# Rebuild, mirror into the test folder (pointing at the mock API), make sure servers run.
set -e
S=/tmp/claude-0/-home-claude/b602244f-d7b9-522b-95d8-07b2cd469a4b/scratchpad
cd /home/claude/ephod-site && python3 -I tools/build.py >/dev/null
mkdir -p $S/dist-test && rm -rf $S/dist-test/* && cp -r dist/. $S/dist-test/
sed -i 's#https://www.uneashippinglimited.com/api/#http://127.0.0.1:8787/#' $S/dist-test/js/config.js
up() { curl -s -m 2 -o /dev/null "$1"; }
up "http://127.0.0.1:8787/get_daily_reading_plan.php?day=1" || setsid nohup python3 -I /home/claude/ephod-site/tools/mock_api.py >/tmp/mock.log 2>&1 < /dev/null &
up "http://127.0.0.1:8788/index.html" || (cd $S/dist-test && setsid nohup php -S 127.0.0.1:8788 >/tmp/php.log 2>&1 < /dev/null &)
for i in 1 2 3 4 5 6; do up "http://127.0.0.1:8788/index.html" && up "http://127.0.0.1:8787/get_daily_reading_plan.php?day=1" && echo "local test site ready" && exit 0; sleep 1; done
echo "servers failed to start"; exit 1
