

import numpy as np
import matplotlib.pyplot as plt
from matplotlib.widgets import Slider, Button, RadioButtons

quota = 100


def stagger_calc(qshift,slope,base):
    #
    #
    i = 50;
    requester = np.zeros(600)
    while ( i < 600 ):
        j = 0
        for j in range(0,50):
            requester[i + j] = j*slope
        i += 50
    #
    i = 0
    value = 0
    qsource = np.zeros(600)
    prev_value = base
    while ( i < 600 ):
        j = 0
        k = int(((int(i/50) + qshift) % 12)*50) % 549
        for j in range(0,50):
            qsource[k+j] = value + prev_value
        prev_value = prev_value + value
        value = requester[k-1]
        i += 50
    #
    qfinal = requester + qsource
    #
    qbounded = np.array(qfinal)
    for i in range(0,qbounded.size):
        qbounded[i] = min(qbounded[i],quota)

    return requester,qsource,qfinal,qbounded

def staggerPlot():
    requester,qsource,qfinal,qbounded = stagger_calc(0,1,0)
    #
    fig, ax = plt.subplots()
    plt.subplots_adjust(left=0.25, bottom=0.25)
    #
    t = np.arange(0,(len(requester)),1)
    l1, = plt.plot(t,requester[0:t.size],color=u'midnightblue',linewidth=3)
    l2, = plt.plot(t,qsource[0:t.size]/2,color=u'crimson',linewidth=3)
    l3, = plt.plot(t,qfinal[0:t.size]/2,color=u'red',linewidth=2)
    l4, = plt.plot(t,qbounded[0:t.size],color=u'black',linewidth=4)
    #
    axcolor = 'lightgoldenrodyellow'
    axshift = plt.axes([0.25, 0.1, 0.65, 0.03], facecolor=axcolor)
    axslope = plt.axes([0.25, 0.15, 0.65, 0.03], facecolor=axcolor)
    axbase = plt.axes([0.25, 0.20, 0.65, 0.03], facecolor=axcolor)
    sshift = Slider(axshift, 'Shift', 0.1, 30.0, valinit=0)
    sslope = Slider(axslope, 'Slope', 0.1, 30.0, valinit=0)
    sbase = Slider(axbase, 'Base', 0.1, 100.0, valinit=0)


    def update(val):
        shift = sshift.val
        slope = sslope.val
        base = sbase.val
        requester,qsource,qfinal,qbounded = stagger_calc(shift,slope,base)
        #
        l1.set_ydata(requester[0:t.size])
        l2.set_ydata(qsource[0:t.size]/2)
        l3.set_ydata(qfinal[0:t.size]/2)
        l4.set_ydata(qbounded[0:t.size])
        fig.canvas.draw_idle()

    sshift.on_changed(update)
    sslope.on_changed(update)
    sbase.on_changed(update)



    plt.show()

if __name__ == "__main__":
    print "hello"
    staggerPlot()
