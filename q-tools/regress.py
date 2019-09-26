

import matplotlib.pyplot as plt
from matplotlib import colors as mcolors
import json
import sys
import random
import numpy as np
from scipy import stats




colornames = [u'black', u'dimgray', u'dimgrey', u'gray', u'darkgray', u'darkgrey', u'silver', u'rosybrown', u'indianred', u'brown', u'firebrick', u'maroon', u'darkred', u'r', u'red', u'salmon', u'tomato', u'darksalmon', u'orangered', u'sienna', u'chocolate', u'saddlebrown', u'sandybrown', u'peru', u'bisque', u'darkorange', u'burlywood', u'tan', u'papayawhip', u'moccasin', u'orange',  u'oldlace', u'darkgoldenrod', u'goldenrod', u'gold', u'darkkhaki', u'beige', u'olive', u'olivedrab', u'yellowgreen', u'darkolivegreen', u'greenyellow', u'chartreuse', u'lawngreen', u'darkseagreen', u'forestgreen', u'limegreen', u'darkgreen', u'g', u'green', u'lime', u'seagreen', u'mediumseagreen', u'springgreen', u'mediumspringgreen', u'mediumaquamarine', u'aquamarine', u'turquoise', u'mediumturquoise', u'azure', u'darkslategray', u'darkslategrey', u'teal', u'darkcyan', u'c', u'aqua', u'cyan', u'darkturquoise', u'cadetblue', u'deepskyblue', u'skyblue',  u'steelblue', u'aliceblue', u'dodgerblue', u'slategray', u'slategrey', u'royalblue', u'lavender', u'midnightblue', u'navy', u'darkblue', u'mediumblue', u'b', u'blue', u'slateblue', u'darkslateblue', u'mediumslateblue', u'mediumpurple', u'rebeccapurple', u'blueviolet', u'indigo', u'darkorchid', u'darkviolet', u'mediumorchid', u'thistle', u'plum', u'violet', u'purple', u'darkmagenta', u'm', u'fuchsia', u'magenta', u'orchid', u'mediumvioletred', u'deeppink', u'hotpink',u'crimson']

def showRegressrion(x,y,timeout,rc,rlab):
    gradient, intercept, r_value, p_value, std_err = stats.linregress(x,y)
    mn=np.min(x)
    mx=np.max(x)
    x1=np.linspace(mn,mx,500)
    y1=gradient*x1+intercept
    
    plt.ylabel("# 200 OK in 90 sec run")
    plt.xlabel("quota available @ flush interval = " + timeout)

    
    plt.plot(x,y,'ob')
    plt.plot(x1,y1,color=rc,label=rlab)
#plt.show()


def main():
    #
    fig = plt.figure()
    #
    x = np.array([0,1,2,3,4,5])
    y = np.array([2,22,42,62,81,102]) #rc,rlab
    showRegressrion(x,y,timeout="5 secs",rc=u'black',rlab='5 secs')
    #
    x = np.array([0, 1, 2, 3, 5, 10, 20])
    y = np.array([2,13,23,35,57,112,222])
    showRegressrion(x,y,timeout="10 secs",rc=u'red',rlab='10 secs')
    #
    x = np.array([0, 1, 10,  20,  40])
    y = np.array([2, 8, 62, 122, 242])
    showRegressrion(x,y,timeout="20 secs",rc=u'green',rlab='20 secs')
    #
    x = np.array([0, 1, 5,  10,  40])
    y = np.array([2, 7, 27, 52, 202])
    showRegressrion(x,y,timeout="30 secs",rc=u'blue',rlab='30 secs')
    #
    x = np.array([0, 1, 10,  40])
    y = np.array([2, 6, 42, 162])
    showRegressrion(x,y,timeout="40 secs",rc=u'purple',rlab='40 secs')
    #
    x = np.array([0, 1, 10,  40])
    y = np.array([2, 4, 32, 122])
    showRegressrion(x,y,timeout="60 secs",rc=u'navy',rlab='60 secs')
    #
    x = np.array([0, 1, 10, 40])
    y = np.array([2, 4, 22, 80])
    showRegressrion(x,y,timeout="during 90 sec run",rc=u'orange',rlab='100 secs')

    plt.legend()
    #if not nowindow:
    plt.show()
    #
    fig.savefig('regressions-quota.pdf', bbox_inches='tight')



if __name__ == "__main__":
    #
    main()
