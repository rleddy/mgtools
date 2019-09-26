 
#Group 4 schedules run for 2+ hours with 1 minute or more between requests
echo "group 4-8-1m"
# group 4 [2+ hour @ 600000.0]
node apigeereq-quota.js $qtype '[[60000,8000]]' 'A' >> filenames.txt &
node apigeereq-quota.js $qtype '[[60000,8000]]' 'B' >> filenames.txt &
node apigeereq-quota.js $qtype '[[60000,8000]]' 'C' >> filenames.txt &
node apigeereq-quota.js $qtype '[[60000,8000]]' 'D' >> filenames.txt &
node apigeereq-quota.js $qtype '[[60000,8000]]' 'E' >> filenames.txt &
node apigeereq-quota.js $qtype '[[60000,8000]]' 'F' >> filenames.txt &
node apigeereq-quota.js $qtype '[[60000,8000]]' 'G' >> filenames.txt &
node apigeereq-quota.js $qtype '[[60000,8000]]' 'H' >> filenames.txt &
#
