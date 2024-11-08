version=$(node -e 'console.log(require("./package.json").version)')

if [ -n "$CI_COMMIT_REF_NAME" ] && [ "$CI_COMMIT_REF_NAME" != "$CI_COMMIT_TAG" ]; then
  version="${version}-${CI_COMMIT_REF_NAME#*/}"
fi

echo $version
