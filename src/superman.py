#!/usr/bin/python

#
#   SUPERMAN
#

import sys
import os
import glob


src_dir = os.path.dirname(os.path.realpath(__file__))
modules_dir = str(src_dir) + "/../modules"
concepts_dir = str(src_dir) + "/../concepts"

def main():
    started = 1;

    if(len(sys.argv) == 1):
        # Enter main loop
        while(started):
            stdin_args = [];
            stdin_args.append(sys.argv[0]);

    else:
        parse_args(sys.argv);
         

def parse_args(args_arr):
    if args_arr[1] == "list":
        if args_arr[2] == "modules":
            list_modules();
        elif (args_arr[2] == "cheats" or args_arr[2] == "cheatsheets"):
            list_cheatsheets();
        else:
            print "Sorry " + str(args_arr[2]) + " is not a listable thing...";
    elif args_arr[1] == "cheat":
        if cheatExists(args_arr[2]):
            
        else: 
            print "Sorry. The cheatsheet " + args_arr[2] + " does not exist"


## LIST functions
def list_modules():
    for root,dirs,files in os.walk(modules_dir):
        for file in files:
            if file.endswith("_mod.py"):
                print file[:-7]

def list_cheatsheets():
    for root,dirs,files in os.walk(modules_dir):
        for file in files:
            if file.endswith("_cheatsheet.py"):
                print file[:-14]


## ADD functions
def add_moduless():
    print ""

## Check exists functions
def cheatExists(name):
    for root,dirs,files in os.walk(modules_dir):
        for file in files:
            fn = str(name) + "_cheatsheet.py"
            if (file == fn):
                return True
    return False

def moduleExists(name):
    for root,dirs,files in os.walk(modules_dir):
        for file in files:
            fn = str(name) + "_mod.py"
            if (file == fn):
                return True
    return False



if __name__ == "__main__":
    main()