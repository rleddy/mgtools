if [ -z $1 ]; then
    echo "A parameter indicating with quota prep is needed"
    exit 0
fi

if [ -z "$MOCHA_PASSWORD_CFG" ]
then
    echo "expecting MOCHA_PASSWORD to be set in environment variables"
    env
else
    echo "MOCHA_PASSWORD being set to test environment CFG"
    export MOCHA_PASSWORD=$MOCHA_PASSWORD_CFG
    export MOCHA_KEY=$MOCHA_PASSWORD_CFG
    export MOCHA_SECRET=$MOCHA_SECRET_CFG
    export MOCHA_USER=$MOCHA_USER_CFG
    export MOCHA_ORG=$MOCHA_ORG_CFG
    export MOCHA_ENV=$MOCHA_ENV_CFG
    export MOCHA_TOKEN_SECRET=$MOCHA_TOKEN_SECRET_CFG
    export MOCHA_TOKEN_ID=$MOCHA_TOKEN_ID_CFG
    export MOCHA_SAML_TOKEN=$MOCHA_SAML_TOKEN_CFG
    export MOCHA_ENDPOINT=$MOCHA_ENDPOINT_CFG
fi

cd ./test-qproducts
pwd

runTag="$1"
quotaType="$2"
quota="$3"
interval="$4"
timeunit="$5"
weight="$6"

# example
# bash test-qproducts/e2evars.sh quant1 flexi 100 1 minute

bash ContextTests.sh $runTag $quotaType $quota $interval $timeunit $weight




# example
# bash test-qproducts/e2evars.sh quant1 flexi 100 1 minute 1
#
