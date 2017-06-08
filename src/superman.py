#!/usr/bin/python

#
#   SUPERMAN
#   Written By: Tyler Welton (spaceB0x)
#

import sys
import os
import glob
import argparse
import cheatsheet_mod as cheat
import module_mod as mod

src_dir = os.path.dirname(os.path.realpath(__file__))

#############
# ARGUMENTS #
#############

parser = argparse.ArgumentParser(description='Turn your mind into a super manual....')
group = parser.add_mutually_exclusive_group()
group.add_argument('-l', '--list', help='list modules, cheats, etc')
group.add_argument('-c', '--cheat', help='use a cheatsheet')
args = parser.parse_args()

def main():
    # If no arguments, then start framework loop
    if(len(sys.argv) == 1):
        # Enter main loop
        while 1:
            printBanner()
            stdin_args = []
            stdin_args.append(sys.argv[0])
    # Else execute one time command (don't enter framework loop)
    else:
        parse_arguments()
        print "ok" 

## Parses arguments for quick command line usage
def parse_arguments():
    ## handle arguments
    if (args.list == "modules") and (args.list != None):
        mod.list_modules()
        exit
    elif (args.list != None) and (args.list == "cheats" or args.list == "cheatsheets"):
        cheat.list_cheatsheets()
        exit

    if args.cheat != None:
        if cheat.cheatExists(args.cheat):
            cheat.getCheat(args.cheat)
            exit
        else: 
            print "Sorry. The cheatsheet " + args.cheat + " does not exist or"


def printBanner():
    print "Welcome to Superman!"

if __name__ == "__main__":
    main()
