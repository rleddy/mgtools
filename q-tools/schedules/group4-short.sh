 
#Group 2 schedules run for ten minutes with 1 second or more between requests
echo "group 4-short"
# group 4 [10 minutes @ 1.0]
# ten minutes on one second apart.
node apigeereq-quota.js $qtype '[[30000,600]]' 'A' >> filenames.txt &
node apigeereq-quota.js $qtype  '[[30000,600]]' 'B' >> filenames.txt &
#node apigeereq-quota.js $qtype  '[[1000,600]]' 'C' >> filenames.txt &
#node apigeereq-quota.js $qtype  '[[1000,600]]' 'D' >> filenames.txt &
#node apigeereq-quota.js $qtype  '[[1000,600]]' 'E' >> filenames.txt &
#node apigeereq-quota.js $qtype  '[[1000,600]]' 'F' >> filenames.txt &
#node apigeereq-quota.js $qtype  '[[1000,600]]' 'G' >> filenames.txt &
#node apigeereq-quota.js $qtype  '[[1000,600]]' 'H' >> filenames.txt &
#
