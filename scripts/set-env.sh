ENV_FILE=.env

cd ../
if [ -f "$ENV_FILE" ]; then
    export $(cat $ENV_FILE | xargs)
fi