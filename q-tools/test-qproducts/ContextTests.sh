#!/bin/sh

#
# Author: dkoroth@google.com
#
# Author: leddyr@google.com # set up different product with different quotas,
#
#set -x

source ./testhelper.sh

# Username and Password for the api.enterprise.apigee.com
#MOCHA_USER=
#MOCHA_PASSWORD=

# OrgName configured at api.enterprise.apigee.com
#MOCHA_ORG=

# Proxy environment configured at api.enterprise.apigee.com
# Default is 'test' environment
#MOCHA_ENV=

#set -x

proxyNamePrefix="edgemicro_"
proxyTargetUrl="http://mocktarget.apigee.net/json"

EMG_CONFIG_DIR="$HOME/.edgemicro"
EMG_CONFIG_FILE="$HOME/.edgemicro/$MOCHA_ORG-$MOCHA_ENV-config.yaml"
#
QPREP=$1
QTYPE=$2
pQUOTA=$3
pINTERVAL=$4
pTIMEUNIT=$5
pWEIGHT=$6
if [ -z $pQUOTA ];then
    pQUOTA=10
    pINTERVAL=1
    pTIMEUNIT="minute"
fi
if [ -z $pINTERVAL ];then
    pINTERVAL=1
fi
if [ -z $pTIMEUNIT ];then
    pTIMEUNIT="minute"
fi
if [ -z $pWEIGHT ];then
    pWEIGHT=1
fi
#
PRODUCT_NAME="edgemicro_product_q${QPREP}"
PROXY_NAME="edgemicro_proxy_q${QPREP}"
DEVELOPER_NAME="edgemicro_dev_q${QPREP}"
DEVELOPER_APP_NAME="edgemicro_dev_app_q${QPREP}"

echo $PRODUCT_NAME
echo $PROXY_NAME
echo $DEVELOPER_NAME
echo $DEVELOPER_APP_NAME


TIMESTAMP=`date "+%Y-%m-%d-%H"`
LOGFILE="NightlyTestLog.$TIMESTAMP"

RED=`tput setaf 1`
GREEN=`tput setaf 2`
NC=`tput sgr0`

STATUS_PASS_STR="Status: ${GREEN}PASS${NC}"
STATUS_FAIL_STR="Status: ${RED}FAIL${NC}"

main() {

  local result=0
  local ret=0
  local testCount=0
  local testPassCount=0
  local testFailCount=0
  local testSkipCount=0

  # check MOCHA_USER is set
  if [ -z $MOCHA_USER ]; then
       echo "MOCHA_USER is not set"
       exit 1
  fi
   
  # check MOCHA_PASSWORD is set
  if [ -z $MOCHA_PASSWORD ]; then
       echo "MOCHA_PASSWORD is not set"
       exit 1
  fi

  # check MOCHA_ORG is set
  if [ -z $MOCHA_ORG ]; then
       echo "MOCHA_ORG is not set"
       exit 1
  fi

  # check MOCHA_ENV is set
  if [ -z $MOCHA_ENV ]; then
       echo "MOCHA_ENV is not set"
       exit 1
  fi

  # Cleanup all the temporary files
  #cleanUp

  echo
  testCount=`expr $testCount + 1`
  echo "$testCount) createAPIProxy"
  createAPIProxy ${PROXY_NAME}; ret=$?
  if [ $ret -eq 0 ]; then
       echo "$STATUS_PASS_STR"
       testPassCount=`expr $testPassCount + 1`
  else
       echo "$STATUS_FAIL_STR"
       result=1
       testFailCount=`expr $testFailCount + 1`
  fi

  echo
  testCount=`expr $testCount + 1`
  echo "$testCount) createAPIProxyBundle"
  createAPIProxyBundle ${PROXY_NAME}; ret=$?
  if [ $ret -eq 0 ]; then
       echo "$STATUS_PASS_STR"
       testPassCount=`expr $testPassCount + 1`
  else
       echo "$STATUS_FAIL_STR"
       result=1
       testFailCount=`expr $testFailCount + 1`
  fi

  echo
  testCount=`expr $testCount + 1`
  echo "$testCount) updateAPIProxy"
  updateAPIProxy ${PROXY_NAME} ${PROXY_NAME}.zip ${proxyBundleVersion}; ret=$?
  if [ $ret -eq 0 ]; then
       echo "$STATUS_PASS_STR"
       testPassCount=`expr $testPassCount + 1`
  else
       echo "$STATUS_FAIL_STR"
       result=1
       testFailCount=`expr $testFailCount + 1`
  fi

  echo
  testCount=`expr $testCount + 1`
  echo "$testCount) deployAPIProxy"
  deployAPIProxy ${PROXY_NAME} ${MOCHA_ENV} ${proxyBundleVersion}; ret=$?
  if [ $ret -eq 0 ]; then
       echo "$STATUS_PASS_STR"
       testPassCount=`expr $testPassCount + 1`
  else
       echo "$STATUS_FAIL_STR"
       result=1
       testFailCount=`expr $testFailCount + 1`
  fi

  echo
  testCount=`expr $testCount + 1`
  echo "$testCount) createAPIProduct"

  createAPIProduct ${PRODUCT_NAME} ${PROXY_NAME} ${pQUOTA} ${pINTERVAL} ${pTIMEUNIT}; ret=$?
  rm -f ${PRODUCT_NAME}.json
  if [ $ret -eq 0 ]; then
       echo "$STATUS_PASS_STR"
       testPassCount=`expr $testPassCount + 1`
  else
       echo "$STATUS_FAIL_STR"
       result=1
       testFailCount=`expr $testFailCount + 1`
  fi

  echo
  testCount=`expr $testCount + 1`
  echo "$testCount) listAPIProduct"
  listAPIProduct ${PRODUCT_NAME}; ret=$?
  if [ $ret -eq 0 ]; then
       echo "$STATUS_PASS_STR"
       testPassCount=`expr $testPassCount + 1`
  else
       echo "$STATUS_FAIL_STR"
       result=1
       testFailCount=`expr $testFailCount + 1`
  fi

  echo
  testCount=`expr $testCount + 1`
  echo "$testCount) createDeveloper"
  createDeveloper ${DEVELOPER_NAME}; ret=$?
  if [ $ret -eq 0 ]; then
       echo "$STATUS_PASS_STR"
       testPassCount=`expr $testPassCount + 1`
  else
       echo "$STATUS_FAIL_STR"
       result=1
       testFailCount=`expr $testFailCount + 1`
  fi

  echo
  testCount=`expr $testCount + 1`
  echo "$testCount) createDeveloperApp"

  createDeveloperApp ${DEVELOPER_NAME} ${DEVELOPER_APP_NAME} ${PRODUCT_NAME}; ret=$?
  if [ $ret -eq 0 ]; then
       echo "$STATUS_PASS_STR"
       testPassCount=`expr $testPassCount + 1`
  else
       echo "$STATUS_FAIL_STR"
       result=1
       testFailCount=`expr $testFailCount + 1`
  fi
  rm -f ${DEVELOPER_APP_NAME}.json

# #

  echo "SLAM) RUN QUOTA SAMPLING PERIOD"
#   SLAM SLAM SLAM SLAM SLAM SLAM SLAM

  listDeveloperApps ${DEVELOPER_NAME}

  setupUserData ${QPREP} ${QTYPE} ${DEVELOPER_NAME} ${DEVELOPER_APP_NAME} ${pQUOTA} ${pINTERVAL} ${pTIMEUNIT} ${pWEIGHT}

#   SLAM SLAM SLAM SLAM SLAM SLAM SLAM

  pushd ..
  # run the slam test with the appropriate schedule...
  cat usrdata.json
  bash slam.sh ${QTYPE} ${QPREP}
  popd

  echo
  testCount=`expr $testCount + 1`
  echo "$testCount) deleteDeveloperApp"
  deleteDeveloperApp ${DEVELOPER_NAME} ${DEVELOPER_APP_NAME}; ret=$?
  if [ $ret -eq 0 ]; then
       echo "$STATUS_PASS_STR"
       testPassCount=`expr $testPassCount + 1`
  else
       echo "$STATUS_FAIL_STR"
       result=1
       testFailCount=`expr $testFailCount + 1`
  fi

  echo
  testCount=`expr $testCount + 1`
  echo "$testCount) deleteAPIProduct"
  deleteAPIProduct ${PRODUCT_NAME}; ret=$?
  if [ $ret -eq 0 ]; then
       echo "$STATUS_PASS_STR"
       testPassCount=`expr $testPassCount + 1`
  else
       echo "$STATUS_FAIL_STR"
       result=1
       testFailCount=`expr $testFailCount + 1`
  fi

  echo
  testCount=`expr $testCount + 1`
  echo "$testCount) undeployAPIProxy"
  undeployAPIProxy ${PROXY_NAME} ${MOCHA_ENV} ${proxyBundleVersion}; ret=$?
  if [ $ret -eq 0 ]; then
       echo "$STATUS_PASS_STR"
       testPassCount=`expr $testPassCount + 1`
  else
       echo "$STATUS_FAIL_STR"
       result=1
       testFailCount=`expr $testFailCount + 1`
  fi
  rm -f ${PROXY_NAME}.zip

  echo
  testCount=`expr $testCount + 1`
  echo "$testCount) deleteAPIProxy"
  deleteAPIProxy ${PROXY_NAME}; ret=$?
  if [ $ret -eq 0 ]; then
       echo "$STATUS_PASS_STR"
       testPassCount=`expr $testPassCount + 1`
  else
       echo "$STATUS_FAIL_STR"
       result=1
       testFailCount=`expr $testFailCount + 1`
  fi

  echo
  testCount=`expr $testCount + 1`
  echo "$testCount) deleteDeveloper"
  deleteDeveloper ${DEVELOPER_NAME}; ret=$?
  if [ $ret -eq 0 ]; then
       echo "$STATUS_PASS_STR"
       testPassCount=`expr $testPassCount + 1`
  else
       echo "$STATUS_FAIL_STR"
       result=1
       testFailCount=`expr $testFailCount + 1`
  fi

  echo
  let testSkipCount="$testCount - ($testPassCount + $testFailCount)"
  echo "$testCount tests, $testPassCount passed, $testFailCount failed, $testSkipCount skipped"

  exit $result

}

main $@


