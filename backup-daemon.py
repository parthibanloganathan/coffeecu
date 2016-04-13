import daemon
import subprocess
import time

with daemon.DaemonContext():
    print "Creating backup at %s" % datetime.datetime.now()
    subprocess.call(['./backup.sh'])
    time.sleep(3600)
