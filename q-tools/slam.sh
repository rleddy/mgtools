qtype=$1
if [  -z $1 ]
then
    qtype=flexi
else
    qtype=$1
fi
echo $qtype
#
if [ $qtype != 'skip' ]; then
    echo > filenames.txt
    if [ -z $2 ]; then
        # group 2 [10min @ 1.0]
        # ten minutes on one second apart.  group 2
        node apigeereq-quota.js $qtype '[[1000,60]]' 'A' >> filenames.txt &
        node apigeereq-quota.js $qtype '[[1000,60]]' 'B' >> filenames.txt &
        #node apigeereq-quota.js $qtype  '[[1000,600]]' 'C' >> filenames.txt &
        #node apigeereq-quota.js $qtype  '[[1000,600]]' 'D' >> filenames.txt &
        #node apigeereq-quota.js $qtype  '[[1000,600]]' 'E' >> filenames.txt &
        #node apigeereq-quota.js $qtype  '[[1000,600]]' 'F' >> filenames.txt &
        #node apigeereq-quota.js $qtype  '[[1000,600]]' 'G' >> filenames.txt &
        #node apigeereq-quota.js $qtype  '[[1000,600]]' 'H' >> filenames.txt &
        #
    else
        source ./schedules/$2.sh
    fi
    wait
fi

#
xargs <filenames.txt -I filename node extract "filename"
#
wait
python display.py filenames.txt $2 $qtype
