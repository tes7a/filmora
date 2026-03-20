#!/usr/bin/env sh

branch_name="$(git rev-parse --abbrev-ref HEAD)"

if [ "$branch_name" = "HEAD" ]; then
  exit 0
fi

case "$branch_name" in
  feat/*|fix/*|refactor/*|chore/*|docs/*|test/*|main|master|develop|dev|release/*|hotfix/*)
    exit 0
    ;;
  *)
    echo "Invalid branch name: $branch_name"
    echo "Use one of: feat/*, fix/*, refactor/*, chore/*, docs/*, test/*"
    exit 1
    ;;
esac
