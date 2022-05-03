# Docker 실향상법
- docker build -t frontend --build-arg BACK_URL=https://api.darlink.xyz .
- docker run --name frontend -p 3000:3000 -d frontend