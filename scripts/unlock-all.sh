#!/usr/bin/env bash
# unlock-all.sh — Interactive master menu for all GitHub achievement scripts
set -e

PROJECT="portscout"

print_banner() {
  echo ""
  echo "\033[33m╔══════════════════════════════════════════════╗\033[0m"
  echo "\033[33m║   🏆 $PROJECT — Achievement Unlock Menu     ║\033[0m"
  echo "\033[33m╚══════════════════════════════════════════════╝\033[0m"
  echo ""
}

print_menu() {
  echo "  1) ⚡  Quickdraw"
  echo "  2) 🤠  YOLO"
  echo "  3) 📢  Publicist"
  echo "  4) 🦈  Pull Shark — Bronze (2 PRs)"
  echo "  5) 🦈  Pull Shark — Silver (16 PRs)"
  echo "  6) 🦈  Pull Shark — Gold  (128 PRs)"
  echo "  7) 🤝  Pair Extraordinaire"
  echo "  8) 🚀  Full Blast — Run 1+2+3+4+7 now"
  echo "  9) 📊  Show achievement tracker"
  echo "  0) ❌  Exit"
  echo ""
  printf "  Choose an option: "
}

run_pair() {
  echo ""
  printf "  Co-author name : "
  read -r CONAME
  printf "  Co-author email: "
  read -r COEMAIL
  bash scripts/pair-extraordinaire.sh "$CONAME" "$COEMAIL"
}

if ! gh auth status &>/dev/null; then
  echo ""
  echo "❌ GitHub CLI not authenticated."
  echo "   Run these commands first:"
  echo "     unset GITHUB_TOKEN"
  echo "     gh auth login"
  echo "     gh auth setup-git"
  echo ""
  exit 1
fi

while true; do
  print_banner
  print_menu
  read -r CHOICE
  echo ""
  case $CHOICE in
    1) bash scripts/quickdraw.sh ;;
    2) bash scripts/yolo.sh ;;
    3) bash scripts/publicist.sh ;;
    4) bash scripts/pull-shark.sh 2 ;;
    5) bash scripts/pull-shark.sh 16 ;;
    6) bash scripts/pull-shark.sh 128 ;;
    7) run_pair ;;
    8)
      echo "🚀 Full Blast — running Quickdraw, YOLO, Publicist, Pull Shark Bronze..."
      bash scripts/quickdraw.sh
      bash scripts/yolo.sh
      bash scripts/publicist.sh
      bash scripts/pull-shark.sh 2
      run_pair
      echo "🎉 Full Blast complete!"
      ;;
    9) node src/achievement-tracker.js ;;
    0) echo "👋 Goodbye!"; exit 0 ;;
    *) echo "  ⚠️  Invalid option. Please choose 0–9." ;;
  esac
  echo ""
  printf "  Press Enter to return to menu..."
  read -r
done
