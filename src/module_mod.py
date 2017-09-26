
####################
## MODULES MODULE ##
####################

import os

src_dir = os.path.dirname(os.path.realpath(__file__))
modules_dir = str(src_dir) + "/../modules"

# Lists all modules
def list_modules():
    for root,dirs,files in os.walk(modules_dir):
        for file in files:
            if file.endswith("_mod.py"):
                print file[:-7]

# Adds a new modules dynamically
def add_modules():
    print ""

# Check if module exists
def moduleExists(name):
    for root,dirs,files in os.walk(modules_dir):
        for file in files:
            fn = str(name) + "_mod.py"
            if (file == fn):
                return True
    return False