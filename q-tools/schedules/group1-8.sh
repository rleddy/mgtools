#
#Group 1 schedules use a short burst of 0.01 sec separated requests allowed to complete before sending.
#The burst lasts for 10 seconds. This is followed by longer separations 0.7sec to 2sec separations.
#
echo "GROUP 1-8"
# group 1 [10sec @ 0.01, 2 minutes @ > 0.7] 
node apigeereq-quota.js $qtype '[[1,10],[900,120]]' 'A' >> filenames.txt &
node apigeereq-quota.js $qtype  '[[1,10],[700,120]]' 'B' >> filenames.txt &
node apigeereq-quota.js $qtype  '[[1,10],["random",120]]' 'C' >> filenames.txt &
node apigeereq-quota.js $qtype  '[[1,10],[1000,120]]' 'D' >> filenames.txt &
node apigeereq-quota.js $qtype  '[[1,10],[1000,120]]' 'E' >> filenames.txt &
node apigeereq-quota.js $qtype  '[[1,10],[1000,120]]' 'F' >> filenames.txt &
node apigeereq-quota.js $qtype  '[[1,10],["random",120]]' 'G' >> filenames.txt &
node apigeereq-quota.js $qtype  '[[1,10],[2000,120]]' 'H' >> filenames.txt &

