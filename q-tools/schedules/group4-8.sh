 
#Group 4 schedules run for 1 hour with 5 minutes or more between requests
echo "group 4-8"
# group 4 [1 hour @ 300000.0]
node apigeereq-quota.js $qtype '[[300000,4000]]' 'A' >> filenames.txt &
node apigeereq-quota.js $qtype  '[[300000,4000]]' 'B' >> filenames.txt &
node apigeereq-quota.js $qtype  '[[300000,4000]]' 'C' >> filenames.txt &
node apigeereq-quota.js $qtype  '[[300000,4000]]' 'D' >> filenames.txt &
node apigeereq-quota.js $qtype  '[[300000,4000]]' 'E' >> filenames.txt &
node apigeereq-quota.js $qtype  '[[300000,4000]]' 'F' >> filenames.txt &
node apigeereq-quota.js $qtype  '[[300000,4000]]' 'G' >> filenames.txt &
node apigeereq-quota.js $qtype  '[[300000,4000]]' 'H' >> filenames.txt &
#
