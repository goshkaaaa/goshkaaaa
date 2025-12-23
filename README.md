<div align="center">
<img src="https://readme-typing-svg.herokuapp.com?font=JetBrains+Mono&size=26&duration=3000&pause=500&color=F7DF1E&center=true&vCenter=true&width=700&lines=JavaScript+Developer;Node.js+%26+Bots+Developer;Discord+%26+Telegram+Bots;Clean+Code+%7C+Async+Magic" />
<img src="https://github-readme-stats.vercel.app/api?username=goshkaaaa&show_icons=true&theme=tokyonight&hide_border=true&icon_color=F7DF1E&title_color=F7DF1E" />
<img src="https://streak-stats.demolab.com?user=goshkaaaa&theme=tokyonight&hide_border=true&ring=F7DF1E&fire=F7DF1E&currStreakLabel=F7DF1E" />
<img src="https://skillicons.dev/icons?i=js,nodejs,ts,discord,bots,express,html,css,git,github&theme=dark" />
<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=goshkaaaa&layout=compact&theme=tokyonight&hide_border=true&title_color=F7DF1E" />
name: Snake

on:
  schedule:
    - cron: "0 0 * * *"
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: Platane/snk@v3
        with:
          github_user_name: goshkaaaa
          outputs: |
            dist/github-snake.svg
      - uses: crazy-max/ghaction-github-pages@v3
        with:
          target_branch: output
          build_dir: dist
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
<img src="https://raw.githubusercontent.com/goshkaaaa/goshkaaaa/output/github-snake.svg" />
<img src="https://github-profile-trophy.vercel.app/?username=goshkaaaa&theme=onedark&no-frame=true&row=1&margin-w=15" />
<img src="https://komarev.com/ghpvc/?username=goshkaaaa&color=yellow&style=flat-square" />
</div>
