
#######################
## CHEATSHEET MODULE ##
#######################

# Dependencies
import os
import imp
src_dir = os.path.dirname(os.path.realpath(__file__))
modules_dir = str(src_dir) + "/../modules"


# Lists all cheatsheets
def list_cheatsheets():
    for root,dirs,files in os.walk(modules_dir):
        for file in files:
            if file.endswith("_cheatsheet.py"):
                print file[:-14]


# Chekc is cheatsheet exists
def cheatExists(name):
    for root,dirs,files in os.walk(modules_dir):
        for file in files:
            fn = str(name) + "_cheatsheet.py"
            if (file == fn):
                return True
    return False

# Print respective cheatsheet
def getCheat(name):
    for root,dirs,files in os.walk(modules_dir):
        for file in files:
            fn = str(name) + "_cheatsheet.py"
            if (file == fn):
                newfn = root + '/' + fn
                c = imp.load_source(fn, newfn);
                c.printCheatSheet();
                