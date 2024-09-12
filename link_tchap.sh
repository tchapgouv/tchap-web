cd ../matrix-js-sdk
yarn unlink
yarn link

cd ../matrix-react-sdk
yarn link matrix-js-sdk
yarn unlink
yarn link

cd ../tchap-web
yarn link matrix-js-sdk
yarn link matrix-react-sdk

# Display result
echo -e "\nYarn links in this dir:";
ls -l node_modules/ | egrep "^l";
echo -e "\nExisting yarn links:";
ls -l ~/.config/yarn/link
