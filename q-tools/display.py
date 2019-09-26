

import matplotlib.pyplot as plt
from matplotlib import colors as mcolors
import json
import sys
import random
import numpy as np


colornames = [u'black', u'dimgray', u'dimgrey', u'gray', u'darkgray', u'darkgrey', u'silver', u'rosybrown', u'indianred', u'brown', u'firebrick', u'maroon', u'darkred', u'r', u'red', u'salmon', u'tomato', u'darksalmon', u'orangered', u'sienna', u'chocolate', u'saddlebrown', u'sandybrown', u'peru', u'bisque', u'darkorange', u'burlywood', u'tan', u'papayawhip', u'moccasin', u'orange',  u'oldlace', u'darkgoldenrod', u'goldenrod', u'gold', u'darkkhaki', u'beige', u'olive', u'olivedrab', u'yellowgreen', u'darkolivegreen', u'greenyellow', u'chartreuse', u'lawngreen', u'darkseagreen', u'forestgreen', u'limegreen', u'darkgreen', u'g', u'green', u'lime', u'seagreen', u'mediumseagreen', u'springgreen', u'mediumspringgreen', u'mediumaquamarine', u'aquamarine', u'turquoise', u'mediumturquoise', u'azure', u'darkslategray', u'darkslategrey', u'teal', u'darkcyan', u'c', u'aqua', u'cyan', u'darkturquoise', u'cadetblue', u'deepskyblue', u'skyblue',  u'steelblue', u'aliceblue', u'dodgerblue', u'slategray', u'slategrey', u'royalblue', u'lavender', u'midnightblue', u'navy', u'darkblue', u'mediumblue', u'b', u'blue', u'slateblue', u'darkslateblue', u'mediumslateblue', u'mediumpurple', u'rebeccapurple', u'blueviolet', u'indigo', u'darkorchid', u'darkviolet', u'mediumorchid', u'thistle', u'plum', u'violet', u'purple', u'darkmagenta', u'm', u'fuchsia', u'magenta', u'orchid', u'mediumvioletred', u'deeppink', u'hotpink',u'crimson']

def showQuotas(datFile):
    with open(datFile) as f:
        x = json.load(f)

    f = plt.figure()
    plt.plot(x)
    plt.show()
    bb = datFile.split('.')
    bb = bb[0] + '.pdf'
    f.savefig(bb, bbox_inches='tight')

def randomColorList(N):
    global colornames
    #
    n = len(colornames)
    names = random.sample(colornames, N)
    return names


def showQuotaList(datFileList,schedule,quotaType,nowindow):
    
    print datFileList
    
    datFile = datFileList[0]  #get a name
    bb = datFile.split('.')
    bb = bb[0] + '.pdf'
    #
    fig = plt.figure()
    
    
    colors = randomColorList(len(datFileList))
    i = 0
    for datFile in datFileList:
        with open(datFile) as f:
            x = json.load(f)
        #
        t = np.arange(0,(len(x)/10),0.1)
        xp = np.array(x)
        c = colors[i]
        plt.plot(t,xp[0:t.size],c,label=str(i+1))
        i += 1
    #
    plt.ylabel("quota available")
    plt.xlabel("time in secs - sample delta T = 0.01sec")
    if ( schedule == None ):
        plt.title(' quota type: ' + quotaType)
    else:
        plt.title("schedule = " + schedule + ' quota type: ' + quotaType)
    plt.legend()
    if not nowindow:
        plt.show()
    #
    fig.savefig(bb, bbox_inches='tight')


def main(flist,schedule,quotaType,nowindow):
    test_list = [i for i in flist if i]
    test_list = list(map(lambda x: (x.split('.'))[0] + '.json', test_list))
    showQuotaList(test_list,schedule,quotaType,nowindow)

if __name__ == "__main__":
    print sys.argv[1]
    with open(sys.argv[1]) as f:
        lines = f.readlines()
    #
    schedule="unknown"
    if len(sys.argv) > 2:
        schedule=sys.argv[2]
    #
    quotaType="flexi"
    if len(sys.argv) > 3:
        quotaType=sys.argv[3]
    #
    if ( quotaType == "skip" ):
        quotaType = schedule
        schedule = None
    nowindow = False
    if len(sys.argv) > 4:
        nowindow = True
    #
    content = [x.strip() for x in lines]
    main(content,schedule,quotaType,nowindow)
