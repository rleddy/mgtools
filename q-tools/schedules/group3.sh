 
#Group 2 schedules run for ten minutes with 1 second or more between requests
echo "group 3-2"
# group 3 [1 hour @ 1.0]
# one hour at one second apart.  group 3
node apigeereq-quota.js $qtype '[[1000,3600]]' 'A' >> filenames.txt &
#node apigeereq-quota.js $qtype  '[[1000,3600]]' 'B' >> filenames.txt &
#node apigeereq-quota.js $qtype  '[[1000,600]]' 'C' >> filenames.txt &
#node apigeereq-quota.js $qtype  '[[1000,600]]' 'D' >> filenames.txt &
#node apigeereq-quota.js $qtype  '[[1000,600]]' 'E' >> filenames.txt &
#node apigeereq-quota.js $qtype  '[[1000,600]]' 'F' >> filenames.txt &
#node apigeereq-quota.js $qtype  '[[1000,600]]' 'G' >> filenames.txt &
#node apigeereq-quota.js $qtype  '[[1000,600]]' 'H' >> filenames.txt &
#
